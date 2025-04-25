import { canvasStore } from '../state/canvasStore';

/**
 * Converts screen coordinates to canvas coordinates
 * This takes into account the current pan and zoom values
 */
export function screenToCanvas(screenX: number, screenY: number) {
  const { zoom, pan } = canvasStore.get();
  
  // Apply inverse transformation
  const canvasX = (screenX / zoom) - pan.x;
  const canvasY = (screenY / zoom) - pan.y;
  
  return { x: canvasX, y: canvasY };
}

/**
 * Converts canvas coordinates to screen coordinates
 * This takes into account the current pan and zoom values
 */
export function canvasToScreen(canvasX: number, canvasY: number) {
  const { zoom, pan } = canvasStore.get();
  
  // Apply transformation
  const screenX = (canvasX + pan.x) * zoom;
  const screenY = (canvasY + pan.y) * zoom;
  
  return { x: screenX, y: screenY };
}

/**
 * Converts a movement in screen coordinates to canvas coordinates
 */
export function screenDeltaToCanvas(deltaX: number, deltaY: number) {
  const { zoom } = canvasStore.get();
  
  // Scale the delta by the zoom level
  return {
    x: deltaX / zoom,
    y: deltaY / zoom
  };
}