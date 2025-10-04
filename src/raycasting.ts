import type { GameMap, Enemy, Item, DecorativeObject } from './types.ts';

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
  type: 'enemy' | 'item' | 'decorative';
  object: Enemy | Item | DecorativeObject;
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

// Optimized sprite culling with view frustum check
function isInViewFrustum(
  transformX: number,
  transformY: number,
  maxDistance: number = 20
): boolean {
  // Check if sprite is behind camera
  if (transformY <= 0) return false;
  
  // Check if sprite is too far away
  if (transformY > maxDistance) return false;
  
  // Check if sprite is within horizontal field of view
  // FOV is approximately -1 to 1 in screen space
  if (Math.abs(transformX) > transformY * 1.5) return false;
  
  return true;
}

export function getSpritesToRender(
  posX: number,
  posY: number,
  dirX: number,
  dirY: number,
  planeX: number,
  planeY: number,
  enemies: Enemy[],
  items: Item[],
  decorativeObjects: DecorativeObject[] = []
): SpriteRender[] {
  const sprites: SpriteRender[] = [];
  const invDet = 1.0 / (planeX * dirY - dirX * planeY);

  // Gegner hinzufügen (lebend und sterbend)
  for (const enemy of enemies) {
    if (enemy.state !== 'dead') { // Rendere lebende und sterbende Gegner
      const spriteX = enemy.x - posX;
      const spriteY = enemy.y - posY;

      const transformX = invDet * (dirY * spriteX - dirX * spriteY);
      const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

      // Optimized: Check view frustum before adding
      if (isInViewFrustum(transformX, transformY)) {
        sprites.push({
          x: transformX,
          y: transformY,
          distance: transformY,
          type: 'enemy',
          object: enemy
        });
      }
    }
  }

  // Leichen hinzufügen (werden separat behandelt, aber müssen auch transformiert werden)
  for (const enemy of enemies) {
    if (enemy.state === 'dead') {
      const spriteX = enemy.x - posX;
      const spriteY = enemy.y - posY;

      const transformX = invDet * (dirY * spriteX - dirX * spriteY);
      const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

      // Optimized: Check view frustum before adding
      if (isInViewFrustum(transformX, transformY)) {
        sprites.push({
          x: transformX,
          y: transformY,
          distance: transformY,
          type: 'enemy',
          object: enemy
        });
      }
    }
  }

  // Nicht gesammelte Items hinzufügen
  for (const item of items) {
    if (!item.collected) {
      const spriteX = item.x - posX;
      const spriteY = item.y - posY;

      const transformX = invDet * (dirY * spriteX - dirX * spriteY);
      const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

      // Optimized: Check view frustum before adding
      if (isInViewFrustum(transformX, transformY)) {
        sprites.push({
          x: transformX,
          y: transformY,
          distance: transformY,
          type: 'item',
          object: item
        });
      }
    }
  }

  // Dekorative Objekte hinzufügen
  for (const obj of decorativeObjects) {
    const spriteX = obj.x - posX;
    const spriteY = obj.y - posY;

    const transformX = invDet * (dirY * spriteX - dirX * spriteY);
    const transformY = invDet * (-planeY * spriteX + planeX * spriteY);

    // Optimized: Check view frustum before adding
    if (isInViewFrustum(transformX, transformY)) {
      sprites.push({
        x: transformX,
        y: transformY,
        distance: transformY,
        type: 'decorative',
        object: obj
      });
    }
  }

  // Nach Entfernung sortieren (weiter hinten zuerst)
  sprites.sort((a, b) => b.distance - a.distance);

  return sprites;
}

