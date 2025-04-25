import { useRef, useCallback, MouseEvent, WheelEvent } from 'react';
import { canvasStore, canvasActions } from '../state/canvasStore';
import { screenToCanvas } from '../utils/canvasCoordinates';

interface PanZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomSensitivity?: number;
  preventScroll?: boolean;
}

export function usePanZoom(options: PanZoomOptions = {}) {
  const {
    minZoom = 0.1,
    maxZoom = 5,
    zoomSensitivity = 0.001,
    preventScroll = true,
  } = options;

  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: MouseEvent) => {
    // Only start panning with middle mouse button (wheel) or when holding ctrl
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      isDragging.current = true;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    
    // Update pan directly in screen coordinates
    const currentPan = canvasStore.pan.get();
    canvasActions.setPan(
      currentPan.x + dx / canvasStore.zoom.get(),
      currentPan.y + dy / canvasStore.zoom.get()
    );
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    if (preventScroll) {
      e.preventDefault();
    }

    const { deltaY } = e;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = direction * zoomSensitivity * Math.abs(deltaY);
    
    const currentZoom = canvasStore.zoom.get();
    const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom * (1 + factor)));
    
    // Get mouse position relative to the viewport
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert mouse position to canvas coordinates before zoom
    const mouseCanvasPos = screenToCanvas(mouseX, mouseY);
    
    // Update zoom
    canvasActions.setZoom(newZoom);
    
    // Calculate the new pan position to zoom toward mouse
    // This ensures the point under the mouse stays fixed during zoom
    const currentPan = canvasStore.pan.get();
    const newPan = {
      x: mouseCanvasPos.x - (mouseX / newZoom),
      y: mouseCanvasPos.y - (mouseY / newZoom)
    };
    
    canvasActions.setPan(newPan.x, newPan.y);
  }, [minZoom, maxZoom, zoomSensitivity, preventScroll]);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    isDragging: isDragging.current,
  };
}