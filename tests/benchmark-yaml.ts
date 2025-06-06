#!/usr/bin/env bun

/**
 * YAML PARSER BENCHMARK - Evaluate best YAML library
 * Tests: Bun native, js-yaml, yaml package, fast-yaml
 */

const testYAML = `
component:
  name: TestButton
  description: A test button component

uses:
  variants: [primary, secondary, tertiary, danger]
  sizes: [xs, sm, md, lg, xl]
  states: [isDisabled, isLoading, isSelected]
  accessibility: [aria-label, aria-describedby]
  interactions: [onClick, onHover]
  styling: [className, style]

config:
  strict: true
  validate: true
`;

const ITERATIONS = 10000;

console.log('🧪 YAML PARSER BENCHMARK');
console.log('========================');
console.log(`Testing with ${ITERATIONS} iterations...`);

// Test Bun native YAML
async function benchmarkBunNative(): Promise<number> {
  if (typeof Bun.YAML === 'undefined') {
    console.log('❌ Bun.YAML not available');
    return Infinity;
  }
  
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    Bun.YAML.parse(testYAML);
  }
  const end = performance.now();
  
  return end - start;
}

// Test js-yaml (most popular)
async function benchmarkJsYaml(): Promise<number> {
  try {
    const { load } = await import('js-yaml');
    
    const start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      load(testYAML);
    }
    const end = performance.now();
    
    return end - start;
  } catch (error) {
    console.log('❌ js-yaml not available:', error);
    return Infinity;
  }
}

// Test yaml package (newer, spec-compliant)
async function benchmarkYamlPackage(): Promise<number> {
  try {
    const { parse } = await import('yaml');
    
    const start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      parse(testYAML);
    }
    const end = performance.now();
    
    return end - start;
  } catch (error) {
    console.log('❌ yaml package not available:', error);
    return Infinity;
  }
}

// Test fast-yaml (performance focused)
async function benchmarkFastYaml(): Promise<number> {
  try {
    const { parse } = await import('fast-yaml');
    
    const start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
      parse(testYAML);
    }
    const end = performance.now();
    
    return end - start;
  } catch (error) {
    console.log('❌ fast-yaml not available:', error);
    return Infinity;
  }
}

// Run benchmarks
const [bunNative, jsYaml, yamlPackage, fastYaml] = await Promise.all([
  benchmarkBunNative(),
  benchmarkJsYaml(),
  benchmarkYamlPackage(),
  benchmarkFastYaml()
]);

console.log('\n📊 YAML PARSER RESULTS:');
console.log('=======================');

const results = [
  { name: 'Bun Native', time: bunNative, bundle: '0KB (built-in)' },
  { name: 'js-yaml', time: jsYaml, bundle: '~67KB' },
  { name: 'yaml', time: yamlPackage, bundle: '~156KB' },
  { name: 'fast-yaml', time: fastYaml, bundle: '~12KB' }
].filter(r => r.time !== Infinity).sort((a, b) => a.time - b.time);

results.forEach((result, index) => {
  const opsPerSec = (ITERATIONS / result.time * 1000).toFixed(0);
  const rank = index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
  console.log(`${rank} ${result.name}: ${result.time.toFixed(2)}ms (${opsPerSec} ops/sec, ${result.bundle})`);
});

// Recommendations
console.log('\n🎯 RECOMMENDATIONS:');
console.log('==================');

if (results[0]?.name === 'Bun Native') {
  console.log('✅ WINNER: Bun Native YAML Parser');
  console.log('   • Fastest performance');
  console.log('   • Zero bundle size (built-in)');
  console.log('   • Zero dependencies');
  console.log('   • Perfect for Praxis philosophy');
} else {
  console.log(`✅ WINNER: ${results[0]?.name}`);
  console.log('   • Fastest performance among available options');
  console.log(`   • Bundle size: ${results[0]?.bundle}`);
  console.log('   • Consider if performance gain justifies dependency');
}

// Bundle size analysis
console.log('\n📦 BUNDLE SIZE ANALYSIS:');
console.log('=======================');
console.log('Current Praxis target: 2KB total bundle');
console.log('Impact of YAML libraries:');
results.forEach(result => {
  if (result.name === 'Bun Native') {
    console.log(`   • ${result.name}: No impact (built-in)`);
  } else {
    const sizeMatch = result.bundle.match(/(\d+)KB/);
    const size = sizeMatch ? parseInt(sizeMatch[1]) : 0;
    const impact = size > 2 ? `❌ Exceeds total bundle target by ${size - 2}KB` : 
                   size > 1 ? `⚠️  Significant impact (${size}KB)` : 
                   `✅ Acceptable impact (${size}KB)`;
    console.log(`   • ${result.name}: ${impact}`);
  }
});

console.log('\n💡 STRATEGIC RECOMMENDATION:');
console.log('============================');

if (bunNative !== Infinity) {
  console.log('🚀 Stick with Bun Native YAML Parser');
  console.log('   ✅ Aligns with zero-dependency philosophy');
  console.log('   ✅ Maintains 2KB bundle target');
  console.log('   ✅ Optimal performance for Bun runtime');
  console.log('   ✅ Reduces attack surface (no external deps)');
} else {
  console.log('🤔 Bun Native YAML not available');
  console.log('Consider fastest available option with acceptable bundle impact');
}