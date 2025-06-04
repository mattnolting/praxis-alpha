import type { Plugin } from 'vite';
import { writeFile, mkdir } from 'fs/promises';
import { basename, dirname, join } from 'path';
import { scanPraxisDirectories, initializeInheritanceEngine, loadYamlConfig, type CascadeMap } from '@praxis/cascade';
import type { GeneratedProps, PraxisConfig } from './schemas';

/**
 * Plugin options for multiple output formats
 */
export interface PraxisPluginOptions {
  /** File pattern to watch for praxis configs */
  pattern?: string;
  /** Output formats to generate */
  outputFormats?: ('typescript' | 'json-schema')[];
  /** Enable file watching */
  watch?: boolean;
  /** Enable HMR */
  hmr?: boolean;
}

/**
 * Enhanced Praxis Vite plugin - supports multiple output formats
 */
export const praxisPlugin = (options: PraxisPluginOptions = {}): Plugin => {
  const {
    pattern = '**/*.praxis.yaml',
    outputFormats = ['typescript'],
    watch = true,
    hmr = true
  } = options;
  
  let cascadeMap: CascadeMap;
  let inheritanceEngine: any;

  // Define helper functions before plugin object
  async function generateAllConfigs() {
    for (const [path, directory] of cascadeMap.directories) {
      if (directory.config.component) {
        // Get inherited configuration
        const inheritedConfig = inheritanceEngine.resolveInherited(path);
        
        if (inheritedConfig) {
          await generateMultipleFormats(
            directory.absolutePath,
            inheritedConfig.config,
            outputFormats
          );
        }
      }
    }
  }

  return {
    name: 'praxis',

    async buildStart() {
      console.log('🚀 Praxis: Scanning for cascade configurations...');
      
      // Scan for all praxis configs
      cascadeMap = await scanPraxisDirectories({
        configFileName: 'praxis.config.yaml'
      });
      
      // Initialize inheritance engine
      inheritanceEngine = initializeInheritanceEngine(cascadeMap);
      
      console.log(`✅ Praxis: Found ${cascadeMap.metadata.totalConfigs} configurations`);
      
      // Generate initial files
      await generateAllConfigs();
    },

    async handleHotUpdate({ file, server }) {
      if (file.includes('praxis.config.yaml') && hmr) {
        console.log(`🔧 Praxis: Processing ${basename(file)}`);
        
        // Re-scan cascade map
        cascadeMap = await scanPraxisDirectories({
          configFileName: 'praxis.config.yaml'
        });
        
        // Re-initialize inheritance
        inheritanceEngine = initializeInheritanceEngine(cascadeMap);
        
        // Regenerate all affected configs
        await generateAllConfigs();

        // Trigger HMR
        server.ws.send({
          type: 'full-reload'
        });
      }
    }
  };

  /**
   * Generate multiple output formats for a component
   */
  async function generateMultipleFormats(
    configPath: string,
    config: any,
    formats: string[]
  ): Promise<void> {
    const componentName = config.component?.name || 'Component';
    const props = config.props || {};
    
    for (const format of formats) {
      switch (format) {
        case 'typescript':
          await generateTypeScript(configPath, componentName, props);
          break;
        case 'json-schema':
          await generateJsonSchema(configPath, componentName, props, config);
          break;
      }
    }
  }

  /**
   * Generate TypeScript interface file
   */
  async function generateTypeScript(
    configPath: string,
    componentName: string,
    props: any
  ): Promise<void> {
    const interfaceName = `${componentName}Props`;
    const outputPath = join(dirname(configPath), `${componentName}Props.ts`);
    
    const propsEntries = Object.entries(props).map(([key, def]: [string, any]) => {
      const optional = def.required === false ? '?' : '';
      const type = mapTypeToTS(def.type, def);
      const comment = def.description ? `  /** ${def.description} */\n` : '';
      const defaultComment = def.default !== undefined ? ` (default: ${JSON.stringify(def.default)})` : '';

      return `${comment}  ${key}${optional}: ${type};${defaultComment ? ` // ${defaultComment}` : ''}`;
    }).join('\n');

    const content = `/**
 * Generated props interface for ${componentName}
 * DO NOT EDIT - Generated from praxis.config.yaml
 * Generated at: ${new Date().toISOString()}
 */

export interface ${interfaceName} {
${propsEntries}
}

export default ${interfaceName};

/**
 * Default props for ${componentName}
 */
export const default${componentName}Props: Partial<${interfaceName}> = {
${generateDefaultProps(props)}
};
`;

    await writeFile(outputPath, content, 'utf-8');
    console.log(`✅ Generated TypeScript: ${basename(outputPath)}`);
  }

  /**
   * Generate JSON Schema file
   */
  async function generateJsonSchema(
    configPath: string,
    componentName: string,
    props: any,
    fullConfig: any
  ): Promise<void> {
    const outputPath = join(dirname(configPath), `${componentName}Schema.json`);
    
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: `/${componentName}Schema.json`,
      title: `${componentName} Props Schema`,
      description: fullConfig.component?.description || `Props schema for ${componentName} component`,
      type: "object",
      properties: generateSchemaProperties(props),
      required: Object.entries(props)
        .filter(([, def]: [string, any]) => def.required === true)
        .map(([key]) => key),
      additionalProperties: false,
      examples: [generateSchemaExample(props)],
      metadata: {
        component: componentName,
        category: fullConfig.component?.category || 'General',
        generatedAt: new Date().toISOString(),
        praxisVersion: '1.0.0'
      }
    };

    await writeFile(outputPath, JSON.stringify(schema, null, 2), 'utf-8');
    console.log(`✅ Generated JSON Schema: ${basename(outputPath)}`);
  }

  /**
   * Generate JSON Schema properties
   */
  function generateSchemaProperties(props: any): any {
    const properties: any = {};
    
    for (const [key, def] of Object.entries(props)) {
      const propDef: any = def as any;
      
      properties[key] = {
        type: mapTypeToJSONSchema(propDef.type),
        description: propDef.description
      };
      
      // Add validation rules
      if (propDef.validation) {
        if (propDef.validation.enum) {
          properties[key].enum = propDef.validation.enum;
        }
        if (propDef.validation.min !== undefined) {
          properties[key].minimum = propDef.validation.min;
        }
        if (propDef.validation.max !== undefined) {
          properties[key].maximum = propDef.validation.max;
        }
        if (propDef.validation.pattern) {
          properties[key].pattern = propDef.validation.pattern;
        }
      }
      
      // Add default value
      if (propDef.default !== undefined) {
        properties[key].default = propDef.default;
      }
      
      // Add examples
      if (propDef.examples) {
        properties[key].examples = propDef.examples;
      }
    }
    
    return properties;
  }

  /**
   * Generate example for JSON Schema
   */
  function generateSchemaExample(props: any): any {
    const example: any = {};
    
    for (const [key, def] of Object.entries(props)) {
      const propDef: any = def as any;
      
      if (propDef.examples && propDef.examples.length > 0) {
        example[key] = propDef.examples[0];
      } else if (propDef.default !== undefined) {
        example[key] = propDef.default;
      }
    }
    
    return example;
  }

  /**
   * Generate default props object
   */
  function generateDefaultProps(props: any): string {
    const defaults = Object.entries(props)
      .filter(([, def]: [string, any]) => def.default !== undefined)
      .map(([key, def]: [string, any]) => `  ${key}: ${JSON.stringify(def.default)}`)
      .join(',\n');
    
    return defaults;
  }
};

/**
 * Map praxis types to TypeScript types
 */
function mapTypeToTS(praxisType: string, def?: any): string {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'object': 'Record<string, any>',
    'array': 'any[]',
    'function': '(...args: any[]) => any',
    'ReactNode': 'React.ReactNode',
    'union': 'any' // Will be enhanced based on unionTypes
  };
  
  // Handle union types
  if (praxisType === 'union' && def?.unionTypes) {
    return def.unionTypes.map((t: string) => mapTypeToTS(t)).join(' | ');
  }
  
  // Handle enums
  if (def?.validation?.enum) {
    return def.validation.enum.map((v: any) => JSON.stringify(v)).join(' | ');
  }

  return typeMap[praxisType] || 'any';
}

/**
 * Map praxis types to JSON Schema types
 */
function mapTypeToJSONSchema(praxisType: string): string {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'object': 'object',
    'array': 'array',
    'function': 'string', // Functions as string in JSON
    'ReactNode': 'string', // React nodes as string
    'union': 'string' // Unions default to string
  };

  return typeMap[praxisType] || 'string';
}
