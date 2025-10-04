import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_2_VARIANT_2: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,2,2,2,1,0,0,0,0,1,2,2,2,1,0,0,1],
    [1,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,1],
    [1,0,0,1,2,2,2,1,0,0,0,0,1,2,2,2,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,2,2,0,0,0,0,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
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
      x: 10.5, y: 9.5,
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
      x: 5,
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
      x: 14.5, y: 15.5,
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
      x: 5,
      y: 7,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.WEAPON,
      x: 15,
      y: 7,
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
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 16, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp3', x: 9, y: 10, side: 0, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [
    // Ceiling lights (every 4-6 tiles)
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do3', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do4', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do5', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do6', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do7', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do8', type: DecorativeObjectType.CEILING_LIGHT, x: 10.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do9', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    // Hallway decorations
    { id: 'do10', type: DecorativeObjectType.VASE, x: 2.5, y: 2.5, colorVariant: 0.3, collisionRadius: 0.25 },
    { id: 'do11', type: DecorativeObjectType.CRATE, x: 17.5, y: 2.5, colorVariant: 0.7, collisionRadius: 0.35 },
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 2.5, y: 9.5, colorVariant: 0.4, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 17.5, y: 9.5, colorVariant: 0.6, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 2.5, y: 14.5, colorVariant: 0.2, collisionRadius: 0.35 },
    { id: 'do15', type: DecorativeObjectType.BENCH, x: 17.5, y: 14.5, colorVariant: 0.8, collisionRadius: 0.4 },
    // Room furniture (left room)
    { id: 'do16', type: DecorativeObjectType.TABLE, x: 5.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do17', type: DecorativeObjectType.CHAIR, x: 5.5, y: 6.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Room furniture (right room)
    { id: 'do18', type: DecorativeObjectType.TABLE, x: 14.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do19', type: DecorativeObjectType.WINE_BOTTLE, x: 14.5, y: 5.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.5, parentId: 'do18' },
    { id: 'do20', type: DecorativeObjectType.CHAIR, x: 14.5, y: 6.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Bottom rooms
    { id: 'do21', type: DecorativeObjectType.TABLE, x: 2.5, y: 16.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do22', type: DecorativeObjectType.TABLE, x: 17.5, y: 16.5, colorVariant: 0.5, collisionRadius: 0.45 },
    // Skeletons
    { id: 'do23', type: DecorativeObjectType.SKELETON, x: 10.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
