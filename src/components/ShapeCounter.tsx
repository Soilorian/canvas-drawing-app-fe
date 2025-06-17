import React from 'react';
import styled from 'styled-components';
import type { ShapeCount } from './types';

const CounterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background-color: #ad4823;
  &.dark {
    background-color: #0030bf;
  }
  border-top: 1px solid #ddd;
`;

const CountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ShapeIcon = styled.div<{ $type: string }>`
  width: 20px;
  height: 20px;
  ${({ $type }) => {
    switch ($type) {
      case 'square':
        return 'background: #ff0000;';
      case 'circle':
        return `
          background: #00ff00;
          border-radius: 50%;
        `;
      case 'triangle':
        return `
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 20px solid #0000ff;
        `;
      case 'diamond':
        return `
          background: #ffff00;
          transform: rotate(45deg);
        `;
      case 'pentagon':
        return `
          background: #ff8800;
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        `;
      case 'star':
        return `
          background: #ff00ff;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        `;
      case 'hexagon':
        return `
          background: #00ffff;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        `;
      default:
        return '';
    }
  }}
`;

interface ShapeCounterProps {
  counts: ShapeCount;
}

const ShapeCounter: React.FC<ShapeCounterProps> = ({ counts, darkMode }) => {
  return (
    <CounterContainer  className={darkMode ? 'dark' : ''}>
      <CountItem>
        <ShapeIcon $type="square" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Squares: {counts.square}</span>
      </CountItem>
      <CountItem>
        <ShapeIcon $type="circle" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Circles: {counts.circle}</span>
      </CountItem>
      <CountItem>
        <ShapeIcon $type="triangle" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Triangles: {counts.triangle}</span>
      </CountItem>
      <CountItem>
        <ShapeIcon $type="diamond" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Diamonds: {counts.diamond}</span>
      </CountItem>
      <CountItem>
        <ShapeIcon $type="pentagon" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Pentagons: {counts.pentagon}</span>
      </CountItem>
      <CountItem>
        <ShapeIcon $type="star" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Stars: {counts.star}</span>
      </CountItem>
      <CountItem>
        <ShapeIcon $type="hexagon" />
        <span style={{ color: darkMode ? 'white': 'black' }}>Hexagons: {counts.hexagon}</span>
      </CountItem>
    </CounterContainer>
  );
};

export default ShapeCounter; 