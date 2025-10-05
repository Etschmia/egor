import { useState } from 'react';
import type { EditorState, ContextMenuOption } from './types';
import type { GameMap, Enemy, EnemyType, Item, ItemType, WeaponType, DecorativeObject, DecorativeObjectType, WallPicture, WallPictureType } from '../types';
import { LevelSelector } from './components/LevelSelector';
import { MapCanvas } from './components/MapCanvas';
import { ContextMenu } from './components/ContextMenu';
import { EntityDialog, type EntityDialogType } from './components/EntityDialog';
import { Toolbar } from './components/Toolbar';
import { useSelection } from './hooks/useSelection';
import { useApiClient } from './hooks/useApiClient';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [entityDialog, setEntityDialog] = useState<EntityDialogType | null>(null);

  // Use selection hook
  const { selectedEntity, handleTileClick, clearSelection } = useSelection(editorState.mapData);
  
  // Use API client hook
  const { saveLevel, isLoading: isSaving } = useApiClient();

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
    const wallPictureAtPos = mapData.wallPictures.find(w => w.x === x && w.y === y);
    const isPlayerStart = Math.floor(mapData.playerStartX) === x && Math.floor(mapData.playerStartY) === y;

    // Options for entities
    if (enemyAtPos) {
      options.push(
        { label: 'Edit Enemy', action: () => handleEditEnemy(enemyAtPos), icon: '✏️' },
        { label: 'Remove Enemy', action: () => handleRemoveEnemy(enemyAtPos.id), icon: '🗑️' }
      );
    } else if (itemAtPos) {
      options.push(
        { label: 'Edit Item', action: () => handleEditItem(itemAtPos), icon: '✏️' },
        { label: 'Remove Item', action: () => handleRemoveItem(itemAtPos.id), icon: '🗑️' }
      );
    } else if (decorativeAtPos) {
      options.push(
        { label: 'Edit Decorative Object', action: () => handleEditDecorativeObject(decorativeAtPos), icon: '✏️' },
        { label: 'Remove Decorative Object', action: () => handleRemoveDecorativeObject(decorativeAtPos.id), icon: '🗑️' }
      );
    } else if (wallPictureAtPos) {
      options.push(
        { label: 'Edit Wall Picture', action: () => handleEditWallPicture(wallPictureAtPos), icon: '✏️' },
        { label: 'Remove Wall Picture', action: () => handleRemoveWallPicture(wallPictureAtPos.id), icon: '🗑️' }
      );
    } else if (isPlayerStart) {
      options.push(
        { label: 'Edit Player Start', action: () => handleEditPlayerStart(), icon: '✏️' }
      );
    }

    // Options based on tile type
    if (tileValue === 1) {
      // Wall tile
      options.push(
        { label: 'Change to Floor', action: () => handleChangeTileType(x, y, 0), icon: '⬛' },
        { label: 'Change to Door', action: () => handleChangeTileType(x, y, 2), icon: '🚪' },
        { label: 'Change to Exit Door', action: () => handleChangeTileType(x, y, 3), icon: '🚪' },
        { label: 'Add Wall Picture', action: () => handleAddWallPicture(x, y), icon: '🖼️' }
      );
    } else if (tileValue === 2) {
      // Door tile
      options.push(
        { label: 'Change to Floor', action: () => handleChangeTileType(x, y, 0), icon: '⬛' },
        { label: 'Change to Wall', action: () => handleChangeTileType(x, y, 1), icon: '⬜' },
        { label: 'Change to Exit Door', action: () => handleChangeTileType(x, y, 3), icon: '🚪' }
      );
    } else if (tileValue === 3) {
      // Exit door tile
      options.push(
        { label: 'Change to Floor', action: () => handleChangeTileType(x, y, 0), icon: '⬛' },
        { label: 'Change to Wall', action: () => handleChangeTileType(x, y, 1), icon: '⬜' },
        { label: 'Change to Door', action: () => handleChangeTileType(x, y, 2), icon: '🚪' }
      );
    } else if (tileValue === 0) {
      // Floor tile - only show add options if no entity exists
      if (!enemyAtPos && !itemAtPos && !decorativeAtPos && !isPlayerStart) {
        options.push(
          { label: 'Change to Wall', action: () => handleChangeTileType(x, y, 1), icon: '⬜' },
          { label: 'Change to Door', action: () => handleChangeTileType(x, y, 2), icon: '🚪' },
          { label: 'Change to Exit Door', action: () => handleChangeTileType(x, y, 3), icon: '🚪' },
          { label: 'Add Enemy', action: () => handleAddEnemy(x, y), icon: '👾' },
          { label: 'Add Item', action: () => handleAddItem(x, y), icon: '💎' },
          { label: 'Add Decorative Object', action: () => handleAddDecorativeObject(x, y), icon: '🏺' },
          { label: 'Set as Player Start', action: () => handleSetPlayerStart(x, y), icon: '🎮' }
        );
      } else if (!isPlayerStart) {
        // If there's an entity but not player start, still allow setting player start
        options.push(
          { label: 'Set as Player Start', action: () => handleSetPlayerStart(x, y), icon: '🎮' }
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

  // Handle tile type changes
  const handleChangeTileType = (x: number, y: number, newTileType: number) => {
    if (!editorState.mapData) return;

    // Create a deep copy of the map data
    const updatedMapData: GameMap = {
      ...editorState.mapData,
      tiles: editorState.mapData.tiles.map((row, rowIndex) => 
        rowIndex === y 
          ? row.map((tile, colIndex) => colIndex === x ? newTileType : tile)
          : [...row]
      ),
    };

    // Update the editor state with the new map data
    setEditorState(prev => ({
      ...prev,
      mapData: updatedMapData,
      isDirty: true,
    }));

    // Close the context menu
    handleCloseContextMenu();
  };

  // Enemy management handlers
  const handleAddEnemy = (x: number, y: number) => {
    setEntityDialog({
      type: 'enemy',
      position: { x: x + 0.5, y: y + 0.5 }, // Center of tile
    });
  };

  const handleEditEnemy = (enemy: Enemy) => {
    setEntityDialog({
      type: 'enemy',
      entity: enemy,
    });
  };

  const handleRemoveEnemy = (enemyId: string) => {
    if (!editorState.mapData) return;

    const updatedMapData: GameMap = {
      ...editorState.mapData,
      enemies: editorState.mapData.enemies.filter(e => e.id !== enemyId),
    };

    setEditorState(prev => ({
      ...prev,
      mapData: updatedMapData,
      isDirty: true,
    }));
  };

  // Item management handlers
  const handleAddItem = (x: number, y: number) => {
    setEntityDialog({
      type: 'item',
      position: { x: x + 0.5, y: y + 0.5 }, // Center of tile
    });
  };

  const handleEditItem = (item: Item) => {
    setEntityDialog({
      type: 'item',
      entity: item,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!editorState.mapData) return;

    const updatedMapData: GameMap = {
      ...editorState.mapData,
      items: editorState.mapData.items.filter(i => i.id !== itemId),
    };

    setEditorState(prev => ({
      ...prev,
      mapData: updatedMapData,
      isDirty: true,
    }));
  };

  // Decorative object management handlers
  const handleAddDecorativeObject = (x: number, y: number) => {
    setEntityDialog({
      type: 'decorative',
      position: { x: x + 0.5, y: y + 0.5 }, // Center of tile
    });
  };

  const handleEditDecorativeObject = (decorativeObject: DecorativeObject) => {
    setEntityDialog({
      type: 'decorative',
      entity: decorativeObject,
    });
  };

  const handleRemoveDecorativeObject = (decorativeId: string) => {
    if (!editorState.mapData) return;

    const updatedMapData: GameMap = {
      ...editorState.mapData,
      decorativeObjects: editorState.mapData.decorativeObjects.filter(d => d.id !== decorativeId),
    };

    setEditorState(prev => ({
      ...prev,
      mapData: updatedMapData,
      isDirty: true,
    }));
  };

  // Wall picture management handlers
  const handleAddWallPicture = (x: number, y: number) => {
    setEntityDialog({
      type: 'wallPicture',
      position: { x, y },
    });
  };

  // Player start position handlers
  const handleSetPlayerStart = (x: number, y: number) => {
    if (!editorState.mapData) return;
    
    setEntityDialog({
      type: 'playerStart',
      direction: editorState.mapData.playerStartDirection,
      position: { x: x + 0.5, y: y + 0.5 }, // Center of tile
    });
  };

  const handleEditPlayerStart = () => {
    if (!editorState.mapData) return;
    
    setEntityDialog({
      type: 'playerStart',
      direction: editorState.mapData.playerStartDirection,
      position: { 
        x: editorState.mapData.playerStartX, 
        y: editorState.mapData.playerStartY 
      },
    });
  };

  const handleEditWallPicture = (wallPicture: WallPicture) => {
    setEntityDialog({
      type: 'wallPicture',
      entity: wallPicture,
    });
  };

  const handleRemoveWallPicture = (wallPictureId: string) => {
    if (!editorState.mapData) return;

    const updatedMapData: GameMap = {
      ...editorState.mapData,
      wallPictures: editorState.mapData.wallPictures.filter(w => w.id !== wallPictureId),
    };

    setEditorState(prev => ({
      ...prev,
      mapData: updatedMapData,
      isDirty: true,
    }));
  };

  const handleEntityDialogSave = (data: any) => {
    if (!editorState.mapData || !entityDialog) return;

    let updatedMapData: GameMap = { ...editorState.mapData };

    switch (entityDialog.type) {
      case 'enemy': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing enemy
          updatedMapData = {
            ...updatedMapData,
            enemies: updatedMapData.enemies.map(e =>
              e.id === entityDialog.entity!.id
                ? {
                    ...e,
                    type: data.type as EnemyType,
                    x: data.x,
                    y: data.y,
                    health: data.health,
                    maxHealth: data.maxHealth,
                    damage: data.damage,
                    speed: data.speed,
                  }
                : e
            ),
          };
        } else {
          // Add new enemy
          const newEnemy: Enemy = {
            id: `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            type: data.type as EnemyType,
            x: data.x,
            y: data.y,
            health: data.health,
            maxHealth: data.maxHealth,
            damage: data.damage,
            speed: data.speed,
            state: 'alive',
            direction: 0,
            lastAttackTime: 0,
            attackCooldown: 1000,
          };
          updatedMapData = {
            ...updatedMapData,
            enemies: [...updatedMapData.enemies, newEnemy],
          };
        }
        break;
      }
      case 'item': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing item
          updatedMapData = {
            ...updatedMapData,
            items: updatedMapData.items.map(i =>
              i.id === entityDialog.entity!.id
                ? {
                    ...i,
                    type: data.type as ItemType,
                    x: data.x,
                    y: data.y,
                    value: data.value,
                    weaponType: data.type === 'WEAPON' ? (data.weaponType as WeaponType) : undefined,
                  }
                : i
            ),
          };
        } else {
          // Add new item
          const newItem: Item = {
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            type: data.type as ItemType,
            x: data.x,
            y: data.y,
            collected: false,
            value: data.value,
            weaponType: data.type === 'WEAPON' ? (data.weaponType as WeaponType) : undefined,
          };
          updatedMapData = {
            ...updatedMapData,
            items: [...updatedMapData.items, newItem],
          };
        }
        break;
      }
      case 'decorative': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing decorative object
          updatedMapData = {
            ...updatedMapData,
            decorativeObjects: updatedMapData.decorativeObjects.map(d =>
              d.id === entityDialog.entity!.id
                ? {
                    ...d,
                    type: data.type as DecorativeObjectType,
                    x: data.x,
                    y: data.y,
                    colorVariant: data.colorVariant,
                    collisionRadius: data.collisionRadius,
                    renderHeight: data.renderHeight,
                  }
                : d
            ),
          };
        } else {
          // Add new decorative object
          const newDecorativeObject: DecorativeObject = {
            id: `decorative_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            type: data.type as DecorativeObjectType,
            x: data.x,
            y: data.y,
            colorVariant: data.colorVariant,
            collisionRadius: data.collisionRadius,
            renderHeight: data.renderHeight,
          };
          updatedMapData = {
            ...updatedMapData,
            decorativeObjects: [...updatedMapData.decorativeObjects, newDecorativeObject],
          };
        }
        break;
      }
      case 'wallPicture': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing wall picture
          updatedMapData = {
            ...updatedMapData,
            wallPictures: updatedMapData.wallPictures.map(w =>
              w.id === entityDialog.entity!.id
                ? {
                    ...w,
                    type: data.type as WallPictureType,
                    x: data.x,
                    y: data.y,
                    side: data.side,
                    offset: data.offset,
                  }
                : w
            ),
          };
        } else {
          // Add new wall picture
          const newWallPicture: WallPicture = {
            id: `wallpicture_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            type: data.type as WallPictureType,
            x: data.x,
            y: data.y,
            side: data.side,
            offset: data.offset,
          };
          updatedMapData = {
            ...updatedMapData,
            wallPictures: [...updatedMapData.wallPictures, newWallPicture],
          };
        }
        break;
      }
      case 'playerStart': {
        // Update player start position and direction
        updatedMapData = {
          ...updatedMapData,
          playerStartX: data.x,
          playerStartY: data.y,
          playerStartDirection: data.direction,
        };
        break;
      }
    }

    setEditorState(prev => ({
      ...prev,
      mapData: updatedMapData,
      isDirty: true,
    }));

    setEntityDialog(null);
  };

  const handleEntityDialogCancel = () => {
    setEntityDialog(null);
  };

  // Toolbar handlers
  const handleSave = async () => {
    if (!editorState.mapData || editorState.currentLevel === null || editorState.currentVariant === null) {
      return;
    }

    const filename = `level${editorState.currentLevel}-variant${editorState.currentVariant}.ts`;
    
    try {
      await saveLevel(filename, editorState.mapData);
      setEditorState(prev => ({
        ...prev,
        isDirty: false,
      }));
      setSuccessMessage('Level saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save level');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleNewLevel = () => {
    // TODO: Implement in task 17
    alert('New Level functionality will be implemented in task 17');
  };

  const handleNewVariant = () => {
    // TODO: Implement in task 17
    alert('New Variant functionality will be implemented in task 17');
  };

  const handleApplySize = (width: number, height: number) => {
    // TODO: Implement in task 18
    alert(`Apply Size functionality will be implemented in task 18. Requested size: ${width}x${height}`);
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
      </header>
      
      <Toolbar
        isDirty={editorState.isDirty}
        currentLevel={editorState.currentLevel}
        currentVariant={editorState.currentVariant}
        mapWidth={editorState.mapData?.width || 20}
        mapHeight={editorState.mapData?.height || 20}
        onSave={handleSave}
        onNewLevel={handleNewLevel}
        onNewVariant={handleNewVariant}
        onApplySize={handleApplySize}
        isSaving={isSaving}
      />
      
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
        {successMessage && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#00ff0020',
            border: '1px solid #00ff00',
            borderRadius: '4px',
            color: '#6bff6b',
            fontSize: '0.9rem',
          }}>
            {successMessage}
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
      <EntityDialog
        dialogType={entityDialog}
        onSave={handleEntityDialogSave}
        onCancel={handleEntityDialogCancel}
      />
    </div>
  );
}
