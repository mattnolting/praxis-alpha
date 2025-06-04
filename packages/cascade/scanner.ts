/**
 * Directory Scanner - Cascade Discovery System
 * Self-organizing directory registration that finds praxis.config.yaml files
 * and maps the cascade hierarchy for inheritance and watching
 */

import { readdir, stat } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { loadYamlConfig } from './yaml';

/**
 * Discovered praxis directory with config and metadata
 */
export interface PraxisDirectory {
  /** Directory path relative to project root */
  path: string;
  /** Absolute path to directory */
  absolutePath: string;
  /** Loaded YAML configuration */
  config: any;
  /** Parent directory (for cascade inheritance) */
  parent?: string;
  /** Child directories */
  children: string[];
  /** Directory depth (root = 0) */
  depth: number;
  /** Whether this directory should be watched for changes */
  shouldWatch: boolean;
}

/**
 * Complete cascade map of discovered directories
 */
export interface CascadeMap {
  /** All discovered directories by path */
  directories: Map<string, PraxisDirectory>;
  /** Root directories (depth 0) */
  roots: string[];
  /** Scan metadata */
  metadata: {
    scannedAt: Date;
    totalDirectories: number;
    totalConfigs: number;
    maxDepth: number;
  };
}

/**
 * Scanner options for customizing discovery behavior
 */
export interface ScannerOptions {
  /** Root directory to start scanning from */
  rootDir?: string;
  /** Config file name to look for */
  configFileName?: string;
  /** Maximum depth to scan */
  maxDepth?: number;
  /** Directories to ignore during scan */
  ignoreDirs?: string[];
}

/**
 * Default scanner options
 */
const defaultOptions: Required<ScannerOptions> = {
  rootDir: process.cwd(),
  configFileName: 'praxis.config.yaml',
  maxDepth: 10,
  ignoreDirs: ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt']
};

/**
 * Scan directory tree and discover all praxis.config.yaml files
 * Returns a complete cascade map with parent-child relationships
 */
export async function scanPraxisDirectories(options: ScannerOptions = {}): Promise<CascadeMap> {
  const opts = { ...defaultOptions, ...options };
  const discovered = new Map<string, PraxisDirectory>();
  
  console.log(`🔍 Scanning for praxis directories from: ${opts.rootDir}`);
  
  await scanDirectory(opts.rootDir, opts.rootDir, 0, opts, discovered);
  
  // Build parent-child relationships
  const cascadeMap = buildCascadeRelationships(discovered, opts.rootDir);
  
  console.log(`✅ Discovery complete: ${cascadeMap.metadata.totalDirectories} directories, ${cascadeMap.metadata.totalConfigs} configs`);
  
  return cascadeMap;
}

/**
 * Recursively scan a directory for praxis config files
 */
async function scanDirectory(
  currentPath: string,
  rootPath: string,
  depth: number,
  options: Required<ScannerOptions>,
  discovered: Map<string, PraxisDirectory>
): Promise<void> {
  // Check depth limit
  if (depth > options.maxDepth) return;
  
  try {
    const entries = await readdir(currentPath, { withFileTypes: true });
    
    // Check if this directory has a praxis config
    const configPath = join(currentPath, options.configFileName);
    const hasConfig = entries.some(entry => 
      entry.isFile() && entry.name === options.configFileName
    );
    
    if (hasConfig) {
      // Load the config and register this directory
      const config = await loadYamlConfig(configPath);
      if (config) {
        const relativePath = relative(rootPath, currentPath) || '.';
        
        discovered.set(relativePath, {
          path: relativePath,
          absolutePath: currentPath,
          config,
          children: [],
          depth,
          shouldWatch: true
        });
        
        console.log(`📁 Registered: ${relativePath} (depth: ${depth})`);
      }
    }
    
    // Recursively scan subdirectories
    for (const entry of entries) {
      if (entry.isDirectory() && !options.ignoreDirs.includes(entry.name)) {
        const subPath = join(currentPath, entry.name);
        await scanDirectory(subPath, rootPath, depth + 1, options, discovered);
      }
    }
    
  } catch (error) {
    console.warn(`⚠️ Could not scan directory: ${currentPath}`);
  }
}

/**
 * Build parent-child relationships from discovered directories
 */
function buildCascadeRelationships(
  discovered: Map<string, PraxisDirectory>,
  rootPath: string
): CascadeMap {
  const roots: string[] = [];
  let maxDepth = 0;
  
  // Sort directories by depth to process parents before children
  const sortedDirs = Array.from(discovered.entries())
    .sort(([, a], [, b]) => a.depth - b.depth);
  
  for (const [path, directory] of sortedDirs) {
    maxDepth = Math.max(maxDepth, directory.depth);
    
    if (directory.depth === 0) {
      // Root directory
      roots.push(path);
    } else {
      // Find parent directory
      const parentPath = dirname(path);
      const normalizedParent = parentPath === '.' ? '.' : parentPath;
      
      if (discovered.has(normalizedParent)) {
        // Set parent relationship
        directory.parent = normalizedParent;
        
        // Add to parent's children
        const parent = discovered.get(normalizedParent)!;
        parent.children.push(path);
      }
    }
  }
  
  return {
    directories: discovered,
    roots,
    metadata: {
      scannedAt: new Date(),
      totalDirectories: discovered.size,
      totalConfigs: discovered.size, // Each discovered dir has a config
      maxDepth
    }
  };
}

/**
 * Get all descendants of a directory (recursive children)
 */
export function getDescendants(cascadeMap: CascadeMap, directoryPath: string): string[] {
  const directory = cascadeMap.directories.get(directoryPath);
  if (!directory) return [];
  
  const descendants: string[] = [];
  
  function collectDescendants(path: string) {
    const dir = cascadeMap.directories.get(path);
    if (!dir) return;
    
    for (const child of dir.children) {
      descendants.push(child);
      collectDescendants(child); // Recursive
    }
  }
  
  collectDescendants(directoryPath);
  return descendants;
}

/**
 * Get full inheritance chain for a directory (from root to directory)
 */
export function getInheritanceChain(cascadeMap: CascadeMap, directoryPath: string): string[] {
  const chain: string[] = [];
  let current: string | undefined = directoryPath;
  
  while (current) {
    chain.unshift(current); // Add to beginning
    const directory = cascadeMap.directories.get(current);
    current = directory?.parent;
  }
  
  return chain;
}

/**
 * Pretty print the cascade map for debugging
 */
export function printCascadeMap(cascadeMap: CascadeMap): void {
  console.log('\n🗺️ PRAXIS CASCADE MAP');
  console.log('====================');
  
  function printDirectory(path: string, indent = 0) {
    const directory = cascadeMap.directories.get(path);
    if (!directory) return;
    
    const prefix = '  '.repeat(indent);
    const icon = directory.children.length > 0 ? '📁' : '📄';
    
    console.log(`${prefix}${icon} ${path} (${directory.children.length} children)`);
    
    // Print children
    for (const child of directory.children) {
      printDirectory(child, indent + 1);
    }
  }
  
  // Print from roots
  for (const root of cascadeMap.roots) {
    printDirectory(root);
  }
  
  console.log(`\n📊 Total: ${cascadeMap.metadata.totalDirectories} directories, max depth: ${cascadeMap.metadata.maxDepth}`);
}

/**
 * Watch discovered directories for changes
 * Returns cleanup function to stop watching
 */
export async function watchCascadeDirectories(
  cascadeMap: CascadeMap,
  onChange: (changedPath: string, directory: PraxisDirectory) => void
): Promise<() => void> {
  // TODO: Implement file watching for discovered directories
  // This will watch for changes to praxis.config.yaml files
  // and trigger onChange callback for cascade updates
  
  console.log(`👀 Starting watchers for ${cascadeMap.metadata.totalDirectories} directories...`);
  
  // Placeholder implementation
  const watchers: any[] = [];
  
  return () => {
    console.log('🛑 Stopping cascade watchers...');
    watchers.forEach(watcher => watcher?.close?.());
  };
}
