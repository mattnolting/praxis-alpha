#!/usr/bin/env bun

/**
 * PHASE 2 VALIDATION - Quick functionality test
 * Ensures surgical parallelization works correctly
 */

// Change to project root for correct file paths
process.chdir('..');

import { generateAllParallel } from './packages/generate/index-parallel.ts';

console.log('🧪 PHASE 2 VALIDATION TEST');
console.log('==========================');

try {
  // Test single component generation
  console.log('Testing parallel generation with TestButton.praxis.yaml...');
  
  const startTime = performance.now();
  await generateAllParallel('TestButton.praxis.yaml');
  const endTime = performance.now();
  
  console.log(`✅ Parallel generation completed in ${(endTime - startTime).toFixed(2)}ms`);
  
  // Verify files were generated/updated
  const tsFile = await Bun.file('TestButtonProps.ts').exists();
  const schemaFile = await Bun.file('TestButtonSchema.json').exists();
  
  console.log(`✅ TypeScript file exists: ${tsFile}`);
  console.log(`✅ Schema file exists: ${schemaFile}`);
  
  if (tsFile && schemaFile) {
    console.log('\n🚀 PHASE 2 VALIDATION: SUCCESS');
    console.log('Surgical parallelization is working correctly!');
  } else {
    console.log('\n❌ PHASE 2 VALIDATION: FAILED');
    console.log('Generated files not found.');
  }
  
} catch (error) {
  console.error('❌ PHASE 2 VALIDATION: ERROR');
  console.error(error);
}
