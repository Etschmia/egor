import { useState } from 'react';
import type { EditorState } from './types';
import type { GameMap } from '../types';
import { LevelSelector } from './components/LevelSelector';

export function Editor() {
  const [editorState, setEditorState] = useState<EditorState>({
    currentLevel: null,
    currentVariant: null,
    mapData: null,
    selectedEntity: null,
    isDirty: false,
    contextMenu: null,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLevelLoad = (level: number, variant: number, mapData: GameMap) => {
    setEditorState(prev => ({
      ...prev,
      currentLevel: level,
      currentVariant: variant,
      mapData,
      selectedEntity: null,
      isDirty: false,
    }));
    setErrorMessage(null);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#1e1e1e',
      color: '#ffffff'
    }}>
      <header style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Level Editor</h1>
        <div>
          {editorState.isDirty && (
            <span style={{ marginRight: '1rem', color: '#ffa500' }}>
              Unsaved changes
            </span>
          )}
        </div>
      </header>
      
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#252525',
      }}>
        <LevelSelector
          currentLevel={editorState.currentLevel}
          currentVariant={editorState.currentVariant}
          onLevelLoad={handleLevelLoad}
          onError={handleError}
        />
        {errorMessage && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#ff000020',
            border: '1px solid #ff0000',
            borderRadius: '4px',
            color: '#ff6b6b',
            fontSize: '0.9rem',
          }}>
            Error: {errorMessage}
          </div>
        )}
      </div>
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
          {editorState.mapData ? (
            <div>
              <p>Level {editorState.currentLevel} - Variant {editorState.currentVariant} loaded</p>
              <p>Map size: {editorState.mapData.width} x {editorState.mapData.height}</p>
            </div>
          ) : (
            <p>Select a level and variant to begin editing</p>
          )}
        </div>
      </main>
    </div>
  );
}
