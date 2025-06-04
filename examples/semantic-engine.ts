/**
 * Semantic Engine Usage Example
 * Human readable, build-time optimized engine in action
 */

import { clear, exists, get, load, ready, resolve, stats } from '../praxis/index.js';

console.log('=== SEMANTIC ENGINE USAGE EXAMPLES ===');

// Usage: Human readable, semantic calls
console.log('resolve("button"):', resolve('button'));
console.log('resolve("components"):', resolve('components'));
console.log('resolve("missing"):', resolve('missing'));

console.log('\n=== INDIVIDUAL FUNCTION USAGE ===');

// Check if ready
console.log('ready("button"):', ready('button'));

// Get from cache
console.log('get("button"):', get('button'));

// Check if exists
console.log('exists("nonexistent"):', exists('nonexistent'));

// Load and cache
console.log('load("root"):', load('root'));

console.log('\n=== ENGINE STATISTICS ===');

// View engine performance
console.log('stats():', stats());

console.log('\n=== THE BEAUTY ===');
console.log('// Human readable engine:');
console.log('function resolve(target) {');
console.log('  if (ready(target)) return get(target);    // Cache hit');
console.log('  if (exists(target)) return load(target);  // Load');
console.log('  return null;                              // Miss');
console.log('}');

console.log('\n// Each function is:');
console.log('// ✅ Cached at build time');
console.log('// ✅ Zero parsing overhead');
console.log('// ✅ Human readable');
console.log('// ✅ Infinitely extensible');
console.log('// ✅ Swappable');

export { resolve, ready, get, exists, load, stats, clear };
