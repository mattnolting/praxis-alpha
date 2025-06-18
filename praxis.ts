#!/usr/bin/env bun

/**
 * PRAXIS - Directory-First Design System Tool
 * Platform-native automation for component design systems
 */

// ============================================================================
// DIRECTORY CONFIGURATION - All operations target configured directory
// ============================================================================

interface PraxisConfig {
  sourceDir: string
  outputDir: string
  patterns: {
    components: string[]
    interfaces: string[]
  }
}

let CONFIG: PraxisConfig = {
  sourceDir: 'src',
  outputDir: 'praxis-generated',
  patterns: {
    components: ['**/*.tsx', '**/*.ts'],
    interfaces: ['**/*Props.ts', '**/*.types.ts']
  }
}

const initConfig = async (sourceDir?: string): Promise<void> => {
  if (sourceDir) {
    CONFIG.sourceDir = sourceDir
  }
  
  // Try to load existing config
  try {
    const configFile = await Bun.file('praxis.config.json').text()
    const loadedConfig = JSON.parse(configFile)
    CONFIG = { ...CONFIG, ...loadedConfig }
  } catch {
    // No config file exists, use defaults
  }
  
  // Ensure output directory exists
  await Bun.write('praxis.config.json', JSON.stringify(CONFIG, null, 2))
  
  console.log(`🎯 Praxis initialized: ${CONFIG.sourceDir} → ${CONFIG.outputDir}`)
}

const getSourcePath = (pattern: string): string => `${CONFIG.sourceDir}/${pattern}`
const getOutputPath = (filename: string): string => `${CONFIG.outputDir}/${filename}`

// ============================================================================
// INTERFACE ANALYSIS - Understand component structure
// ============================================================================

interface ComponentAnalysis {
  name: string
  filePath: string
  interfaces: ParsedInterface[]
  complexity: 'simple' | 'medium' | 'complex'
  migrationStatus: 'ready' | 'partial' | 'manual'
}

interface ParsedInterface {
  name: string
  variants: string[]
  sizes: string[]
  states: string[]
  ignored: string[]
}

const parseInterface = (content: string): ParsedInterface[] => {
  const interfaces: ParsedInterface[] = []
  
  const interfaceMatches = content.matchAll(/export interface (\\w+Props)\\s*{([^}]+)}/gs)
  
  for (const match of interfaceMatches) {
    const [, name, body] = match
    const componentName = name.replace('Props', '')
    
    const variants: string[] = []
    const sizes: string[] = []
    const states: string[] = []
    const ignored: string[] = []
    
    const propMatches = body.matchAll(/(\\w+)\\??\\s*:\\s*([^;\\n]+)/g)
    
    for (const propMatch of propMatches) {
      const [, propName, propType] = propMatch
      
      if (propType.includes('=>') || propType.includes('React.') || propType.includes('ComponentType')) {
        ignored.push(propName)
        continue
      }
      
      const quotedValues = propType.match(/'[^']+'/g)
      
      if (quotedValues && quotedValues.length >= 2) {
        const values = quotedValues.map(v => v.replace(/'/g, ''))
        
        if (propName.toLowerCase().includes('variant') || propName.toLowerCase().includes('type')) {
          variants.push(...values)
        } else if (propName.toLowerCase().includes('size')) {
          sizes.push(...values)
        } else {
          variants.push(...values)
        }
      } else if (propType.includes('boolean')) {
        states.push(propName)
      } else {
        ignored.push(propName)
      }
    }
    
    interfaces.push({
      name: componentName,
      variants: [...new Set(variants)],
      sizes: [...new Set(sizes)],
      states: [...new Set(states)],
      ignored: [...new Set(ignored)]
    })
  }
  
  return interfaces
}

const analyzeComponent = (filePath: string, content: string): ComponentAnalysis => {
  const interfaces = parseInterface(content)
  const name = filePath.split('/').pop()?.replace(/\\.(ts|tsx)$/, '') || 'Unknown'
  
  let complexity: 'simple' | 'medium' | 'complex' = 'simple'
  let migrationStatus: 'ready' | 'partial' | 'manual' = 'manual'
  
  const totalProps = interfaces.reduce((sum, iface) => 
    sum + iface.variants.length + iface.sizes.length + iface.states.length, 0)
  
  if (totalProps > 10) complexity = 'complex'
  else if (totalProps > 5) complexity = 'medium'
  
  const migratableProps = interfaces.filter(iface => 
    iface.variants.length || iface.sizes.length || iface.states.length).length
  
  if (migratableProps === interfaces.length && interfaces.length > 0) migrationStatus = 'ready'
  else if (migratableProps > 0) migrationStatus = 'partial'
  
  return {
    name,
    filePath,
    interfaces,
    complexity,
    migrationStatus
  }
}

// ============================================================================
// PRAXIS OPERATIONS - Four core operations
// ============================================================================

/**
 * ANALYZE - Understand current component structure
 */
export const analyze = async (sourceDir?: string): Promise<void> => {
  await initConfig(sourceDir)
  
  console.log(`\\n🔍 ANALYZING: ${CONFIG.sourceDir}`)
  console.log('─'.repeat(60))
  
  const componentFiles = []
  for (const pattern of CONFIG.patterns.components) {
    componentFiles.push(...Array.from(new Bun.Glob(getSourcePath(pattern)).scanSync()))
  }
  
  if (!componentFiles.length) {
    console.log(`❌ No component files found in ${CONFIG.sourceDir}`)
    return
  }
  
  const analyses: ComponentAnalysis[] = []
  
  for (const file of componentFiles) {
    try {
      const content = await Bun.file(file).text()
      if (content.includes('interface') && content.includes('Props')) {
        const analysis = analyzeComponent(file, content)
        if (analysis.interfaces.length > 0) {
          analyses.push(analysis)
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not analyze ${file}`)
    }
  }
  
  // Summary statistics
  const ready = analyses.filter(a => a.migrationStatus === 'ready').length
  const partial = analyses.filter(a => a.migrationStatus === 'partial').length
  const manual = analyses.filter(a => a.migrationStatus === 'manual').length
  
  console.log(`\\n📊 ANALYSIS RESULTS`)
  console.log(`   Files scanned: ${componentFiles.length}`)
  console.log(`   Components found: ${analyses.length}`)
  console.log(`   Ready for migration: ${ready}`)
  console.log(`   Partial migration: ${partial}`)
  console.log(`   Manual review needed: ${manual}`)
  
  // Detailed breakdown
  console.log(`\\n📋 COMPONENT BREAKDOWN`)
  for (const analysis of analyses.slice(0, 10)) { // Show first 10
    const status = analysis.migrationStatus === 'ready' ? '✅' : 
                  analysis.migrationStatus === 'partial' ? '🟡' : '🔴'
    console.log(`   ${status} ${analysis.name} (${analysis.complexity}, ${analysis.interfaces.length} interfaces)`)
  }
  
  if (analyses.length > 10) {
    console.log(`   ... and ${analyses.length - 10} more`)
  }
  
  console.log(`\\n🚀 Next: Run 'migrate' to convert ready components`)
}

/**
 * MIGRATE - Convert TypeScript interfaces to Praxis configs
 */
export const migrate = async (sourceDir?: string): Promise<void> => {
  await initConfig(sourceDir)
  
  console.log(`\\n🚀 MIGRATING: ${CONFIG.sourceDir} → ${CONFIG.outputDir}`)
  console.log('─'.repeat(60))
  
  const componentFiles = []
  for (const pattern of CONFIG.patterns.components) {
    componentFiles.push(...Array.from(new Bun.Glob(getSourcePath(pattern)).scanSync()))
  }
  
  let convertedCount = 0
  
  for (const file of componentFiles) {
    try {
      const content = await Bun.file(file).text()
      if (content.includes('interface') && content.includes('Props')) {
        const analysis = analyzeComponent(file, content)
        
        for (const iface of analysis.interfaces) {
          if (iface.variants.length || iface.sizes.length || iface.states.length) {
            const praxisConfig = generatePraxisConfig(iface)
            const outputPath = getOutputPath(`${iface.name.toLowerCase()}.prax.ts`)
            
            await Bun.write(outputPath, praxisConfig)
            console.log(`✅ ${iface.name} → ${outputPath}`)
            convertedCount++
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Failed to migrate ${file}`)
    }
  }
  
  console.log(`\\n🎉 MIGRATION COMPLETE`)
  console.log(`   Converted: ${convertedCount} components`)
  console.log(`   Output: ${CONFIG.outputDir}/`)
  console.log(`\\n🚀 Next: Run 'monitor' to watch for changes`)
}

/**
 * MONITOR - Watch for changes and auto-regenerate
 */
export const monitor = async (sourceDir?: string): Promise<void> => {
  await initConfig(sourceDir)
  
  console.log(`\\n👀 MONITORING: ${CONFIG.sourceDir}`)
  console.log('─'.repeat(60))
  
  const fileStates = new Map<string, string>()
  
  const checkChanges = async () => {
    const praxisFiles = Array.from(new Bun.Glob(getOutputPath('*.prax.ts')).scanSync())
    const changed: string[] = []
    
    for (const file of praxisFiles) {
      try {
        const content = await Bun.file(file).text()
        const fileHash = Bun.hash(content).toString()
        
        if (fileStates.get(file) !== fileHash) {
          fileStates.set(file, fileHash)
          changed.push(file)
        }
      } catch {
        // File might have been deleted
        fileStates.delete(file)
      }
    }
    
    if (changed.length) {
      console.log(`\\n🔄 ${changed.length} files changed`)
      await generateOutputs()
    }
  }
  
  // Initial generation
  await generateOutputs()
  
  console.log(`\\n🔄 Watching for changes... (Ctrl+C to stop)`)
  setInterval(checkChanges, 1000)
  
  await new Promise(() => {}) // Keep running
}

/**
 * MEASURE - Analyze bundle size and performance
 */
export const measure = async (sourceDir?: string): Promise<void> => {
  await initConfig(sourceDir)
  
  console.log(`\\n📊 MEASURING: ${CONFIG.outputDir}`)
  console.log('─'.repeat(60))
  
  const generatedFiles = Array.from(new Bun.Glob(getOutputPath('*')).scanSync())
  
  if (!generatedFiles.length) {
    console.log(`❌ No generated files found. Run 'migrate' first.`)
    return
  }
  
  let totalSize = 0
  const fileMetrics: Array<{path: string, sizeKB: number, type: string}> = []
  
  for (const file of generatedFiles) {
    try {
      const stat = await Bun.file(file).size
      const sizeKB = Math.round(stat / 1024 * 100) / 100
      const type = file.endsWith('.ts') ? 'TypeScript' :
                  file.endsWith('.json') ? 'JSON' :
                  file.endsWith('.stories.ts') ? 'Stories' : 'Other'
      
      fileMetrics.push({
        path: file.split('/').pop() || file,
        sizeKB,
        type
      })
      totalSize += sizeKB
    } catch (error) {
      console.log(`⚠️  Could not measure ${file}`)
    }
  }
  
  // Group by type
  const typeMetrics = fileMetrics.reduce((acc, metric) => {
    if (!acc[metric.type]) acc[metric.type] = { count: 0, sizeKB: 0 }
    acc[metric.type].count++
    acc[metric.type].sizeKB += metric.sizeKB
    return acc
  }, {} as Record<string, {count: number, sizeKB: number}>)
  
  console.log(`\\n📈 BUNDLE ANALYSIS`)
  console.log(`   Total files: ${generatedFiles.length}`)
  console.log(`   Total size: ${totalSize}KB`)
  console.log(`   Average per file: ${Math.round(totalSize / generatedFiles.length * 100) / 100}KB`)
  
  console.log(`\\n📋 BY FILE TYPE`)
  for (const [type, metrics] of Object.entries(typeMetrics)) {
    console.log(`   ${type}: ${metrics.count} files, ${metrics.sizeKB}KB`)
  }
  
  console.log(`\\n🎯 OPTIMIZATION OPPORTUNITIES`)
  const largeFiles = fileMetrics.filter(f => f.sizeKB > 5).sort((a, b) => b.sizeKB - a.sizeKB)
  if (largeFiles.length) {
    console.log(`   Large files (>5KB):`)
    largeFiles.slice(0, 5).forEach(f => {
      console.log(`   - ${f.path}: ${f.sizeKB}KB`)
    })
  } else {
    console.log(`   ✅ All files are optimally sized (<5KB each)`)
  }
}

// ============================================================================
// OUTPUT GENERATION - Generate all platform outputs
// ============================================================================

const generatePraxisConfig = (parsed: ParsedInterface): string => {
  const config = {
    component: {
      name: parsed.name,
      description: `${parsed.name} component`,
      category: inferCategory(parsed.name)
    },
    uses: {}
  }
  
  if (parsed.variants.length) config.uses.variants = parsed.variants
  if (parsed.sizes.length) config.uses.sizes = parsed.sizes
  if (parsed.states.length) config.uses.states = parsed.states
  
  return `/**
 * ${parsed.name} - Generated by Praxis
 */
export default ${JSON.stringify(config, null, 2)} as const`
}

const inferCategory = (name: string): string => {
  const categoryMap = {
    button: 'input', input: 'input', form: 'input',
    modal: 'overlay', dialog: 'overlay', tooltip: 'overlay',
    card: 'layout', container: 'layout', grid: 'layout',
    alert: 'feedback', toast: 'feedback',
    badge: 'display', avatar: 'display',
    table: 'data'
  }
  
  const lowerName = name.toLowerCase()
  for (const [key, category] of Object.entries(categoryMap)) {
    if (lowerName.includes(key)) return category
  }
  return 'general'
}

const generateOutputs = async (): Promise<void> => {
  const start = performance.now()
  const praxisFiles = Array.from(new Bun.Glob(getOutputPath('*.prax.ts')).scanSync())
  
  if (!praxisFiles.length) {
    console.log('📋 No .prax.ts files found')
    return
  }
  
  const operations: Array<{path: string, content: string}> = []
  
  for (const file of praxisFiles) {
    try {
      const mod = await import(`./${file}?t=${Date.now()}`)
      const config = mod.default
      
      if (!config?.component?.name) continue
      
      const name = config.component.name
      const props = {
        ...config.uses?.variants && { variant: config.uses.variants },
        ...config.uses?.sizes && { size: config.uses.sizes },
        ...config.uses?.states && Object.fromEntries(config.uses.states.map(s => [s, true]))
      }
      
      // Generate TypeScript interface
      let tsInterface = `export interface ${name}Props {\\n`
      for (const [key, value] of Object.entries(props)) {
        if (Array.isArray(value)) {
          tsInterface += `  ${key}?: ${value.map(v => `'${v}'`).join(' | ')}\\n`
        } else {
          tsInterface += `  ${key}?: boolean\\n`
        }
      }
      tsInterface += '}'
      
      // Generate Storybook story
      const storyArgs = []
      if (props.variant) storyArgs.push(`variant: '${props.variant[0]}'`)
      if (props.size) storyArgs.push(`size: '${props.size[0]}'`)
      
      const story = `import type { Meta, StoryObj } from '@storybook/react'
import { ${name} } from './${name}'

const meta: Meta = { title: 'Components/${name}', component: ${name} }
export default meta
export const Default: StoryObj = { args: { ${storyArgs.join(', ')} } }`
      
      operations.push(
        { path: getOutputPath(`${name}Props.ts`), content: tsInterface },
        { path: getOutputPath(`${name}.stories.ts`), content: story }
      )
      
    } catch (error) {
      console.log(`⚠️  Failed to process ${file}`)
    }
  }
  
  // Write all files
  let written = 0
  for (const op of operations) {
    try {
      await Bun.write(op.path, op.content)
      written++
    } catch (error) {
      console.log(`⚠️  Failed to write ${op.path}`)
    }
  }
  
  const total = performance.now() - start
  console.log(`✅ Generated ${written} files in ${total.toFixed(1)}ms`)
}

// ============================================================================
// CLI - Directory-first command structure
// ============================================================================

const [operation, sourceDir] = Bun.argv.slice(2)

switch (operation) {
  case 'analyze':
    await analyze(sourceDir)
    break
    
  case 'migrate':
    await migrate(sourceDir)
    break
    
  case 'monitor':
    await monitor(sourceDir)
    break
    
  case 'measure':
    await measure(sourceDir)
    break
    
  case 'init':
    await initConfig(sourceDir || 'src')
    console.log('✅ Praxis initialized')
    break
    
  default:
    console.log(`
🎯 Praxis - Directory-First Design System Tool

SETUP:
  bun praxis.ts init [dir]              Initialize Praxis for directory

CORE OPERATIONS:
  bun praxis.ts analyze [dir]           📊 Analyze component structure
  bun praxis.ts migrate [dir]           🚀 Migrate interfaces to Praxis
  bun praxis.ts monitor [dir]           👀 Watch for changes
  bun praxis.ts measure [dir]           📈 Bundle size analysis

WORKFLOW:
  1. analyze    - Understand your components
  2. migrate    - Convert to Praxis format  
  3. monitor    - Watch for changes
  4. measure    - Track bundle impact

Zero configuration, maximum automation! 🚀
`)
}
