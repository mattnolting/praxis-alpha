import { defineConfig } from 'vite'

export default defineConfig({
  // Directory-first Praxis integration
  // Run 'bun run init src/components' to point Praxis at your components
  
  plugins: [
    // Native integration with Praxis monitoring
    {
      name: 'praxis-integration',
      buildStart() {
        console.log('🎯 Praxis: Run `bun run monitor` for live design system updates')
      }
    }
  ],
  
  // Optimized for your tech stack preferences
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false
      }
    }
  },
  
  // Development optimization  
  server: {
    hmr: true
  }
})
