#!/usr/bin/env bun

/**
 * @praxis/generate - TEMPLATE-LEVEL PARALLELIZATION IMPLEMENTATION
 * 🚀 Phase 2: Template-Level Parallelization within Components
 * Performance Target: 2x additional improvement through parallel template generation
 */

import { createNativeWatcher, type WatchEvent } from './quick-native-watcher.ts';
import { loadConfig, type PraxisConfig } from './config-parser.ts';

// 🌍 IMPORT GLOBAL CACHED SYSTEM (maintains 9.9x improvement)
import {
  PathOps,
  FileOps,
  generateCompleteComponent,
  Conditionals,
  GlobalPerformance
} from './global-cached-system.ts';

// 🚀 NATIVE FILE WATCHER - True event-driven with FS events
const nativeWatcher = createNativeWatcher();

// ============================================================================
// 🚀 PHASE 2: TEMPLATE-LEVEL PARALLEL FUNCTIONS (NEW ARCHITECTURE)
// ============================================================================

/**
 * 🚀 PHASE 2: Parallel TypeScript and Schema Generation
 * Generate both TypeScript and Schema simultaneously for a single component
 * PERFORMANCE TARGET: 2x improvement through template-level parallelization
 */
export async function generateAllTemplatesParallel(configPath: string): Promise<void> {
  const config = await loadConfig(configPath);
  if (!config) return;

  const componentName = config.component.name;
  
  // Create output paths for both templates
  const tsOutputPath = PathOps.createOutputPath(configPath, componentName, 'Props.ts');
  const schemaOutputPath = PathOps.createOutputPath(configPath, componentName, 'Schema.json');

  console.log(`🚀 Processing: ${PathOps.extractBasename(configPath)} (TEMPLATE PARALLEL)`);

  // 🚀 PHASE 2: Check if regeneration needed for BOTH templates in parallel
  const [needsTsRegen, needsSchemaRegen] = await Promise.all([
    FileOps.shouldRegenerate(configPath, tsOutputPath),
    FileOps.shouldRegenerate(configPath, schemaOutputPath)
  ]);

  // Early exit if both are cached
  if (!needsTsRegen && !needsSchemaRegen) {
    console.log(`⚡ Cached: ${componentName}Props.ts`);
    console.log(`⚡ Cached: ${componentName}Schema.json`);
    return;
  }

  // Generate content using cached functions
  let tsContent: string = '';
  let schemaContent: string = '';

  if (Conditionals.hasUsesDeclaration(config)) {
    // 🚀 MASTER CACHED FUNCTION: Eliminates ALL manual parsing
    const result = generateCompleteComponent(componentName, config.uses);
    tsContent = result.typescript;
    schemaContent = result.schema;
  } else {
    // Fallback for non-uses configs
    tsContent = `// No 'uses' declaration found in config`;
    schemaContent = JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      title: `${componentName} Props`,
      type: "object",
      properties: {},
      required: []
    }, null, 2);
  }

  // 🚀 PHASE 2: Write BOTH files in parallel
  const writePromises: Promise<void>[] = [];

  if (needsTsRegen) {
    writePromises.push(FileOps.writeGenerated(tsOutputPath, tsContent));
  }

  if (needsSchemaRegen) {
    writePromises.push(FileOps.writeGenerated(schemaOutputPath, schemaContent));
  }

  // Execute all file writes simultaneously
  await Promise.all(writePromises);
}

/**
 * 🚀 PHASE 2: Enhanced Component Processing with Template Parallelization
 * Combines component-level parallelization (Phase 1) with template-level parallelization (Phase 2)
 */
export async function generateAll(configPath: string, formats: string[] = ['typescript']): Promise<void> {
  // ✅ CACHED: Format validation
  const validFormats = formats.filter(format => Conditionals.isValidFormat(format));
  
  // For standard typescript + json-schema combination, use template parallelization
  if (validFormats.includes('typescript') && validFormats.includes('json-schema')) {
    await generateAllTemplatesParallel(configPath);
    return;
  }

  // Fallback to sequential for non-standard format combinations
  const promises = validFormats.map(format => {
    switch (format) {
      case 'typescript':
        return generateTypeScriptOnly(configPath);
      case 'json-schema':
        return generateSchemaOnly(configPath);
      default:
        console.warn(`Unknown format: ${format}`);
        return Promise.resolve();
    }
  });

  await Promise.all(promises);
}

/**
 * Individual template generators for non-standard combinations
 */
async function generateTypeScriptOnly(configPath: string): Promise<void> {
  const config = await loadConfig(configPath);
  if (!config) return;

  const componentName = config.component.name;
  const outputPath = PathOps.createOutputPath(configPath, componentName, 'Props.ts');

  if (!(await FileOps.shouldRegenerate(configPath, outputPath))) {
    console.log(`⚡ Cached: ${componentName}Props.ts`);
    return;
  }

  let content: string;

  if (Conditionals.hasUsesDeclaration(config)) {
    const result = generateCompleteComponent(componentName, config.uses);
    content = result.typescript;
  } else {
    content = `// No 'uses' declaration found in config`;
  }

  await FileOps.writeGenerated(outputPath, content);
}

async function generateSchemaOnly(configPath: string): Promise<void> {
  const config = await loadConfig(configPath);
  if (!config) return;

  const componentName = config.component.name;
  const outputPath = PathOps.createOutputPath(configPath, componentName, 'Schema.json');

  if (!(await FileOps.shouldRegenerate(configPath, outputPath))) {
    console.log(`⚡ Cached: ${componentName}Schema.json`);
    return;
  }

  let content: string;

  if (Conditionals.hasUsesDeclaration(config)) {
    const result = generateCompleteComponent(componentName, config.uses);
    content = result.schema;
  } else {
    content = JSON.stringify({
      $schema: "http://json-schema.org/draft-07/schema#",
      title: `${componentName} Props`,
      type: "object",
      properties: {},
      required: []
    }, null, 2);
  }

  await FileOps.writeGenerated(outputPath, content);
}

/**
 * 🚀 PHASE 1 + PHASE 2: DUAL-LEVEL PARALLEL PROCESSING
 * Combines component-level (Phase 1) + template-level (Phase 2) parallelization
 * PERFORMANCE TARGET: 3.9x (Phase 1) × 2x (Phase 2) = ~8x total improvement
 */
export async function scanAndGenerateDualParallel(dir: string = '.'): Promise<void> {
  console.log('🔍 Scanning for Praxis configs...');

  // Track performance with global system
  const start = performance.now();

  const glob = new Bun.Glob('**/*.praxis.yaml');
  const configs = await Array.fromAsync(glob.scan(dir));

  console.log(`Found ${configs.length} config files`);

  // 🚀 DUAL PARALLEL PROCESSING: 
  // - Component-level parallelization (Phase 1)
  // - Template-level parallelization (Phase 2)
  console.log(`🚀 Processing ${configs.length} components with DUAL PARALLELIZATION...`);
  console.log(`   📊 Component-level: Promise.all across ${configs.length} components`);
  console.log(`   📊 Template-level: Promise.all within each component`);
  
  const results = await Promise.all(
    configs.map(configPath => 
      generateAll(configPath, ['typescript', 'json-schema'])
        .catch(error => {
          console.error(`❌ Failed to process ${configPath}:`, error);
          return null; // Continue processing other components
        })
    )
  );

  // Count successful generations
  const successCount = results.filter(result => result !== null).length;
  
  const duration = performance.now() - start;

  console.log(`✅ Generated ${successCount}/${configs.length} components in ${duration.toFixed(2)}ms`);
  console.log(`🚀 DUAL PARALLELIZATION: Component-level + Template-level optimization`);
  
  // 🚀 GLOBAL PERFORMANCE SUMMARY
  GlobalPerformance.printSummary();
  
  // Calculate and display dual parallel performance metrics
  const componentsPerSecond = Math.round((configs.length / duration) * 1000);
  console.log(`📊 Dual Parallel Performance: ${componentsPerSecond.toLocaleString()} components/sec`);
  
  // Show improvement over Phase 1
  console.log(`🎯 Phase 2 Enhancement: Template-level parallelization within components`);
}

/**
 * 🚀 DUAL PARALLEL WATCH MODE
 * Enhanced file watching with dual-level parallel processing
 */
export async function watchAndGenerateDualParallel(dir: string = '.'): Promise<void> {
  console.log('👀 Starting dual parallel file watcher...');

  // Initial dual parallel generation
  await scanAndGenerateDualParallel(dir);

  console.log('🚀 Using dual parallelization with native event-driven file watching...');

  // Use native file watcher - NO POLLING!
  await nativeWatcher.watch('**/*.praxis.yaml', async (events: WatchEvent[]) => {
    console.log(`📦 Processing ${events.length} file events with DUAL PARALLELIZATION...`);

    // Process each unique file once (debouncing already handled)
    const uniqueFiles = new Set(events.map(event => event.path));

    // 🚀 DUAL PARALLEL: Process all changed files with template-level parallelization
    const results = await Promise.all(
      Array.from(uniqueFiles).map(async (filePath) => {
        const event = events.find(e => e.path === filePath);

        if (event?.type === 'unlink') {
          console.log(`🗑️ File deleted: ${event.path}`);
          return null;
        } else {
          console.log(`🔄 Config changed: ${filePath} (DUAL PARALLEL)`);
          try {
            await generateAll(filePath, ['typescript', 'json-schema']);
            return filePath;
          } catch (error) {
            console.error(`❌ Generation failed for ${filePath}:`, error);
            return null;
          }
        }
      })
    );

    const successfulUpdates = results.filter(result => result !== null).length;
    console.log(`✅ Updated ${successfulUpdates}/${uniqueFiles.size} components with dual parallelization`);

    // Show watcher stats periodically
    const stats = nativeWatcher.getStats();
    console.log(`📊 Watcher: Native FS events, ${stats.watcherType}`);
    
    // Show global cache performance
    GlobalPerformance.printSummary();
  });

  console.log('🚀 Dual parallel file watching active... (Press Ctrl+C to stop)');

  // Cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n📋 Cleaning up native watcher...');
    nativeWatcher.stop();
    
    // Final performance summary
    console.log('\n🏆 Final Performance Summary:');
    GlobalPerformance.printSummary();
    
    process.exit(0);
  });
}

// ============================================================================
// COMMAND LINE USAGE (ENHANCED WITH DUAL PARALLEL OPTIONS)
// ============================================================================

if (import.meta.main) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'generate':
      await scanAndGenerateDualParallel(args[1]);
      break;

    case 'watch':
      await watchAndGenerateDualParallel(args[1]);
      break;

    case 'single':
      if (args[1]) {
        await generateAll(args[1], ['typescript', 'json-schema']);
      } else {
        console.error('Usage: bun generate.ts single <config-path>');
      }
      break;

    case 'benchmark':
      console.log('🚀 Running benchmark with dual parallelization...');
      const start = performance.now();
      await scanAndGenerateDualParallel(args[1] || '.');
      const duration = performance.now() - start;
      console.log(`⚡ Dual parallel benchmark completed in ${duration.toFixed(2)}ms`);
      GlobalPerformance.printSummary();
      break;

    case 'compare':
      console.log('🧪 Comparing Phase 1 vs Phase 2 performance...');
      
      // Import Phase 1 version for comparison
      const { scanAndGenerateParallel } = await import('./index-parallel.ts');
      
      console.log('\n1️⃣ Running Phase 1 (Component-Level Parallelization)...');
      const phase1Start = performance.now();
      await scanAndGenerateParallel(args[1] || '.');
      const phase1Time = performance.now() - phase1Start;
      
      console.log('\n2️⃣ Running Phase 2 (Dual Parallelization)...');
      const phase2Start = performance.now();
      await scanAndGenerateDualParallel(args[1] || '.');
      const phase2Time = performance.now() - phase2Start;
      
      console.log('\n📊 PHASE COMPARISON:');
      console.log(`Phase 1 (Component-level): ${phase1Time.toFixed(2)}ms`);
      console.log(`Phase 2 (Dual parallel):   ${phase2Time.toFixed(2)}ms`);
      const improvement = phase1Time / phase2Time;
      console.log(`🚀 Phase 2 Improvement: ${improvement.toFixed(1)}x faster`);
      break;

    default:
      console.log(`
🚀 Praxis Generate - Dual Parallelization Implementation (Phase 2)

Usage:
  bun generate.ts generate [dir]     # Dual parallel scan and generate all
  bun generate.ts watch [dir]        # Dual parallel watch for changes
  bun generate.ts single <config>    # Generate single file with template parallelization
  bun generate.ts benchmark [dir]    # Run dual parallelization benchmark
  bun generate.ts compare [dir]      # Compare Phase 1 vs Phase 2 performance

Examples:
  bun generate.ts generate          # Process current directory with dual parallelization
  bun generate.ts watch             # Watch current directory with dual parallel updates
  bun generate.ts single TestButton.praxis.yaml
  bun generate.ts benchmark         # Test dual parallelization performance
  bun generate.ts compare           # Measure Phase 1 vs Phase 2 improvement

Performance: Global cached functions (9.9x) + Component parallelization (3.9x) + Template parallelization (2x target)
Architecture: Dual-level parallelization with error isolation
Bundle: 100% Bun-native, zero external dependencies
`);
  }
}

export default {
  generateAllTemplatesParallel,
  generateAll,
  scanAndGenerateDualParallel,
  watchAndGenerateDualParallel,
  performance: GlobalPerformance
};
