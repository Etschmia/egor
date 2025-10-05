/**
 * Example usage of useMapData hook
 * 
 * This file demonstrates how to use the useMapData hook in the Editor component
 * to manage map data with undo/redo functionality.
 */

import { useMapData } from './useMapData';
import type { GameMap } from '../../types';

// Example: Basic usage in a component
export function ExampleEditorComponent() {
  const {
    mapData,
    isDirty,
    canUndo,
    canRedo,
    setMapData,
    updateMapData,
    undo,
    redo,
    markAsSaved,
  } = useMapData();

  // Example 1: Load a new level
  const loadLevel = (newMapData: GameMap) => {
    setMapData(newMapData);
    // This clears history and marks as not dirty
  };

  // Example 2: Change a tile type with undo support
  const changeTileType = (x: number, y: number, newType: number) => {
    updateMapData((prev) => ({
      ...prev,
      tiles: prev.tiles.map((row, rowIndex) =>
        rowIndex === y
          ? row.map((tile, colIndex) => (colIndex === x ? newType : tile))
          : [...row]
      ),
    }), `Change tile at (${x}, ${y}) to type ${newType}`);
  };

  // Example 3: Add an enemy with undo support
  const addEnemy = (x: number, y: number, enemyType: string) => {
    updateMapData((prev) => ({
      ...prev,
      enemies: [
        ...prev.enemies,
        {
          id: `enemy_${Date.now()}`,
          type: enemyType as any,
          x: x + 0.5,
          y: y + 0.5,
          health: 100,
          maxHealth: 100,
          damage: 10,
          speed: 1,
          state: 'alive' as const,
          direction: 0,
          lastAttackTime: 0,
          attackCooldown: 1000,
        },
      ],
    }), `Add ${enemyType} enemy at (${x}, ${y})`);
  };

  // Example 4: Remove an enemy with undo support
  const removeEnemy = (enemyId: string) => {
    updateMapData((prev) => ({
      ...prev,
      enemies: prev.enemies.filter((e) => e.id !== enemyId),
    }), `Remove enemy ${enemyId}`);
  };

  // Example 5: Save level
  const saveLevel = async () => {
    if (!mapData) return;
    
    // Call API to save
    // await apiClient.saveLevel(filename, mapData);
    
    // Mark as saved to clear dirty flag
    markAsSaved();
  };

  // Example 6: Keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
        event.preventDefault();
        redo();
      } else if (event.key === 's') {
        event.preventDefault();
        saveLevel();
      }
    }
  };

  return {
    mapData,
    isDirty,
    canUndo,
    canRedo,
    loadLevel,
    changeTileType,
    addEnemy,
    removeEnemy,
    saveLevel,
    undo,
    redo,
    handleKeyDown,
  };
}

/**
 * Integration notes:
 * 
 * 1. Replace direct state management in Editor.tsx:
 *    - Replace useState for mapData with useMapData hook
 *    - Replace manual isDirty tracking with hook's isDirty
 * 
 * 2. Update all map modification functions:
 *    - Use updateMapData instead of setEditorState
 *    - Provide descriptive action names for better undo/redo UX
 * 
 * 3. Add undo/redo buttons to Toolbar:
 *    - Use canUndo and canRedo to enable/disable buttons
 *    - Call undo() and redo() on button clicks
 * 
 * 4. Add keyboard shortcuts:
 *    - Ctrl+Z for undo
 *    - Ctrl+Y or Ctrl+Shift+Z for redo
 * 
 * 5. Update save handler:
 *    - Call markAsSaved() after successful save
 *    - This clears the dirty flag
 */
