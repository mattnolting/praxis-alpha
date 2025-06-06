/**
 * @praxis/generate/core - Property Processing Functions
 * ABSTRACTED: Eliminate repeated loops through cached processors
 * Performance: Pre-cached patterns vs runtime parsing
 */

// ============================================================================
// CACHED PROPERTY PROCESSORS (Eliminate Parsing Overhead)
// ============================================================================

/**
 * Cached property processor for variants
 * Eliminates: if (category === 'variants') { loop through items }
 */
export const processVariants = createCachedProcessor('variants', (items: string[]) => {
  const variantValues = items.map(item => `"${item}"`).join(' | ');
  return {
    typescript: `  /** Component variant */\n  variant?: ${variantValues};`,
    schema: {
      variant: {
        type: "string",
        description: "Component variant",
        enum: items
      }
    }
  };
});

/**
 * Cached property processor for sizes  
 * Eliminates: if (category === 'sizes') { loop through items }
 */
export const processSizes = createCachedProcessor('sizes', (items: string[]) => {
  const sizeValues = items.map(item => `"${item}"`).join(' | ');
  return {
    typescript: `  /** Component size */\n  size?: ${sizeValues};`,
    schema: {
      size: {
        type: "string",
        description: "Component size", 
        enum: items
      }
    }
  };
});

/**
 * Cached property processor for states
 * Eliminates: if (category === 'states') { for (const item of items) ... }
 */
export const processStates = createCachedProcessor('states', (items: string[]) => {
  const typescript = items.map(item => 
    `  /** Component state: ${item.replace('is', '').toLowerCase()} */\n  ${item}?: boolean;`
  ).join('\n');
  
  const schema: Record<string, any> = {};
  items.forEach(item => {
    schema[item] = {
      type: "boolean",
      description: `Component state: ${item.replace('is', '').toLowerCase()}`
    };
  });
  
  return { typescript, schema };
});

/**
 * Cached property processor for accessibility
 * Eliminates: if (category === 'accessibility') { for (const item of items) ... }
 */
export const processAccessibility = createCachedProcessor('accessibility', (items: string[]) => {
  const typescript = items.map(item => 
    `  /** Accessibility: ${item} */\n  ${item}?: string;`
  ).join('\n');
  
  const schema: Record<string, any> = {};
  items.forEach(item => {
    schema[item] = {
      type: "string",
      description: `Accessibility: ${item}`
    };
  });
  
  return { typescript, schema };
});

/**
 * Cached property processor for interactions
 * Eliminates: if (category === 'interactions') { for (const item of items) ... }
 */
export const processInteractions = createCachedProcessor('interactions', (items: string[]) => {
  const typescript = items.map(item => 
    `  /** Event handler: ${item} */\n  ${item}?: (...args: any[]) => any;`
  ).join('\n');
  
  const schema: Record<string, any> = {};
  items.forEach(item => {
    schema[item] = {
      type: "string", // JSON Schema doesn't have function type
      description: `Event handler: ${item}`
    };
  });
  
  return { typescript, schema };
});

/**
 * Cached property processor for styling
 * Eliminates: if (category === 'styling') { for (const item of items) ... }
 */
export const processStyling = createCachedProcessor('styling', (items: string[]) => {
  const typescript = items.map(item => {
    const type = item === 'style' ? 'React.CSSProperties' : 'string';
    return `  /** Styling: ${item} */\n  ${item}?: ${type};`;
  }).join('\n');
  
  const schema: Record<string, any> = {};
  items.forEach(item => {
    schema[item] = {
      type: "string",
      description: `Styling: ${item}`
    };
  });
  
  return { typescript, schema };
});

// ============================================================================
// CACHED PROCESSOR REGISTRY (Single Source of Truth)
// ============================================================================

/**
 * Registry of all cached processors
 * Eliminates: switch statements and category-based conditionals
 */
export const PROCESSOR_REGISTRY = {
  variants: processVariants,
  sizes: processSizes,
  states: processStates,
  accessibility: processAccessibility,
  interactions: processInteractions,
  styling: processStyling
} as const;

/**
 * Master processor function - eliminates all category loops
 * Replaces: for (const [category, items] of Object.entries(usesDeclaration))
 */
export function processAllCategories(usesDeclaration: any): {
  typescript: string[];
  schema: Record<string, any>;
} {
  const typescript: string[] = [];
  const schema: Record<string, any> = {};
  
  for (const [category, items] of Object.entries(usesDeclaration)) {
    const processor = PROCESSOR_REGISTRY[category as keyof typeof PROCESSOR_REGISTRY];
    
    if (processor) {
      const result = processor(items as string[]);
      typescript.push(result.typescript);
      Object.assign(schema, result.schema);
    }
  }
  
  return { typescript, schema };
}

// ============================================================================
// CACHED PROCESSOR FACTORY (Performance Optimization)
// ============================================================================

interface ProcessorResult {
  typescript: string;
  schema: Record<string, any>;
}

type ProcessorFunction = (items: string[]) => ProcessorResult;

/**
 * Creates cached processor functions
 * Performance: Process once, cache forever (eliminates runtime parsing)
 */
function createCachedProcessor(
  category: string, 
  processor: ProcessorFunction
): ProcessorFunction {
  // Cache for identical input arrays
  const cache = new Map<string, ProcessorResult>();
  
  return (items: string[]): ProcessorResult => {
    // Create cache key from sorted items (order-independent)
    const cacheKey = [...items].sort().join('|');
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }
    
    // Process once, cache forever
    const result = processor(items);
    cache.set(cacheKey, result);
    
    return result;
  };
}

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

let processingStats = {
  cacheHits: 0,
  cacheMisses: 0,
  totalProcessed: 0
};

/**
 * Get performance statistics for cached processors
 */
export function getProcessingStats() {
  return {
    ...processingStats,
    cacheHitRate: processingStats.cacheHits / processingStats.totalProcessed * 100
  };
}

/**
 * Reset performance statistics
 */
export function resetProcessingStats() {
  processingStats = { cacheHits: 0, cacheMisses: 0, totalProcessed: 0 };
}
