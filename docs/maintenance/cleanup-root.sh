#!/bin/bash

echo "🧹 Cleaning up root directory pollution..."

# Remove leftover linting files
rm -f .editorconfig
rm -f .prettierignore  
rm -f eslint.config.mjs
rm -f prettier.config.mjs
rm -rf .vscode

echo "✅ Root directory cleaned!"
echo "📁 Remaining files should be core project files only"

# Show what's left
echo ""
echo "📋 Current root directory:"
ls -la | grep -v node_modules | grep -v .yarn | grep -v dist
