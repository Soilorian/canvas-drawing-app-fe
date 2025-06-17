import React from 'react';
import styled from 'styled-components';
import type { Shape as ShapeType } from './types';

const ShapeContainer = styled.div<{ $isDragging?: boolean }>`
  position: absolute;
  cursor: move;
  user-select: none;
  opacity: ${props => props.$isDragging ? 0.6 : 1};
  transform-origin: center;
`;

const getShapePath = (type: ShapeType['type']) => {
  switch (type) {
    case 'square':
      return 'M0 0h100v100h-100z';
    case 'circle':
      return 'M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0';
    case 'triangle':
      return 'M50 0L100 100H0z';
    case 'diamond':
      return 'M50 0L100 50L50 100L0 50z';
    case 'pentagon':
      return 'M50 0L98 35L79 90L21 90L2 35Z';
    case 'star':
      return 'M50 0L61 35H98L68 57L79 91L50 70L21 91L32 57L2 35H39Z';
    case 'hexagon':
      return 'M25 0L75 0L100 50L75 100L25 100L0 50Z';
    default:
      return '';
  }
};

interface ShapeProps extends ShapeType {
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDrag?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const Shape: React.FC<ShapeProps> = ({
  type,
  x,
  y,
  width,
  height,
  rotation,
  color,
  isDragging,
  onDragStart,
  onDrag,
  onDragEnd,
  onClick,
  onDoubleClick,
}) => {
  return (
    <ShapeContainer
      $isDragging={isDragging}
      style={{
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
      }}
      draggable
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={getShapePath(type)}
          fill={color}
        />
      </svg>
    </ShapeContainer>
  );
};

export default Shape; 