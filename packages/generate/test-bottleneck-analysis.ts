#!/usr/bin/env bun

/**
 * 🔬 BOTTLENECK ANALYSIS TEST
 * Identify why parallel processing isn't hitting 5x target
 */

import { scanAndGenerate } from './index-cached.ts';
import { scanAndGenerateParallel } from './index-parallel.ts';

console.log('🔬 BOTTLENECK ANALYSIS: Why Not 5x Improvement?');
console.log('===============================================');

// ============================================================================
// TEST 1: Cache Saturation Analysis
// ============================================================================

async function testCacheSaturation() {
  console.log('\n1️⃣ CACHE SATURATION ANALYSIS');
  console.log('Testing with fresh vs cached scenarios...\n');
  
  // Clear generated files to force fresh generation
  const generatedFiles = [
    'TestAlertProps.ts', 'TestAlertSchema.json',
    'TestButtonProps.ts', 'TestButtonSchema.json', 
    'TestInputProps.ts', 'TestInputSchema.json',
    'TestModalProps.ts', 'TestModalSchema.json',
    'TestCardProps.ts', 'TestCardSchema.json'
  ];
  
  // Clean slate test
  for (const file of generatedFiles) {
    try { await Bun.write(file, ''); } catch {}
  }
  
  console.log('🧹 Testing with FRESH generation (no cache benefits)...');
  
  // Sequential fresh
  const freshSeqStart = performance.now();
  await scanAndGenerate('.');
  const freshSeqTime = performance.now() - freshSeqStart;
  
  // Clean again
  for (const file of generatedFiles) {
    try { await Bun.write(file, ''); } catch {}
  }
  
  // Parallel fresh  
  const freshParStart = performance.now();
  await scanAndGenerateParallel('.');
  const freshParTime = performance.now() - freshParStart;
  
  console.log(`\n📊 FRESH GENERATION RESULTS:`);
  console.log(`Sequential: ${freshSeqTime.toFixed(2)}ms`);
  console.log(`Parallel:   ${freshParTime.toFixed(2)}ms`);
  const freshImprovement = freshSeqTime / freshParTime;
  console.log(`🚀 Fresh Improvement: ${freshImprovement.toFixed(1)}x faster`);
  
  if (freshImprovement > 4.0) {
    console.log(`✅ HYPOTHESIS CONFIRMED: Cache saturation was limiting parallel benefit`);
  } else {
    console.log(`❌ HYPOTHESIS REJECTED: Cache saturation not the main issue`);
  }
  
  return freshImprovement;
}

// ============================================================================
// TEST 2: Component Count Scaling Analysis  
// ============================================================================

async function testComponentScaling() {
  console.log('\n2️⃣ COMPONENT COUNT SCALING ANALYSIS');
  console.log('Testing if more components increase parallel benefit...\n');
  
  // Create additional test components
  const additionalComponents = [
    'TestTooltip', 'TestBadge', 'TestSpinner', 'TestToggle', 'TestSlider',
    'TestNavbar', 'TestSidebar', 'TestFooter', 'TestBreadcrumb', 'TestPagination'
  ];
  
  for (const name of additionalComponents) {
    const config = `component:
  name: ${name}
  description: "${name} component for scaling test"

uses:
  variants: [primary, secondary, tertiary]
  sizes: [sm, md, lg]
  states: [isDisabled, isLoading]
  accessibility: [aria-label]
  interactions: [onClick]
  styling: [className, style]`;
    
    await Bun.write(`${name}.praxis.yaml`, config);
  }
  
  console.log(`📦 Created ${additionalComponents.length} additional components`);
  console.log(`🎯 Total components: ${5 + additionalComponents.length} (15 total)`);
  
  // Test with 15 components
  console.log('\n🧪 Testing with 15 components...');
  
  const manySeqStart = performance.now();
  await scanAndGenerate('.');
  const manySeqTime = performance.now() - manySeqStart;
  
  const manyParStart = performance.now();
  await scanAndGenerateParallel('.');
  const manyParTime = performance.now() - manyParStart;
  
  console.log(`\n📊 15-COMPONENT RESULTS:`);
  console.log(`Sequential: ${manySeqTime.toFixed(2)}ms`);
  console.log(`Parallel:   ${manyParTime.toFixed(2)}ms`);
  const manyImprovement = manySeqTime / manyParTime;
  console.log(`🚀 15-Component Improvement: ${manyImprovement.toFixed(1)}x faster`);
  
  // Calculate throughput
  const throughput = Math.round((15 / manyParTime) * 1000);
  console.log(`📊 Throughput: ${throughput.toLocaleString()} components/sec`);
  
  // Cleanup
  for (const name of additionalComponents) {
    try { await Bun.write(`${name}.praxis.yaml`, ''); } catch {}
  }
  
  return manyImprovement;
}

// ============================================================================
// TEST 3: CPU vs I/O Bound Analysis
// ============================================================================

async function testCpuVsIoBound() {
  console.log('\n3️⃣ CPU vs I/O BOUND ANALYSIS');
  console.log('Testing processing vs file operation performance...\n');
  
  // Measure pure processing time (no file I/O)
  const { generateCompleteComponent } = await import('./global-cached-system.ts');
  
  const testConfig = {
    variants: ['primary', 'secondary', 'tertiary', 'danger'],
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
    states: ['isDisabled', 'isLoading', 'isSelected'],
    accessibility: ['aria-label', 'aria-describedby'],
    interactions: ['onClick', 'onHover', 'onFocus'],
    styling: ['className', 'style']
  };
  
  console.log('🧮 Testing pure CPU processing (no I/O)...');
  
  // Sequential processing
  const cpuSeqStart = performance.now();
  for (let i = 0; i < 5; i++) {
    generateCompleteComponent(`TestComponent${i}`, testConfig);
  }
  const cpuSeqTime = performance.now() - cpuSeqStart;
  
  // Parallel processing
  const cpuParStart = performance.now();
  await Promise.all(
    Array.from({length: 5}, (_, i) => 
      Promise.resolve(generateCompleteComponent(`TestComponent${i}`, testConfig))
    )
  );
  const cpuParTime = performance.now() - cpuParStart;
  
  console.log(`\n📊 PURE CPU PROCESSING RESULTS:`);
  console.log(`Sequential: ${cpuSeqTime.toFixed(2)}ms`);
  console.log(`Parallel:   ${cpuParTime.toFixed(2)}ms`);
  const cpuImprovement = cpuSeqTime / cpuParTime;
  console.log(`🚀 CPU Improvement: ${cpuImprovement.toFixed(1)}x faster`);
  
  return cpuImprovement;
}

// ============================================================================
// MAIN BOTTLENECK ANALYSIS
// ============================================================================

async function runBottleneckAnalysis() {
  const freshImprovement = await testCacheSaturation();
  const scalingImprovement = await testComponentScaling();
  const cpuImprovement = await testCpuVsIoBound();
  
  console.log('\n🎯 BOTTLENECK ANALYSIS SUMMARY:');
  console.log('===============================');
  console.log(`Fresh Generation: ${freshImprovement.toFixed(1)}x improvement`);
  console.log(`15 Components:    ${scalingImprovement.toFixed(1)}x improvement`);
  console.log(`Pure CPU Work:    ${cpuImprovement.toFixed(1)}x improvement`);
  
  console.log('\n💡 BOTTLENECK IDENTIFICATION:');
  
  if (freshImprovement >= 4.0) {
    console.log('✅ PRIMARY BOTTLENECK: Cache saturation limits parallel benefits');
    console.log('   💊 SOLUTION: Test with fresh components or disable cache for testing');
  }
  
  if (scalingImprovement > freshImprovement + 0.5) {
    console.log('✅ SCALING BOTTLENECK: More components increase parallel benefit');
    console.log('   💊 SOLUTION: Parallel processing shines with larger projects');
  }
  
  if (cpuImprovement < 2.0) {
    console.log('✅ CPU BOTTLENECK: Processing work is too light for significant parallel gain');
    console.log('   💊 SOLUTION: Focus on I/O optimization or template pre-compilation');
  } else {
    console.log('✅ I/O BOTTLENECK: File operations are limiting parallel performance');
    console.log('   💊 SOLUTION: Implement batch file operations');
  }
  
  console.log('\n🚀 NEXT PHASE RECOMMENDATION:');
  if (Math.max(freshImprovement, scalingImprovement, cpuImprovement) >= 4.0) {
    console.log('✅ PROCEED TO PHASE 2: Template-level parallelization');
    console.log('   🎯 Phase 1 established parallel foundation successfully');
  } else {
    console.log('🔄 OPTIMIZE PHASE 1: Address identified bottlenecks first');
    console.log('   🎯 Focus on I/O optimization and batch operations');
  }
}

if (import.meta.main) {
  await runBottleneckAnalysis();
}

export { runBottleneckAnalysis };
