import React from 'react';
import styled from 'styled-components';
import type { Shape as ShapeType } from './types';
import Shape from './Shape';

const SelectorContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  &.dark {
    background-color: #333;
  }
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem;
`;

const ShapeWrapper = styled.div`
  width: 90px;
  height: 90px;
  position: relative;
`;

const defaultShapes: Omit<ShapeType, 'id' | 'x' | 'y'>[] = [
  {
    type: 'square',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#ff0000',
  },
  {
    type: 'circle',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#00ff00',
  },
  {
    type: 'triangle',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#0000ff',
  },
  {
    type: 'diamond',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#ffff00',
  },
  {
    type: 'pentagon',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#ff8800',
  },
  {
    type: 'star',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#ff00ff',
  },
  {
    type: 'hexagon',
    width: 80,
    height: 80,
    rotation: 0,
    color: '#00ffff',
  },
];

interface ShapeSelectorProps {
  onShapeSelect: (shape: Omit<ShapeType, 'id'>) => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ onShapeSelect, darkMode }) => {
  const handleDragStart = (shape: Omit<ShapeType, 'id' | 'x' | 'y'>, e: React.DragEvent) => {
    e.dataTransfer.setData('shape', JSON.stringify({
      ...shape,
      x: 0,
      y: 0,
    }));
  };

  return (
    <SelectorContainer className={darkMode ? 'dark' : ''}>
      {defaultShapes.map((shape) => (
        <ShapeWrapper key={shape.type}>
          <Shape
            {...shape}
            id={`template-${shape.type}`}
            x={0}
            y={0}
            onDragStart={(e) => handleDragStart(shape, e)}
          />
        </ShapeWrapper>
      ))}
    </SelectorContainer>
  );
};

export default ShapeSelector; 