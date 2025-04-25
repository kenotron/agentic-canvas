import { useState, useCallback } from 'react';
import Canvas from './components/Canvas';
import { CanvasElement } from './types/canvas';
import { observer } from '@legendapp/state/react';
import { canvasStore, canvasActions } from './state/canvasStore';
import './App.css';

// Initial elements
const initialElements: CanvasElement[] = [
  {
    id: '1',
    type: 'node',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1' },
    style: { background: '#f5f5ff' }
  },
  {
    id: '2',
    type: 'node',
    position: { x: 300, y: 200 },
    data: { label: 'Node 2' },
    style: { background: '#ffebf5' }
  },
  {
    id: '3',
    type: 'node',
    position: { x: 150, y: 300 },
    data: { label: 'Node 3' },
    style: { background: '#f5fff5' }
  },
];

const App = observer(function App() {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  
  const handleElementsChange = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
  }, []);
  
  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedElements(ids);
  }, []);
  
  const addNewNode = () => {
    const id = `node-${elements.length + 1}`;
    const newNode: CanvasElement = {
      id,
      type: 'node',
      position: { x: 200, y: 200 },
      data: { label: `New Node ${elements.length + 1}` }
    };
    
    setElements([...elements, newNode]);
  };
  
  const resetView = () => {
    canvasActions.reset();
  };
  
  const zoom = canvasStore.zoom.get();
  const tool = canvasStore.tool.get();
  
  return (
    <div className="app">
      <div className="app-header">
        <h1>Agentic Canvas</h1>
        <div className="toolbar">
          <div className="tool-group">
            <button 
              className={`tool-button ${tool === 'pen' ? 'active' : ''}`}
              onClick={() => canvasActions.setTool('pen')}
            >
              Pen
            </button>
            <button 
              className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
              onClick={() => canvasActions.setTool('eraser')}
            >
              Eraser
            </button>
          </div>
          <div className="tool-group">
            <button className="tool-button" onClick={addNewNode}>
              Add Node
            </button>
            <button className="tool-button" onClick={resetView}>
              Reset View
            </button>
          </div>
          <div className="zoom-info">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      
      <div className="canvas-container">
        <Canvas
          elements={elements}
          onElementsChange={handleElementsChange}
          onSelectionChange={handleSelectionChange}
          backgroundPattern={true}
          snapToGrid={true}
        />
      </div>
      
      {selectedElements.length > 0 && (
        <div className="selection-info">
          Selected: {selectedElements.join(', ')}
        </div>
      )}
    </div>
  );
});

export default App;