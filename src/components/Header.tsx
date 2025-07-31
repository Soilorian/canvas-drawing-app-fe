import React from 'react';
import styled from 'styled-components';
import type { DrawingState, Shape } from './types';

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
  onLoad: (state: DrawingState) => void;
  handleShapeLoad: (shapes: Shape[]) => void;
}

const Header: React.FC<HeaderProps> = ({ drawingState, onImport, darkMode, onToggleDarkMode, onLoad, handleShapeLoad }) => {
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

  // State for dialogs
  const [showSave, setShowSave] = React.useState(false);
  const [showLoad, setShowLoad] = React.useState(false);
  const [canvasName, setCanvasName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Save Canvas handler
  const handleSaveCanvas = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/canvas/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvasName,
          canvas: drawingState.shapes,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        alert('Save failed: ' + err);
      } else {
        alert('Canvas saved!');
        setShowSave(false);
        setCanvasName('');
      }
    } catch (e) {
      alert('Save failed: ' + e);
    } finally {
      setLoading(false);
    }
  };

  // Load Canvas handler
  const handleLoadCanvas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/canvas/load?canvasName=${encodeURIComponent(canvasName)}`);
      if (!res.ok) {
        const err = await res.text();
        alert('Load failed: ' + err);
      } else {
        const data = await res.json();
        if (data.canvas) {
          try {
            handleShapeLoad(data.canvas);
            setShowLoad(false);
            setCanvasName('');
          } catch (e) {
            alert('Invalid canvas data from server.');
          }
        } else {
          alert('No canvas data returned.');
        }
      }
    } catch (e) {
      alert('Load failed: ' + e);
    } finally {
      setLoading(false);
    }
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
        <Button onClick={() => setShowSave(true)}>Save Canvas</Button>
        <Button onClick={() => setShowLoad(true)}>Load Canvas</Button>
      </ButtonGroup>
      {/* Save Dialog */}
      {showSave && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300 }}>
            <h3>Save Canvas</h3>
            <input
              type="text"
              placeholder="Enter canvas name"
              value={canvasName}
              onChange={e => setCanvasName(e.target.value)}
              disabled={loading}
              style={{ width: '100%', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowSave(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleSaveCanvas} disabled={loading || !canvasName}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* Load Dialog */}
      {showLoad && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300 }}>
            <h3>Load Canvas</h3>
            <input
              type="text"
              placeholder="Enter canvas name"
              value={canvasName}
              onChange={e => setCanvasName(e.target.value)}
              disabled={loading}
              style={{ width: '100%', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowLoad(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleLoadCanvas} disabled={loading || !canvasName}>Load</Button>
            </div>
          </div>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header; 
