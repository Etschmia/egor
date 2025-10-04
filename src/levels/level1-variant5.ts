import { type GameMap, EnemyType, ItemType, WallPictureType, DecorativeObjectType } from '../types.ts';

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
    [1,0,0,0,1,0,0,1,2,2,2,2,1,0,0,1,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,1,0,0,2,0,0,0,1],
    [1,0,0,0,1,0,0,2,0,0,0,0,2,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,2,0,0,0,0,2,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,2,2,2,2,1,0,0,1,0,0,0,1],
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
  decorativeObjects: [
    // Ceiling lights (every 4-6 tiles)
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do3', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do4', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do5', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do6', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do7', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 16.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do8', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 16.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do9', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 16.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    // Hallway decorations
    { id: 'do10', type: DecorativeObjectType.VASE, x: 2.5, y: 7.5, colorVariant: 0.4, collisionRadius: 0.25 },
    { id: 'do11', type: DecorativeObjectType.CRATE, x: 2.5, y: 15.5, colorVariant: 0.6, collisionRadius: 0.35 },
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 10.5, y: 2.5, colorVariant: 0.5, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 17.5, y: 7.5, colorVariant: 0.7, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 17.5, y: 15.5, colorVariant: 0.3, collisionRadius: 0.35 },
    // Room furniture (top large room)
    { id: 'do15', type: DecorativeObjectType.TABLE, x: 6.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do16', type: DecorativeObjectType.WINE_BOTTLE, x: 6.5, y: 5.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.5, parentId: 'do15' },
    { id: 'do17', type: DecorativeObjectType.CHAIR, x: 6.5, y: 6.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do18', type: DecorativeObjectType.TABLE, x: 13.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do19', type: DecorativeObjectType.CHAIR, x: 13.5, y: 6.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Room furniture (left room)
    { id: 'do20', type: DecorativeObjectType.TABLE, x: 6.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do21', type: DecorativeObjectType.CHAIR, x: 6.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Room furniture (right room)
    { id: 'do22', type: DecorativeObjectType.TABLE, x: 13.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do23', type: DecorativeObjectType.CHAIR, x: 13.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Room furniture (center room)
    { id: 'do24', type: DecorativeObjectType.TABLE, x: 9.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do25', type: DecorativeObjectType.CHAIR, x: 9.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do26', type: DecorativeObjectType.TABLE, x: 11.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do27', type: DecorativeObjectType.CHAIR, x: 11.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Skeletons
    { id: 'do28', type: DecorativeObjectType.SKELETON, x: 3.5, y: 17.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do29', type: DecorativeObjectType.SKELETON, x: 16.5, y: 17.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do30', type: DecorativeObjectType.SKELETON, x: 10.5, y: 3.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

// Keep old LEVEL_1 for backward compatibility
