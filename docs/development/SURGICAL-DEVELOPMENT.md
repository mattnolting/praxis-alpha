# Surgical Development Methodology

## Overview

**"Surgical precision over rapid iteration"** - A methodical approach to software development that prioritizes understanding, performance, and maintainability over speed of delivery. Every component is designed, reviewed, and validated before moving to the next piece.

## Core Philosophy

### Principles
- **Surgical precision**: Review each component before creating the next
- **Performance first**: Every decision optimized for speed, stability, and bundle size
- **Zero pollution**: Clean, methodical structure with immediate cleanup
- **Functional programming**: Pure, composable, extensible functions
- **Knowledge-driven**: Document and understand each step
- **No guessing**: Only what we need, until we need more
- **Real-world over academic**: Practical solutions that solve actual problems vs. theoretical completeness

### Development Priorities (Non-negotiable)
1. **Semantic naming** - Every name describes exact purpose
2. **Performance** - Cached, parallel, optimized operations
3. **Stability** - Robust, predictable behavior
4. **Bundle size** - Minimal footprint
5. **Functional programming** - Pure, composable functions
6. **Extensibility** - All reusable functions are extensible

## The Process

### 1. Design → Review → Implement → Test → Validate

**Design**: Propose a specific component/function with clear constraints and multiple options when appropriate.

**Review**: Discuss pros/cons, implications, and alternatives together. Ensure mutual understanding before proceeding.

**Implement**: Build only what was agreed upon, nothing extra. Follow established patterns and naming conventions.

**Test**: Validate performance, functionality, and integration. Create temporary performance tests when needed.

**Validate**: Confirm component meets requirements and integrates properly before moving to next piece.

### 2. Single Responsibility Cycles

- Focus on **ONE** function, component, or decision at a time
- Complete each piece fully before starting the next
- No parallel development of unrelated components
- Each cycle produces a working, tested, documented piece

### 3. Knowledge-Driven Development

- Document decisions as they're made
- Update shared documentation after each cycle
- Capture the "why" behind technical choices
- Build a knowledge base that guides future decisions
- Maintain clear development history and rationale

## Tactical Approaches

### When Making Architectural Decisions

1. **Identify the constraint** (performance, clarity, maintainability)
2. **Design 2-3 options** that address the constraint differently
3. **Create performance tests** if performance is critical
4. **Choose based on data**, not intuition
5. **Lock in the decision** and document rationale
6. **Move forward** without second-guessing

### When Building Components

1. **Start with the interface** - how will it be used?
2. **Design the minimal viable version** that solves the specific problem
3. **Review the approach** before any implementation
4. **Build incrementally** with testing at each step
5. **Validate integration** with existing components
6. **Document the component's purpose and usage**

### When Managing Complexity

1. **Separate concerns surgically** - one responsibility per function
2. **Leverage existing patterns** - file system structure, naming conventions
3. **Cache strategically** - reuse expensive operations through cached functions
4. **Keep APIs simple** - hide complex logic behind clean interfaces
5. **Use two-condition patterns** for optimal performance

### Performance-First Development

- **Test performance implications** before committing to patterns
- **Create dedicated performance test directories** (delete after decisions)
- **Let data guide architectural decisions**
- **Optimize for speed, memory, and bundle size from the start**
- **Use cached, reusable functions** to eliminate processing overhead

## Philosophy: Real-World Over Academic

### **Academic Approach**
- Solve theoretical problems with maximum configurability
- Feature completeness for edge cases
- "Best practices" regardless of context
- Complex abstractions for flexibility
- Plugin architectures for everything

### **Surgical Approach** 
- Solve actual problems with lean, focused tools
- Real-world experience drives decisions
- Context-specific solutions
- Simple, direct implementations
- Platform-native leveraging

### **Example: Linting Tools**
**Academic**: ESLint with 200+ rules, plugin ecosystem, configuration files
**Surgical**: praxis-linter with 5 focused rules, TypeScript-native, zero config

**The Insight**: "Big backpack full of bricks when you need a lean auto-correct"

### **When to Depart from Academic Advice**
- Academic solution creates more problems than it solves
- Theoretical completeness conflicts with practical performance
- "Best practices" don't fit your specific context
- Tool complexity exceeds problem complexity
- Real-world experience contradicts academic theory

**Result**: Exceptional performance through practical focus rather than theoretical adherence.

## File Organization & Cleanup

### Zero Pollution Strategy

- **All temporary files** go in dedicated directories
- **Delete test/temporary directories** immediately after decisions
- **Keep core codebase** clean and focused
- **No cruft, no leftover files**, no guessing what's important

### Directory Structure Rules

- **Semantic directory names** that describe their purpose
- **Consistent file naming** across the project
- **Temporary directories** clearly marked for deletion
- **Core system files** separated from experiments/tests

## Quality Gates

### Before Moving to Next Component
- [ ] Current component is fully functional
- [ ] Performance is validated (if relevant)
- [ ] Documentation is updated
- [ ] Temporary files are cleaned up
- [ ] Integration points are clear
- [ ] Both developers understand the implementation
- [ ] Component follows established patterns

### Before Major Decisions
- [ ] Multiple options have been considered
- [ ] Performance implications are understood
- [ ] The decision aligns with core principles
- [ ] The choice can be explained clearly
- [ ] Future extensibility is preserved
- [ ] Decision is documented with rationale

### Before Implementation
- [ ] Interface design is agreed upon
- [ ] Component responsibility is clearly defined
- [ ] Integration approach is determined
- [ ] Naming follows semantic conventions
- [ ] Performance requirements are understood

## Anti-Patterns to Avoid

❌ **Building multiple components simultaneously**
❌ **Making assumptions without validation** 
❌ **Leaving temporary/test files in the codebase**
❌ **Moving forward without mutual understanding**
❌ **Optimizing prematurely without measuring**
❌ **Adding features "just in case"**
❌ **Copying patterns without understanding why**
❌ **Rushing through design phase**
❌ **Skipping performance validation**
❌ **Creating unclear or ambiguous naming**
❌ **Following academic advice over real-world needs**
❌ **Choosing theoretical completeness over practical solutions**

## Success Indicators

✅ **Clean, understandable codebase at every step**
✅ **Performance characteristics are known and intentional**
✅ **Each function has a single, clear responsibility** 
✅ **Developer experience is prioritized**
✅ **Technical debt is minimized through careful design**
✅ **Both developers can explain any component's purpose and implementation**
✅ **Consistent patterns and conventions throughout**
✅ **Extensible architecture that supports future growth**
✅ **Documentation that accurately reflects current state**

## Implementation Guidelines

### Function Design Patterns

**Semantic Cache Functions**:
```typescript
// Pattern: Two clear conditions with cached functions
function resolve(target: string) {
  if (cache.isReady(target)) return cache.value(target);
  if (cache.canResolve(target)) return cache.compute(target);
  return null;
}
```

**Reusable Building Blocks**:
```typescript
// Functions that eliminate parsing overhead
const cache = createSmartCache(dataMap);
// Use everywhere in codebase - same pattern, zero parsing
```

**Single Responsibility**:
```typescript
// ONE function, ONE purpose
function data(target: string): ConfigData | string | array | object {
  // Single responsibility: get data for target
  return configMap.resolve(target);
}
```

### Documentation Patterns

- **Decision documentation**: Capture why choices were made
- **Progress tracking**: Update shared documentation after each cycle
- **Usage examples**: Show how components integrate
- **Performance notes**: Document measured characteristics

## Workflow Commands

### `/start` - Begin Development Session
- Read all documentation fully
- Understand current project state
- Review previous decisions and rationale

### `/update` - Sanitize and Update Documentation
- Update project documentation with current progress
- Capture recent decisions and implementations
- Maintain accurate development history

### Development Cycle Commands
- **Design**: Propose next component with options
- **Review**: Discuss approach and alternatives
- **Implement**: Build agreed-upon component
- **Test**: Validate functionality and performance
- **Validate**: Confirm integration and requirements
- **Document**: Update knowledge base and move forward

---

**Result**: Stable, performant, maintainable code built through methodical decision-making rather than rapid iteration and refactoring. A development process that scales with complexity while maintaining clarity and performance.
