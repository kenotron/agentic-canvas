import { createStore } from 'legend-state';

// Define the shape of your canvas state
export interface CanvasState {
  tool: 'pen' | 'eraser';
  zoom: number;
  pan: { x: number; y: number };
  // You can add layers, color, strokeWidth, etc.
}

// Create a Legend State store for the canvas
// The API may vary; adjust accordingly to the v3 beta docs
export const useCanvasStore = createStore<CanvasState>((set) => ({
  tool: 'pen',
  zoom: 1,
  pan: { x: 0, y: 0 },
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
}));

// Usage in components:
// const tool = useCanvasStore((state) => state.tool);
// const setTool = useCanvasStore((state) => state.setTool);
