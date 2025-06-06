/**
 * @praxis/generate/core - Conditional Logic Processors  
 * ABSTRACTED: Eliminate repeated if statements through cached conditionals
 * Performance: Pre-cached decisions vs runtime conditional parsing
 */

// ============================================================================
// CACHED CONDITIONAL PROCESSORS (Eliminate If Statement Parsing)
// ============================================================================

/**
 * Cached file type detector
 * Eliminates: if (filename.includes('praxis.config.yaml') || filename.includes('.praxis.yaml'))
 */
export const isConfigFile = createCachedCondition(
  (filename: string) => filename.includes('praxis.config.yaml') || filename.includes('.praxis.yaml')
);

/**
 * Cached Praxis config detector
 * Eliminates: if (isConfigFile && eventType === 'change')
 */
export const isPraxisConfigChange = createCachedCondition(
  (filename: string, eventType: string) => isConfigFile(filename) && eventType === 'change'
);

/**
 * Cached uses syntax detector
 * Eliminates: if (config.uses) vs if (config.props)
 */
export const hasUsesDeclaration = createCachedCondition(
  (config: any) => config.uses !== undefined && config.uses !== null
);

/**
 * Cached output format detector
 * Eliminates: switch (format) { case 'typescript': case 'json-schema': }
 */
export const isValidFormat = createCachedCondition(
  (format: string) => ['typescript', 'json-schema'].includes(format)
);

/**
 * Cached required prop detector
 * Eliminates: if (requiredProps.includes(propName))
 */
export const isRequiredProp = createCachedCondition(
  (propName: string) => ['children', 'id'].includes(propName)
);

/**
 * Cached enum validator
 * Eliminates: if (def?.validation?.enum)
 */
export const hasEnumValidation = createCachedCondition(
  (def: any) => def?.validation?.enum !== undefined
);

/**
 * Cached default value checker
 * Eliminates: if (def.default !== undefined)
 */
export const hasDefaultValue = createCachedCondition(
  (def: any) => def.default !== undefined
);

// ============================================================================
// FILE OPERATION CONDITIONALS (Performance Critical)
// ============================================================================

/**
 * Cached regeneration checker
 * Eliminates: repeated file stat conditionals
 */
export const shouldRegenerate = createAsyncCachedCondition(
  async (configPath: string, outputPath: string): Promise<boolean> => {
    try {
      const [configStat, outputStat] = await Promise.all([
        Bun.file(configPath).stat(),
        Bun.file(outputPath).stat()
      ]);
      
      return configStat.mtime > outputStat.mtime;
    } catch {
      return true; // If output doesn't exist, regenerate
    }
  }
);

/**
 * Cached file existence checker
 * Eliminates: repeated try/catch file operations
 */
export const fileExists = createAsyncCachedCondition(
  async (filePath: string): Promise<boolean> => {
    try {
      await Bun.file(filePath).stat();
      return true;
    } catch {
      return false;
    }
  }
);

// ============================================================================
// PATH OPERATION CONDITIONALS (100% Bun-Native)
// ============================================================================

/**
 * Cached directory extractor
 * Eliminates: repeated lastIndexOf and substring operations
 */
export const extractDirectory = createCachedFunction(
  (configPath: string): string => {
    const lastSlash = configPath.lastIndexOf('/');
    return lastSlash >= 0 ? configPath.substring(0, lastSlash) : '.';
  }
);

/**
 * Cached basename extractor
 * Eliminates: repeated path parsing operations
 */
export const extractBasename = createCachedFunction(
  (filePath: string): string => {
    const lastSlash = filePath.lastIndexOf('/');
    return lastSlash >= 0 ? filePath.substring(lastSlash + 1) : filePath;
  }
);

/**
 * Cached output path generator
 * Eliminates: repeated string concatenation patterns
 */
export const createOutputPath = createCachedFunction(
  (configPath: string, componentName: string, extension: string): string => {
    const directory = extractDirectory(configPath);
    return `${directory}/${componentName}${extension}`;
  }
);

// ============================================================================
// TYPE MAPPING CONDITIONALS (Registry-Driven)
// ============================================================================

/**
 * Cached TypeScript type mapper
 * Eliminates: repeated type lookup conditionals
 */
export const mapToTypeScript = createCachedFunction(
  (praxisType: string, def?: any): string => {
    // Handle enum case first (most common)
    if (hasEnumValidation(def)) {
      return def.validation.enum.map((v: any) => JSON.stringify(v)).join(' | ');
    }
    
    // Standard type mapping
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number', 
      'boolean': 'boolean',
      'object': 'Record<string, any>',
      'array': 'any[]',
      'function': '(...args: any[]) => any'
    };
    
    return typeMap[praxisType] || 'any';
  }
);

/**
 * Cached JSON Schema type mapper
 * Eliminates: repeated schema type lookup conditionals
 */
export const mapToJSONSchema = createCachedFunction(
  (praxisType: string): string => {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean', 
      'object': 'object',
      'array': 'array',
      'function': 'string'
    };
    
    return typeMap[praxisType] || 'string';
  }
);

// ============================================================================
// CONDITIONAL FACTORY FUNCTIONS (Performance Core)
// ============================================================================

/**
 * Creates cached condition functions (synchronous)
 * Performance: Condition evaluated once, cached forever
 */
function createCachedCondition<T extends any[], R>(
  condition: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T): R => {
    // Create cache key from arguments
    const cacheKey = JSON.stringify(args);
    
    if (cache.has(cacheKey)) {
      conditionalStats.cacheHits++;
      return cache.get(cacheKey)!;
    }
    
    // Evaluate once, cache forever
    const result = condition(...args);
    cache.set(cacheKey, result);
    conditionalStats.cacheMisses++;
    
    return result;
  };
}

/**
 * Creates cached async condition functions
 * Performance: Async conditions cached to eliminate repeated I/O
 */
function createAsyncCachedCondition<T extends any[], R>(
  condition: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  const cache = new Map<string, R>();
  
  return async (...args: T): Promise<R> => {
    const cacheKey = JSON.stringify(args);
    
    if (cache.has(cacheKey)) {
      conditionalStats.cacheHits++;
      return cache.get(cacheKey)!;
    }
    
    // Evaluate once, cache forever  
    const result = await condition(...args);
    cache.set(cacheKey, result);
    conditionalStats.cacheMisses++;
    
    return result;
  };
}

/**
 * Creates cached pure functions (non-conditional)
 * Performance: Pure function results cached for identical inputs
 */
function createCachedFunction<T extends any[], R>(
  func: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T): R => {
    const cacheKey = JSON.stringify(args);
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }
    
    const result = func(...args);
    cache.set(cacheKey, result);
    
    return result;
  };
}

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

let conditionalStats = {
  cacheHits: 0,
  cacheMisses: 0,
  get totalEvaluations() { return this.cacheHits + this.cacheMisses; },
  get cacheHitRate() { return this.cacheHits / this.totalEvaluations * 100; }
};

/**
 * Get conditional performance statistics
 */
export function getConditionalStats() {
  return { ...conditionalStats };
}

/**
 * Reset conditional performance statistics
 */
export function resetConditionalStats() {
  conditionalStats.cacheHits = 0;
  conditionalStats.cacheMisses = 0;
}

// ============================================================================
// MASTER CONDITIONAL PROCESSOR
// ============================================================================

/**
 * Process all conditionals through cached functions
 * Eliminates: All if statement parsing overhead in main generation logic
 */
export function processConditionals(context: {
  filename?: string;
  eventType?: string;
  config?: any;
  format?: string;
  configPath?: string;
  outputPath?: string;
}) {
  return {
    isConfigFile: context.filename ? isConfigFile(context.filename) : false,
    isPraxisConfigChange: context.filename && context.eventType ? 
      isPraxisConfigChange(context.filename, context.eventType) : false,
    hasUsesDeclaration: context.config ? hasUsesDeclaration(context.config) : false,
    isValidFormat: context.format ? isValidFormat(context.format) : false,
    shouldRegenerate: context.configPath && context.outputPath ? 
      shouldRegenerate(context.configPath, context.outputPath) : Promise.resolve(true)
  };
}
