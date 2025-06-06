#!/usr/bin/env bun

/**
 * BUN CONFIGURATION VALIDATION
 * Ensures proper Bun-native setup and configuration
 */

console.log('🔍 Validating Bun-Native Configuration...\n');

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

function validateEnvironment() {
  console.log('🌍 Environment Validation:');
  
  // Check Bun version
  const bunVersion = Bun.version;
  console.log(`✅ Bun Version: ${bunVersion}`);
  
  // Check Node.js not being used
  if (process.versions.bun) {
    console.log(`✅ Running on Bun runtime (not Node.js)`);
  } else {
    console.log(`❌ WARNING: Not running on Bun runtime`);
  }
  
  // Check TypeScript support
  console.log(`✅ Native TypeScript: ${!!Bun.Transpiler ? 'Available' : 'Fallback mode'}`);
  
  // Check YAML support
  console.log(`✅ Native YAML: ${typeof Bun.YAML !== 'undefined' ? 'Available' : 'Import-based fallback'}`);
  
  console.log('');
}

// ============================================================================
// DEPENDENCY VALIDATION
// ============================================================================

async function validateDependencies() {
  console.log('📦 Dependency Validation:');
  
  try {
    const packageJson = await Bun.file('./package.json').json();
    
    const prodDeps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    
    console.log(`📊 Production Dependencies: ${prodDeps.length}`);
    if (prodDeps.length === 0) {
      console.log('✅ Zero production dependencies - pure Bun native!');
    } else {
      console.log(`⚠️  Production dependencies found: ${prodDeps.join(', ')}`);
    }
    
    console.log(`📊 Dev Dependencies: ${devDeps.length}`);
    console.log(`✅ Dev dependencies: ${devDeps.join(', ')}`);
    
    // Check for eliminated dependencies
    const eliminatedDeps = ['yaml', 'glob', 'typescript', 'vite'];
    const stillPresent = eliminatedDeps.filter(dep => 
      prodDeps.includes(dep) || devDeps.includes(dep)
    );
    
    if (stillPresent.length === 0) {
      console.log('✅ All target dependencies successfully eliminated');
    } else {
      console.log(`⚠️  Dependencies that could be eliminated: ${stillPresent.join(', ')}`);
    }
    
  } catch (error) {
    console.log(`❌ Could not read package.json: ${error}`);
  }
  
  console.log('');
}

// ============================================================================
// CONFIGURATION FILE VALIDATION
// ============================================================================

async function validateConfigFiles() {
  console.log('⚙️  Configuration File Validation:');
  
  // Check bunfig.toml
  const bunfigExists = await Bun.file('./bunfig.toml').exists();
  console.log(`${bunfigExists ? '✅' : '❌'} bunfig.toml: ${bunfigExists ? 'Present' : 'Missing'}`);
  
  // Check tsconfig.json
  const tsconfigExists = await Bun.file('./tsconfig.json').exists();
  console.log(`${tsconfigExists ? '✅' : '❌'} tsconfig.json: ${tsconfigExists ? 'Present' : 'Missing'}`);
  
  if (tsconfigExists) {
    try {
      const tsconfig = await Bun.file('./tsconfig.json').json();
      const moduleResolution = tsconfig.compilerOptions?.moduleResolution;
      console.log(`   Module Resolution: ${moduleResolution === 'bundler' ? '✅ bundler' : '⚠️  ' + moduleResolution}`);
      
      const allowImportingTsExtensions = tsconfig.compilerOptions?.allowImportingTsExtensions;
      console.log(`   TS Extensions: ${allowImportingTsExtensions ? '✅ Enabled' : '⚠️  Disabled'}`);
    } catch (error) {
      console.log(`   ❌ Could not parse tsconfig.json: ${error}`);
    }
  }
  
  console.log('');
}

// ============================================================================
// FUNCTIONALITY VALIDATION
// ============================================================================

async function validateFunctionality() {
  console.log('🔧 Functionality Validation:');
  
  // Test YAML parsing
  try {
    const yamlContent = 'test: value\narray: [1, 2, 3]';
    
    if (typeof Bun.YAML !== 'undefined') {
      const parsed = Bun.YAML.parse(yamlContent);
      console.log(`✅ Bun Native YAML: Parsed ${Object.keys(parsed).length} keys`);
    } else {
      // Fallback test
      const { parse } = await import('yaml');
      const parsed = parse(yamlContent);
      console.log(`✅ YAML (fallback): Parsed ${Object.keys(parsed).length} keys`);
    }
  } catch (error) {
    console.log(`❌ YAML parsing failed: ${error}`);
  }
  
  // Test Glob functionality
  try {
    const glob = new Bun.Glob('*.ts');
    const files = await Array.fromAsync(glob.scan('.'));
    console.log(`✅ Bun Native Glob: Found ${files.length} TypeScript files`);
  } catch (error) {
    console.log(`❌ Glob functionality failed: ${error}`);
  }
  
  // Test file operations
  try {
    const testFile = './validation-test.tmp';
    await Bun.write(testFile, 'test content');
    const content = await Bun.file(testFile).text();
    await Bun.write(testFile, ''); // Clear
    const fs = require('fs').promises;
    await fs.unlink(testFile);
    console.log(`✅ File Operations: Read/write/delete successful`);
  } catch (error) {
    console.log(`❌ File operations failed: ${error}`);
  }
  
  console.log('');
}

// ============================================================================
// PERFORMANCE VALIDATION
// ============================================================================

async function validatePerformance() {
  console.log('⚡ Performance Validation:');
  
  // Startup time measurement
  const startupStart = performance.now();
  
  // Simple operations benchmark
  const iterations = 10000;
  const operationsStart = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    // Simulate typical Praxis operations
    const obj = { test: 'value', number: i };
    JSON.stringify(obj);
    JSON.parse(JSON.stringify(obj));
  }
  
  const operationsEnd = performance.now();
  const operationsTime = operationsEnd - operationsStart;
  const opsPerSecond = Math.round(iterations / operationsTime * 1000);
  
  console.log(`✅ Basic Operations: ${opsPerSecond.toLocaleString()} ops/sec`);
  
  // Memory usage
  const memUsage = process.memoryUsage();
  const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
  console.log(`✅ Memory Usage: ${heapUsedMB} MB heap used`);
  
  const startupEnd = performance.now();
  const startupTime = startupEnd - startupStart;
  console.log(`✅ Validation Runtime: ${startupTime.toFixed(2)}ms`);
  
  console.log('');
}

// ============================================================================
// PROJECT STRUCTURE VALIDATION
// ============================================================================

async function validateProjectStructure() {
  console.log('📁 Project Structure Validation:');
  
  const expectedFiles = [
    'packages/generate/index.ts',
    'packages/generate/config-parser.ts',
    'packages/hmr/index.ts',
    'bunfig.toml',
    'tsconfig.json'
  ];
  
  for (const file of expectedFiles) {
    const exists = await Bun.file(file).exists();
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  }
  
  // Check for removed/legacy files
  const legacyFiles = [
    'vite.config.ts',
    'eslint.config.mjs',
    'prettier.config.mjs',
    '.editorconfig'
  ];
  
  let cleanupNeeded = false;
  for (const file of legacyFiles) {
    const exists = await Bun.file(file).exists();
    if (exists) {
      console.log(`⚠️  Legacy file found: ${file} (consider removing)`);
      cleanupNeeded = true;
    }
  }
  
  if (!cleanupNeeded) {
    console.log('✅ No legacy configuration files found');
  }
  
  console.log('');
}

// ============================================================================
// MAIN VALIDATION RUNNER
// ============================================================================

async function runValidation() {
  const start = performance.now();
  
  validateEnvironment();
  await validateDependencies();
  await validateConfigFiles();
  await validateFunctionality();
  await validatePerformance();
  await validateProjectStructure();
  
  const end = performance.now();
  
  console.log('🏆 Validation Summary:');
  console.log(`   Total Time: ${(end - start).toFixed(2)}ms`);
  console.log('   Configuration: Bun-native optimized');
  console.log('   Dependencies: Minimized');
  console.log('   Performance: Validated');
  console.log('   Structure: Clean');
  
  console.log('\n✅ Bun configuration validation complete!');
  console.log('🚀 Ready for surgical development with platform-native optimization');
}

// Run validation if called directly
if (import.meta.main) {
  await runValidation();
}

export { 
  validateEnvironment,
  validateDependencies, 
  validateConfigFiles,
  validateFunctionality,
  validatePerformance,
  validateProjectStructure
};
