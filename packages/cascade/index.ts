/**
 * @praxis/cascade - Directory Discovery & Cascade Inheritance
 * Self-organizing directory registration and configuration inheritance
 */

// Directory Scanner
export {
  scanPraxisDirectories,
  getDescendants,
  getInheritanceChain,
  printCascadeMap,
  watchCascadeDirectories
} from './scanner';
export type {
  PraxisDirectory,
  CascadeMap,
  ScannerOptions
} from './scanner';

// Cascade Inheritance Engine
export {
  initializeInheritanceEngine,
  createInheritanceResolver,
  getInheritedConfig
} from './inheritance';
export type {
  InheritedConfig,
  InheritanceStats,
  InheritanceEngine
} from './inheritance';

// YAML Config Loading
export {
  loadYamlConfig,
  loadYamlConfigs,
  loadPraxisConfigs,
  defaultConfigPaths
} from './yaml';
