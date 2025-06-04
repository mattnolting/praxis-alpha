/**
 * Cache Pattern B: Condition-Based Cache
 * DELETE AFTER STRATEGY DECISION
 */

import { HIT_TARGETS, measurePerformance, MEDIUM_DATASET, MISS_TARGETS } from './test-runner';

// Condition-based cache creator
function createConditionalCache(dataMap: Map<string, any>) {
  const cache = new Map<string, any>();

  return {
    exists(target: string): boolean {
      return cache.has(target) || dataMap.has(target);
    },

    retrieve(target: string): any {
      if (cache.has(target)) {
        return cache.get(target);
      }
      return null;
    },

    store(target: string): any {
      if (!cache.has(target)) {
        const data = dataMap.get(target);
        if (data) {
          cache.set(target, data);
        }
        return data;
      }
      return cache.get(target);
    },

    loadable(target: string): boolean {
      return !cache.has(target) && dataMap.has(target);
    }
  };
}

// Pattern B Implementation
function createPatternB(dataMap: Map<string, any>) {
  const cached = createConditionalCache(dataMap);

  return function resolve(target: string) {
    if (cached.exists(target)) return cached.retrieve(target);
    if (cached.loadable(target)) return cached.store(target);
    return null;
  };
}

// Test Pattern B
export function testPatternB() {
  console.log('=== PATTERN B: Condition-Based Cache ===');

  const resolver = createPatternB(MEDIUM_DATASET);

  // Test cache hits
  measurePerformance('Pattern B - Cache Hits', () => {
    HIT_TARGETS.forEach(target => resolver(target));
  }, 1000);

  // Test cache misses
  measurePerformance('Pattern B - Cache Misses', () => {
    MISS_TARGETS.forEach(target => resolver(target));
  }, 1000);

  // Test mixed access
  measurePerformance('Pattern B - Mixed Access', () => {
    [...HIT_TARGETS, ...MISS_TARGETS].forEach(target => resolver(target));
  }, 1000);
}
