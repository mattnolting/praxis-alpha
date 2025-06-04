# Root Directory Organization Plan

## 🧹 Current Pollution (Remove These)
- `.editorconfig` ❌ (Linting pollution)
- `.prettierignore` ❌ (Linting pollution)  
- `eslint.config.mjs` ❌ (Linting pollution)
- `prettier.config.mjs` ❌ (Linting pollution)
- `.vscode/` ❌ (IDE pollution)

## ✅ Core Files (Keep These)
```
praxis-clean/
├── 📄 package.json              # Project definition
├── 📄 tsconfig.json             # TypeScript config
├── 📄 tsup.config.ts            # Build config
├── 📄 yarn.lock                 # Dependencies
├── 📄 .gitignore                # Git config
├── 📄 praxis.config.yaml        # Sample praxis config

# Documentation
├── 📄 README.md                 # Project overview
├── 📄 CHAT_LOG.md               # Development history
├── 📄 DIRECTORY.md              # Project structure
├── 📄 SURGICAL-DEVELOPMENT.md   # Methodology
├── 📄 MILESTONE-ACHIEVED.md     # Achievements
├── 📄 CLEANUP-NOTES.md          # Legacy cleanup notes

# Source Code  
├── 📁 praxis/                   # Core system
├── 📁 examples/                 # Usage examples
├── 📁 performance-tests/        # Temporary (delete after decisions)

# Build & Dependencies (Generated)
├── 📁 dist/                     # Build output
├── 📁 node_modules/            # Dependencies
├── 📁 .yarn/                    # Yarn config
├── 📄 .pnp.cjs                 # Yarn PnP
├── 📄 .pnp.loader.mjs          # Yarn PnP
```

## 🎯 After Cleanup (Ideal State)
**18 total files/directories** (currently ~22 with pollution)

**Root should contain only:**
- Core project files (package.json, configs)
- Documentation (MD files)
- Source code (praxis/, examples/)
- Generated/dependencies (dist/, node_modules/, .yarn/)

## 🚀 Cleanup Command
```bash
chmod +x cleanup-root.sh
./cleanup-root.sh
```

**Result**: Clean, organized root with zero pollution ✨
