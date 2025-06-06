/**
 * @praxis/core - Composable Plugin Architecture
 * Enhanced developer experience through modular, surgical design
 */

// ============================================================================
// CORE PLUGIN INTERFACE
// ============================================================================

export interface PraxisPlugin {
  name: string;
  version?: string;
  generate?: (config: any, options?: any) => Promise<GenerationResult>;
  watch?: (callback: (file: string) => void) => Promise<void>;
  validate?: (config: any) => ValidationResult;
  transform?: (content: string, format: string) => string;
}

export interface GenerationResult {
  files: GeneratedFile[];
  duration: number;
  cacheHits: number;
  errors?: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  format: 'typescript' | 'json-schema' | 'css' | 'docs';
  size: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PraxisOptions {
  outputFormats?: string[];
  cacheEnabled?: boolean;
  watchMode?: boolean;
  verbose?: boolean;
  patterns?: string[];
}

// ============================================================================
// PLUGIN REGISTRY
// ============================================================================

class PraxisPluginRegistry {
  private plugins = new Map<string, PraxisPlugin>();
  private middleware: Array<(result: GenerationResult) => GenerationResult> = [];
  
  register(plugin: PraxisPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`⚠️ Plugin ${plugin.name} already registered, overwriting`);
    }
    this.plugins.set(plugin.name, plugin);
    console.log(`✅ Registered plugin: ${plugin.name}`);
  }
  
  get(name: string): PraxisPlugin | undefined {
    return this.plugins.get(name);
  }
  
  list(): string[] {
    return Array.from(this.plugins.keys());
  }
  
  use(middleware: (result: GenerationResult) => GenerationResult): void {
    this.middleware.push(middleware);
  }
  
  async runPipeline(config: any, options: PraxisOptions = {}): Promise<GenerationResult> {
    const start = performance.now();
    let result: GenerationResult = {
      files: [],
      duration: 0,
      cacheHits: 0
    };
    
    // Run generation plugins
    for (const [name, plugin] of this.plugins) {
      if (plugin.generate) {
        try {
          const pluginResult = await plugin.generate(config, options);
          result.files.push(...pluginResult.files);
          result.cacheHits += pluginResult.cacheHits;
        } catch (error) {
          result.errors = result.errors || [];
          result.errors.push(`Plugin ${name}: ${error.message}`);
        }
      }
    }
    
    // Apply middleware
    for (const mw of this.middleware) {
      result = mw(result);
    }
    
    result.duration = performance.now() - start;
    return result;
  }
}

export const pluginRegistry = new PraxisPluginRegistry();

// ============================================================================
// BUILT-IN PLUGINS
// ============================================================================

// TypeScript Generation Plugin
export const typescriptPlugin: PraxisPlugin = {
  name: 'typescript',
  version: '1.0.0',
  async generate(config: any, options?: any): Promise<GenerationResult> {
    const start = performance.now();
    const { generateFromUsesDeclarationOptimized } = await import('./memory-pool.ts');
    
    if (!config.component?.name || !config.uses) {
      return { files: [], duration: 0, cacheHits: 0 };
    }
    
    const content = generateFromUsesDeclarationOptimized(config.uses, config.component.name);
    const path = `${config.component.name}Props.ts`;
    
    return {
      files: [{
        path,
        content,
        format: 'typescript',
        size: content.length
      }],
      duration: performance.now() - start,
      cacheHits: 1 // From memory pool
    };
  }
};

// JSON Schema Generation Plugin
export const jsonSchemaPlugin: PraxisPlugin = {
  name: 'json-schema',
  version: '1.0.0',
  async generate(config: any, options?: any): Promise<GenerationResult> {
    const start = performance.now();
    
    if (!config.component?.name || !config.uses) {
      return { files: [], duration: 0, cacheHits: 0 };
    }
    
    const componentName = config.component.name;
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
        }
        // Add other categories as needed
      }
    }
    
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: `${componentName} Props`,
      type: "object",
      properties,
      required: []
    };
    
    const content = JSON.stringify(schema, null, 2);
    const path = `${componentName}Schema.json`;
    
    return {
      files: [{
        path,
        content,
        format: 'json-schema',
        size: content.length
      }],
      duration: performance.now() - start,
      cacheHits: 0
    };
  }
};

// Validation Plugin
export const validationPlugin: PraxisPlugin = {
  name: 'validation',
  version: '1.0.0',
  validate(config: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate component structure
    if (!config.component) {
      errors.push('Missing component configuration');
    } else if (!config.component.name) {
      errors.push('Component name is required');
    }
    
    // Validate uses declaration
    if (!config.uses) {
      warnings.push('No uses declaration found');
    } else {
      for (const [category, items] of Object.entries(config.uses)) {
        if (!Array.isArray(items)) {
          errors.push(`Category '${category}' must be an array`);
        } else if (items.length === 0) {
          warnings.push(`Category '${category}' is empty`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
};

// File Watcher Plugin
export const watchPlugin: PraxisPlugin = {
  name: 'watch',
  version: '1.0.0',
  async watch(callback: (file: string) => void): Promise<void> {
    // Use Bun's native file watching
    const glob = new Bun.Glob('**/*.praxis.yaml');
    const fileStats = new Map();
    
    // Initial scan
    const files = await Array.fromAsync(glob.scan('.'));
    for (const file of files) {
      try {
        const stat = await Bun.file(file).stat();
        fileStats.set(file, stat.mtime);
      } catch {}
    }
    
    // Watch for changes
    setInterval(async () => {
      const currentFiles = await Array.fromAsync(glob.scan('.'));
      
      for (const file of currentFiles) {
        try {
          const stat = await Bun.file(file).stat();
          const lastMtime = fileStats.get(file);
          
          if (!lastMtime || stat.mtime > lastMtime) {
            fileStats.set(file, stat.mtime);
            if (lastMtime) callback(file);
          }
        } catch {}
      }
    }, 100);
  }
};

// ============================================================================
// COMPOSABLE API
// ============================================================================

export function createPraxis(options: PraxisOptions = {}): {
  use: (plugin: PraxisPlugin) => void;
  generate: (configPath: string) => Promise<GenerationResult>;
  watch: (callback?: (file: string) => void) => Promise<void>;
  validate: (configPath: string) => Promise<ValidationResult>;
} {
  // Register built-in plugins
  pluginRegistry.register(typescriptPlugin);
  pluginRegistry.register(jsonSchemaPlugin);
  pluginRegistry.register(validationPlugin);
  pluginRegistry.register(watchPlugin);
  
  return {
    use(plugin: PraxisPlugin) {
      pluginRegistry.register(plugin);
    },
    
    async generate(configPath: string): Promise<GenerationResult> {
      // Read config
      const file = Bun.file(configPath);
      const content = await file.text();
      
      // Parse YAML (using our native parser)
      const { parseSimpleYAML } = await import('../generate/index.ts');
      const config = parseSimpleYAML(content);
      
      // Run plugin pipeline
      return await pluginRegistry.runPipeline(config, options);
    },
    
    async watch(callback?: (file: string) => void): Promise<void> {
      const watcher = pluginRegistry.get('watch');
      if (watcher?.watch) {
        await watcher.watch(callback || ((file) => {
          console.log(`🔄 File changed: ${file}`);
        }));
      }
    },
    
    async validate(configPath: string): Promise<ValidationResult> {
      const file = Bun.file(configPath);
      const content = await file.text();
      const { parseSimpleYAML } = await import('../generate/index.ts');
      const config = parseSimpleYAML(content);
      
      const validator = pluginRegistry.get('validation');
      if (validator?.validate) {
        return validator.validate(config);
      }
      
      return { valid: true, errors: [], warnings: [] };
    }
  };
}

// ============================================================================
// MIDDLEWARE HELPERS
// ============================================================================

export const middleware = {
  // Add file size optimization
  optimizeFileSize: (result: GenerationResult) => {
    result.files = result.files.map(file => ({
      ...file,
      content: file.content.replace(/\n\s*\n/g, '\n'), // Remove extra newlines
      size: file.content.length
    }));
    return result;
  },
  
  // Add performance logging
  logPerformance: (result: GenerationResult) => {
    console.log(`⚡ Generated ${result.files.length} files in ${result.duration.toFixed(2)}ms`);
    console.log(`📈 Cache hits: ${result.cacheHits}`);
    return result;
  },
  
  // Add error handling
  handleErrors: (result: GenerationResult) => {
    if (result.errors?.length) {
      console.error('❌ Generation errors:');
      result.errors.forEach(error => console.error(`  ${error}`));
    }
    return result;
  }
};

// ============================================================================
// SIMPLE API FOR COMMON USAGE
// ============================================================================

export async function generate(configPath: string, options?: PraxisOptions): Promise<GenerationResult> {
  const praxis = createPraxis(options);
  return await praxis.generate(configPath);
}

export async function watch(callback?: (file: string) => void, options?: PraxisOptions): Promise<void> {
  const praxis = createPraxis(options);
  return await praxis.watch(callback);
}

export async function validate(configPath: string, options?: PraxisOptions): Promise<ValidationResult> {
  const praxis = createPraxis(options);
  return await praxis.validate(configPath);
}

// Default export for easy importing
export default {
  createPraxis,
  generate,
  watch,
  validate,
  middleware,
  plugins: {
    typescript: typescriptPlugin,
    jsonSchema: jsonSchemaPlugin,
    validation: validationPlugin,
    watch: watchPlugin
  }
};
