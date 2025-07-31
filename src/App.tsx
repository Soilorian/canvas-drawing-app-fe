import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import type { Shape, DrawingState, ShapeCount } from './components/types';
import Header from './components/Header';
import Canvas from './components/Canvas';
import ShapeSelector from './components/ShapeSelector';
import ShapeCounter from './components/ShapeCounter';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #d1c494;
  &.dark {
    background-color: #000236;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-around;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const App: React.FC = () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    const handleToggleDarkMode = () => setDarkMode((d) => !d);

    const handleShapeAdd = useCallback((newShape: Omit<Shape, 'id'>) => {
        setShapes(prevShapes => [
            ...prevShapes,
            {
                ...newShape,
                id: uuidv4(),
            },
        ]);
    }, []);

    useEffect(() => {
        (window as any).onShapeAdd = handleShapeAdd;
        return () => {
            (window as any).onShapeAdd = undefined;
        };
    }, [handleShapeAdd]);

    const handleShapeUpdate = useCallback((updatedShape: Shape) => {
        setShapes(prevShapes =>
            prevShapes.map(shape =>
                shape.id === updatedShape.id ? updatedShape : shape
            )
        );
    }, []);

    const handleShapeDelete = useCallback((shapeId: string) => {
        setShapes(prevShapes =>
            prevShapes.filter(shape => shape.id !== shapeId)
        );
    }, []);

    const handleImport = useCallback((importedState: DrawingState) => {
        setShapes(importedState.shapes);
    }, []);

    const handleLoad = useCallback((loadedState: DrawingState) => {
        setShapes(loadedState.shapes);
    }, []);

    const handleShapeLoad = useCallback((shapes: Shape[]) => {
        setShapes(shapes);
    }, []);

    const shapeCounts: ShapeCount = shapes.reduce(
        (counts, shape) => {
            if (counts[shape.type] !== undefined) {
                counts[shape.type]!++;
            }
            return counts;
        },
        {
            square: 0,
            circle: 0,
            triangle: 0,
            diamond: 0,
            pentagon: 0,
            star: 0,
            hexagon: 0,
        }
    );

    return (
        <AppContainer className={darkMode ? 'dark' : ''}>
            <Header
                drawingState={{ shapes }}
                onImport={handleImport}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onLoad={handleLoad}
                handleShapeLoad={handleShapeLoad}
            />
            <MainContent className={darkMode ? 'dark' : ''}>
                <ShapeSelector onShapeSelect={handleShapeAdd}
                darkMode={darkMode} />
                <Canvas
                    shapes={shapes}
                    darkMode={darkMode}
                    onShapeUpdate={handleShapeUpdate}
                    onShapeDelete={handleShapeDelete}
                />
            <ShapeCounter 
                darkMode={darkMode}
                counts={shapeCounts}/>
            </MainContent>
        </AppContainer>
    );
};

export default App;
