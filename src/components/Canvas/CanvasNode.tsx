import { CSSProperties, memo, useRef, useState, useEffect } from 'react';
import { CanvasNodeProps } from '../../types/canvas';
import { observer } from '@legendapp/state/react';
import { canvasStore } from '../../state/canvasStore';

const CanvasNode = observer(({ 
  element, 
  style, 
  onPositionChange,
  selected = false,
  onClick
}: CanvasNodeProps) => {
  const { id, position, data, type } = element;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Track mouse positions
  const startPosRef = useRef({ x: 0, y: 0 });
  const nodePosRef = useRef({ ...position });
  
  // Handle direct drag implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only handle left mouse button without modifiers
    if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey) return;
    
    // Prevent text selection and event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Store starting positions
    startPosRef.current = { x: e.clientX, y: e.clientY };
    nodePosRef.current = { ...position };
    setIsDragging(true);
    
    // Set up temporary event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const zoom = canvasStore.zoom.get();
      const dx = (e.clientX - startPosRef.current.x) / zoom;
      const dy = (e.clientY - startPosRef.current.y) / zoom;
      
      if (onPositionChange) {
        onPositionChange(id, {
          x: nodePosRef.current.x + dx,
          y: nodePosRef.current.y + dy
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add temporary event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if (onClick) onClick(id, e);
  };
  
  const nodeStyle: CSSProperties = {
    position: 'absolute',
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    boxSizing: 'border-box',
    border: selected ? '2px solid #3498db' : '1px solid #ddd',
    borderRadius: '4px',
    padding: '8px',
    background: 'white',
    boxShadow: selected ? '0 0 10px rgba(52, 152, 219, 0.5)' : '0 1px 4px rgba(0,0,0,0.1)',
    minWidth: '100px',
    minHeight: '60px',
    zIndex: selected ? 10 : 1,
    ...style,
    ...element.style,
  };
  
  return (
    <div
      ref={nodeRef}
      className={`canvas-node ${isDragging ? 'dragging' : ''}`}
      data-id={id}
      data-type={type}
      style={nodeStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="canvas-node-content">
        {data?.label || `Node ${id}`}
      </div>
    </div>
  );
});

export default memo(CanvasNode);