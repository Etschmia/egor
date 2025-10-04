import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType } from '../types.ts';

export const LEVEL_3_VARIANT_1: GameMap = {
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
