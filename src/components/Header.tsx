import React from 'react';
import styled from 'styled-components';
import type { DrawingState } from './types';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #632a09;
  &.dark {
    background-color: #0030bf;
  }
  border-bottom: 1px solid #ddd;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

interface HeaderProps {
  drawingState: DrawingState;
  onImport: (state: DrawingState) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawingState, onImport, darkMode, onToggleDarkMode }) => {
  const handleExport = () => {
    const dataStr = JSON.stringify(drawingState);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drawing.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedState = JSON.parse(content) as DrawingState;
        onImport(importedState);
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <HeaderContainer className={darkMode ? 'dark' : ''}>
      <Title style={{ color: darkMode ? 'white': 'black' }}>Canvas Board</Title>
      <ButtonGroup>
        <Button as="label">
          Import
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </Button>
        <Button onClick={handleExport}>Export</Button>
        <Button onClick={onToggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Button>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default Header; 