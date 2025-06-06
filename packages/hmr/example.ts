#!/usr/bin/env bun

/**
 * Example: React Integration with Praxis HMR
 * Shows how to use our HMR system in a React app
 */

export const ReactHMRExample = `
// In your React app (src/praxis-hmr.ts)
declare global {
  interface Window {
    __PRAXIS_HMR_CALLBACK__?: (data: any) => void;
  }
}

// Setup HMR callback for component refresh
window.__PRAXIS_HMR_CALLBACK__ = (data) => {
  console.log('🔧 Praxis config updated:', data.file);
  
  // Option 1: Force TypeScript recompilation (if using dev server)
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
    // Trigger React refresh
    window.location.reload();
  }
  
  // Option 2: Smart component refresh (advanced)
  // This would update only components using the changed config
  // Implementation depends on your component registration system
};

// Include the HMR client (from packages/hmr/index.ts)
// This connects to ws://localhost:3001/praxis-hmr automatically
`;

/**
 * Test the HMR server
 */
async function testHMR() {
  console.log('🧪 Testing Praxis HMR Server');
  console.log('============================');
  console.log('');
  
  console.log('1. Start HMR server:');
  console.log('   bun run dev:hmr');
  console.log('');
  
  console.log('2. In your React app, add HMR client:');
  console.log('   <script src="http://localhost:3001/praxis-hmr-client.js"></script>');
  console.log('');
  
  console.log('3. Test config change:');
  console.log('   Edit TestButton.praxis.yaml');
  console.log('   Watch for instant regeneration');
  console.log('');
  
  console.log('4. Expected workflow:');
  console.log('   Edit YAML → Generate TS → Notify browser → Update UI');
  console.log('   Expected speed: <200ms end-to-end');
  console.log('');
  
  console.log('Benefits vs Vite HMR:');
  console.log('✅ More targeted (only .praxis.yaml files)');
  console.log('✅ Faster generation (pure Bun vs Vite overhead)');
  console.log('✅ Less memory usage (no dev server bundle)');
  console.log('✅ Native WebSocket (no polling)');
  console.log('✅ Direct file watching (no complex bundler logic)');
}

if (import.meta.main) {
  await testHMR();
}
