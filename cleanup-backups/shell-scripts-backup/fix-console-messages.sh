#!/bin/bash

echo "🔧 FINAL TOUCH: Fix Console Messages"
echo "===================================="

cd /Users/mnolting/Web/praxis-alpha

# The user updated the imports but we need to fix the console messages
# that still say "excellent" instead of "native"

echo "Updating console messages to reflect native file watching..."

# Update the main index.ts to show correct messaging
sed -i.bak 's/Starting excellent file watcher/Starting native file watcher/g' packages/generate/index.ts
sed -i 's/Using excellent event-driven file watching/Using native event-driven file watching/g' packages/generate/index.ts
sed -i 's/Excellent file watcher active/Native file watcher active/g' packages/generate/index.ts
sed -i 's/Excellent file watching active/Native file watching active/g' packages/generate/index.ts
sed -i 's/Cleaning up excellent watcher/Cleaning up native watcher/g' packages/generate/index.ts

echo "✅ Console messages updated"

echo ""
echo "🧪 Test the final implementation:"
echo "================================="
echo "bun packages/generate/index.ts watch"
echo ""
echo "Should now show:"
echo "👀 Starting native file watcher..."
echo "🚀 Native file watcher active..."
echo "⚡ True event-driven updates"
