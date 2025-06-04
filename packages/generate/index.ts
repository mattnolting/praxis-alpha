/**
 * @praxis/generate - Generic Code Generation Framework
 * Reusable generation utilities and caching system
 */

// Smart Cache System
export { 
  createSmartCache, 
  createCachedResolver, 
  createSharedCacheResolvers 
} from './cache';
export type { SmartCache, CacheStats } from './cache';

// Semantic Engine
export { 
  resolve, 
  ready, 
  get, 
  exists, 
  load, 
  stats, 
  clear,
  initializeEngine,
  initializeWithMockData
} from './engine';
