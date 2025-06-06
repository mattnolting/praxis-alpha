#!/usr/bin/env bun

/**
 * @praxis/generate - PHASE 2: SURGICAL PARALLELIZATION
 * Shared preprocessing + parallel template generation
 */

import { createNativeWatcher, type WatchEvent } from './quick-native-watcher.ts';
import { loadConfig, type PraxisConfig } from './config-parser.ts';

// ============================================================================
// SURGICAL PARALLELIZATION - SHARED PREPROCESSING
// ============================================================================

interface PreprocessedConfig {
  componentName: string;
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

async function preprocessConfig(configPath: string): Promise<PreprocessedConfig | null> {
  const config = await loadConfig(configPath);
  if (!config) return null;

  const componentName = config.component.name;
  const tsPath = createOutputFile(configPath, componentName, 'Props.ts');
  const schemaPath = createOutputFile(configPath, componentName, 'Schema.json');

  // Parallel regeneration checks
  const [tsRegen, schemaRegen] = await Promise.all([
    shouldRegenerate(configPath, tsPath),
    shouldRegenerate(configPath, schemaPath)
  ]);

  return {
    componentName,
    outputPaths: {
      typescript: tsPath,
      schema: schemaPath
    },
    usesDeclaration: config.uses,
    needsRegeneration: {
      typescript: tsRegen,
      schema: schemaRegen
    }
  };
}

// ============================================================================
// PARALLEL TEMPLATE GENERATORS - ACCEPT PREPROCESSED DATA
// ============================================================================

async function generateTypeScriptFromPreprocessed(preprocessed: PreprocessedConfig): Promise<void> {
  if (!preprocessed.needsRegeneration.typescript) {
    console.log(`⚡ Cached: ${preprocessed.componentName}Props.ts`);
    return;
  }

  const content = preprocessed.usesDeclaration 
    ? generateFromUsesDeclaration(preprocessed.usesDeclaration, preprocessed.componentName)
    : `// No 'uses' declaration found in config`;

  await writeGeneratedFile(preprocessed.outputPaths.typescript, content);
}

async function generateSchemaFromPreprocessed(preprocessed: PreprocessedConfig): Promise<void> {
  if (!preprocessed.needsRegeneration.schema) {
    console.log(`⚡ Cached: ${preprocessed.componentName}Schema.json`);
    return;
  }

  const content = generateJSONSchema({
    component: { name: preprocessed.componentName },
    uses: preprocessed.usesDeclaration
  } as PraxisConfig);

  await writeGeneratedFile(preprocessed.outputPaths.schema, content);
}

// ============================================================================
// SURGICAL PARALLELIZATION - CORE FUNCTION
// ============================================================================

export async function generateAllParallel(configPath: string): Promise<void> {
  console.log(`🚀 Processing: ${getFileBaseName(configPath)}`);

  // PHASE 2: Single preprocessing, parallel generation
  const preprocessed = await preprocessConfig(configPath);
  if (!preprocessed) return;

  // Parallel template generation with shared data
  await Promise.all([
    generateTypeScriptFromPreprocessed(preprocessed),
    generateSchemaFromPreprocessed(preprocessed)
  ]);
}

// ============================================================================
// PURE BUN FILE OPERATIONS (UNCHANGED)
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

async function writeGeneratedFile(filePath: string, content: string) {
  try {
    await Bun.write(filePath, content);
    console.log(`✅ Generated: ${getFileBaseName(filePath)}`);
  } catch (error) {
    console.error(`❌ Failed to write: ${filePath}`, error);
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
// PARALLEL SCAN AND GENERATE
// ============================================================================

export async function scanAndGenerateParallel(dir: string = '.'): Promise<void> {
  console.log('🔍 Scanning for Praxis configs...');

  const glob = new Bun.Glob('**/*.praxis.yaml');
  const configs = await Array.fromAsync(glob.scan(dir));

  console.log(`Found ${configs.length} config files`);

  // Pipeline parallelization - process multiple components
  const pipeline = configs.map(async (configPath, index) => {
    // Stagger starts to optimize I/O
    await new Promise(resolve => setTimeout(resolve, index * 10));
    return generateAllParallel(configPath);
  });

  await Promise.all(pipeline);

  console.log(`✅ Generated interfaces for ${configs.length} components`);
}

// ============================================================================
// NATIVE FILE WATCHING (UNCHANGED)
// ============================================================================

const nativeWatcher = createNativeWatcher();

export async function watchAndGenerateParallel(dir: string = '.'): Promise<void> {
  console.log('👀 Starting native file watcher...');

  await scanAndGenerateParallel(dir);

  console.log('🚀 Using native event-driven file watching...');

  await nativeWatcher.watch('**/*.praxis.yaml', async (events: WatchEvent[]) => {
    console.log(`📦 Processing ${events.length} file events...`);

    const uniqueFiles = new Set(events.map(event => event.path));

    for (const filePath of uniqueFiles) {
      const event = events.find(e => e.path === filePath);

      if (event?.type === 'unlink') {
        console.log(`🗑️ File deleted: ${event.path}`);
      } else {
        console.log(`🔄 Config changed: ${filePath}`);
        try {
          await generateAllParallel(filePath);
        } catch (error) {
          console.error(`❌ Generation failed for ${filePath}:`, error);
        }
      }
    }

    const stats = nativeWatcher.getStats();
    console.log(`📊 Watcher: Native FS events, ${stats.watcherType}`);
  });

  console.log('🚀 Native file watching active... (Press Ctrl+C to stop)');

  process.on('SIGINT', () => {
    console.log('\n📋 Cleaning up native watcher...');
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
      await scanAndGenerateParallel(args[1]);
      break;

    case 'watch':
      await watchAndGenerateParallel(args[1]);
      break;

    case 'single':
      if (args[1]) {
        await generateAllParallel(args[1]);
      } else {
        console.error('Usage: bun index-parallel.ts single <config-path>');
      }
      break;

    default:
      console.log(`
🚀 Praxis Generate - PHASE 2: SURGICAL PARALLELIZATION

Usage:
  bun index-parallel.ts generate [dir]     # Scan and generate all
  bun index-parallel.ts watch [dir]        # Watch for changes  
  bun index-parallel.ts single <config>    # Generate single file

Features:
  ⚡ Shared preprocessing - single config parse
  🚀 Parallel template generation
  📦 Pipeline processing for multiple components
  🎯 2x additional improvement target
`);
  }
}

export default {
  generateAllParallel,
  scanAndGenerateParallel,
  watchAndGenerateParallel
};