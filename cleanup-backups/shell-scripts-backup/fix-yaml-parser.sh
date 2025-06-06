#!/bin/bash

echo "📝 FIXING YAML PARSER - Replacing custom implementation with standard library"

cd /Users/mnolting/Web/praxis-alpha

# Create robust YAML parser
cat > packages/generate/config-parser.ts << 'EOF'
#!/usr/bin/env bun

/**
 * PLATFORM-NATIVE YAML PARSING
 * Replaces custom parser with robust, standard implementation
 */

import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';

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
    
    const config = parseYAML(content, {
      filename: filePath,
      strict: true,
      uniqueKeys: true,
      maxAliasCount: 100
    }) as PraxisConfig;
    
    if (!config.component?.name) {
      throw new Error(`Missing component.name in ${filePath}`);
    }
    
    return config;
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ YAML parsing failed: ${filePath}`);
      console.error(`   Error: ${error.message}`);
      
      if ('linePos' in error && error.linePos) {
        const linePos = error.linePos as any;
        console.error(`   Line ${linePos.line}, Column ${linePos.col}`);
      }
    }
    return null;
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
    const glob = new Bun.Glob(pattern);
    const files = await Array.fromAsync(glob.scan('.'));
    
    console.log(`📋 Found ${files.length} configuration files`);
    
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const config = await loadConfig(file);
        return { file, config };
      })
    );
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.config) {
        configs.set(result.value.file, result.value.config);
      } else if (result.status === 'rejected') {
        console.error(`❌ Failed to load config: ${result.reason}`);
      }
    }
    
    console.log(`✅ Successfully loaded ${configs.size} configurations`);
    
  } catch (error) {
    console.error('❌ Failed to scan for configuration files:', error);
  }
  
  return configs;
}

export type { PraxisConfig };
EOF

# Update main index.ts to use new parser
# Replace the parseSimpleYAML function and readConfig function
cat > temp_index_update.ts << 'EOF'
// Replace these lines in packages/generate/index.ts:

// OLD: import { createExcellentWatcher, type WatchEvent } from './excellent-watcher.ts';
// NEW: 
import { createNativeWatcher, type WatchEvent } from './native-watcher.ts';
import { loadConfig, type PraxisConfig } from './config-parser.ts';

// OLD: async function readConfig(filePath: string) { ... }
// NEW: (function is now in config-parser.ts as loadConfig)

// Update generateTypeScript function:
export async function generateTypeScript(configPath: string): Promise<void> {
  const config = await loadConfig(configPath);  // Changed from readConfig
  if (!config) return;
  
  const componentName = config.component.name;  // Simplified access
  const outputPath = createOutputFile(configPath, componentName, 'Props.ts');
  
  if (!(await shouldRegenerate(configPath, outputPath))) {
    console.log(`⚡ Cached: ${componentName}Props.ts`);
    return;
  }
  
  let content: string;
  
  if (config.uses) {
    content = generateFromUsesDeclaration(config.uses, componentName);
  } else {
    content = `// No 'uses' declaration found in config`;
  }
  
  await writeGeneratedFile(outputPath, content);
}

// Similar updates for generateSchema function...
EOF

echo "✅ Created robust YAML parser with validation"
echo "📝 Manual step: Update packages/generate/index.ts imports and readConfig calls"
echo "   - Replace readConfig() calls with loadConfig()"
echo "   - Add import: import { loadConfig, type PraxisConfig } from './config-parser.ts';"
