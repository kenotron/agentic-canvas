# ADR 001: Direct Legend State Library Imports

## Status
Accepted

## Date
2025-04-25

## Context
Legend State is being used as the state management library for the agentic-canvas application. We need to decide whether to:
1. Import and re-export Legend State functions from a central module
2. Import Legend State functions directly in each file that needs them

## Decision
We will use direct imports from Legend State in all files without re-exporting the functions.

This means that:
- Components and modules will import directly from `@legendapp/state` and `@legendapp/state/react` 
- We will not create any centralized re-export files (e.g., no `src/state/index.ts` that re-exports Legend State functions)

Example:
```typescript
// Preferred approach - direct imports
import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';

// Not recommended - importing from a re-export file
import { observable, observer } from '../state';
```

## Consequences

### Advantages
- Clearer dependency graph - files explicitly show their dependency on Legend State
- Better tree-shaking - only the specific functions needed are imported
- Easier upgrades - changes to Legend State API can be applied directly at import sites
- Consistent with React's own import patterns
- Reduced indirection - easier to understand where functions come from

### Disadvantages
- Cannot centralize types or extensions to Legend State functions
- May need to update more files during major version upgrades
- Potential duplication in import statements across files

## Implementation
- Update all existing imports to use direct Legend State imports
- Ensure CLAUDE.md documents this pattern
- Apply ESLint rules to encourage direct imports