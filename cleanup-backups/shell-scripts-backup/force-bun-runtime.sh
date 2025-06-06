#!/bin/bash

echo "🔧 FORCING BUN RUNTIME FOR VITE"
echo "==============================="

cd /Users/mnolting/Web/praxis-alpha

echo ""
echo "🔍 Step 1: Check Current Runtime Detection"
echo "========================================"

# Test runtime detection
node -e "console.log('Node.js - Bun available:', typeof Bun !== 'undefined')"
bun -e "console.log('Bun - Bun available:', typeof Bun !== 'undefined')"

echo ""
echo "⚡ Step 2: Force Bun Runtime for Vite"
echo "==================================="

# The issue is that Vite spawns its own Node.js processes
# We need to run Vite directly with Bun

echo "Current package.json script:"
grep "dev:vite" package.json

echo ""
echo "Testing direct Bun execution of Vite..."

# Check if we can run vite directly with bun
bun --version
bun vite --version

echo ""
echo "🚀 Step 3: Update Package Scripts for Pure Bun"
echo "=============================================="

# Update package.json to use bun directly
sed -i.backup 's/"dev:vite": "vite"/"dev:vite": "bun --bun vite"/' package.json

echo "Updated package.json script:"
grep "dev:vite" package.json

echo ""
echo "📝 Step 4: Alternative - Direct Bun Vite Execution"
echo "================================================="

cat > run-vite-with-bun.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Vite with pure Bun runtime..."
export BUN_RUNTIME=1
bun --bun vite
EOF

chmod +x run-vite-with-bun.sh

echo "Created run-vite-with-bun.sh script"

echo ""
echo "🎯 BUN RUNTIME FORCING COMPLETE"
echo "==============================="

echo ""
echo "🚀 NOW TRY THESE OPTIONS:"
echo "======================="
echo ""
echo "Option 1 (Updated script):"
echo "  bun run dev:vite"
echo ""
echo "Option 2 (Direct execution):"
echo "  ./run-vite-with-bun.sh"
echo ""
echo "Option 3 (Manual):"
echo "  bun --bun vite"
echo ""
echo "Should show: [praxis] Runtime: Bun"
echo "Instead of:  [praxis] Runtime: Node.js"