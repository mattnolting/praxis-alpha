#!/usr/bin/env bun

/**
 * Praxis Plugin Architecture Demo
 * Shows the enhanced developer experience with composable plugins
 */

import praxis, { createPraxis, middleware } from './packages/generate/core/plugin-architecture.ts';

// ============================================================================
// SIMPLE API USAGE
// ============================================================================

console.log('🎨 Testing Simple API...');

// Simple generation
const result = await praxis.generate('TestButton.praxis.yaml');
console.log(`Generated ${result.files.length} files in ${result.duration.toFixed(2)}ms`);

// Simple validation
const validation = await praxis.validate('TestButton.praxis.yaml');
console.log(`Validation: ${validation.valid ? '✅' : '❌'}`);
if (validation.warnings.length) {
  console.log('Warnings:', validation.warnings);
}

// ============================================================================
// COMPOSABLE API USAGE
// ============================================================================

console.log('\n🔧 Testing Composable API...');

// Create customized Praxis instance
const customPraxis = createPraxis({
  outputFormats: ['typescript', 'json-schema'],
  cacheEnabled: true,
  verbose: true
});

// Add custom plugin
customPraxis.use({
  name: 'css-generator',
  version: '1.0.0',
  async generate(config: any) {
    if (!config.component?.name) {
      return { files: [], duration: 0, cacheHits: 0 };
    }
    
    const start = performance.now();
    const className = config.component.name.toLowerCase();
    
    let css = `.${className} {\n`;
    
    if (config.uses?.variants) {
      for (const variant of config.uses.variants) {
        css += `  &--${variant} { /* ${variant} styles */ }\n`;
      }
    }
    
    if (config.uses?.sizes) {
      for (const size of config.uses.sizes) {
        css += `  &--${size} { /* ${size} styles */ }\n`;
      }
    }
    
    css += `}\n`;
    
    return {
      files: [{
        path: `${config.component.name}.css`,
        content: css,
        format: 'css' as any,
        size: css.length
      }],
      duration: performance.now() - start,
      cacheHits: 0
    };
  }
});

// Add middleware for enhanced experience
const registry = (customPraxis as any).pluginRegistry || 
  (await import('./packages/generate/core/plugin-architecture.ts')).pluginRegistry;

registry.use(middleware.optimizeFileSize);
registry.use(middleware.logPerformance);
registry.use(middleware.handleErrors);

// Generate with custom setup
const customResult = await customPraxis.generate('TestButton.praxis.yaml');

console.log('\n📊 Custom Generation Results:');
for (const file of customResult.files) {
  console.log(`  📄 ${file.path} (${file.size} bytes, ${file.format})`);
}

// ============================================================================
// WATCH MODE DEMO
// ============================================================================

console.log('\n👀 Testing Watch Mode...');

// Custom watch callback
const watchCallback = async (file: string) => {
  console.log(`🔄 File changed: ${file}`);
  const result = await customPraxis.generate(file);
  console.log(`  ✅ Regenerated ${result.files.length} files`);
};

// Start watching (commented out for demo, would run indefinitely)
// await customPraxis.watch(watchCallback);

console.log('✅ Plugin architecture demo complete!');
console.log('\n🎯 Developer Experience Benefits:');
console.log('  • Simple API for basic usage');
console.log('  • Composable plugins for customization'); 
console.log('  • Built-in middleware for common tasks');
console.log('  • Type-safe plugin interfaces');
console.log('  • Zero configuration required');
console.log('  • Extensible architecture');

// ============================================================================
// EXAMPLE PLUGIN USAGE PATTERNS
// ============================================================================

console.log('\n📖 Usage Patterns:');

console.log(`
// 1. Simple usage
import praxis from '@praxis/core';
await praxis.generate('Button.praxis.yaml');

// 2. Custom instance
const myPraxis = createPraxis({ verbose: true });
myPraxis.use(customPlugin);
await myPraxis.generate('Button.praxis.yaml');

// 3. Middleware
myPraxis.use(middleware.logPerformance);

// 4. Watch mode
await myPraxis.watch((file) => {
  console.log('File changed:', file);
});
`);
