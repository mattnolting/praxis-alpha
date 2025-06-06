# Tests Directory

**Surgical test organization following zero pollution methodology**

## Test Files

### **Performance Benchmarks**
- `benchmark-bun-native.ts` - Bun vs external dependencies performance comparison
- `benchmark-enhanced.ts` - Phase 2.1 enhanced batch processing validation
- `benchmark-yaml.ts` - YAML parser performance evaluation (Bun native vs alternatives)

### **Functionality Validation**
- `validate-bun-config.ts` - Bun-native configuration validation  
- `validate-phase2.ts` - Phase 2 parallel implementation functionality test

### **Organization & Structure**
- `../test-organization.ts` - File organization and YAML parsing validation
- `../organize-generated-files.ts` - Migration script for clean file structure

## Commands

```bash
# Performance benchmarks
bun run benchmark              # Bun-native performance
bun run benchmark:enhanced     # Phase 2.1 enhanced batch processing
bun run benchmark:yaml         # YAML parser evaluation

# Validation tests  
bun run validate:config        # Bun configuration
bun run validate:phase2        # Phase 2 functionality
bun run test:organization      # File organization and YAML parsing

# Organization tools
bun run organize:files         # Fix existing file clutter
bun run validate:bun          # Complete Bun validation
bun run validate:performance  # All performance tests
```

## Organization

All test and validation files are centralized here following surgical development principles:
- ✅ **Zero pollution** - Tests separated from core implementation
- ✅ **Semantic naming** - Each file's purpose is immediately clear
- ✅ **Surgical precision** - Focused, single-responsibility test files
- ✅ **Easy discovery** - All tests in one location

*Tests support the main packages/ implementation without cluttering the root directory.*
