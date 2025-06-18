# Praxis: Directory-First Design System Tool

## Quick Start Example

```bash
# 1. Initialize Praxis for your components directory
bun praxis.ts init src/components

# 2. Analyze your existing component structure  
bun run analyze
# 📊 Files scanned: 23, Components found: 18, Ready for migration: 15

# 3. Migrate TypeScript interfaces to Praxis format
bun run migrate  
# ✅ Button → praxis-generated/button.prax.ts
# ✅ Input → praxis-generated/input.prax.ts

# 4. Start live monitoring during development
bun run dev  # alias for 'bun run monitor'
# 👀 Watching for changes... (generates TypeScript + Storybook files)

# 5. Measure bundle impact
bun run measure
# 📊 Total: 23.7KB across 46 files (avg 0.52KB per file)
```

## Four Core Operations

### **analyze** - Understand your components
- Scans configured directory for TypeScript interfaces
- Identifies migratable components vs manual review needed
- Shows complexity breakdown and migration readiness

### **migrate** - Convert to Praxis format  
- Converts TypeScript interfaces to `.prax.ts` configs
- Generates TypeScript interfaces + Storybook stories
- Only processes components marked as "ready"

### **monitor** - Live development mode
- Watches for changes in `.prax.ts` files
- Auto-regenerates outputs when changes detected
- Perfect for development workflow

### **measure** - Bundle analysis
- Tracks generated file sizes and bundle impact
- Shows breakdown by file type (TypeScript, Stories, etc.)
- Identifies optimization opportunities

## Zero Configuration Required

Works with any project structure - just point it at your components directory!
