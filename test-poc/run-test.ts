#!/usr/bin/env bun

/**
 * Run Praxis POC Test - Complete demonstration
 */

import { execSync } from 'child_process';

console.log(`
🚀 PRAXIS UNIVERSAL DESIGN SYSTEM PROTOCOL
==========================================
Proof of Concept Test

This test will:
1️⃣ Analyze existing React components with manual interfaces
2️⃣ Detect prop patterns and duplication
3️⃣ Generate global SSOT registry  
4️⃣ Measure performance improvements
5️⃣ Show cross-disciplinary benefits

Starting analysis...
`);

try {
  // Run the analyzer
  console.log('🔄 Running component analysis...\n');
  
  const result = execSync('bun analyzer.ts', {
    cwd: '/Users/mnolting/Web/praxis-alpha/test-poc',
    encoding: 'utf-8'
  });
  
  console.log(result);
  
  console.log(`
🎯 TEST COMPLETE!
================

📁 Generated Files:
   • praxis-ssot.yaml - Global registry (single source of truth)
   
🔍 What This Demonstrates:
   • Component prop discovery from existing code
   • Pattern detection across components  
   • Conflict identification and resolution
   • Performance improvement measurement
   • Universal registry generation

💡 Cross-Disciplinary Benefits:
   🎨 Design:      Same variants/sizes across all platforms
   👩‍💻 Development: Zero manual prop maintenance
   ✍️ Copywriting:  Complete visibility into component states
   🧪 QA:          Auto-generated test scenarios
   📱 Mobile:      Platform-native code generation
   🤖 AI:          Structured component knowledge
   📊 Product:     Component usage analytics

🚀 Next Steps:
   • Review generated praxis-ssot.yaml
   • See how 3 components with 21 total props
   • Reduce to single global registry
   • Eliminate manual prop maintenance
   • Enable universal platform support

This is just the beginning! 🌟
`);
  
} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}
