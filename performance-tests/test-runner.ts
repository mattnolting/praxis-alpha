/**
 * Performance Test Runner - Cache Strategy Comparison
 * DELETE AFTER STRATEGY DECISION
 */

// Test data generator
function generateTestData(size: number) {
  const data = new Map();
  for (let i = 0; i < size; i++) {
    data.set(`config${i}`, {
      component: `Component${i}`,
      props: { variant: 'primary', size: 'default' },
      meta: { version: '1.0.0' }
    });
  }
  return data;
}

// Performance measurement utility
function measurePerformance(name: string, fn: () => any, iterations: number = 10000) {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`${name}:`);
  console.log(`  Total: ${totalTime.toFixed(2)}ms`);
  console.log(`  Average: ${avgTime.toFixed(4)}ms per call`);
  console.log(`  Ops/sec: ${(1000 / avgTime).toFixed(0)}`);
  console.log('');

  return { totalTime, avgTime, opsPerSec: 1000 / avgTime };
}

// Test scenarios
const SMALL_DATASET = generateTestData(10);
const MEDIUM_DATASET = generateTestData(100);
const LARGE_DATASET = generateTestData(1000);

// Test targets for cache hits/misses
const HIT_TARGETS = ['config1', 'config5', 'config10'];
const MISS_TARGETS = ['missing1', 'missing2', 'missing3'];

export {
  generateTestData,
  measurePerformance,
  SMALL_DATASET,
  MEDIUM_DATASET,
  LARGE_DATASET,
  HIT_TARGETS,
  MISS_TARGETS
};
