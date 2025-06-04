/**
 * Cascade Inheritance Engine - Smart Semantic Inheritance
 * Leverages proven semantic engine pattern for configuration merging
 * Performance target: 1M+ inheritance resolutions/sec (cached)
 */

import { createSmartCache } from '@praxis/generate';
import type { CascadeMap, PraxisDirectory } from './scanner';
import { getInheritanceChain } from './scanner';

/**
 * Inherited configuration with metadata
 */
export interface InheritedConfig {
  /** Final merged configuration */
  config: any;
  
  /** Inheritance metadata */
  meta: {
    inheritanceChain: string[];
    overrides: Record<string, string>; // which config provided each value
    mergeStrategy: string;
    cachedAt: Date;
  };
}

/**
 * Statistics for inheritance engine performance
 */
export interface InheritanceStats {
  cacheSize: number;
  memoryBytes: number;
  hitCount: number;
  missCount: number;
  computeCount: number;
  averageChainLength: number;
  totalInheritanceChains: number;
}

/**
 * Inheritance engine interface - semantic, human-readable
 */
export interface InheritanceEngine {
  /** Resolve final config for a target with full inheritance */
  resolveInherited(targetPath: string): InheritedConfig | null;
  
  /** Get raw inheritance chain data */
  getInheritanceData(targetPath: string): PraxisDirectory[];
  
  /** Clear inheritance cache */
  clearInheritanceCache(): void;
  
  /** Get inheritance statistics */
  getInheritanceStats(): InheritanceStats;
}

// Global inheritance cache
let inheritanceCache: ReturnType<typeof createSmartCache>;
let cascadeMapInstance: CascadeMap;

/**
 * Initialize the inheritance engine with cascade map
 */
export function initializeInheritanceEngine(cascadeMap: CascadeMap): InheritanceEngine {
  cascadeMapInstance = cascadeMap;
  
  // Create inheritance cache using semantic engine pattern
  const inheritanceData = buildInheritanceData(cascadeMap);
  inheritanceCache = createSmartCache(inheritanceData);
  
  return {
    resolveInherited,
    getInheritanceData,
    clearInheritanceCache,
    getInheritanceStats
  };
}

/**
 * Build inheritance data map for caching
 */
function buildInheritanceData(cascadeMap: CascadeMap): Map<string, InheritedConfig> {
  const inheritanceData = new Map<string, InheritedConfig>();
  
  // Pre-compute inheritance for all discovered directories
  for (const [path] of cascadeMap.directories) {
    const inheritedConfig = computeInheritance(path, cascadeMap);
    if (inheritedConfig) {
      inheritanceData.set(path, inheritedConfig);
    }
  }
  
  return inheritanceData;
}

/**
 * Resolve inherited configuration (semantic engine pattern)
 * Human readable: if ready, get it; if exists, compute it
 */
function resolveInherited(targetPath: string): InheritedConfig | null {
  if (!inheritanceCache) return null;
  
  // Semantic engine pattern - two clear conditions
  if (inheritanceCache.isReady(targetPath)) {
    return inheritanceCache.value(targetPath) as InheritedConfig ?? null;
  }
  
  if (inheritanceCache.canResolve(targetPath)) {
    return inheritanceCache.compute(targetPath) as InheritedConfig ?? null;
  }
  
  return null;
}

/**
 * Get raw inheritance chain data
 */
function getInheritanceData(targetPath: string): PraxisDirectory[] {
  if (!cascadeMapInstance) return [];
  
  const chain = getInheritanceChain(cascadeMapInstance, targetPath);
  return chain
    .map(path => cascadeMapInstance.directories.get(path))
    .filter((dir): dir is PraxisDirectory => dir !== undefined);
}

/**
 * Clear inheritance cache
 */
function clearInheritanceCache(): void {
  if (inheritanceCache) {
    inheritanceCache.clearCache();
  }
}

/**
 * Get inheritance statistics
 */
function getInheritanceStats(): InheritanceStats {
  if (!inheritanceCache) {
    return {
      cacheSize: 0,
      memoryBytes: 0,
      hitCount: 0,
      missCount: 0,
      computeCount: 0,
      averageChainLength: 0,
      totalInheritanceChains: 0
    };
  }
  
  const cacheStats = inheritanceCache.getStats();
  const chainLengths = Array.from(cascadeMapInstance?.directories.keys() || [])
    .map(path => getInheritanceChain(cascadeMapInstance, path).length);
  
  const averageChainLength = chainLengths.length > 0 
    ? chainLengths.reduce((sum, length) => sum + length, 0) / chainLengths.length
    : 0;
  
  return {
    ...cacheStats,
    averageChainLength,
    totalInheritanceChains: chainLengths.length
  };
}

/**
 * Compute inheritance for a target path
 */
function computeInheritance(targetPath: string, cascadeMap: CascadeMap): InheritedConfig | null {
  const chain = getInheritanceChain(cascadeMap, targetPath);
  if (chain.length === 0) return null;
  
  const overrides: Record<string, string> = {};
  let mergedConfig = {};
  
  // Merge configs from root → child (child overrides parent)
  for (const configPath of chain) {
    const directory = cascadeMap.directories.get(configPath);
    if (directory?.config) {
      const previousConfig = { ...mergedConfig };
      mergedConfig = semanticMerge(mergedConfig, directory.config, configPath);
      
      // Track which config provided each top-level property
      trackOverrides(previousConfig, mergedConfig, overrides, configPath);
    }
  }
  
  return {
    config: mergedConfig,
    meta: {
      inheritanceChain: chain,
      overrides,
      mergeStrategy: 'semantic-deep-merge',
      cachedAt: new Date()
    }
  };
}

/**
 * Semantic merge strategy for configuration inheritance
 */
function semanticMerge(base: any, override: any, sourcePath: string): any {
  if (!override) return base;
  if (!base) return override;
  
  // Handle different data types semantically
  if (Array.isArray(override)) {
    // Arrays: Replace strategy (child replaces parent completely)
    return [...override];
  }
  
  if (typeof override === 'object' && override !== null) {
    const merged = { ...base };
    
    // Objects: Deep merge strategy
    for (const [key, value] of Object.entries(override)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursive merge for nested objects
        merged[key] = semanticMerge(merged[key], value, sourcePath);
      } else {
        // Direct override for primitives and arrays
        merged[key] = value;
      }
    }
    
    return merged;
  }
  
  // Primitives: Override strategy (child replaces parent)
  return override;
}

/**
 * Track which configuration provided each property
 */
function trackOverrides(
  previousConfig: any,
  mergedConfig: any,
  overrides: Record<string, string>,
  sourcePath: string
): void {
  if (!mergedConfig || typeof mergedConfig !== 'object') return;
  
  for (const key of Object.keys(mergedConfig)) {
    const previousValue = previousConfig?.[key];
    const currentValue = mergedConfig[key];
    
    // If value changed or is new, track the source
    if (previousValue !== currentValue) {
      overrides[key] = sourcePath;
    }
  }
}

/**
 * Utility: Create inheritance resolver function
 * Returns a cached resolver following semantic engine pattern
 */
export function createInheritanceResolver(cascadeMap: CascadeMap) {
  const engine = initializeInheritanceEngine(cascadeMap);
  
  return function inheritanceResolve(targetPath: string): any {
    const inherited = engine.resolveInherited(targetPath);
    return inherited?.config ?? null;
  };
}

/**
 * Utility: Get flattened inherited configuration (just the config, no metadata)
 */
export function getInheritedConfig(cascadeMap: CascadeMap, targetPath: string): any {
  const inherited = computeInheritance(targetPath, cascadeMap);
  return inherited?.config ?? null;
}
