import { type GameMap, EnemyType, ItemType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_1_VARIANT_4: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,1],
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
  decorativeObjects: [
    // Ceiling lights (every 4-6 tiles)
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do3', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do4', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do5', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do6', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 10.5, colorVariant: .5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do7', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do8', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do9', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    // Hallway decorations
    { id: 'do10', type: DecorativeObjectType.VASE, x: 2.5, y: 8.5, colorVariant: 0.35, collisionRadius: 0.25 },
    { id: 'do11', type: DecorativeObjectType.CRATE, x: 2.5, y: 13.5, colorVariant: 0.65, collisionRadius: 0.35 },
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 10.5, y: 2.5, colorVariant: 0.55, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 17.5, y: 8.5, colorVariant: 0.45, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 17.5, y: 13.5, colorVariant: 0.25, collisionRadius: 0.35 },
    { id: 'do15', type: DecorativeObjectType.BENCH, x: 5.5, y: 17.5, colorVariant: 0.75, collisionRadius: 0.4 },
    // Room furniture (top large room)
    { id: 'do16', type: DecorativeObjectType.TABLE, x: 8.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do17', type: DecorativeObjectType.CHAIR, x: 7.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do18', type: DecorativeObjectType.TABLE, x: 12.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do19', type: DecorativeObjectType.WINE_BOTTLE, x: 12.5, y: 8.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.8, parentId: 'do18' },
    { id: 'do20', type: DecorativeObjectType.CHAIR, x: 13.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Room furniture (center room)
    { id: 'do21', type: DecorativeObjectType.TABLE, x: 9.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do22', type: DecorativeObjectType.CHAIR, x: 9.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do23', type: DecorativeObjectType.TABLE, x: 11.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do24', type: DecorativeObjectType.CHAIR, x: 11.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Skeletons
    { id: 'do25', type: DecorativeObjectType.SKELETON, x: 3.5, y: 17.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do26', type: DecorativeObjectType.SKELETON, x: 16.5, y: 3.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

