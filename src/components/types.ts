export interface Shape {
  id: string;
  type: 'square' | 'circle' | 'triangle' | 'diamond' | 'pentagon' | 'star' | 'hexagon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

export interface DrawingState {
  shapes: Shape[];
}

export interface ShapeCount {
  square: number;
  circle: number;
  triangle: number;
  diamond: number;
  pentagon: number;
  star: number;
  hexagon: number;
} 