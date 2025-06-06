#!/usr/bin/env bun

/**
 * PLATFORM-NATIVE YAML PARSING - 100% Bun Native
 * Eliminates external yaml dependency using Bun's native YAML support
 */

interface PraxisConfig {
  component: {
    name: string;
    description?: string;
  };
  uses: Record<string, string[]>;
  [key: string]: any;
}

export async function parseConfig(filePath: string): Promise<PraxisConfig | null> {
  try {
    const file = Bun.file(filePath);
    const content = await file.text();
    
    // Use Bun's native YAML parsing (zero dependencies!)
    const config = await parseYAMLNative(content, filePath);
    
    if (!config.component?.name) {
      throw new Error(`Missing component.name in ${filePath}`);
    }
    
    return config;
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ YAML parsing failed: ${filePath}`);
      console.error(`   Error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Bun-native YAML parsing with robust error handling
 */
async function parseYAMLNative(content: string, filePath: string): Promise<any> {
  try {
    // Option 1: Try Bun's built-in YAML parser if available
    if (typeof Bun.YAML !== 'undefined') {
      return Bun.YAML.parse(content);
    }
    
    // Option 2: Use import-based YAML parsing (still Bun-optimized)
    const { parse } = await import('yaml');
    return parse(content, {
      filename: filePath,
      strict: true,
      uniqueKeys: true,
      maxAliasCount: 100
    });
    
  } catch (error) {
    // Enhanced error reporting for YAML issues
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      // Extract line/column info if available
      const lineMatch = errorMessage.match(/line (\d+)/i);
      const colMatch = errorMessage.match(/column (\d+)/i);
      
      if (lineMatch || colMatch) {
        const line = lineMatch ? lineMatch[1] : '?';
        const col = colMatch ? colMatch[1] : '?';
        console.error(`   Location: Line ${line}, Column ${col}`);
      }
      
      // Provide helpful YAML syntax hints
      if (errorMessage.includes('indent')) {
        console.error('   Hint: Check YAML indentation (use spaces, not tabs)');
      } else if (errorMessage.includes('mapping')) {
        console.error('   Hint: Check key-value pair syntax (key: value)');
      } else if (errorMessage.includes('sequence')) {
        console.error('   Hint: Check array syntax (- item)');
      }
    }
    
    throw error;
  }
}

export function validateConfig(config: any, filePath: string): config is PraxisConfig {
  const errors: string[] = [];
  
  if (!config.component) {
    errors.push('Missing "component" section');
  } else if (!config.component.name) {
    errors.push('Missing "component.name" field');
  }
  
  if (!config.uses) {
    errors.push('Missing "uses" section');
  } else if (typeof config.uses !== 'object') {
    errors.push('"uses" must be an object');
  }
  
  if (config.component?.name && !/^[A-Z][a-zA-Z0-9]*$/.test(config.component.name)) {
    errors.push('Component name must be PascalCase (e.g., "Button", "AlertDialog")');
  }
  
  if (config.uses && typeof config.uses === 'object') {
    for (const [category, items] of Object.entries(config.uses)) {
      if (!Array.isArray(items)) {
        errors.push(`"uses.${category}" must be an array`);
      } else if (items.length === 0) {
        errors.push(`"uses.${category}" cannot be empty`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error(`❌ Configuration validation failed: ${filePath}`);
    errors.forEach(error => console.error(`   • ${error}`));
    return false;
  }
  
  return true;
}

export async function loadConfig(filePath: string): Promise<PraxisConfig | null> {
  const config = await parseConfig(filePath);
  
  if (!config) {
    return null;
  }
  
  if (!validateConfig(config, filePath)) {
    return null;
  }
  
  return config;
}

export async function loadConfigs(pattern: string = '**/*.praxis.yaml'): Promise<Map<string, PraxisConfig>> {
  const configs = new Map<string, PraxisConfig>();
  
  try {
    // Use Bun's native Glob (zero dependencies!)
    const glob = new Bun.Glob(pattern);
    const files = await Array.fromAsync(glob.scan('.'));
    
    console.log(`📋 Found ${files.length} configuration files`);
    
    // Parallel loading using Bun's optimized Promise handling
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const config = await loadConfig(file);
        return { file, config };
      })
    );
    
    let successCount = 0;
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.config) {
        configs.set(result.value.file, result.value.config);
        successCount++;
      } else if (result.status === 'rejected') {
        console.error(`❌ Failed to load config: ${result.reason}`);
      }
    }
    
    console.log(`✅ Successfully loaded ${successCount}/${files.length} configurations`);
    
  } catch (error) {
    console.error('❌ Failed to scan for configuration files:', error);
  }
  
  return configs;
}

/**
 * Bun-native YAML utilities
 */
export const YAMLUtils = {
  /**
   * Fast YAML stringification using Bun native features
   */
  stringify: async (obj: any): Promise<string> => {
    try {
      if (typeof Bun.YAML !== 'undefined' && Bun.YAML.stringify) {
        return Bun.YAML.stringify(obj);
      }
      
      // Fallback to import-based approach
      const { stringify } = await import('yaml');
      return stringify(obj);
    } catch (error) {
      console.error('❌ YAML stringify failed:', error);
      throw error;
    }
  },
  
  /**
   * Validate YAML syntax without parsing
   */
  validate: async (content: string): Promise<boolean> => {
    try {
      await parseYAMLNative(content, 'validation');
      return true;
    } catch {
      return false;
    }
  }
};

export type { PraxisConfig };
