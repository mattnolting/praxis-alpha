/**
 * Cache Pattern A: Semantic Cache Functions
 * DELETE AFTER STRATEGY DECISION
 */

import { HIT_TARGETS, measurePerformance, MEDIUM_DATASET, MISS_TARGETS } from './test-runner';

// Semantic cache function creators
function createCacheChecker(dataMap: Map<string, any>) {
  const cache = new Map<string, boolean>();

  return function hasConfig(target: string): boolean {
    if (cache.has(target)) {
      const cached = cache.get(target);
      return cached !== undefined ? cached : false;
    }

    const exists = dataMap.has(target);
    cache.set(target, exists);
    return exists;
  };
}

function createCacheLoader(dataMap: Map<string, any>) {
  const cache = new Map<string, any>();

  return function getConfig(target: string): any {
    if (cache.has(target)) {
      return cache.get(target);
    }

    const config = dataMap.get(target);
    if (config) {
      cache.set(target, config);
    }
    return config;
  };
}

// Pattern A Implementation
function createPatternA(dataMap: Map<string, any>) {
  const hasConfig = createCacheChecker(dataMap);
  const getConfig = createCacheLoader(dataMap);

  return function resolve(target: string) {
    if (hasConfig(target)) return getConfig(target);
    if (getConfig(target)) return getConfig(target); // Fallback check
    return null;
  };
}

// Test Pattern A
export function testPatternA() {
  console.log('=== PATTERN A: Semantic Cache Functions ===');

  const resolver = createPatternA(MEDIUM_DATASET);

  // Test cache hits
  measurePerformance('Pattern A - Cache Hits', () => {
    HIT_TARGETS.forEach(target => resolver(target));
  }, 1000);

  // Test cache misses
  measurePerformance('Pattern A - Cache Misses', () => {
    MISS_TARGETS.forEach(target => resolver(target));
  }, 1000);

  // Test mixed access
  measurePerformance('Pattern A - Mixed Access', () => {
    [...HIT_TARGETS, ...MISS_TARGETS].forEach(target => resolver(target));
  }, 1000);
}
