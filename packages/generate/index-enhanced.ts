#!/usr/bin/env bun

/**
 * @praxis/generate - PHASE 2.1: ENHANCED PARALLELIZATION
 * Multi-component batch processing + optimized I/O
 */

import { createNativeWatcher, type WatchEvent } from './quick-native-watcher.ts';
import { loadConfig, type PraxisConfig } from './config-parser.ts';

// ============================================================================
// ENHANCED PARALLELIZATION - BATCH PROCESSING
// ============================================================================

interface ComponentBatch {
  configs: Array<{
    path: string;
    config: PraxisConfig;
  }>;
  outputs: Array<{
    path: string;
    content: string;
    type: 'typescript' | 'schema';
  }>;
}

async function loadConfigsBatch(configPaths: string[]): Promise<ComponentBatch> {
  // Parallel config loading
  const loadPromises = configPaths.map(async (path) => {
    const config = await loadConfig(path);
    return config ? { path, config } : null;
  });

  const results = await Promise.all(loadPromises);
  const configs = results.filter(Boolean) as Array<{ path: string; config: PraxisConfig }>;

  return { configs, outputs: [] };
}

async function generateBatchOutputs(batch: ComponentBatch): Promise<void> {
  // Generate all content in parallel
  const generationPromises: Promise<void>[] = [];

  for (const { path, config } of batch.configs) {
    const componentName = config.component.name;
    
    // TypeScript generation
    generationPromises.push(
      (async () => {
        const tsPath = createOutputFile(path, componentName, 'Props.ts');
        if (await shouldRegenerate(path, tsPath)) {
          const content = config.uses 
            ? generateFromUsesDeclaration(config.uses, componentName)
            : `// No 'uses' declaration found in config`;
          
          batch.outputs.push({
            path: tsPath,
            content,
            type: 'typescript'
          });
        }
      })()
    );

    // Schema generation  
    generationPromises.push(
      (async () => {
        const schemaPath = createOutputFile(path, componentName, 'Schema.json');
        if (await shouldRegenerate(path, schemaPath)) {
          const content = generateJSONSchema(config);
          
          batch.outputs.push({
            path: schemaPath,
            content,
            type: 'schema'
          });
        }
      })()
    );
  }

  await Promise.all(generationPromises);
}

async function writeBatchOutputs(batch: ComponentBatch): Promise<void> {
  // Parallel file writing with optimized I/O
  const writePromises = batch.outputs.map(async ({ path, content }) => {
    try {
      await Bun.write(path, content);
      console.log(`✅ Generated: ${getFileBaseName(path)}`);
    } catch (error) {
      console.error(`❌ Failed to write: ${path}`, error);
    }
  });

  await Promise.all(writePromises);
}

// ============================================================================
// ENHANCED CORE FUNCTION - BATCH PROCESSING
// ============================================================================

export async function generateAllEnhanced(configPath: string): Promise<void> {
  console.log(`🚀 Processing: ${getFileBaseName(configPath)}`);
  
  // Process single file through batch system for consistency
  const batch = await loadConfigsBatch([configPath]);
  await generateBatchOutputs(batch);
  await writeBatchOutputs(batch);
}

export async function generateBatchEnhanced(configPaths: string[]): Promise<void> {
  if (configPaths.length === 0) return;
  
  console.log(`🚀 Batch processing ${configPaths.length} components...`);
  
  // Enhanced parallel batch processing
  const batch = await loadConfigsBatch(configPaths);
  await generateBatchOutputs(batch);
  await writeBatchOutputs(batch);
  
  console.log(`✅ Generated ${batch.outputs.length} files from ${batch.configs.length} components`);
}

// ============================================================================
// OPTIMIZED SCAN AND GENERATE
// ============================================================================

export async function scanAndGenerateEnhanced(dir: string = '.'): Promise<void> {
  console.log('🔍 Scanning for Praxis configs...');

  const glob = new Bun.Glob('**/*.praxis.yaml');
  const configs = await Array.fromAsync(glob.scan(dir));

  console.log(`Found ${configs.length} config files`);

  // Process in optimized batches of 5 components
  const BATCH_SIZE = 5;
  const batches: string[][] = [];
  
  for (let i = 0; i < configs.length; i += BATCH_SIZE) {
    batches.push(configs.slice(i, i + BATCH_SIZE));
  }

  // Process batches with some parallelism but not overwhelming I/O
  const batchPromises = batches.map(async (batch, index) => {
    // Stagger batch starts slightly
    await new Promise(resolve => setTimeout(resolve, index * 5));
    return generateBatchEnhanced(batch);
  });

  await Promise.all(batchPromises);

  console.log(`✅ Generated interfaces for ${configs.length} components`);
}

// ============================================================================
// PURE BUN FILE OPERATIONS (OPTIMIZED)
// ============================================================================

function createOutputFile(configPath: string, componentName: string, extension: string): string {
  const lastSlash = configPath.lastIndexOf('/');
  const directory = lastSlash >= 0 ? configPath.substring(0, lastSlash) : '.';
  return `${directory}/${componentName}${extension}`;
}

function getFileBaseName(filePath: string): string {
  const lastSlash = filePath.lastIndexOf('/');
  return lastSlash >= 0 ? filePath.substring(lastSlash + 1) : filePath;
}

async function shouldRegenerate(configPath: string, outputPath: string): Promise<boolean> {
  try {
    const [configStat, outputStat] = await Promise.all([
      Bun.file(configPath).stat(),
      Bun.file(outputPath).stat()
    ]);
    return configStat.mtime > outputStat.mtime;
  } catch {
    return true;
  }
}

// ============================================================================
// GENERATION TEMPLATES (UNCHANGED)
// ============================================================================

function generateFromUsesDeclaration(usesDeclaration: any, componentName: string): string {
  const interfaceName = `${componentName}Props`;
  const props: string[] = [];

  for (const [category, items] of Object.entries(usesDeclaration)) {
    if (category === 'variants') {
      const variantValues = (items as string[]).map(item => `"${item}"`).join(' | ');
      props.push(`  /** Component variant */\n  variant?: ${variantValues};`);
    } else if (category === 'sizes') {
      const sizeValues = (items as string[]).map(item => `"${item}"`).join(' | ');
      props.push(`  /** Component size */\n  size?: ${sizeValues};`);
    } else if (category === 'states') {
      for (const item of items as string[]) {
        props.push(`  /** Component state: ${item.replace('is', '').toLowerCase()} */\n  ${item}?: boolean;`);
      }
    } else if (category === 'accessibility') {
      for (const item of items as string[]) {
        props.push(`  /** Accessibility: ${item} */\n  ${item}?: string;`);
      }
    } else if (category === 'interactions') {
      for (const item of items as string[]) {
        props.push(`  /** Event handler: ${item} */\n  ${item}?: (...args: any[]) => any;`);
      }
    } else if (category === 'styling') {
      for (const item of items as string[]) {
        const type = item === 'style' ? 'React.CSSProperties' : 'string';
        props.push(`  /** Styling: ${item} */\n  ${item}?: ${type};`);
      }
    }
  }

  return `/**
 * Generated props for ${componentName}
 * DO NOT EDIT - Generated by Praxis using registry
 */

export interface ${interfaceName} {
${props.join('\n')}
}

export default ${interfaceName};
`;
}

function generateJSONSchema(config: PraxisConfig): string {
  const componentName = config.component?.name || 'Component';
  let properties = {};

  if (config.uses) {
    for (const [category, items] of Object.entries(config.uses)) {
      if (category === 'variants') {
        properties = { ...properties, variant: { type: "string", description: "Component variant", enum: items } };
      } else if (category === 'sizes') {
        properties = { ...properties, size: { type: "string", description: "Component size", enum: items } };
      } else if (category === 'states') {
        for (const item of items as string[]) {
          properties = { ...properties, [item]: { type: "boolean", description: `Component state: ${item.replace('is', '').toLowerCase()}` } };
        }
      } else if (category === 'accessibility') {
        for (const item of items as string[]) {
          properties = { ...properties, [item]: { type: "string", description: `Accessibility: ${item}` } };
        }
      } else if (category === 'interactions') {
        for (const item of items as string[]) {
          properties = { ...properties, [item]: { type: "string", description: `Event handler: ${item}` } };
        }
      } else if (category === 'styling') {
        for (const item of items as string[]) {
          properties = { ...properties, [item]: { type: "string", description: `Styling: ${item}` } };
        }
      }
    }
  }

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: `${componentName} Props`,
    type: "object",
    properties,
    required: []
  };

  return JSON.stringify(schema, null, 2);
}

// ============================================================================
// NATIVE FILE WATCHING (ENHANCED)
// ============================================================================

const nativeWatcher = createNativeWatcher();

export async function watchAndGenerateEnhanced(dir: string = '.'): Promise<void> {
  console.log('👀 Starting enhanced file watcher...');

  await scanAndGenerateEnhanced(dir);

  console.log('🚀 Using enhanced batch processing...');

  await nativeWatcher.watch('**/*.praxis.yaml', async (events: WatchEvent[]) => {
    console.log(`📦 Processing ${events.length} file events...`);

    const uniqueFiles = new Set(events.map(event => event.path));
    const validFiles = Array.from(uniqueFiles).filter(path => {
      const event = events.find(e => e.path === path);
      return event?.type !== 'unlink';
    });

    if (validFiles.length > 0) {
      console.log(`🔄 Batch processing ${validFiles.length} changed configs...`);
      try {
        await generateBatchEnhanced(validFiles);
      } catch (error) {
        console.error(`❌ Batch generation failed:`, error);
      }
    }

    const stats = nativeWatcher.getStats();
    console.log(`📊 Watcher: Enhanced batch processing, ${stats.watcherType}`);
  });

  console.log('🚀 Enhanced file watching active... (Press Ctrl+C to stop)');

  process.on('SIGINT', () => {
    console.log('\n📋 Cleaning up enhanced watcher...');
    nativeWatcher.stop();
    process.exit(0);
  });
}

// ============================================================================
// COMMAND LINE USAGE
// ============================================================================

if (import.meta.main) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'generate':
      await scanAndGenerateEnhanced(args[1]);
      break;

    case 'watch':
      await watchAndGenerateEnhanced(args[1]);
      break;

    case 'single':
      if (args[1]) {
        await generateAllEnhanced(args[1]);
      } else {
        console.error('Usage: bun index-enhanced.ts single <config-path>');
      }
      break;

    default:
      console.log(`
🚀 Praxis Generate - PHASE 2.1: ENHANCED PARALLELIZATION

Usage:
  bun index-enhanced.ts generate [dir]     # Scan and generate all
  bun index-enhanced.ts watch [dir]        # Watch for changes  
  bun index-enhanced.ts single <config>    # Generate single file

Features:
  🔥 Multi-component batch processing
  ⚡ Optimized parallel I/O operations  
  📦 Intelligent batch sizing (5 components)
  🎯 Target: Real bottleneck optimization
`);
  }
}

export default {
  generateAllEnhanced,
  generateBatchEnhanced,
  scanAndGenerateEnhanced,
  watchAndGenerateEnhanced
};