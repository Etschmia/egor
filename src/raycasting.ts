import type { GameMap, Enemy, Item } from './types.ts';

export interface RaycastResult {
  distance: number;
  wallType: number;
  side: number; // 0 = horizontal, 1 = vertical
  hitX: number;
  hitY: number;
}

export interface SpriteRender {
  x: number;
  y: number;
  distance: number;
  type: 'enemy' | 'item';
  object: Enemy | Item;
}

export function castRay(
  posX: number,
  posY: number,
  dirX: number,
  dirY: number,
  map: GameMap
): RaycastResult {
  // DDA (Digital Differential Analysis) Algorithmus
  const mapX = Math.floor(posX);
  const mapY = Math.floor(posY);

  const deltaDistX = Math.abs(1 / dirX);
  const deltaDistY = Math.abs(1 / dirY);

  let stepX: number;
  let stepY: number;
  let sideDistX: number;
  let sideDistY: number;

  if (dirX < 0) {
    stepX = -1;
    sideDistX = (posX - mapX) * deltaDistX;
  } else {
    stepX = 1;
    sideDistX = (mapX + 1.0 - posX) * deltaDistX;
  }

  if (dirY < 0) {
    stepY = -1;
    sideDistY = (posY - mapY) * deltaDistY;
  } else {
    stepY = 1;
    sideDistY = (mapY + 1.0 - posY) * deltaDistY;
  }

  let hit = 0;
  let side = 0;
  let currentMapX = mapX;
  let currentMapY = mapY;

  while (hit === 0) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      currentMapX += stepX;
      side = 0;
    } else {
      sideDistY += deltaDistY;
      currentMapY += stepY;
      side = 1;
    }

    if (
      currentMapX < 0 ||
      currentMapX >= map.width ||
      currentMapY < 0 ||
      currentMapY >= map.height ||
      map.tiles[currentMapY][currentMapX] > 0
    ) {
      hit = 1;
    }
  }

  let perpWallDist: number;
  if (side === 0) {
    perpWallDist = (currentMapX - posX + (1 - stepX) / 2) / dirX;
  } else {
    perpWallDist = (currentMapY - posY + (1 - stepY) / 2) / dirY;
  }

  const wallType =
    currentMapX >= 0 &&
    currentMapX < map.width &&
    currentMapY >= 0 &&
    currentMapY < map.height
      ? map.tiles[currentMapY][currentMapX]
      : 1;

  return {
    distance: perpWallDist,
    wallType,
    side,
    hitX: currentMapX,
    hitY: currentMapY
  };
}

export function getSpritesToRender(
  posX: number,
  posY: number,
  dirX: number,
  dirY: number,
  planeX: number,
  planeY: number,
  enemies: Enemy[],
  items: Item[]
): SpriteRender[] {
  const sprites: SpriteRender[] = [];

  // Lebende Gegner hinzufügen
  enemies.forEach((enemy) => {
    if (enemy.isAlive) {
      const spriteX = enemy.x - posX;
      const spriteY = enemy.y - posY;

      const invDet = 1.0 / (planeX * dirY - dirX * planeY);
      const transformX = invDet * (dirY * spriteX - dirX * spriteY);
      const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

      if (transformY > 0) {
        sprites.push({
          x: transformX,
          y: transformY,
          distance: transformY,
          type: 'enemy',
          object: enemy
        });
      }
    }
  });

  // Nicht gesammelte Items hinzufügen
  items.forEach((item) => {
    if (!item.collected) {
      const spriteX = item.x - posX;
      const spriteY = item.y - posY;

      const invDet = 1.0 / (planeX * dirY - dirX * planeY);
      const transformX = invDet * (dirY * spriteX - dirX * spriteY);
      const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

      if (transformY > 0) {
        sprites.push({
          x: transformX,
          y: transformY,
          distance: transformY,
          type: 'item',
          object: item
        });
      }
    }
  });

  // Nach Entfernung sortieren (weiter hinten zuerst)
  sprites.sort((a, b) => b.distance - a.distance);

  return sprites;
}

