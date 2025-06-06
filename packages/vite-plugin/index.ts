/**
 * @praxis/vite-plugin - Pure Bun-optimized version
 * Designed specifically for Bun's performance and capabilities
 */

interface PraxisConfig {
  component: {
    name: string;
    description?: string;
  };
  uses: Record<string, string[]>;
}

interface PraxisPluginOptions {
  watch?: boolean;
  outputDir?: string;
  formats?: string[];
  verbose?: boolean;
}

// Force Bun runtime check
const isBunRuntime = typeof Bun !== 'undefined' && typeof globalThis.Bun !== 'undefined';

if (!isBunRuntime) {
  console.warn('⚠️ [praxis] Running in non-Bun environment - performance will be degraded');
  console.warn('💡 [praxis] Use "bun --bun vite" for maximum performance');
}

// Enhanced YAML parser optimized for Bun
function parseYAML(content: string): any {
  const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  const result: any = {};
  const stack: Array<{ obj: any; indent: number }> = [{ obj: result, indent: -1 }];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    const indent = line.length - line.trimStart().length;
    const colonIndex = trimmed.indexOf(':');
    
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    
    // Find the correct parent object based on indentation
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const currentObj = stack[stack.length - 1].obj;
    
    if (value === '' || value === undefined) {
      // This is a nested object
      currentObj[key] = {};
      stack.push({ obj: currentObj[key], indent });
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Array value
      const arrayStr = value.slice(1, -1);
      const items = arrayStr.split(',').map(s => s.trim().replace(/["']/g, ''));
      currentObj[key] = items;
    } else {
      // Simple value
      currentObj[key] = value.replace(/["']/g, '');
    }
  }
  
  return result;
}

// Bun-optimized file operations
async function readTextFile(filePath: string): Promise<string> {
  if (isBunRuntime) {
    // Use Bun's ultra-fast file API
    const file = Bun.file(filePath);
    return await file.text();
  } else {
    // Fallback to Node.js
    const { readFile } = await import('fs/promises');
    return await readFile(filePath, 'utf-8');
  }
}

async function writeTextFile(filePath: string, content: string): Promise<void> {
  if (isBunRuntime) {
    // Use Bun's high-performance write
    await Bun.write(filePath, content);
  } else {
    // Fallback to Node.js
    const { writeFile, mkdir } = await import('fs/promises');
    const { dirname } = await import('path');
    
    try {
      await mkdir(dirname(filePath), { recursive: true });
    } catch {
      // Directory might already exist
    }
    
    await writeFile(filePath, content);
  }
}

async function globFiles(pattern: string): Promise<string[]> {
  if (isBunRuntime) {
    // Use Bun's native glob - extremely fast
    const glob = new Bun.Glob(pattern);
    return await Array.fromAsync(glob.scan('.'));
  } else {
    // Fallback to Node.js glob package
    const { glob } = await import('glob');
    return await glob(pattern, { ignore: 'node_modules/**' });
  }
}

// Bun-optimized config loader
async function loadConfig(filePath: string): Promise<PraxisConfig | null> {
  try {
    const startTime = isBunRuntime ? performance.now() : Date.now();
    
    const content = await readTextFile(filePath);
    const config = parseYAML(content);
    
    const endTime = isBunRuntime ? performance.now() : Date.now();
    const loadTime = endTime - startTime;
    
    if (isBunRuntime && loadTime > 1) {
      console.log(`[praxis] ⚡ Bun file read: ${loadTime.toFixed(2)}ms for ${filePath}`);
    }
    
    if (!config.component) {
      console.warn(`[praxis] Missing 'component' section in ${filePath}`);
      return null;
    }
    
    if (!config.component.name) {
      console.warn(`[praxis] Missing 'component.name' in ${filePath}`);
      return null;
    }
    
    return config as PraxisConfig;
  } catch (error) {
    console.error(`[praxis] Failed to load config: ${filePath}`, error);
    return null;
  }
}

// High-performance TypeScript generation
function generateTypeScript(config: PraxisConfig): string {
  const componentName = config.component.name;
  const props: string[] = [];

  for (const [category, items] of Object.entries(config.uses || {})) {
    if (category === 'variants') {
      const variantValues = items.map(item => `"${item}"`).join(' | ');
      props.push(`  /** Component variant */\n  variant?: ${variantValues};`);
    } else if (category === 'sizes') {
      const sizeValues = items.map(item => `"${item}"`).join(' | ');
      props.push(`  /** Component size */\n  size?: ${sizeValues};`);
    } else if (category === 'states') {
      for (const item of items) {
        props.push(`  /** Component state: ${item.replace('is', '').toLowerCase()} */\n  ${item}?: boolean;`);
      }
    } else if (category === 'accessibility') {
      for (const item of items) {
        props.push(`  /** Accessibility: ${item} */\n  "${item}"?: string;`);
      }
    } else if (category === 'interactions') {
      for (const item of items) {
        props.push(`  /** Event handler: ${item} */\n  ${item}?: (...args: any[]) => any;`);
      }
    } else if (category === 'styling') {
      for (const item of items) {
        const type = item === 'style' ? 'React.CSSProperties' : 'string';
        props.push(`  /** Styling: ${item} */\n  ${item}?: ${type};`);
      }
    }
  }

  return `/**
 * Generated props for ${componentName}
 * DO NOT EDIT - Generated by Praxis using Vite plugin (Bun-optimized)
 * @generated ${new Date().toISOString()}
 */

export interface ${componentName}Props {
${props.join('\n')}
}

export default ${componentName}Props;
`;
}

// Main plugin function optimized for Bun
export function praxis(options: PraxisPluginOptions = {}) {
  const opts = {
    watch: true,
    outputDir: 'src/types',
    formats: ['typescript', 'json-schema'],
    verbose: false,
    ...options
  };

  let watchers: any[] = [];
  const runtimeInfo = {
    runtime: isBunRuntime ? 'Bun' : 'Node.js',
    performance: isBunRuntime ? 'Optimized' : 'Degraded',
    fileAPI: isBunRuntime ? 'Bun.file()' : 'fs.readFile()',
    globAPI: isBunRuntime ? 'Bun.Glob()' : 'glob package'
  };

  const log = (message: string) => {
    if (opts.verbose) {
      console.log(`[praxis] ${message}`);
    }
  };

  async function processFile(filePath: string): Promise<void> {
    try {
      const startTime = performance.now();
      
      const config = await loadConfig(filePath);
      if (!config) {
        console.warn(`[praxis] Skipping ${filePath} - invalid config`);
        return;
      }

      const componentName = config.component.name;

      // Generate TypeScript with Bun-optimized speed
      if (opts.formats.includes('typescript')) {
        const tsContent = generateTypeScript(config);
        const tsPath = `${opts.outputDir}/${componentName}Props.ts`;
        
        await writeTextFile(tsPath, tsContent);
        log(`Generated ${tsPath}`);
      }

      // Generate JSON Schema
      if (opts.formats.includes('json-schema')) {
        const schema = {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: `${componentName} Props`,
          type: "object",
          properties: Object.fromEntries(
            Object.entries(config.uses || {}).flatMap(([category, items]) => {
              if (category === 'variants') {
                return [['variant', { type: "string", enum: items }]];
              } else if (category === 'sizes') {
                return [['size', { type: "string", enum: items }]];
              } else if (category === 'states') {
                return items.map(item => [item, { type: "boolean" }]);
              }
              return [];
            })
          ),
          required: []
        };
        
        const schemaPath = `${opts.outputDir}/${componentName}Schema.json`;
        await writeTextFile(schemaPath, JSON.stringify(schema, null, 2));
        log(`Generated ${schemaPath}`);
      }

      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      if (isBunRuntime) {
        console.log(`✅ [praxis] Generated ${componentName} in ${processingTime.toFixed(2)}ms (Bun-optimized)`);
      } else {
        console.log(`✅ [praxis] Generated ${componentName} in ${processingTime.toFixed(2)}ms (Node.js fallback)`);
      }

    } catch (error) {
      console.error(`❌ [praxis] Error processing ${filePath}:`, error);
    }
  }

  async function scanAndProcess(): Promise<void> {
    try {
      const startTime = performance.now();
      
      const configs = await globFiles('**/*.praxis.yaml');
      console.log(`🔍 [praxis] Found ${configs.length} config files using ${runtimeInfo.globAPI}`);
      
      if (configs.length === 0) {
        console.log(`[praxis] No .praxis.yaml files found`);
        return;
      }
      
      // Process files in parallel when using Bun for maximum performance
      if (isBunRuntime && configs.length > 1) {
        await Promise.all(configs.map(configPath => processFile(configPath)));
      } else {
        // Sequential processing for Node.js compatibility
        for (const configPath of configs) {
          await processFile(configPath);
        }
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`✅ [praxis] Processed ${configs.length} components in ${totalTime.toFixed(2)}ms (${runtimeInfo.runtime})`);
    } catch (error) {
      console.error('❌ [praxis] Error scanning configs:', error);
    }
  }

  function setupWatching(): void {
    if (!opts.watch) return;

    // Use Node.js fs.watch for file watching (works in both Bun and Node.js)
    const { watch } = require('fs');
    
    const watcher = watch('.', { recursive: true }, async (eventType, filename) => {
      if (!filename || !filename.endsWith('.praxis.yaml')) return;

      console.log(`📝 [praxis] File ${eventType}: ${filename} (${runtimeInfo.runtime})`);
      
      setTimeout(async () => {
        await processFile(filename);
      }, 50);
    });

    watchers.push(watcher);
    console.log(`👀 [praxis] File watching active using ${runtimeInfo.runtime} runtime`);
  }

  return {
    name: 'praxis',
    
    async buildStart() {
      console.log(`🚀 [praxis] Runtime: ${runtimeInfo.runtime} (${runtimeInfo.performance})`);
      if (!isBunRuntime) {
        console.log(`💡 [praxis] For maximum performance, use: bun --bun vite`);
      }
      await scanAndProcess();
    },

    configureServer(devServer: any) {
      // Add enhanced status endpoint
      devServer.middlewares.use('/praxis-status', (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          ...runtimeInfo,
          watching: watchers.length > 0,
          outputDir: opts.outputDir,
          performance: isBunRuntime ? 'Maximum (Bun)' : 'Standard (Node.js)'
        }));
      });
      
      setTimeout(async () => {
        await scanAndProcess();
        setupWatching();
      }, 100);
    },

    buildEnd() {
      for (const watcher of watchers) {
        try {
          watcher.close();
        } catch (error) {
          log(`Error closing watcher: ${error}`);
        }
      }
      watchers = [];
    }
  };
}

export default praxis;