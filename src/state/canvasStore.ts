import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';

// Define the shape of your canvas state
export interface CanvasState {
  tool: 'pen' | 'eraser';
  zoom: number;
  pan: { x: number; y: number };
  // You can add layers, color, strokeWidth, etc.
}

// Create a Legend State store for the canvas using v3 beta API
export const canvasStore = observable<CanvasState>({
  tool: 'pen',
  zoom: 1,
  pan: { x: 0, y: 0 },
});

// Export observer for component wrapping
export { observer };

// Create derived state (computed values)
export const isZoomedIn = observable(() => canvasStore.zoom.get() > 1.5);

// Helper functions to update state
export const canvasActions = {
  setTool: (tool: CanvasState['tool']) => canvasStore.tool.set(tool),
  setZoom: (zoom: number) => canvasStore.zoom.set(zoom),
  setPan: (x: number, y: number) => canvasStore.pan.set({ x, y }),
  updatePan: (dx: number, dy: number) => {
    const currentPan = canvasStore.pan.get();
    canvasStore.pan.set({ 
      x: currentPan.x + dx, 
      y: currentPan.y + dy 
    });
  },
  reset: () => {
    canvasStore.set({
      tool: 'pen',
      zoom: 1,
      pan: { x: 0, y: 0 }
    });
  }
};

// Example usage in components:
// 1. Access store directly:
//    const tool = canvasStore.tool.get();
//    canvasActions.setTool('eraser');
//
// 2. Use in observer components:
//    const ToolDisplay = observer(function ToolDisplay() {
//      // Automatically re-renders when canvasStore.tool changes
//      const tool = canvasStore.tool.get(); 
//      return <div>Current tool: {tool}</div>;
//    });
//
// 3. For selection with destructuring:
//    const CanvasControls = observer(function CanvasControls() {
//      const { tool, zoom } = canvasStore.get();
//      return (
//        <div>
//          <div>Tool: {tool}</div>
//          <div>Zoom: {zoom.toFixed(1)}x</div>
//        </div>
//      );
//    });