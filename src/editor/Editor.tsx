import { useState, useEffect } from 'react';
import type { ContextMenuState, ContextMenuOption } from './types';
import type { GameMap, Enemy, EnemyType, Item, ItemType, WeaponType, DecorativeObject, DecorativeObjectType, WallPicture, WallPictureType } from '../types';
import { LevelSelector } from './components/LevelSelector';
import { MapCanvas } from './components/MapCanvas';
import { ContextMenu } from './components/ContextMenu';
import { EntityDialog, type EntityDialogType } from './components/EntityDialog';
import { NewLevelDialog, type NewLevelDialogType } from './components/NewLevelDialog';
import { Toolbar } from './components/Toolbar';
import { ToastContainer } from './components/Toast';
import { LoadingOverlay } from './components/LoadingSpinner';
import { Legend } from './components/Legend';
import { useSelection } from './hooks/useSelection';
import { useApiClient } from './hooks/useApiClient';
import { useMapData } from './hooks/useMapData';
import { useToast } from './hooks/useToast';

export function Editor() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [currentVariant, setCurrentVariant] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [entityDialog, setEntityDialog] = useState<EntityDialogType | null>(null);
  const [newLevelDialog, setNewLevelDialog] = useState<NewLevelDialogType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use map data hook with undo/redo support
  const { mapData, isDirty, canUndo, canRedo, setMapData, updateMapData, undo, redo, markAsSaved } = useMapData();

  // Use selection hook
  const { selectedEntity, handleTileClick, clearSelection } = useSelection(mapData);
  
  // Use API client hook
  const { saveLevel, isLoading: isSaving } = useApiClient();

  // Use toast notifications
  const { toasts, removeToast, success, error: showError, info } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're in an input field
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      // Ctrl+S: Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (!isInputField) {
          handleSave();
        }
      }

      // Ctrl+Z: Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (!isInputField && canUndo) {
          undo();
        }
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if (((event.ctrlKey || event.metaKey) && event.key === 'y') || 
          ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')) {
        event.preventDefault();
        if (!isInputField && canRedo) {
          redo();
        }
      }

      // Delete: Remove selected entity
      if (event.key === 'Delete' && !isInputField) {
        event.preventDefault();
        handleDeleteSelectedEntity();
      }

      // Escape: Close dialogs and deselect
      if (event.key === 'Escape') {
        if (entityDialog) {
          setEntityDialog(null);
        } else if (newLevelDialog) {
          setNewLevelDialog(null);
        } else if (contextMenu) {
          setContextMenu(null);
        } else if (selectedEntity) {
          clearSelection();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, entityDialog, newLevelDialog, contextMenu, selectedEntity, clearSelection]);

  // Handle delete selected entity
  const handleDeleteSelectedEntity = () => {
    if (!selectedEntity || !mapData) return;

    if (selectedEntity.type === 'enemy') {
      const enemy = mapData.enemies.find(e => e.id === selectedEntity.id);
      if (enemy) {
        handleRemoveEnemy(selectedEntity.id);
      }
    } else if (selectedEntity.type === 'item') {
      const item = mapData.items.find(i => i.id === selectedEntity.id);
      if (item) {
        handleRemoveItem(selectedEntity.id);
      }
    } else if (selectedEntity.type === 'decorative') {
      const decorative = mapData.decorativeObjects.find(d => d.id === selectedEntity.id);
      if (decorative) {
        handleRemoveDecorativeObject(selectedEntity.id);
      }
    } else if (selectedEntity.type === 'wallPicture') {
      const wallPicture = mapData.wallPictures.find(w => w.id === selectedEntity.id);
      if (wallPicture) {
        handleRemoveWallPicture(selectedEntity.id);
      }
    }
    
    clearSelection();
  };

  const handleLevelLoad = (level: number, variant: number, loadedMapData: GameMap) => {
    setCurrentLevel(level);
    setCurrentVariant(variant);
    setMapData(loadedMapData);
    clearSelection();
    info(`Loaded Level ${level} Variant ${variant}`);
  };

  const handleError = (errorMessage: string) => {
    showError(errorMessage);
  };

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent, x: number, y: number) => {
    event.preventDefault();
    
    if (!mapData) return;

    const options: ContextMenuOption[] = [];
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
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        options,
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Handle tile type changes
  const handleChangeTileType = (x: number, y: number, newTileType: number) => {
    if (!mapData) return;

    updateMapData(
      (prev) => ({
        ...prev,
        tiles: prev.tiles.map((row, rowIndex) => 
          rowIndex === y 
            ? row.map((tile, colIndex) => colIndex === x ? newTileType : tile)
            : [...row]
        ),
      }),
      `Change tile at (${x}, ${y}) to type ${newTileType}`
    );

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
    if (!mapData) return;

    updateMapData(
      (prev) => ({
        ...prev,
        enemies: prev.enemies.filter(e => e.id !== enemyId),
      }),
      `Remove enemy ${enemyId}`
    );
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
    if (!mapData) return;

    updateMapData(
      (prev) => ({
        ...prev,
        items: prev.items.filter(i => i.id !== itemId),
      }),
      `Remove item ${itemId}`
    );
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
    if (!mapData) return;

    updateMapData(
      (prev) => ({
        ...prev,
        decorativeObjects: prev.decorativeObjects.filter(d => d.id !== decorativeId),
      }),
      `Remove decorative object ${decorativeId}`
    );
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
    if (!mapData) return;
    
    setEntityDialog({
      type: 'playerStart',
      direction: mapData.playerStartDirection,
      position: { x: x + 0.5, y: y + 0.5 }, // Center of tile
    });
  };

  const handleEditPlayerStart = () => {
    if (!mapData) return;
    
    setEntityDialog({
      type: 'playerStart',
      direction: mapData.playerStartDirection,
      position: { 
        x: mapData.playerStartX, 
        y: mapData.playerStartY 
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
    if (!mapData) return;

    updateMapData(
      (prev) => ({
        ...prev,
        wallPictures: prev.wallPictures.filter(w => w.id !== wallPictureId),
      }),
      `Remove wall picture ${wallPictureId}`
    );
  };

  const handleEntityDialogSave = (data: any) => {
    if (!mapData || !entityDialog) return;

    switch (entityDialog.type) {
      case 'enemy': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing enemy
          updateMapData(
            (prev) => ({
              ...prev,
              enemies: prev.enemies.map(e =>
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
            }),
            `Edit enemy ${entityDialog.entity.id}`
          );
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
          updateMapData(
            (prev) => ({
              ...prev,
              enemies: [...prev.enemies, newEnemy],
            }),
            `Add enemy at (${data.x}, ${data.y})`
          );
        }
        break;
      }
      case 'item': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing item
          updateMapData(
            (prev) => ({
              ...prev,
              items: prev.items.map(i =>
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
            }),
            `Edit item ${entityDialog.entity.id}`
          );
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
          updateMapData(
            (prev) => ({
              ...prev,
              items: [...prev.items, newItem],
            }),
            `Add item at (${data.x}, ${data.y})`
          );
        }
        break;
      }
      case 'decorative': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing decorative object
          updateMapData(
            (prev) => ({
              ...prev,
              decorativeObjects: prev.decorativeObjects.map(d =>
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
            }),
            `Edit decorative object ${entityDialog.entity.id}`
          );
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
          updateMapData(
            (prev) => ({
              ...prev,
              decorativeObjects: [...prev.decorativeObjects, newDecorativeObject],
            }),
            `Add decorative object at (${data.x}, ${data.y})`
          );
        }
        break;
      }
      case 'wallPicture': {
        if ('entity' in entityDialog && entityDialog.entity) {
          // Edit existing wall picture
          updateMapData(
            (prev) => ({
              ...prev,
              wallPictures: prev.wallPictures.map(w =>
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
            }),
            `Edit wall picture ${entityDialog.entity.id}`
          );
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
          updateMapData(
            (prev) => ({
              ...prev,
              wallPictures: [...prev.wallPictures, newWallPicture],
            }),
            `Add wall picture at (${data.x}, ${data.y})`
          );
        }
        break;
      }
      case 'playerStart': {
        // Update player start position and direction
        updateMapData(
          (prev) => ({
            ...prev,
            playerStartX: data.x,
            playerStartY: data.y,
            playerStartDirection: data.direction,
          }),
          `Set player start to (${data.x}, ${data.y})`
        );
        break;
      }
    }

    setEntityDialog(null);
  };

  const handleEntityDialogCancel = () => {
    setEntityDialog(null);
  };

  // Toolbar handlers
  const handleSave = async () => {
    if (!mapData || currentLevel === null || currentVariant === null) {
      return;
    }

    const filename = `level${currentLevel}-variant${currentVariant}.ts`;
    
    try {
      setIsLoading(true);
      await saveLevel(filename, mapData);
      markAsSaved();
      success('Level saved successfully!');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save level');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLevel = () => {
    setNewLevelDialog({ type: 'newLevel' });
  };

  const handleNewVariant = () => {
    if (currentLevel === null) return;
    setNewLevelDialog({ type: 'newVariant', currentLevel: currentLevel });
  };

  const createEmptyMap = (width: number, height: number): GameMap => {
    // Create tiles array with outer walls and floor inside
    const tiles: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        // Set outer edges as walls (1), interior as floor (0)
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          row.push(1); // Wall
        } else {
          row.push(0); // Floor
        }
      }
      tiles.push(row);
    }

    return {
      width,
      height,
      tiles,
      enemies: [],
      items: [],
      wallPictures: [],
      decorativeObjects: [],
      playerStartX: 2.5,
      playerStartY: 2.5,
      playerStartDirection: 0,
    };
  };

  const handleNewLevelDialogSave = async (level: number, variant: number) => {
    const filename = `level${level}-variant${variant}.ts`;
    
    // Create empty map with default dimensions
    const emptyMap = createEmptyMap(20, 20);
    
    try {
      setIsLoading(true);
      // Save the new level
      await saveLevel(filename, emptyMap);
      
      // Load the new level in the editor
      setCurrentLevel(level);
      setCurrentVariant(variant);
      setMapData(emptyMap);
      clearSelection();
      
      success(`Level ${level} Variant ${variant} created successfully!`);
      setNewLevelDialog(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create level');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLevelDialogCancel = () => {
    setNewLevelDialog(null);
  };

  const handleApplySize = (width: number, height: number) => {
    if (!mapData) return;

    const currentWidth = mapData.width;
    const currentHeight = mapData.height;

    // Check if size actually changed
    if (width === currentWidth && height === currentHeight) {
      return;
    }

    // Show warning dialog about potential data loss
    const willShrink = width < currentWidth || height < currentHeight;
    const message = willShrink
      ? `Warning: Resizing from ${currentWidth}x${currentHeight} to ${width}x${height} will remove tiles and entities outside the new boundaries. This action cannot be undone. Continue?`
      : `Resize map from ${currentWidth}x${currentHeight} to ${width}x${height}?`;

    if (!confirm(message)) {
      return;
    }

    // Resize the map
    const resizedMapData = resizeMap(mapData, width, height);

    updateMapData(
      () => resizedMapData,
      `Resize map to ${width}x${height}`
    );

    success(`Map resized to ${width}x${height}`);
  };

  const resizeMap = (mapData: GameMap, newWidth: number, newHeight: number): GameMap => {
    const oldWidth = mapData.width;
    const oldHeight = mapData.height;

    // Create new tiles array
    const newTiles: number[][] = [];
    for (let y = 0; y < newHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < newWidth; x++) {
        if (y < oldHeight && x < oldWidth) {
          // Copy existing tile
          row.push(mapData.tiles[y][x]);
        } else {
          // New tile - set as floor (0)
          row.push(0);
        }
      }
      newTiles.push(row);
    }

    // Filter entities that are outside the new boundaries
    const filteredEnemies = mapData.enemies.filter(
      e => Math.floor(e.x) < newWidth && Math.floor(e.y) < newHeight
    );
    const filteredItems = mapData.items.filter(
      i => Math.floor(i.x) < newWidth && Math.floor(i.y) < newHeight
    );
    const filteredDecorativeObjects = mapData.decorativeObjects.filter(
      d => Math.floor(d.x) < newWidth && Math.floor(d.y) < newHeight
    );
    const filteredWallPictures = mapData.wallPictures.filter(
      w => w.x < newWidth && w.y < newHeight
    );

    // Adjust player start position if it's outside new boundaries
    let playerStartX = mapData.playerStartX;
    let playerStartY = mapData.playerStartY;
    if (Math.floor(playerStartX) >= newWidth || Math.floor(playerStartY) >= newHeight) {
      // Move player start to a safe position (center of map or 2.5, 2.5)
      playerStartX = Math.min(2.5, newWidth - 1.5);
      playerStartY = Math.min(2.5, newHeight - 1.5);
    }

    return {
      ...mapData,
      width: newWidth,
      height: newHeight,
      tiles: newTiles,
      enemies: filteredEnemies,
      items: filteredItems,
      decorativeObjects: filteredDecorativeObjects,
      wallPictures: filteredWallPictures,
      playerStartX,
      playerStartY,
    };
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
        isDirty={isDirty}
        currentLevel={currentLevel}
        mapWidth={mapData?.width || 20}
        mapHeight={mapData?.height || 20}
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
          currentLevel={currentLevel}
          currentVariant={currentVariant}
          onLevelLoad={handleLevelLoad}
          onError={handleError}
        />
      </div>
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {mapData && (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#888', borderBottom: '1px solid #333' }}>
            <p style={{ margin: '0.25rem 0' }}>
              Level {currentLevel} - Variant {currentVariant} | 
              Map size: {mapData.width} x {mapData.height}
              {selectedEntity && (
                <span style={{ marginLeft: '1rem', color: '#4CAF50' }}>
                  | Selected: {selectedEntity.type}
                  {selectedEntity.type === 'tile' && ` (${selectedEntity.x}, ${selectedEntity.y})`}
                </span>
              )}
              {canUndo && (
                <span style={{ marginLeft: '1rem', color: '#888' }}>
                  | Ctrl+Z: Undo
                </span>
              )}
              {canRedo && (
                <span style={{ marginLeft: '1rem', color: '#888' }}>
                  | Ctrl+Y: Redo
                </span>
              )}
            </p>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <MapCanvas 
            mapData={mapData}
            selectedEntity={selectedEntity}
            onTileClick={handleTileClick}
            onContextMenu={handleContextMenu}
          />
        </div>
      </main>
      <ContextMenu 
        contextMenu={contextMenu}
        onClose={handleCloseContextMenu}
      />
      <EntityDialog
        dialogType={entityDialog}
        onSave={handleEntityDialogSave}
        onCancel={handleEntityDialogCancel}
      />
      <NewLevelDialog
        dialogType={newLevelDialog}
        onSave={handleNewLevelDialogSave}
        onCancel={handleNewLevelDialogCancel}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {isLoading && <LoadingOverlay message="Processing..." />}
      <Legend />
    </div>
  );
}
