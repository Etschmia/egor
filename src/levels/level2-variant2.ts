import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType } from '../types.ts';

export const LEVEL_2_VARIANT_2: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,2,0,0,0,0,2,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,1],
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
      x: 10,
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
      x: 15,
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
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
