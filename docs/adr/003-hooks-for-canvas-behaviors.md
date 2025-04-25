# ADR 003: Custom Hooks for Canvas Behaviors

## Status
Accepted

## Date
2025-04-25

## Context
The infinite canvas application requires complex user interaction patterns including panning, zooming, and dragging elements. These behaviors need to be:
1. Reusable across different components
2. Testable in isolation
3. Maintainable and extensible
4. Compatible with our React component architecture

We need to decide how to structure these interaction behaviors in a way that aligns with React best practices.

## Decision
We will implement canvas behaviors as custom React hooks:

- **usePanZoom**: Manages canvas pan and zoom operations including wheel events and drag to pan
- **useDraggable**: Provides drag capabilities for canvas elements with position updates

Each hook will:
- Accept configuration options to customize behavior
- Return event handlers to attach to DOM elements
- Integrate with our Legend State stores for state updates
- Handle coordinate transformations between screen and canvas coordinate systems

## Consequences

### Advantages
- **Separation of Concerns**: Interaction logic separated from rendering logic
- **Reusability**: Behaviors can be applied to different components
- **Composability**: Hooks can be combined to create more complex behaviors
- **Testability**: Hooks can be tested in isolation
- **Progressive Enhancement**: New features can be added by creating new hooks
- **Consistency**: Standard pattern for all interaction behaviors

### Disadvantages
- **Learning Curve**: Requires understanding React's hooks model and closures
- **Debugging Complexity**: Hook interactions can sometimes be harder to debug
- **Reference Management**: Requires careful management of dependencies and refs
- **Event Coordination**: Multiple hooks may need to coordinate event handling

### Implementation Details
- Hooks will use React's `useCallback` and `useRef` to maintain stable references
- DOM event handlers will be optimized to avoid unnecessary renders
- Coordinate transformations will account for current zoom level and pan position
- Hooks will maintain internal state for interaction tracking (e.g., is dragging)
- External state updates will be batched when possible for performance

## Alternatives Considered

### Higher-Order Components (HOCs)
HOCs would wrap components with interaction behaviors but:
- Would increase component nesting depth
- Make prop drilling more complex
- Lead to naming collisions and harder composition

### Render Props
Render props would allow injecting behavior through children functions but:
- Create more complex component trees
- Introduce potential performance issues
- May lead to "callback hell" with multiple behaviors

### Class Mixins
Not supported in modern React and would not align with React's composition model.

## Future Considerations
- We may develop more specialized hooks for specific interaction patterns:
  - useMultiSelect for rubber-band selection
  - useSnapping for grid or object snapping
  - useGesture for multi-touch gestures
- If performance becomes an issue, we may optimize hooks with techniques like:
  - Debounced/throttled event handlers
  - Web Workers for complex calculations
  - Passive event listeners for scroll performance