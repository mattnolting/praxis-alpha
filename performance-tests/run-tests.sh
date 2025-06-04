#!/bin/bash

# Performance Test Runner Script
# DELETE THIS DIRECTORY AFTER STRATEGY DECISION

echo "🔧 Running Praxis Cache Performance Tests..."
echo ""

# Check if we have Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js to run performance tests."
    exit 1
fi

# Check if we have TypeScript
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install npm to run performance tests."
    exit 1
fi

echo "📊 Starting performance comparison..."
echo "This will test three cache patterns and provide recommendations."
echo ""

# Run the performance tests from current directory
npx tsx run-performance-tests.ts

echo ""
echo "✅ Performance tests complete!"
echo "📋 Review the results above to choose the optimal cache pattern."
echo "🗑️  Remember to delete the entire 'performance-tests' directory after making your decision."
