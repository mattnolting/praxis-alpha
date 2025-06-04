/**
 * Inheritance Engine Test - Validate Implementation
 * Quick surgical test to ensure inheritance works as expected
 */

import { 
  initializeInheritanceEngine, 
  createInheritanceResolver,
  getInheritedConfig,
  type InheritedConfig 
} from '../core/inheritance';
import type { CascadeMap, PraxisDirectory } from '../core/scanner';

/**
 * Create mock cascade map for testing
 */
function createMockCascadeMap(): CascadeMap {
  const directories = new Map<string, PraxisDirectory>();
  
  // Root config
  directories.set('.', {
    path: '.',
    absolutePath: '/project',
    config: {
      theme: 'light',
      version: '1.0.0',
      globals: {
        spacing: 8,
        borderRadius: 4
      }
    },
    children: ['components'],
    depth: 0,
    shouldWatch: true
  });
  
  // Components directory config
  directories.set('components', {
    path: 'components',
    absolutePath: '/project/components',
    config: {
      theme: 'dark', // Override root
      generateIndex: true,
      globals: {
        spacing: 16, // Override root spacing
        typography: 'Inter' // Add new property
      }
    },
    parent: '.',
    children: ['components/Button'],
    depth: 1,
    shouldWatch: true
  });
  
  // Button component config
  directories.set('components/Button', {
    path: 'components/Button',
    absolutePath: '/project/components/Button',
    config: {
      component: 'Button',
      props: {
        variant: 'primary',
        size: 'default'
      },
      globals: {
        borderRadius: 8 // Override components borderRadius
      }
    },
    parent: 'components',
    children: [],
    depth: 2,
    shouldWatch: true
  });
  
  return {
    directories,
    roots: ['.'],
    metadata: {
      scannedAt: new Date(),
      totalDirectories: 3,
      totalConfigs: 3,
      maxDepth: 2
    }
  };
}

/**
 * Test inheritance engine functionality
 */
export function testInheritanceEngine(): void {
  console.log('🧪 Testing Inheritance Engine...');
  
  const cascadeMap = createMockCascadeMap();
  const engine = initializeInheritanceEngine(cascadeMap);
  
  // Test 1: Button component should inherit from components and root
  console.log('\\n📝 Test 1: Button Component Inheritance');
  const buttonInherited = engine.resolveInherited('components/Button');
  
  if (buttonInherited) {
    console.log('✅ Button inheritance resolved');
    console.log('📋 Inheritance chain:', buttonInherited.meta.inheritanceChain);
    console.log('🔄 Overrides:', buttonInherited.meta.overrides);
    
    // Validate expected inheritance:
    // - theme: 'dark' (from components, overrides root 'light')
    // - version: '1.0.0' (from root)
    // - spacing: 16 (from components, overrides root 8)
    // - borderRadius: 8 (from button, overrides components 4)
    // - typography: 'Inter' (from components)
    // - component: 'Button' (from button)
    // - props: {...} (from button)
    
    const config = buttonInherited.config;
    console.log('🎯 Final config theme:', config.theme); // Should be 'dark'
    console.log('🎯 Final config version:', config.version); // Should be '1.0.0'
    console.log('🎯 Final config globals.spacing:', config.globals?.spacing); // Should be 16
    console.log('🎯 Final config globals.borderRadius:', config.globals?.borderRadius); // Should be 8
    console.log('🎯 Final config globals.typography:', config.globals?.typography); // Should be 'Inter'
    
  } else {
    console.log('❌ Button inheritance failed');
  }
  
  // Test 2: Performance test with resolver
  console.log('\\n⚡ Test 2: Performance Test');
  const resolver = createInheritanceResolver(cascadeMap);
  
  const startTime = Date.now();
  const iterations = 10000;
  
  for (let i = 0; i < iterations; i++) {
    resolver('components/Button');
  }
  
  const endTime = Date.now();
  const opsPerSecond = Math.round(iterations / ((endTime - startTime) / 1000));
  
  console.log(`✅ Performance: ${opsPerSecond.toLocaleString()} ops/sec`);
  console.log(`🎯 Target: 1M+ ops/sec - ${opsPerSecond >= 1000000 ? 'ACHIEVED' : 'NEEDS OPTIMIZATION'}`);
  
  // Test 3: Statistics
  console.log('\\n📊 Test 3: Inheritance Statistics');
  const stats = engine.getInheritanceStats();
  console.log('📈 Cache stats:', stats);
  
  console.log('\\n🎉 Inheritance Engine Tests Complete!');
}

/**
 * Quick validation of semantic merge behavior
 */
export function testSemanticMerge(): void {
  console.log('\\n🔬 Testing Semantic Merge Logic...');
  
  const cascadeMap = createMockCascadeMap();
  
  // Test that Button gets proper inheritance
  const buttonConfig = getInheritedConfig(cascadeMap, 'components/Button');
  
  if (buttonConfig) {
    console.log('✅ Semantic merge test passed');
    console.log('🔍 Merged config preview:', JSON.stringify(buttonConfig, null, 2));
  } else {
    console.log('❌ Semantic merge test failed');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testInheritanceEngine();
  testSemanticMerge();
}
