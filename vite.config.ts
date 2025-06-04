/**
 * Modern Vite Library Build Configuration
 * Replaces tsup with Vite's native library mode
 * Optimized for performance, bundle size, and modern tooling
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';
import type { Plugin, PluginOption } from 'vite';

export default defineConfig({
  // Library mode configuration
  build: {
    lib: {
      // Multiple entry points with new structure
      entry: {
        'index': resolve(__dirname, 'core/index.ts'),
        'plugin': resolve(__dirname, 'core/plugin.ts')
      },
      name: 'PraxisSystem',
      formats: ['es', 'cjs'], // ESM + CommonJS
      fileName: (format, entryName) => {
        const ext = format === 'cjs' ? 'js' : 'mjs';
        return `${entryName}.${ext}`;
      }
    },
    
    // Modern build optimizations
    target: 'node16',
    minify: 'esbuild', // Fast, efficient minification
    sourcemap: true,
    emptyOutDir: true,
    
    // Rollup options for advanced configuration
    rollupOptions: {
      // External dependencies (not bundled)
      external: [
        'vite',
        'yaml',
        'fs/promises',
        'path',
        'fs',
        'node:fs/promises',
        'node:path',
        'node:fs'
      ],
      
      // Output configuration
      output: {
        // Preserve module structure
        preserveModules: false,
        
        // Global variables for UMD builds (if needed)
        globals: {
          'vite': 'Vite'
        },
        
        // Optimized chunk names
        chunkFileNames: '[name]-[hash].js',
        
        // Modern exports
        exports: 'named',
        interop: 'auto'
      }
    }
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'core')
    }
  },
  
  // Plugin configuration for development
  plugins: (() => {
    const plugins: PluginOption[] = [];
    
    // TypeScript declarations
    plugins.push({
      name: 'typescript-declarations',
      generateBundle() {
        // Generate .d.ts files using TypeScript compiler
        try {
          const { execSync } = require('child_process');
          execSync('tsc --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });
          console.log('✅ TypeScript declarations generated');
        } catch (error) {
          const err = error as Error;
          console.warn('⚠️ TypeScript declaration generation failed:', err.message);
        }
      }
    } satisfies Plugin);
    
    // Bundle analyzer for development
    if (process.env.ANALYZE) {
      plugins.push({
        name: 'bundle-analyzer',
        generateBundle(_options: any, bundle: Record<string, any>) {
          const sizes = Object.entries(bundle).map(([fileName, chunk]) => ({
            fileName,
            size: chunk.type === 'chunk' ? (chunk.code?.length || 0) : 0
          }));
          
          console.log('\n📦 Bundle Analysis:');
          console.log('==================');
          sizes.forEach(({ fileName, size }) => {
            const sizeKB = (size / 1024).toFixed(1);
            console.log(`${fileName}: ${sizeKB}KB`);
          });
          
          const totalSize = sizes.reduce((sum, { size }) => sum + size, 0);
          console.log(`\nTotal: ${(totalSize / 1024).toFixed(1)}KB`);
          
          // Warn if bundle is getting large
          if (totalSize > 100_000) { // 100KB threshold for library
            console.warn('⚠️ Library bundle size is getting large!');
            console.log('Consider:');
            console.log('• Tree-shaking unused exports');
            console.log('• Lazy loading heavy components');
            console.log('• Reviewing dependency sizes');
          }
        }
      } satisfies Plugin);
    }
    
    return plugins;
  })(),
  
  // Optimization for library builds
  optimizeDeps: {
    // Include only essential runtime dependencies
    include: ['yaml'],
    exclude: ['vite'] // Don't bundle peer dependencies
  }
});
