#!/usr/bin/env bun

/**
 * @praxis/generate - PHASE 3B: INTELLIGENT BATCH OPERATIONS + PARALLEL PROCESSING
 * Combines Phase 3A intelligent processing with Phase 3B batch file operations
 */

import { createNativeWatcher, type WatchEvent } from './quick-native-watcher.ts';
import { loadConfig, type PraxisConfig } from './config-parser.ts';
import { 
  PathOps, 
  FileOps, 
  BatchFileOps,
  processAllCategoriesIntelligent,
  generateCompleteComponentPhase3A,
  Templates,
  Phase3BPerformance
} from './global-cached-system.ts';

// ============================================================================
// PHASE 3B: ENHANCED PREPROCESSING WITH BATCH OPERATIONS
// ============================================================================

interface EnhancedBatchConfig {
  componentName: string;
  configPath: string;
  outputPaths: {
    typescript: string;
    schema: string;
  };
  usesDeclaration: any;
  needsRegeneration: {
    typescript: boolean;
    schema: boolean;
  };
}

/**
 * 🚀 PHASE 3B: BATCH PREPROCESSING
 * Process multiple configs simultaneously with batch file operations
 */
export async function batchPreprocessConfigs(configPaths: string[]): Promise<EnhancedBatchConfig[]> {
  console.log(`🔄 Batch preprocessing ${configPaths.length} configs...`);

  // Load all configs in parallel
  const configs = await Promise.all(
    configPaths.map(async (configPath) => {
      const config = await loadConfig(configPath);
      return { configPath, config };
    })
  );

  // Filter valid configs and prepare batch operations
  const validConfigs = configs.filter(({ config }) => config !== null);
  const batchOperations: Array<{config: string, output: string, componentName: string}> = [];
  
  validConfigs.forEach(({ configPath, config }) => {
    if (config) {
      const componentName = config.component.name;
      const tsPath = PathOps.createOutputPath(configPath, componentName, 'Props.ts');
      const schemaPath = PathOps.createOutputPath(configPath, componentName, 'Schema.json');
      
      batchOperations.push(
        { config: configPath, output: tsPath, componentName },
        { config: configPath, output: schemaPath, componentName }
      );
    }
  });

  // 🚀 BATCH FILE OPERATIONS: Check regeneration needs for all files
  const regenerationResults = await BatchFileOps.batchShouldRegenerate(batchOperations);

  // Build enhanced configs with batch results
  const enhancedConfigs: EnhancedBatchConfig[] = validConfigs.map(({ configPath, config }) => {
    if (!config) return null;

    const componentName = config.component.name;
    const tsPath = PathOps.createOutputPath(configPath, componentName, 'Props.ts');
    const schemaPath = PathOps.createOutputPath(configPath, componentName, 'Schema.json');

    // Find regeneration results for this component
    const tsResult = regenerationResults.find(r => r.path === tsPath && r.componentName === componentName);
    const schemaResult = regenerationResults.find(r => r.path === schemaPath && r.componentName === componentName);

    return {
      componentName,
      configPath,
      outputPaths: {
        typescript: tsPath,
        schema: schemaPath
      },
      usesDeclaration: config.uses,
      needsRegeneration: {
        typescript: tsResult?.needsRegeneration ?? true,
        schema: schemaResult?.needsRegeneration ?? true
      }
    };
  }).filter(Boolean) as EnhancedBatchConfig[];

  console.log(`✅ Batch preprocessing complete: ${enhancedConfigs.length} configs processed`);
  return enhancedConfigs;
}

// ============================================================================
// PHASE 3B: INTELLIGENT BATCH GENERATION
// ============================================================================

/**
 * 🚀 PHASE 3B: GENERATE ALL WITH INTELLIGENT BATCH OPERATIONS
 */
export async function generateAllPhase3B(configPaths: string[]): Promise<void> {
  if (configPaths.length === 0) return;

  console.log(`🚀 Phase 3B Processing: ${configPaths.length} components with intelligent batch operations`);

  // Batch preprocessing with intelligent file operations
  const enhancedConfigs = await batchPreprocessConfigs(configPaths);

  // Filter components that need regeneration
  const componentsNeedingWork = enhancedConfigs.filter(config => 
    config.needsRegeneration.typescript || config.needsRegeneration.schema
  );

  if (componentsNeedingWork.length === 0) {
    console.log('⚡ All components up to date');
    return;
  }

  console.log(`🔄 Generating ${componentsNeedingWork.length} components...`);

  // Generate content for all components using Phase 3A intelligent processing
  const generationResults = await Promise.all(
    componentsNeedingWork.map(async (config) => {
      // 🎯 Use Phase 3A intelligent parallel processing for content generation
      const generated = await generateCompleteComponentPhase3A(config.componentName, config.usesDeclaration);
      
      return {
        componentName: config.componentName,
        typescript: {
          path: config.outputPaths.typescript,
          content: generated.typescript,
          needed: config.needsRegeneration.typescript
        },
        schema: {
          path: config.outputPaths.schema,
          content: generated.schema,
          needed: config.needsRegeneration.schema
        }
      };
    })
  );

  // Prepare batch write operations
  const writeOperations: Array<{path: string, content: string, componentName: string}> = [];
  
  generationResults.forEach(result => {
    if (result.typescript.needed) {
      writeOperations.push({
        path: result.typescript.path,
        content: result.typescript.content,
        componentName: result.componentName
      });
    }
    if (result.schema.needed) {
      writeOperations.push({
        path: result.schema.path,
        content: result.schema.content,
        componentName: result.componentName
      });
    }
  });

  // 🚀 BATCH FILE OPERATIONS: Write all files with resilient error handling
  if (writeOperations.length > 0) {
    const batchResults = await BatchFileOps.batchWrite(writeOperations);
    
    console.log(`✅ Batch Generation Complete:`);
    console.log(`   📝 Successful: ${batchResults.successful} files`);
    if (batchResults.failed > 0) {
      console.log(`   ❌ Failed: ${batchResults.failed} files`);
    }
  }

  console.log(`🎉 Phase 3B Complete: ${componentsNeedingWork.length} components processed`);
}

// ============================================================================
// PHASE 3B: ENHANCED SCANNING WITH BATCH OPERATIONS
// ============================================================================

export async function scanAndGeneratePhase3B(dir: string = '.'): Promise<void> {
  console.log('🔍 Phase 3B: Scanning for Praxis configs with intelligent batch operations...');

  const glob = new Bun.Glob('**/*.praxis.yaml');
  const configs = await Array.fromAsync(glob.scan(dir));

  console.log(`📊 Found ${configs.length} config files`);

  if (configs.length === 0) {
    console.log('No Praxis config files found');
    return;
  }

  // Performance analysis
  const analysisOperations = configs.map(configPath => ({
    config: configPath,
    output: configPath.replace('.praxis.yaml', 'Props.ts'), // Simplified for analysis
    componentName: PathOps.extractBasename(configPath).replace('.praxis.yaml', '')
  }));

  const performanceAnalysis = await Phase3BPerformance.compareBatchOperations(analysisOperations, 5);
  
  console.log(`📈 Batch Operations Analysis:`);
  console.log(`   📊 Operation count: ${performanceAnalysis.operationCount}`);
  console.log(`   ⚡ Decision: ${performanceAnalysis.decision}`);
  console.log(`   🚀 Expected improvement: ${performanceAnalysis.improvement.toFixed(2)}x`);
  console.log(`   📋 Analysis: ${Phase3BPerformance.analyzeBatchBenefit(configs.length)}`);

  // Generate with intelligent batch operations
  await generateAllPhase3B(configs);

  console.log(`✅ Phase 3B Complete: Processed ${configs.length} components with intelligent batch operations`);
}

// ============================================================================
// PHASE 3B: ENHANCED FILE WATCHING WITH BATCH OPERATIONS
// ============================================================================

const nativeWatcher = createNativeWatcher();

export async function watchAndGeneratePhase3B(dir: string = '.'): Promise<void> {
  console.log('👀 Phase 3B: Starting enhanced file watcher with batch operations...');

  await scanAndGeneratePhase3B(dir);

  console.log('🚀 Phase 3B: Native event-driven file watching with intelligent batching...');

  await nativeWatcher.watch('**/*.praxis.yaml', async (events: WatchEvent[]) => {
    console.log(`📦 Processing ${events.length} file events with Phase 3B batch operations...`);

    const validConfigPaths = events
      .filter(event => event.type !== 'unlink')
      .map(event => event.path)
      .filter((path, index, array) => array.indexOf(path) === index); // Deduplicate

    if (validConfigPaths.length > 0) {
      console.log(`🔄 Batch processing ${validConfigPaths.length} changed configs...`);
      
      try {
        await generateAllPhase3B(validConfigPaths);
      } catch (error) {
        console.error(`❌ Phase 3B batch generation failed:`, error);
      }
    }

    // Handle deleted files
    const deletedFiles = events.filter(event => event.type === 'unlink');
    deletedFiles.forEach(event => {
      console.log(`🗑️ File deleted: ${event.path}`);
    });

    const stats = nativeWatcher.getStats();
    console.log(`📊 Watcher: Native FS events, ${stats.watcherType}`);
  });

  console.log('🚀 Phase 3B: Enhanced file watching active... (Press Ctrl+C to stop)');

  process.on('SIGINT', () => {
    console.log('\n📋 Cleaning up Phase 3B watcher...');
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
      await scanAndGeneratePhase3B(args[1]);
      break;

    case 'watch':
      await watchAndGeneratePhase3B(args[1]);
      break;

    case 'batch':
      if (args[1]) {
        const glob = new Bun.Glob(args[1]);
        const configs = await Array.fromAsync(glob.scan('.'));
        await generateAllPhase3B(configs);
      } else {
        console.error('Usage: bun index-phase3b.ts batch <pattern>');
      }
      break;

    default:
      console.log(`
🚀 Praxis Generate - PHASE 3B: INTELLIGENT BATCH OPERATIONS

Usage:
  bun index-phase3b.ts generate [dir]     # Scan and generate with batch operations
  bun index-phase3b.ts watch [dir]        # Watch with intelligent batching  
  bun index-phase3b.ts batch <pattern>    # Batch process specific files

Features:
  🎯 Intelligent batch operations (3+ files → batch processing)
  🚀 Phase 3A intelligent parallel processing integration
  📦 Resilient file operations with Promise.allSettled
  ⚡ ~2x improvement for multi-component projects
  🔧 Automatic fallback for small operation sets
`);
  }
}

export default {
  generateAllPhase3B,
  scanAndGeneratePhase3B,
  watchAndGeneratePhase3B,
  batchPreprocessConfigs
};
