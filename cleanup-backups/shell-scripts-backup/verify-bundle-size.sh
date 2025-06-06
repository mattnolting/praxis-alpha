#!/bin/bash

echo "📊 BUNDLE SIZE VERIFICATION"
echo "============================="

cd /Users/mnolting/Web/praxis-alpha

# Create dist directory
mkdir -p dist scripts

# 1. Core bundle test
echo "📦 Testing core bundle size..."
bun build packages/generate/index.ts --target=node --minify --outfile=dist/praxis-core.js

if [ -f dist/praxis-core.js ]; then
    CORE_SIZE=$(du -h dist/praxis-core.js | cut -f1)
    CORE_SIZE_KB=$(du -k dist/praxis-core.js | cut -f1)
    echo "✅ Core bundle: $CORE_SIZE ($CORE_SIZE_KB KB)"
else
    echo "❌ Failed to build core bundle"
    exit 1
fi

# 2. Tree-shaking test
echo "🌳 Testing tree-shaking..."
cat > test-tree-shake.ts << 'EOF'
import { generateTypeScript } from './packages/generate/index.ts';
console.log(typeof generateTypeScript);
EOF

bun build test-tree-shake.ts --target=node --minify --outfile=dist/tree-shake-test.js

if [ -f dist/tree-shake-test.js ]; then
    TREE_SIZE=$(du -h dist/tree-shake-test.js | cut -f1)
    TREE_SIZE_KB=$(du -k dist/tree-shake-test.js | cut -f1)
    echo "✅ Tree-shaken import: $TREE_SIZE ($TREE_SIZE_KB KB)"
else
    echo "❌ Failed to build tree-shake test"
fi

# 3. Dependency audit
echo "📋 Dependency audit..."
echo "Runtime dependencies:"
bun pm ls --depth=0 | grep -v "devDependencies"

# 4. Bundle analysis with detailed breakdown
echo "🔍 Detailed bundle analysis..."
bun build packages/generate/index.ts --target=node --sourcemap --outfile=dist/praxis-analyzed.js

# 5. Size comparison with alternatives
cat << 'EOF'

📊 SIZE COMPARISON
==================
Praxis Core:           ~12KB  (target)
TypeScript Compiler:   60MB   (2000x larger)
Zod:                   57KB   (4.7x larger) 
Joi:                   145KB  (12x larger)
Ajv:                   120KB  (10x larger)

🎯 TARGET METRICS
=================
Core bundle:           <15KB  (robust with validation)
Tree-shaken import:    <8KB   (minimal functionality)
Platform generators:   +3-5KB each (separate packages)
Build plugins:         +2-4KB each (development tools)

EOF

# 6. Performance benchmark
echo "⚡ Performance benchmark..."
time bun packages/generate/index.ts single TestButton.praxis.yaml > /dev/null 2>&1

# 7. Bundle size limits check
MAX_CORE_SIZE=15  # 15KB limit

if [ $CORE_SIZE_KB -gt $MAX_CORE_SIZE ]; then
    echo "❌ BUNDLE SIZE EXCEEDED: ${CORE_SIZE_KB}KB > ${MAX_CORE_SIZE}KB"
    echo "   Core bundle is too large. Consider:"
    echo "   • Moving optional features to separate packages"
    echo "   • Optimizing imports and dependencies"
    echo "   • Using dynamic imports for rarely-used features"
    exit 1
else
    echo "✅ BUNDLE SIZE WITHIN LIMITS: ${CORE_SIZE_KB}KB <= ${MAX_CORE_SIZE}KB"
fi

# 8. Create bundle monitoring script
cat > scripts/bundle-monitor.sh << 'EOF'
#!/bin/bash
# Bundle size monitoring for CI/CD

set -e

CURRENT_SIZE=$(bun build packages/generate/index.ts --target=node --minify | wc -c)
MAX_SIZE=15360  # 15KB in bytes

echo "📦 Bundle size: ${CURRENT_SIZE} bytes"

if [ $CURRENT_SIZE -gt $MAX_SIZE ]; then
    echo "❌ Bundle size exceeded: ${CURRENT_SIZE} > ${MAX_SIZE} bytes"
    echo "🎯 Maximum allowed: 15KB (${MAX_SIZE} bytes)"
    exit 1
fi

echo "✅ Bundle size within limits: ${CURRENT_SIZE} <= ${MAX_SIZE} bytes"
EOF

chmod +x scripts/bundle-monitor.sh

# Cleanup test files
rm -f test-tree-shake.ts

echo ""
echo "🎉 Bundle size verification complete!"
echo "📊 Run './scripts/bundle-monitor.sh' to check size limits"
echo "🔍 Check dist/ folder for built bundles"
