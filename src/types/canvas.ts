export interface CanvasElement {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data?: Record<string, any>;
  style?: React.CSSProperties;
}

export interface CanvasNodeProps {
  element: CanvasElement;
  style?: React.CSSProperties;
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  selected?: boolean;
  onClick?: (id: string, e: React.MouseEvent) => void;
}

export interface CanvasProps {
  elements: CanvasElement[];
  onElementsChange?: (elements: CanvasElement[]) => void;
  renderElement?: (props: CanvasNodeProps) => React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  backgroundPattern?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  minZoom?: number;
  maxZoom?: number;
  defaultPosition?: { x: number; y: number };
  defaultZoom?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
}