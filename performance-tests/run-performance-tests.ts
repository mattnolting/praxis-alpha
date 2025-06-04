/**
 * Main Performance Test Runner
 * DELETE AFTER STRATEGY DECISION
 *
 * Usage: node --loader ts-node/esm run-performance-tests.ts
 */

import { testPatternA } from './pattern-a-test';
import { testPatternB } from './pattern-b-test';
import { testPatternC } from './pattern-c-test';
import { runScalabilityTests } from './scalability-test';
import { runSemanticEngineTests } from './semantic-engine-test';

function runAllTests() {
  console.log('🔧 PRAXIS CACHE PERFORMANCE TESTS');
  console.log('==================================');
  console.log('Testing three cache patterns to guide strategy decision\n');

  console.log('Dataset: 100 configs, 3 hit targets, 3 miss targets');
  console.log('Iterations: 1000 per test\n');

  // Run all pattern tests
  testPatternA();
  console.log('');

  testPatternB();
  console.log('');

  testPatternC();
  console.log('');

  console.log('=== PERFORMANCE COMPARISON COMPLETE ===');
  console.log('Review results above to select optimal cache pattern.');
  console.log('Delete all test files after decision is made.\n');
}

// Memory usage test
function testMemoryUsage() {
  console.log('🧠 MEMORY USAGE TEST');
  console.log('===================');

  // This is a basic test - in Node.js you'd use process.memoryUsage()
  // For browser testing, you'd use performance.memory if available

  if (typeof process !== 'undefined' && process.memoryUsage) {
    const before = process.memoryUsage();

    // Run some cache operations
    testPatternA();
    testPatternB();
    testPatternC();

    const after = process.memoryUsage();

    console.log('Memory usage (approximate):');
    console.log(`Heap Used: ${((after.heapUsed - before.heapUsed) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`External: ${((after.external - before.external) / 1024 / 1024).toFixed(2)} MB`);
  } else {
    console.log('Memory usage testing not available in this environment');
  }
  console.log('');
}

// Run tests
runAllTests();
testMemoryUsage();

// Run scalability tests for Pattern C (our winner)
console.log('\n' + '='.repeat(50));
console.log('RUNNING SCALABILITY TESTS FOR PATTERN C');
console.log('='.repeat(50) + '\n');
runScalabilityTests();

// Run semantic engine tests
console.log('\n' + '='.repeat(50));
console.log('RUNNING SEMANTIC ENGINE TESTS');
console.log('='.repeat(50) + '\n');
runSemanticEngineTests();
