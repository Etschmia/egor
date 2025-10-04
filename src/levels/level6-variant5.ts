import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType } from '../types.ts';

export const LEVEL_6_VARIANT_5: GameMap = {
  width: 24,
  height: 24,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 12, y: 4, health: 350, maxHealth: 350, damage: 22, speed: 0.027, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 550 },
    { id: 'e2', type: EnemyType.MONSTER, x: 5, y: 7, health: 350, maxHealth: 350, damage: 22, speed: 0.027, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 550 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 19, y: 7, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 12, y: 10, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e5', type: EnemyType.MONSTER, x: 12, y: 12, health: 400, maxHealth: 400, damage: 28, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 450 },
    { id: 'e6', type: EnemyType.ZOMBIE, x: 5, y: 16, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 19, y: 16, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e8', type: EnemyType.GHOST, x: 12, y: 2, health: 140, maxHealth: 140, damage: 18, speed: 0.048, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 850 },
    { id: 'e9', type: EnemyType.GHOST, x: 12, y: 21, health: 140, maxHealth: 140, damage: 18, speed: 0.048, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 850 },
    { id: 'e10', type: EnemyType.MONSTER, x: 12, y: 18, health: 350, maxHealth: 350, damage: 22, speed: 0.027, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 550 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 2, collected: false, value: 50 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 22, y: 2, collected: false, value: 50 },
    { id: 'i3', type: ItemType.AMMO, x: 12, y: 9, collected: false, value: 70 },
    { id: 'i4', type: ItemType.AMMO, x: 12, y: 13, collected: false, value: 70 },
    { id: 'i5', type: ItemType.WEAPON, x: 12, y: 11, collected: false, weaponType: WeaponType.HEAVY_MG },
    { id: 'i6', type: ItemType.TREASURE, x: 2, y: 22, collected: false, value: 350 },
    { id: 'i7', type: ItemType.TREASURE, x: 22, y: 22, collected: false, value: 350 }
  ],
  wallPictures: [
    { id: 'wp1', x: 6, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 17, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
