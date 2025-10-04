import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType, DecorativeObjectType } from './types.ts';
import {
  LEVEL_2_VARIANT_1, LEVEL_2_VARIANT_2, LEVEL_2_VARIANT_3, LEVEL_2_VARIANT_4, LEVEL_2_VARIANT_5,
  LEVEL_3_VARIANT_1, LEVEL_3_VARIANT_2, LEVEL_3_VARIANT_3, LEVEL_3_VARIANT_4, LEVEL_3_VARIANT_5
} from './levels/index.ts';

// 1 = Wand, 0 = freier Raum, 2 = normale Tür, 3 = Exit-Tür (öffnet sich nur wenn alle Gegner tot sind)
// Map-Größe: 20x20

// Level 1 Variants
export const LEVEL_1_VARIANT_1: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 8,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 17,
      y: 5,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 16,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_SMALL,
      x: 7,
      y: 7,
      collected: false,
      value: 25
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 13,
      y: 7,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 10,
      collected: false,
      value: 100
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 15, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp3', x: 8, y: 6, side: 0, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp4', x: 11, y: 6, side: 0, offset: 0.5, type: WallPictureType.PORTRAIT }
  ],
  decorativeObjects: [
    // Test objects for rendering verification
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.VASE, x: 6.5, y: 4.5, colorVariant: 0.3, collisionRadius: 0.25 },
    { id: 'do3', type: DecorativeObjectType.CRATE, x: 8.5, y: 4.5, colorVariant: 0.7, collisionRadius: 0.35 },
    { id: 'do4', type: DecorativeObjectType.TABLE, x: 5.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do5', type: DecorativeObjectType.WINE_BOTTLE, x: 5.5, y: 8.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.8, parentId: 'do4' },
    { id: 'do6', type: DecorativeObjectType.SKELETON, x: 15.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do7', type: DecorativeObjectType.BENCH, x: 12.5, y: 4.5, colorVariant: 0.4, collisionRadius: 0.4 },
    { id: 'do8', type: DecorativeObjectType.CHAIR, x: 6.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.3 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_1_VARIANT_2: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,2,0,0,0,2,0,0,2,0,0,0,2,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 6,
      y: 5,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 13,
      y: 9,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 16,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_SMALL,
      x: 6,
      y: 9,
      collected: false,
      value: 25
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 13,
      y: 5,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 12,
      collected: false,
      value: 100
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 4, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 15, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp3', x: 8, y: 7, side: 0, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_1_VARIANT_3: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,2,0,0,2,0,0,1,1,0,0,2,0,0,2,0,0,1],
    [1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 5,
      y: 5,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 15,
      y: 9,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 16,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_SMALL,
      x: 5,
      y: 9,
      collected: false,
      value: 25
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 15,
      y: 5,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 8,
      collected: false,
      value: 100
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp2', x: 16, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp3', x: 9, y: 14, side: 0, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_1_VARIANT_4: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 5,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 5,
      y: 10,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 15,
      y: 10,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_SMALL,
      x: 10,
      y: 10,
      collected: false,
      value: 25
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 5,
      y: 8,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 15,
      collected: false,
      value: 100
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 6, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp2', x: 13, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp3', x: 3, y: 6, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_1_VARIANT_5: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,1,0,0,2,0,0,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,1,1,1,1,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 9,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 8,
      y: 5,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 12,
      y: 12,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_SMALL,
      x: 8,
      y: 9,
      collected: false,
      value: 25
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 12,
      y: 9,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 5,
      collected: false,
      value: 100
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 4, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 15, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp3', x: 7, y: 6, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

// Keep old LEVEL_1 for backward compatibility
export const LEVEL_1 = LEVEL_1_VARIANT_1;

export const LEVEL_2: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,1,1,1,0,0,1,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,1,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,0,0,1,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 7,
      y: 7,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 17,
      y: 2,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 9,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e4',
      type: EnemyType.ZOMBIE,
      x: 7,
      y: 15,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e5',
      type: EnemyType.ZOMBIE,
      x: 17,
      y: 17,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_LARGE,
      x: 10,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 6,
      y: 6,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.WEAPON,
      x: 10,
      y: 10,
      collected: false,
      weaponType: WeaponType.MACHINE_PISTOL
    },
    {
      id: 'i4',
      type: ItemType.TREASURE,
      x: 10,
      y: 17,
      collected: false,
      value: 150
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 4, y: 1, side: 0, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp2', x: 14, y: 1, side: 0, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp3', x: 9, y: 3, side: 0, offset: 0.3, type: WallPictureType.PORTRAIT },
    { id: 'wp4', x: 11, y: 3, side: 0, offset: 0.7, type: WallPictureType.PORTRAIT },
    { id: 'wp5', x: 1, y: 6, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_3: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,1,1,2,1,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,2,0,0,0,0,1,0,0,0,1,0,0,0,2,0,0,1],
    [1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,1,1,0,1,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 9,
      y: 7,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 15,
      y: 5,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e3',
      type: EnemyType.MONSTER,
      x: 10,
      y: 9,
      health: 200,
      maxHealth: 200,
      damage: 15,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e4',
      type: EnemyType.ZOMBIE,
      x: 5,
      y: 13,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e5',
      type: EnemyType.ZOMBIE,
      x: 15,
      y: 13,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e6',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 17,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e7',
      type: EnemyType.GHOST,
      x: 7,
      y: 11,
      health: 80,
      maxHealth: 80,
      damage: 8,
      speed: 0.035,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1200
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_LARGE,
      x: 4,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 16,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.AMMO,
      x: 5,
      y: 9,
      collected: false,
      value: 40
    },
    {
      id: 'i4',
      type: ItemType.AMMO,
      x: 15,
      y: 9,
      collected: false,
      value: 40
    },
    {
      id: 'i5',
      type: ItemType.WEAPON,
      x: 10,
      y: 11,
      collected: false,
      weaponType: WeaponType.CHAINSAW
    },
    {
      id: 'i6',
      type: ItemType.TREASURE,
      x: 10,
      y: 18,
      collected: false,
      value: 200
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 7, y: 1, side: 0, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp2', x: 12, y: 1, side: 0, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp3', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp4', x: 16, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp5', x: 9, y: 6, side: 0, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp6', x: 12, y: 6, side: 0, offset: 0.5, type: WallPictureType.LANDSCAPE }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_4: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,2,2,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,2,2,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.MONSTER,
      x: 5,
      y: 8,
      health: 250,
      maxHealth: 250,
      damage: 18,
      speed: 0.022,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 16,
      y: 5,
      health: 250,
      maxHealth: 250,
      damage: 18,
      speed: 0.022,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 7,
      y: 10,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.03,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e4',
      type: EnemyType.ZOMBIE,
      x: 15,
      y: 10,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.03,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e5',
      type: EnemyType.MONSTER,
      x: 5,
      y: 15,
      health: 250,
      maxHealth: 250,
      damage: 18,
      speed: 0.022,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e6',
      type: EnemyType.MONSTER,
      x: 16,
      y: 15,
      health: 250,
      maxHealth: 250,
      damage: 18,
      speed: 0.022,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e7',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 9,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.03,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e8',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 11,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.03,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e9',
      type: EnemyType.GHOST,
      x: 3,
      y: 12,
      health: 100,
      maxHealth: 100,
      damage: 12,
      speed: 0.04,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_LARGE,
      x: 2,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 18,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.AMMO,
      x: 5,
      y: 8,
      collected: false,
      value: 50
    },
    {
      id: 'i4',
      type: ItemType.AMMO,
      x: 15,
      y: 8,
      collected: false,
      value: 50
    },
    {
      id: 'i5',
      type: ItemType.WEAPON,
      x: 10,
      y: 10,
      collected: false,
      weaponType: WeaponType.ASSAULT_RIFLE
    },
    {
      id: 'i6',
      type: ItemType.TREASURE,
      x: 2,
      y: 18,
      collected: false,
      value: 250
    },
    {
      id: 'i7',
      type: ItemType.TREASURE,
      x: 18,
      y: 18,
      collected: false,
      value: 250
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 9, y: 1, side: 0, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp2', x: 10, y: 1, side: 0, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp3', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp4', x: 16, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp5', x: 1, y: 9, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp6', x: 18, y: 9, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_5: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,2,0,0,2,0,0,1,1,0,0,2,0,0,2,0,0,1],
    [1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.MONSTER,
      x: 8,
      y: 4,
      health: 300,
      maxHealth: 300,
      damage: 20,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 15,
      y: 4,
      health: 300,
      maxHealth: 300,
      damage: 20,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 8,
      y: 7,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e4',
      type: EnemyType.ZOMBIE,
      x: 12,
      y: 7,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e5',
      type: EnemyType.MONSTER,
      x: 10,
      y: 10,
      health: 350,
      maxHealth: 350,
      damage: 25,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e6',
      type: EnemyType.ZOMBIE,
      x: 8,
      y: 12,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e7',
      type: EnemyType.ZOMBIE,
      x: 12,
      y: 12,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e8',
      type: EnemyType.MONSTER,
      x: 5,
      y: 14,
      health: 300,
      maxHealth: 300,
      damage: 20,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e9',
      type: EnemyType.MONSTER,
      x: 15,
      y: 14,
      health: 300,
      maxHealth: 300,
      damage: 20,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e10',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 17,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e11',
      type: EnemyType.GHOST,
      x: 5,
      y: 8,
      health: 120,
      maxHealth: 120,
      damage: 15,
      speed: 0.045,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e12',
      type: EnemyType.GHOST,
      x: 15,
      y: 8,
      health: 120,
      maxHealth: 120,
      damage: 15,
      speed: 0.045,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_LARGE,
      x: 2,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 18,
      y: 2,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.AMMO,
      x: 5,
      y: 7,
      collected: false,
      value: 60
    },
    {
      id: 'i4',
      type: ItemType.AMMO,
      x: 15,
      y: 7,
      collected: false,
      value: 60
    },
    {
      id: 'i5',
      type: ItemType.WEAPON,
      x: 10,
      y: 5,
      collected: false,
      weaponType: WeaponType.HEAVY_MG
    },
    {
      id: 'i6',
      type: ItemType.AMMO,
      x: 5,
      y: 12,
      collected: false,
      value: 60
    },
    {
      id: 'i7',
      type: ItemType.AMMO,
      x: 15,
      y: 12,
      collected: false,
      value: 60
    },
    {
      id: 'i8',
      type: ItemType.HEALTH_LARGE,
      x: 10,
      y: 14,
      collected: false,
      value: 50
    },
    {
      id: 'i9',
      type: ItemType.TREASURE,
      x: 2,
      y: 17,
      collected: false,
      value: 300
    },
    {
      id: 'i10',
      type: ItemType.TREASURE,
      x: 18,
      y: 17,
      collected: false,
      value: 300
    }
  ],
  wallPictures: [
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.2, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 3, y: 3, side: 1, offset: 0.8, type: WallPictureType.ABSTRACT },
    { id: 'wp3', x: 16, y: 3, side: 1, offset: 0.2, type: WallPictureType.LANDSCAPE },
    { id: 'wp4', x: 16, y: 3, side: 1, offset: 0.8, type: WallPictureType.PORTRAIT },
    { id: 'wp5', x: 6, y: 5, side: 0, offset: 0.3, type: WallPictureType.ABSTRACT },
    { id: 'wp6', x: 6, y: 5, side: 0, offset: 0.7, type: WallPictureType.LANDSCAPE },
    { id: 'wp7', x: 13, y: 5, side: 0, offset: 0.3, type: WallPictureType.PORTRAIT },
    { id: 'wp8', x: 13, y: 5, side: 0, offset: 0.7, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_6: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,2,1,0,0,1,1,0,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,2,1,0,0,1,1,0,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.MONSTER,
      x: 4,
      y: 4,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 15,
      y: 4,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.025,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e3',
      type: EnemyType.GHOST,
      x: 8,
      y: 8,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.04,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
        {
      id: 'e4',
      type: EnemyType.GHOST,
      x: 12,
      y: 12,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.04,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.WEAPON,
      x: 10,
      y: 10,
      collected: false,
      weaponType: WeaponType.ASSAULT_RIFLE
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 2,
      y: 17,
      collected: false,
      value: 100
    }
  ],
  wallPictures: [],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_7: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1,2,2,0,1,0,0,0,1,0,0,1],
    [1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,2,0,0,2,1,0,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1,2,2,0,1,0,0,0,1,0,0,1],
    [1,3,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 6,
      y: 6,
      health: 300,
      maxHealth: 300,
      damage: 25,
      speed: 0.03,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e2',
      type: EnemyType.ZOMBIE,
      x: 14,
      y: 6,
      health: 300,
      maxHealth: 300,
      damage: 25,
      speed: 0.03,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e3',
      type: EnemyType.MONSTER,
      x: 6,
      y: 14,
      health: 400,
      maxHealth: 400,
      damage: 30,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e4',
      type: EnemyType.MONSTER,
      x: 14,
      y: 14,
      health: 400,
      maxHealth: 400,
      damage: 30,
      speed: 0.02,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e5',
      type: EnemyType.GHOST,
      x: 10,
      y: 10,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.05,
      state: 'alive',
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_LARGE,
      x: 2,
      y: 2,
      collected: false,
      value: 100
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 18,
      y: 2,
      collected: false,
      value: 100
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 1,
      collected: false,
      value: 500
    }
  ],
  wallPictures: [],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 18,
  playerStartDirection: -Math.PI / 2
};

// Nested array structure for map variants: LEVELS_WITH_VARIANTS[levelIndex][variantIndex]
export const LEVELS_WITH_VARIANTS: GameMap[][] = [
  [LEVEL_1_VARIANT_1, LEVEL_1_VARIANT_2, LEVEL_1_VARIANT_3, LEVEL_1_VARIANT_4, LEVEL_1_VARIANT_5],
  [LEVEL_2_VARIANT_1, LEVEL_2_VARIANT_2, LEVEL_2_VARIANT_3, LEVEL_2_VARIANT_4, LEVEL_2_VARIANT_5],
  [LEVEL_3_VARIANT_1, LEVEL_3_VARIANT_2, LEVEL_3_VARIANT_3, LEVEL_3_VARIANT_4, LEVEL_3_VARIANT_5],
  [LEVEL_4],
  [LEVEL_5],
  [LEVEL_6],
  [LEVEL_7]
];

// Compatibility export: returns first variant of each level
export const LEVELS: GameMap[] = LEVELS_WITH_VARIANTS.map(variants => variants[0]);