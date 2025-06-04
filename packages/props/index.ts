/**
 * @praxis/props - Props Generation System
 * TypeScript + JSON Schema generation with cascade inheritance
 */

// Props-specific plugin
export { praxisPlugin } from './plugin';

// Re-export from cascade package
export {
  scanPraxisDirectories,
  getDescendants,
  getInheritanceChain,
  printCascadeMap,
  watchCascadeDirectories,
  initializeInheritanceEngine,
  createInheritanceResolver,
  getInheritedConfig,
  loadYamlConfig,
  loadYamlConfigs,
  loadPraxisConfigs,
  defaultConfigPaths
} from '@praxis/cascade';
export type {
  PraxisDirectory,
  CascadeMap,
  ScannerOptions,
  InheritedConfig,
  InheritanceStats,
  InheritanceEngine
} from '@praxis/cascade';

// Re-export from generate package
export { 
  resolve, 
  ready, 
  get, 
  exists, 
  load, 
  stats, 
  clear,
  initializeEngine,
  initializeWithMockData,
  createSmartCache, 
  createCachedResolver, 
  createSharedCacheResolvers 
} from '@praxis/generate';
export type { 
  SmartCache, 
  CacheStats 
} from '@praxis/generate';

// Props-specific schemas
export type { 
  PraxisConfig, 
  PropDefinition, 
  GeneratedProps 
} from './schemas';
