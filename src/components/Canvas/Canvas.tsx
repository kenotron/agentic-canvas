import { useState, useCallback, MouseEvent, CSSProperties, useRef, useEffect } from 'react';
import { observer } from '@legendapp/state/react';
import { canvasStore, canvasActions } from '../../state/canvasStore';
import { usePanZoom } from '../../hooks/usePanZoom';
import CanvasNode from './CanvasNode';
import { CanvasElement, CanvasProps } from '../../types/canvas';
import { screenDeltaToCanvas, screenToCanvas } from '../../utils/canvasCoordinates';
import './Canvas.css';

const Canvas = observer(({
  elements = [],
  onElementsChange,
  renderElement,
  style,
  className = '',
  backgroundPattern = true,
  gridSize = 20,
  snapToGrid = false,
  minZoom = 0.1,
  maxZoom = 5,
  defaultPosition = { x: 0, y: 0 },
  defaultZoom = 1,
  onSelectionChange,
}: CanvasProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Initialize canvas with default values
  useEffect(() => {
    canvasActions.setZoom(defaultZoom);
    canvasActions.setPan(defaultPosition.x, defaultPosition.y);
  }, [defaultPosition.x, defaultPosition.y, defaultZoom]);

  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = usePanZoom({
    minZoom,
    maxZoom,
  });

  const zoom = canvasStore.zoom.get();
  const pan = canvasStore.pan.get();

  const handleCanvasClick = (e: MouseEvent) => {
    // Only handle direct canvas clicks
    if ((e.target as HTMLElement).classList.contains('canvas-inner')) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    }
  };

  const handleNodePositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    if (!onElementsChange) return;

    let newPosition = { ...position };
    
    // Apply snap to grid
    if (snapToGrid) {
      newPosition = {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize,
      };
    }
    
    const updatedElements = elements.map(el => 
      el.id === id ? { ...el, position: newPosition } : el
    );
    
    onElementsChange(updatedElements);
  }, [elements, onElementsChange, snapToGrid, gridSize]);

  const handleNodeClick = useCallback((id: string, e: MouseEvent) => {
    e.stopPropagation();
    
    // Toggle selection when holding shift
    if (e.shiftKey) {
      const newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id];
      
      setSelectedIds(newSelectedIds);
      onSelectionChange?.(newSelectedIds);
    } else {
      // Single selection
      setSelectedIds([id]);
      onSelectionChange?.([id]);
    }
  }, [selectedIds, onSelectionChange]);

  const canvasStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: backgroundPattern ? 'var(--canvas-background-pattern)' : '#f8f9fa',
    ...style,
  };

  const transformStyle: CSSProperties = {
    transform: `translate(${pan.x * zoom}px, ${pan.y * zoom}px) scale(${zoom})`,
    transformOrigin: '0 0',
    width: '100%',
    height: '100%',
    position: 'absolute',
  };

  const renderDefaultNode = (props: any) => <CanvasNode {...props} />;

  return (
    <div
      ref={canvasRef}
      className={`canvas-wrapper ${className}`}
      style={canvasStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onClick={handleCanvasClick}
    >
      {/* Canvas transformation layer */}
      <div className="canvas-inner" style={transformStyle}>
        {/* Grid pattern is applied via CSS */}
        
        {/* Render all elements */}
        {elements.map(element => {
          const nodeProps = {
            key: element.id,
            element,
            selected: selectedIds.includes(element.id),
            onPositionChange: handleNodePositionChange,
            onClick: handleNodeClick,
          };
          
          return renderElement 
            ? renderElement(nodeProps)
            : renderDefaultNode(nodeProps);
        })}
      </div>
      
      {/* Controls overlay (optional) - would be implemented separately */}
    </div>
  );
});

export default Canvas;