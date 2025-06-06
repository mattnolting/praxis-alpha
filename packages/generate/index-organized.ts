#!/usr/bin/env bun

/**
 * @praxis/generate - ORGANIZED FILE GENERATION
 * Generate files into proper directory structure (no root clutter)
 */

import { createNativeWatcher, type WatchEvent } from './quick-native-watcher.ts';
import { loadConfig, type PraxisConfig } from './config-parser.ts';

// ============================================================================
// ORGANIZED FILE STRUCTURE
// ============================================================================

function createOutputFile(configPath: string, componentName: string, extension: string): string {
  // Create organized directory structure
  const baseDir = 'generated';
  
  if (extension === 'Props.ts') {
    return `${baseDir}/props/${componentName}Props.ts`;
  } else if (extension === 'Schema.json') {
    return `${baseDir}/schemas/${componentName}Schema.json`;
  }
  
  // Fallback to original behavior
  const lastSlash = configPath.lastIndexOf('/');
  const directory = lastSlash >= 0 ? configPath.substring(0, lastSlash) : '.';
  return `${directory}/${componentName}${extension}`;
}

async function ensureDirectories(): Promise<void> {
  try {
    await Bun.spawn(['mkdir', '-p', 'generated/props', 'generated/schemas']).exited;
  } catch (error) {
    // Directories might already exist, that's okay
  }
}

// ============================================================================
// ENHANCED YAML PARSING - BUN NATIVE FIRST
// ============================================================================

async function parseYAMLWithBunNative(content: string): Promise<any> {
  // Try Bun native first (zero dependencies)
  if (typeof Bun.YAML !== 'undefined') {
    try {
      return Bun.YAML.parse(content);
    } catch (error) {
      console.log('⚠️  Bun.YAML parse failed, trying alternatives...');
    }
  }
  
  // Fallback strategies (only if Bun native fails)
  const fallbacks = [
    // Try js-yaml (most stable)
    async () => {
      const { load } = await import('js-yaml');
      return load(content);
    },
    // Try yaml package (newer spec)
    async () => {
      const { parse } = await import('yaml');
      return parse(content);
    },
    // Try fast-yaml (performance)
    async () => {
      const { parse } = await import('fast-yaml');
      return parse(content);
    }
  ];
  
  for (const fallback of fallbacks) {
    try {
      return await fallback();
    } catch (error) {
      continue; // Try next fallback
    }
  }
  
  throw new Error('All YAML parsers failed');
}

// ============================================================================
// PURE BUN FILE OPERATIONS
// ============================================================================

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
    return true; // File doesn't exist, need to generate
  }
}

async function writeGeneratedFile(filePath: string, content: string) {
  try {
    await Bun.write(filePath, content);
    console.log(`✅ Generated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to write: ${filePath}`, error);
  }
}

// ============================================================================
// GENERATION TEMPLATES
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
 * DO NOT EDIT - Generated by Praxis
 * Source: ${componentName}.praxis.yaml
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
    description: `Generated schema for ${componentName} component`,
    type: "object",
    properties,
    required: [],
    additionalProperties: false,
    generated: {
      timestamp: new Date().toISOString(),
      source: `${componentName}.praxis.yaml`,
      version: "1.0.0"
    }
  };

  return JSON.stringify(schema, null, 2);
}

// ============================================================================
// CORE GENERATION FUNCTIONS
// ============================================================================

export async function generateTypeScript(configPath: string): Promise<void> {
  const config = await loadConfig(configPath);
  if (!config) return;

  await ensureDirectories();
  
  const componentName = config.component.name;
  const outputPath = createOutputFile(configPath, componentName, 'Props.ts');

  if (!(await shouldRegenerate(configPath, outputPath))) {
    console.log(`⚡ Cached: ${componentName}Props.ts`);
    return;
  }

  const content = config.uses 
    ? generateFromUsesDeclaration(config.uses, componentName)
    : `// No 'uses' declaration found in config`;

  await writeGeneratedFile(outputPath, content);
}

export async function generateSchema(configPath: string): Promise<void> {
  const config = await loadConfig(configPath);
  if (!config) return;

  await ensureDirectories();
  
  const componentName = config.component.name;
  const outputPath = createOutputFile(configPath, componentName, 'Schema.json');

  if (!(await shouldRegenerate(configPath, outputPath))) {
    console.log(`⚡ Cached: ${componentName}Schema.json`);
    return;
  }

  const content = generateJSONSchema(config);
  await writeGeneratedFile(outputPath, content);
}

export async function generateAll(configPath: string, formats: string[] = ['typescript', 'json-schema']): Promise<void> {
  console.log(`🚀 Processing: ${getFileBaseName(configPath)}`);

  const promises = formats.map(format => {
    switch (format) {
      case 'typescript':
        return generateTypeScript(configPath);
      case 'json-schema':
        return generateSchema(configPath);
      default:
        console.warn(`Unknown format: ${format}`);
        return Promise.resolve();
    }
  });

  await Promise.all(promises);
}

// ============================================================================
// INDEX FILE GENERATION
// ============================================================================

async function generateIndexFiles(): Promise<void> {
  const propsDir = 'generated/props';
  const schemasDir = 'generated/schemas';
  
  try {
    // Generate props index
    const propsGlob = new Bun.Glob('*Props.ts');
    const propsFiles = await Array.fromAsync(propsGlob.scan(propsDir));
    
    const propsExports = propsFiles.map(file => {
      const name = file.replace('.ts', '');
      return `export { default as ${name} } from './${file}';`;
    }).join('\n');
    
    await Bun.write(`${propsDir}/index.ts`, `// Generated props exports\n${propsExports}\n`);
    
    // Generate schemas index
    const schemasGlob = new Bun.Glob('*Schema.json');
    const schemaFiles = await Array.fromAsync(schemasGlob.scan(schemasDir));
    
    const schemaImports = schemaFiles.map(file => {
      const name = file.replace('.json', '');
      return `import ${name} from './${file}';`;
    }).join('\n');
    
    const schemaExports = schemaFiles.map(file => 
      file.replace('.json', '')
    ).join(',\n  ');
    
    await Bun.write(`${schemasDir}/index.ts`, 
      `// Generated schema exports\n${schemaImports}\n\nexport {\n  ${schemaExports}\n};\n`
    );
    
    // Generate main index
    const mainIndex = `// Praxis Generated Files\nexport * from './props';\nexport * from './schemas';\n`;
    await Bun.write('generated/index.ts', mainIndex);
    
    console.log('✅ Generated index files');
    
  } catch (error) {
    console.error('❌ Failed to generate index files:', error);
  }
}

export async function scanAndGenerate(dir: string = '.'): Promise<void> {
  console.log('🔍 Scanning for Praxis configs...');

  await ensureDirectories();
  
  const glob = new Bun.Glob('**/*.praxis.yaml');
  const configs = await Array.fromAsync(glob.scan(dir));

  console.log(`Found ${configs.length} config files`);

  for (const configPath of configs) {
    await generateAll(configPath, ['typescript', 'json-schema']);
  }

  await generateIndexFiles();

  console.log(`✅ Generated organized files for ${configs.length} components`);
  console.log('📁 Files organized in generated/props/ and generated/schemas/');
}

// ============================================================================
// NATIVE FILE WATCHING
// ============================================================================

const nativeWatcher = createNativeWatcher();

export async function watchAndGenerate(dir: string = '.'): Promise<void> {
  console.log('👀 Starting organized file watcher...');

  await scanAndGenerate(dir);

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
          await generateAll(filePath, ['typescript', 'json-schema']);
        } catch (error) {
          console.error(`❌ Generation failed for ${filePath}:`, error);
        }
      }
    }

    await generateIndexFiles();
    
    const stats = nativeWatcher.getStats();
    console.log(`📊 Watcher: Native FS events, ${stats.watcherType}`);
  });

  console.log('🚀 Organized file watching active... (Press Ctrl+C to stop)');

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
      await scanAndGenerate(args[1]);
      break;

    case 'watch':
      await watchAndGenerate(args[1]);
      break;

    case 'single':
      if (args[1]) {
        await ensureDirectories();
        await generateAll(args[1], ['typescript', 'json-schema']);
        await generateIndexFiles();
      } else {
        console.error('Usage: bun index-organized.ts single <config-path>');
      }
      break;

    case 'cleanup':
      console.log('🧹 Running file organization cleanup...');
      await Bun.spawn(['bun', 'organize-generated-files.ts']).exited;
      break;

    default:
      console.log(`
🚀 Praxis Generate - ORGANIZED FILE GENERATION

Usage:
  bun index-organized.ts generate [dir]     # Scan and generate organized
  bun index-organized.ts watch [dir]        # Watch with organized output
  bun index-organized.ts single <config>    # Generate single organized
  bun index-organized.ts cleanup            # Organize existing files

Features:
  📁 Organized structure: generated/props/ and generated/schemas/
  🚀 Bun-native YAML parsing (zero dependencies)
  ⚡ Smart caching and regeneration
  📋 Auto-generated index files
  🧹 Clean root directory (no clutter)

Output structure:
  generated/
  ├── props/           # TypeScript interfaces
  │   ├── *Props.ts    # Generated interfaces
  │   └── index.ts     # Barrel export
  ├── schemas/         # JSON schemas  
  │   ├── *Schema.json # Generated schemas
  │   └── index.ts     # Barrel export
  └── index.ts         # Main export

Usage in code:
  import { TestButtonProps } from './generated';
  import { TestButtonSchema } from './generated';
`);
  }
}

export default {
  generateTypeScript,
  generateSchema,
  generateAll,
  scanAndGenerate,
  watchAndGenerate
};