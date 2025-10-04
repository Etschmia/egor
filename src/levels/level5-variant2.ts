import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType } from '../types.ts';

export const LEVEL_5_VARIANT_2: GameMap = {
  width: 22,
  height: 22,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,2,0,0,0,0,0,0,2,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,2,0,0,0,0,0,0,2,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 5, y: 5, health: 300, maxHealth: 300, damage: 20, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e2', type: EnemyType.MONSTER, x: 17, y: 5, health: 300, maxHealth: 300, damage: 20, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 11, y: 10, health: 180, maxHealth: 180, damage: 18, speed: 0.035, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 11, y: 12, health: 180, maxHealth: 180, damage: 18, speed: 0.035, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e5', type: EnemyType.MONSTER, x: 5, y: 16, health: 350, maxHealth: 350, damage: 25, speed: 0.02, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 },
    { id: 'e6', type: EnemyType.MONSTER, x: 17, y: 16, health: 300, maxHealth: 300, damage: 20, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 11, y: 2, health: 180, maxHealth: 180, damage: 18, speed: 0.035, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e8', type: EnemyType.GHOST, x: 2, y: 11, health: 120, maxHealth: 120, damage: 15, speed: 0.045, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 900 },
    { id: 'e9', type: EnemyType.GHOST, x: 20, y: 11, health: 120, maxHealth: 120, damage: 15, speed: 0.045, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 900 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 2, collected: false, value: 50 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 20, y: 2, collected: false, value: 50 },
    { id: 'i3', type: ItemType.AMMO, x: 5, y: 7, collected: false, value: 60 },
    { id: 'i4', type: ItemType.AMMO, x: 17, y: 7, collected: false, value: 60 },
    { id: 'i5', type: ItemType.WEAPON, x: 11, y: 11, collected: false, weaponType: WeaponType.HEAVY_MG },
    { id: 'i6', type: ItemType.TREASURE, x: 11, y: 20, collected: false, value: 300 }
  ],
  wallPictures: [
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp2', x: 18, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
