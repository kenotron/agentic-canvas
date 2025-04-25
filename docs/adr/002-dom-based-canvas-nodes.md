# ADR 002: DOM-Based Canvas Nodes

## Status
Accepted

## Date
2025-04-25

## Context
When designing an infinite canvas for interactive diagrams and visualizations, we need to decide on the rendering approach for canvas elements (nodes, connections, etc.). The main options are:

1. **Canvas/WebGL Rendering**: Drawing elements directly to a Canvas or WebGL context
2. **DOM-Based Rendering**: Using HTML/DOM elements with absolute positioning
3. **Hybrid Approach**: Using Canvas/WebGL for backgrounds and DOM for interactive elements

Each approach has different trade-offs in terms of performance, interactivity, and development complexity.

## Decision
We will use a **DOM-based approach** for rendering canvas nodes and other interactive elements. Specifically:

- Canvas nodes will be represented as regular DOM elements with absolute positioning
- The pan/zoom transformations will be applied via CSS transforms to a container element
- Dragging, selecting, and other interactions will use standard DOM events

## Consequences

### Advantages
- **Richer Interactions**: Can leverage full DOM event system, form elements, and browser features
- **Accessibility**: DOM elements can maintain standard accessibility features
- **Styling Flexibility**: Full CSS support for styling, transitions, and animations
- **Familiar Developer Experience**: Standard React component patterns and browser APIs
- **Text Handling**: Native text handling, editing, and internationalization support
- **Interactive Components**: Can embed fully interactive React components inside nodes

### Disadvantages
- **Performance Ceiling**: May hit performance limitations with thousands of elements
- **Memory Usage**: DOM nodes consume more memory than Canvas/WebGL primitives
- **Rendering Complexity**: Complex shapes and effects may be harder to implement
- **Limited Visual Effects**: Some visual effects are harder to achieve compared to Canvas/WebGL

### Implementation Details
- Element positions are stored in model coordinates (not screen coordinates)
- CSS transforms are used for the pan/zoom operations
- The main canvas container captures mouse/touch events for pan and zoom
- Individual node elements handle their own drag events
- A translation layer converts between screen and model coordinates based on current transform

## Alternatives Considered

### Canvas/WebGL Rendering
While this would provide better performance for thousands of nodes, it would require:
- Custom handling of all interactions
- Re-implementing many DOM features (text editing, hover states, etc.)
- More complex architecture for connecting React state to canvas elements

### Hybrid Approach
A hybrid approach could offer benefits of both worlds but would introduce significant complexity:
- Z-index management between layers
- Synchronization between DOM and Canvas elements
- More complex event handling

## Future Considerations
- If performance becomes an issue with very large numbers of nodes, we may implement:
  - Virtualization for nodes outside the viewport
  - Batched DOM updates for smoother interactions
  - Culling of elements outside the visible area
- For specialized visual effects, we could introduce Canvas/WebGL layers beneath the DOM elements