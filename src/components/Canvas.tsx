import React, { useState } from 'react';
import styled from 'styled-components';
import type { Shape as ShapeType } from './types';
import Shape from './Shape';

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 600px;
  border: 2px solid #ddd;
  margin: 1rem auto;
  background-color: white;
  &.dark {
    background-color: #333;
  }
  overflow: hidden;
`;

interface CanvasProps {
  shapes: ShapeType[];
  onShapeUpdate: (updatedShape: ShapeType) => void;
  onShapeDelete: (shapeId: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ shapes, onShapeUpdate, onShapeDelete, darkMode }) => {
  const [draggedShape, setDraggedShape] = useState<string | null>(null);

  const handleDragStart = (id: string, e: React.DragEvent) => {
    setDraggedShape(id);
    const dragImg = new Image();
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImg, 0, 0);
  };

  const handleDrag = (shape: ShapeType, e: React.DragEvent) => {
    if (!e.clientX || !e.clientY) return;
    const canvasRect = (e.target as HTMLElement).closest('.canvas')?.getBoundingClientRect();
    if (!canvasRect) return;
    const newX = e.clientX - canvasRect.left;
    const newY = e.clientY - canvasRect.top;
    onShapeUpdate({
      ...shape,
      x: newX - shape.width / 2,
      y: newY - shape.height / 2,
    });
  };

  const handleDragEnd = () => {
    setDraggedShape(null);
  };

  const handleShapeClick = (shape: ShapeType) => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800'];
    const currentColorIndex = colors.indexOf(shape.color);
    const nextColor = colors[(currentColorIndex + 1) % colors.length];
    onShapeUpdate({
      ...shape,
      color: nextColor,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('shape');
    if (data) {
      try {
        const shape = JSON.parse(data);
        const canvasRect = (e.target as HTMLElement).closest('.canvas')?.getBoundingClientRect();
        if (!canvasRect) return;
        const x = e.clientX - canvasRect.left - shape.width / 2;
        const y = e.clientY - canvasRect.top - shape.height / 2;
        if (!shape.id) {
          (window as any).onShapeAdd && (window as any).onShapeAdd({ ...shape, x, y });
        }
      } catch {}
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <CanvasContainer className={darkMode ? 'canvas dark' : 'canvas'} onDrop={handleDrop} onDragOver={handleDragOver}>
      {shapes.map((shape) => (
        <Shape
          key={shape.id}
          {...shape}
          isDragging={draggedShape === shape.id}
          onDragStart={(e) => handleDragStart(shape.id, e)}
          onDrag={(e) => handleDrag(shape, e)}
          onDragEnd={handleDragEnd}
          onClick={() => handleShapeClick(shape)}
          onDoubleClick={() => onShapeDelete(shape.id)}
        />
      ))}
    </CanvasContainer>
  );
};

export default Canvas; 