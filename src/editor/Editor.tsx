import { useState } from 'react';
import type { EditorState, ContextMenuOption } from './types';
import type { GameMap } from '../types';
import { LevelSelector } from './components/LevelSelector';
import { MapCanvas } from './components/MapCanvas';
import { ContextMenu } from './components/ContextMenu';
import { useSelection } from './hooks/useSelection';

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

  // Use selection hook
  const { selectedEntity, handleTileClick, clearSelection } = useSelection(editorState.mapData);

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
    clearSelection();
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent, x: number, y: number) => {
    event.preventDefault();
    
    if (!editorState.mapData) return;

    const options: ContextMenuOption[] = [];
    const mapData = editorState.mapData;
    const tileValue = mapData.tiles[y][x];

    // Check if there's an entity at this position
    const enemyAtPos = mapData.enemies.find(e => Math.floor(e.x) === x && Math.floor(e.y) === y);
    const itemAtPos = mapData.items.find(i => Math.floor(i.x) === x && Math.floor(i.y) === y);
    const decorativeAtPos = mapData.decorativeObjects.find(d => Math.floor(d.x) === x && Math.floor(d.y) === y);
    const isPlayerStart = Math.floor(mapData.playerStartX) === x && Math.floor(mapData.playerStartY) === y;

    // Options for entities
    if (enemyAtPos) {
      options.push(
        { label: 'Edit Enemy', action: () => console.log('Edit enemy', enemyAtPos.id), icon: '✏️' },
        { label: 'Remove Enemy', action: () => console.log('Remove enemy', enemyAtPos.id), icon: '🗑️' }
      );
    } else if (itemAtPos) {
      options.push(
        { label: 'Edit Item', action: () => console.log('Edit item', itemAtPos.id), icon: '✏️' },
        { label: 'Remove Item', action: () => console.log('Remove item', itemAtPos.id), icon: '🗑️' }
      );
    } else if (decorativeAtPos) {
      options.push(
        { label: 'Edit Decorative Object', action: () => console.log('Edit decorative', decorativeAtPos.id), icon: '✏️' },
        { label: 'Remove Decorative Object', action: () => console.log('Remove decorative', decorativeAtPos.id), icon: '🗑️' }
      );
    } else if (isPlayerStart) {
      options.push(
        { label: 'Edit Player Start', action: () => console.log('Edit player start'), icon: '✏️' },
        { label: 'Remove Player Start', action: () => console.log('Remove player start'), icon: '🗑️' }
      );
    }

    // Options based on tile type
    if (tileValue === 1) {
      // Wall tile
      options.push(
        { label: 'Change to Floor', action: () => console.log('Change to floor', x, y), icon: '⬛' },
        { label: 'Change to Door', action: () => console.log('Change to door', x, y), icon: '🚪' },
        { label: 'Change to Exit Door', action: () => console.log('Change to exit door', x, y), icon: '🚪' },
        { label: 'Add Wall Picture', action: () => console.log('Add wall picture', x, y), icon: '🖼️' }
      );
    } else if (tileValue === 2) {
      // Door tile
      options.push(
        { label: 'Change to Floor', action: () => console.log('Change to floor', x, y), icon: '⬛' },
        { label: 'Change to Wall', action: () => console.log('Change to wall', x, y), icon: '⬜' },
        { label: 'Change to Exit Door', action: () => console.log('Change to exit door', x, y), icon: '🚪' }
      );
    } else if (tileValue === 3) {
      // Exit door tile
      options.push(
        { label: 'Change to Floor', action: () => console.log('Change to floor', x, y), icon: '⬛' },
        { label: 'Change to Wall', action: () => console.log('Change to wall', x, y), icon: '⬜' },
        { label: 'Change to Door', action: () => console.log('Change to door', x, y), icon: '🚪' }
      );
    } else if (tileValue === 0) {
      // Floor tile - only show add options if no entity exists
      if (!enemyAtPos && !itemAtPos && !decorativeAtPos && !isPlayerStart) {
        options.push(
          { label: 'Change to Wall', action: () => console.log('Change to wall', x, y), icon: '⬜' },
          { label: 'Change to Door', action: () => console.log('Change to door', x, y), icon: '🚪' },
          { label: 'Change to Exit Door', action: () => console.log('Change to exit door', x, y), icon: '🚪' },
          { label: 'Add Enemy', action: () => console.log('Add enemy', x, y), icon: '👾' },
          { label: 'Add Item', action: () => console.log('Add item', x, y), icon: '💎' },
          { label: 'Add Decorative Object', action: () => console.log('Add decorative', x, y), icon: '🏺' },
          { label: 'Set as Player Start', action: () => console.log('Set player start', x, y), icon: '🎮' }
        );
      } else if (!isPlayerStart) {
        // If there's an entity but not player start, still allow setting player start
        options.push(
          { label: 'Set as Player Start', action: () => console.log('Set player start', x, y), icon: '🎮' }
        );
      }
    }

    if (options.length > 0) {
      setEditorState(prev => ({
        ...prev,
        contextMenu: {
          x: event.clientX,
          y: event.clientY,
          options,
        },
      }));
    }
  };

  const handleCloseContextMenu = () => {
    setEditorState(prev => ({
      ...prev,
      contextMenu: null,
    }));
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
        {editorState.mapData && (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#888', borderBottom: '1px solid #333' }}>
            <p style={{ margin: '0.25rem 0' }}>
              Level {editorState.currentLevel} - Variant {editorState.currentVariant} | 
              Map size: {editorState.mapData.width} x {editorState.mapData.height}
              {selectedEntity && (
                <span style={{ marginLeft: '1rem', color: '#4CAF50' }}>
                  | Selected: {selectedEntity.type}
                  {selectedEntity.type === 'tile' && ` (${selectedEntity.x}, ${selectedEntity.y})`}
                </span>
              )}
            </p>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <MapCanvas 
            mapData={editorState.mapData}
            selectedEntity={selectedEntity}
            onTileClick={handleTileClick}
            onContextMenu={handleContextMenu}
          />
        </div>
      </main>
      <ContextMenu 
        contextMenu={editorState.contextMenu}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
}
