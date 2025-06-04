/**
 * Cache Pattern C: Smart Cache Evaluator
 * DELETE AFTER STRATEGY DECISION
 */

import { HIT_TARGETS, measurePerformance, MEDIUM_DATASET, MISS_TARGETS } from './test-runner';

// Smart cache evaluator creator
function createSmartCache(dataMap: Map<string, any>) {
  const cache = new Map<string, any>();
  const computeStatus = new Map<string, boolean>();

  return {
    isReady(target: string): boolean {
      return cache.has(target);
    },

    value(target: string): any {
      return cache.get(target);
    },

    canResolve(target: string): boolean {
      return !cache.has(target) && dataMap.has(target);
    },

    compute(target: string): any {
      if (!this.isReady(target) && dataMap.has(target)) {
        const data = dataMap.get(target);
        cache.set(target, data);
        computeStatus.set(target, true);
        return data;
      }
      return cache.get(target);
    },

    // Performance stats
    getCacheSize(): number {
      return cache.size;
    },

    getComputeCount(): number {
      return computeStatus.size;
    }
  };
}

// Pattern C Implementation
function createPatternC(dataMap: Map<string, any>) {
  const cache = createSmartCache(dataMap);

  return function resolve(target: string) {
    if (cache.isReady(target)) return cache.value(target);
    if (cache.canResolve(target)) return cache.compute(target);
    return null;
  };
}

// Test Pattern C
export function testPatternC() {
  console.log('=== PATTERN C: Smart Cache Evaluator ===');

  const resolver = createPatternC(MEDIUM_DATASET);

  // Test cache hits
  measurePerformance('Pattern C - Cache Hits', () => {
    HIT_TARGETS.forEach(target => resolver(target));
  }, 1000);

  // Test cache misses
  measurePerformance('Pattern C - Cache Misses', () => {
    MISS_TARGETS.forEach(target => resolver(target));
  }, 1000);

  // Test mixed access
  measurePerformance('Pattern C - Mixed Access', () => {
    [...HIT_TARGETS, ...MISS_TARGETS].forEach(target => resolver(target));
  }, 1000);
}
