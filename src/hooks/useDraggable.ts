import { useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggableOptions {
  onDragStart?: (position: Position) => void;
  onDrag?: (position: Position, delta: Position) => void;
  onDragEnd?: (position: Position) => void;
  disabled?: boolean;
}

/**
 * A simple hook for making elements draggable
 */
export function useDraggable(options: DraggableOptions = {}) {
  const {
    onDragStart,
    onDrag,
    onDragEnd,
    disabled = false,
  } = options;

  // Track dragging state
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle left mouse button without ctrl key
    if (disabled || e.button !== 0 || e.ctrlKey) return;
    
    // Prevent default browser behavior like text selection
    e.preventDefault();
    // Don't let the event propagate to parent elements
    e.stopPropagation();
    
    const x = e.clientX;
    const y = e.clientY;
    
    // Initialize drag state
    isDragging.current = true;
    startPos.current = { x, y };
    lastPos.current = { x, y };
    
    // Notify drag start
    onDragStart?.({ x, y });
    
    // Event handlers need to be defined inline so they have access to current closure
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      // Calculate delta from last position
      const deltaX = currentX - lastPos.current.x;
      const deltaY = currentY - lastPos.current.y;
      
      // Notify drag
      onDrag?.({ x: currentX, y: currentY }, { x: deltaX, y: deltaY });
      
      // Update last position
      lastPos.current = { x: currentX, y: currentY };
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      // Calculate total distance moved
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      // Reset state
      isDragging.current = false;
      
      // Notify drag end
      onDragEnd?.({ x: deltaX, y: deltaY });
      
      // Clean up event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Attach global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onDragStart, onDrag, onDragEnd, disabled]);
  
  return { onMouseDown: handleMouseDown };
}