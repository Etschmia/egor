/**
 * Map Renderer for Level Editor
 * 
 * This module handles rendering the level map on a canvas element.
 * It provides visual representation of tiles, entities, and interactive elements.
 * The color scheme is based on the in-game MiniMap component.
 */

import type { GameMap, EnemyType, ItemType, DecorativeObjectType } from '../../types';

// Size of each tile in pixels on the canvas
export const TILE_SIZE = 25; // 25px per tile

// Color scheme based on MiniMap component
export const COLORS = {
  FLOOR: '#000000',
  WALL: '#FFFFFF',
  DOOR: '#8B4513',
  EXIT_DOOR: '#00FF00',
  PLAYER_START: '#0000FF',
  ENEMIES: {
    ZOMBIE: '#90EE90',
    MONSTER: '#FF6347',
    GHOST: '#DDA0DD',
    DOG: '#FFD700',
  },
  ITEMS: {
    HEALTH_SMALL: '#FF0000',
    HEALTH_LARGE: '#FF0000',
    TREASURE: '#FFD700',
    AMMO: '#FFA500',
    WEAPON: '#C0C0C0',
  },
  DECORATIVE: '#808080',
  WALL_PICTURE: '#8B4513',
  HOVER: 'rgba(255, 255, 255, 0.3)',
  SELECTION: '#FFFF00',
};

export interface RenderOptions {
  hoverTile?: { x: number; y: number } | null;
  selectedEntity?: { type: string; x?: number; y?: number; id?: string } | null;
}

/**
 * Main rendering function that draws the entire map
 * 
 * @param ctx - Canvas 2D rendering context
 * @param mapData - The level data to render
 * @param options - Optional rendering options (hover, selection)
 */
export function renderMap(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  options: RenderOptions = {}
): void {
  const { hoverTile, selectedEntity } = options;

  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Render tiles
  renderTiles(ctx, mapData, hoverTile, selectedEntity);

  // Render decorative objects
  renderDecorativeObjects(ctx, mapData, selectedEntity);

  // Render items
  renderItems(ctx, mapData, selectedEntity);

  // Render enemies
  renderEnemies(ctx, mapData, selectedEntity);

  // Render wall pictures
  renderWallPictures(ctx, mapData, selectedEntity);

  // Render player start position
  renderPlayerStart(ctx, mapData, selectedEntity);
}

function renderTiles(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  hoverTile: { x: number; y: number } | null | undefined,
  selectedEntity: { type: string; x?: number; y?: number } | null | undefined
): void {
  for (let y = 0; y < mapData.height; y++) {
    for (let x = 0; x < mapData.width; x++) {
      const tile = mapData.tiles[y][x];
      const screenX = x * TILE_SIZE;
      const screenY = y * TILE_SIZE;

      // Determine tile color
      let color: string;
      switch (tile) {
        case 0: // Floor
          color = COLORS.FLOOR;
          break;
        case 1: // Wall
          color = COLORS.WALL;
          break;
        case 2: // Door
          color = COLORS.DOOR;
          break;
        case 3: // Exit door
          color = COLORS.EXIT_DOOR;
          break;
        default:
          color = COLORS.FLOOR;
      }

      // Draw tile
      ctx.fillStyle = color;
      ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

      // Draw grid lines
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

      // Draw hover effect
      if (hoverTile && hoverTile.x === x && hoverTile.y === y) {
        ctx.fillStyle = COLORS.HOVER;
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }

      // Draw selection highlight for tiles
      if (selectedEntity?.type === 'tile' && selectedEntity.x === x && selectedEntity.y === y) {
        ctx.strokeStyle = COLORS.SELECTION;
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function renderPlayerStart(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  selectedEntity: { type: string } | null | undefined
): void {
  const x = mapData.playerStartX;
  const y = mapData.playerStartY;
  const direction = mapData.playerStartDirection;

  const centerX = x * TILE_SIZE + TILE_SIZE / 2;
  const centerY = y * TILE_SIZE + TILE_SIZE / 2;
  const radius = TILE_SIZE / 3;

  // Draw circle
  ctx.fillStyle = COLORS.PLAYER_START;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw direction arrow
  const arrowLength = radius * 1.2;
  const directionRad = (direction * Math.PI) / 180;
  const arrowEndX = centerX + Math.cos(directionRad) * arrowLength;
  const arrowEndY = centerY + Math.sin(directionRad) * arrowLength;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(arrowEndX, arrowEndY);
  ctx.stroke();

  // Draw arrowhead
  const arrowHeadSize = 5;
  const angle1 = directionRad + (3 * Math.PI) / 4;
  const angle2 = directionRad - (3 * Math.PI) / 4;

  ctx.beginPath();
  ctx.moveTo(arrowEndX, arrowEndY);
  ctx.lineTo(arrowEndX + Math.cos(angle1) * arrowHeadSize, arrowEndY + Math.sin(angle1) * arrowHeadSize);
  ctx.moveTo(arrowEndX, arrowEndY);
  ctx.lineTo(arrowEndX + Math.cos(angle2) * arrowHeadSize, arrowEndY + Math.sin(angle2) * arrowHeadSize);
  ctx.stroke();

  // Draw selection highlight
  if (selectedEntity?.type === 'playerStart') {
    ctx.strokeStyle = COLORS.SELECTION;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function renderEnemies(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  selectedEntity: { type: string; id?: string } | null | undefined
): void {
  mapData.enemies.forEach((enemy) => {
    const centerX = enemy.x * TILE_SIZE + TILE_SIZE / 2;
    const centerY = enemy.y * TILE_SIZE + TILE_SIZE / 2;
    const radius = TILE_SIZE / 3.5;

    // Get color based on enemy type
    const color = COLORS.ENEMIES[enemy.type as EnemyType] || '#FF0000';

    // Draw enemy marker
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw type indicator (first letter)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(enemy.type[0], centerX, centerY);

    // Draw selection highlight
    if (selectedEntity?.type === 'enemy' && selectedEntity.id === enemy.id) {
      ctx.strokeStyle = COLORS.SELECTION;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function renderItems(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  selectedEntity: { type: string; id?: string } | null | undefined
): void {
  mapData.items.forEach((item) => {
    const centerX = item.x * TILE_SIZE + TILE_SIZE / 2;
    const centerY = item.y * TILE_SIZE + TILE_SIZE / 2;
    const size = TILE_SIZE / 3;

    // Get color based on item type
    const color = COLORS.ITEMS[item.type as ItemType] || '#FFFFFF';

    // Draw item marker as diamond
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - size);
    ctx.lineTo(centerX + size, centerY);
    ctx.lineTo(centerX, centerY + size);
    ctx.lineTo(centerX - size, centerY);
    ctx.closePath();
    ctx.fill();

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw type indicator
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let label = '';
    switch (item.type) {
      case 'HEALTH_SMALL':
        label = 'H';
        break;
      case 'HEALTH_LARGE':
        label = 'H+';
        break;
      case 'TREASURE':
        label = 'T';
        break;
      case 'AMMO':
        label = 'A';
        break;
      case 'WEAPON':
        label = 'W';
        break;
    }
    ctx.fillText(label, centerX, centerY);

    // Draw selection highlight
    if (selectedEntity?.type === 'item' && selectedEntity.id === item.id) {
      ctx.strokeStyle = COLORS.SELECTION;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size - 3);
      ctx.lineTo(centerX + size + 3, centerY);
      ctx.lineTo(centerX, centerY + size + 3);
      ctx.lineTo(centerX - size - 3, centerY);
      ctx.closePath();
      ctx.stroke();
    }
  });
}

function renderDecorativeObjects(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  selectedEntity: { type: string; id?: string } | null | undefined
): void {
  mapData.decorativeObjects.forEach((obj) => {
    const centerX = obj.x * TILE_SIZE + TILE_SIZE / 2;
    const centerY = obj.y * TILE_SIZE + TILE_SIZE / 2;
    const size = TILE_SIZE / 4;

    // Draw decorative object marker as square
    ctx.fillStyle = COLORS.DECORATIVE;
    ctx.fillRect(centerX - size, centerY - size, size * 2, size * 2);

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(centerX - size, centerY - size, size * 2, size * 2);

    // Draw type indicator
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let label = '';
    switch (obj.type as DecorativeObjectType) {
      case 'CEILING_LIGHT':
        label = 'L';
        break;
      case 'VASE':
        label = 'V';
        break;
      case 'CRATE':
        label = 'C';
        break;
      case 'BENCH':
        label = 'B';
        break;
      case 'TABLE':
        label = 'T';
        break;
      case 'CHAIR':
        label = 'Ch';
        break;
      case 'WINE_BOTTLE':
        label = 'W';
        break;
      case 'SKELETON':
        label = 'S';
        break;
    }
    ctx.fillText(label, centerX, centerY);

    // Draw selection highlight
    if (selectedEntity?.type === 'decorative' && selectedEntity.id === obj.id) {
      ctx.strokeStyle = COLORS.SELECTION;
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - size - 3, centerY - size - 3, size * 2 + 6, size * 2 + 6);
    }
  });
}

function renderWallPictures(
  ctx: CanvasRenderingContext2D,
  mapData: GameMap,
  selectedEntity: { type: string; id?: string } | null | undefined
): void {
  mapData.wallPictures.forEach((picture) => {
    const tileX = picture.x * TILE_SIZE;
    const tileY = picture.y * TILE_SIZE;
    const size = 8;

    // Calculate position on wall based on side and offset
    let centerX: number;
    let centerY: number;

    if (picture.side === 0) {
      // North/South wall - position along X axis
      centerX = tileX + picture.offset * TILE_SIZE;
      centerY = tileY + TILE_SIZE / 2;
    } else {
      // East/West wall - position along Y axis
      centerX = tileX + TILE_SIZE / 2;
      centerY = tileY + picture.offset * TILE_SIZE;
    }

    // Draw wall picture marker as small rectangle
    ctx.fillStyle = COLORS.WALL_PICTURE;
    ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);

    // Draw icon (P for picture)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 6px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY);

    // Draw selection highlight
    if (selectedEntity?.type === 'wallPicture' && selectedEntity.id === picture.id) {
      ctx.strokeStyle = COLORS.SELECTION;
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - size / 2 - 2, centerY - size / 2 - 2, size + 4, size + 4);
    }
  });
}

/**
 * Converts screen coordinates (pixels) to map coordinates (tile indices)
 * 
 * @param screenX - X coordinate in pixels
 * @param screenY - Y coordinate in pixels
 * @returns Map coordinates as { x, y } tile indices
 */
export function screenToMapCoordinates(
  screenX: number,
  screenY: number
): { x: number; y: number } {
  return {
    x: Math.floor(screenX / TILE_SIZE),
    y: Math.floor(screenY / TILE_SIZE),
  };
}

/**
 * Calculates the required canvas size based on map dimensions
 * 
 * @param mapData - The level data
 * @returns Canvas dimensions in pixels
 */
export function calculateCanvasSize(mapData: GameMap): { width: number; height: number } {
  return {
    width: mapData.width * TILE_SIZE,
    height: mapData.height * TILE_SIZE,
  };
}
