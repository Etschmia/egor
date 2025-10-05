import { useState, useCallback } from 'react';
import type { SelectedEntity } from '../types';
import type { GameMap } from '../../types';

export function useSelection(mapData: GameMap | null) {
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  const selectTile = useCallback((x: number, y: number) => {
    setSelectedEntity({ type: 'tile', x, y });
  }, []);

  const selectEnemy = useCallback((id: string) => {
    setSelectedEntity({ type: 'enemy', id });
  }, []);

  const selectItem = useCallback((id: string) => {
    setSelectedEntity({ type: 'item', id });
  }, []);

  const selectDecorativeObject = useCallback((id: string) => {
    setSelectedEntity({ type: 'decorative', id });
  }, []);

  const selectWallPicture = useCallback((id: string) => {
    setSelectedEntity({ type: 'wallPicture', id });
  }, []);

  const selectPlayerStart = useCallback(() => {
    setSelectedEntity({ type: 'playerStart' });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  // Handle tile click - determine what entity is at the clicked position
  const handleTileClick = useCallback((x: number, y: number) => {
    if (!mapData) return;

    // Check if player start is at this position
    if (mapData.playerStartX === x && mapData.playerStartY === y) {
      selectPlayerStart();
      return;
    }

    // Check if an enemy is at this position
    const enemy = mapData.enemies.find(e => 
      Math.floor(e.x) === x && Math.floor(e.y) === y
    );
    if (enemy && enemy.id) {
      selectEnemy(enemy.id);
      return;
    }

    // Check if an item is at this position
    const item = mapData.items.find(i => 
      Math.floor(i.x) === x && Math.floor(i.y) === y
    );
    if (item && item.id) {
      selectItem(item.id);
      return;
    }

    // Check if a decorative object is at this position
    const decorative = mapData.decorativeObjects.find(obj => 
      Math.floor(obj.x) === x && Math.floor(obj.y) === y
    );
    if (decorative && decorative.id) {
      selectDecorativeObject(decorative.id);
      return;
    }

    // Check if a wall picture is at this position
    const wallPicture = mapData.wallPictures.find(pic => pic.x === x && pic.y === y);
    if (wallPicture && wallPicture.id) {
      selectWallPicture(wallPicture.id);
      return;
    }

    // If nothing else, select the tile itself
    selectTile(x, y);
  }, [mapData, selectTile, selectEnemy, selectItem, selectDecorativeObject, selectWallPicture, selectPlayerStart]);

  return {
    selectedEntity,
    selectTile,
    selectEnemy,
    selectItem,
    selectDecorativeObject,
    selectWallPicture,
    selectPlayerStart,
    clearSelection,
    handleTileClick,
  };
}
