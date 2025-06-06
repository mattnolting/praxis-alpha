#!/bin/bash

echo "🌳 TREE-SHAKING VERIFICATION"
echo "=============================="

cd /Users/mnolting/Web/praxis-alpha

# Test 1: Basic import resolution
echo "📦 Test 1: Basic import resolution"
cat > test-import-basic.ts << 'EOF'
import { generateTypeScript } from './packages/generate/index.ts';

// Actually use the function so it's not eliminated as dead code
console.log('Function loaded:', typeof generateTypeScript);

// Test with a dummy call (won't execute but shows bundler the function is used)
if (false) {
  generateTypeScript('dummy.yaml');
}
EOF

bun build test-import-basic.ts --target=node --minify --outfile=dist/tree-shake-basic.js
BASIC_SIZE=$(du -h dist/tree-shake-basic.js | cut -f1)
echo "✅ Basic import bundle: $BASIC_SIZE"

# Test 2: Direct function import
echo ""
echo "📦 Test 2: Direct function import"
cat > test-import-direct.ts << 'EOF'
// Direct import path
import { generateTypeScript, generateSchema } from './packages/generate/index.ts';

const functions = { generateTypeScript, generateSchema };
console.log('Loaded functions:', Object.keys(functions));
EOF

bun build test-import-direct.ts --target=node --minify --outfile=dist/tree-shake-direct.js
DIRECT_SIZE=$(du -h dist/tree-shake-direct.js | cut -f1)
echo "✅ Direct import bundle: $DIRECT_SIZE"

# Test 3: Full bundle import
echo ""
echo "📦 Test 3: Full bundle import"  
cat > test-import-full.ts << 'EOF'
import praxis from './packages/generate/index.ts';

console.log('Praxis module:', typeof praxis);
console.log('Available methods:', Object.keys(praxis));
EOF

bun build test-import-full.ts --target=node --minify --outfile=dist/tree-shake-full.js
FULL_SIZE=$(du -h dist/tree-shake-full.js | cut -f1)
echo "✅ Full import bundle: $FULL_SIZE"

# Test 4: ES Module export check
echo ""
echo "📦 Test 4: Export verification"
cat > test-exports.ts << 'EOF'
// Check what's actually exported
import * as praxis from './packages/generate/index.ts';

console.log('All exports:', Object.keys(praxis));
console.log('generateTypeScript:', typeof praxis.generateTypeScript);
console.log('generateSchema:', typeof praxis.generateSchema);
console.log('default export:', typeof praxis.default);
EOF

bun build test-exports.ts --target=node --minify --outfile=dist/tree-shake-exports.js
EXPORTS_SIZE=$(du -h dist/tree-shake-exports.js | cut -f1)
echo "✅ Exports verification bundle: $EXPORTS_SIZE"

# Analysis
echo ""
echo "📊 TREE-SHAKING ANALYSIS"
echo "========================"
echo "Basic import:      $BASIC_SIZE"
echo "Direct import:     $DIRECT_SIZE"  
echo "Full import:       $FULL_SIZE"
echo "Export check:      $EXPORTS_SIZE"

# Compare with core bundle
CORE_SIZE=$(du -h dist/praxis-core.js | cut -f1)
echo "Core bundle:       $CORE_SIZE"

echo ""
echo "🔍 BUNDLE ANALYSIS"
echo "=================="

# Show what's in the tree-shaken bundles
echo "Basic import content (first 200 chars):"
head -c 200 dist/tree-shake-basic.js && echo "..."

echo ""
echo "✅ Tree-shaking test complete"
echo "📁 Check dist/ folder for detailed bundle analysis"

# Cleanup test files
rm -f test-import-*.ts test-exports.ts
