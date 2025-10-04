import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType } from '../types.ts';

export const LEVEL_7_VARIANT_4: GameMap = {
  width: 24,
  height: 24,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
    [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 5, y: 4, health: 400, maxHealth: 400, damage: 25, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 },
    { id: 'e2', type: EnemyType.MONSTER, x: 19, y: 4, health: 400, maxHealth: 400, damage: 25, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 12, y: 7, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 12, y: 16, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e5', type: EnemyType.MONSTER, x: 12, y: 11, health: 450, maxHealth: 450, damage: 30, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 400 },
    { id: 'e6', type: EnemyType.ZOMBIE, x: 5, y: 19, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 19, y: 19, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e8', type: EnemyType.GHOST, x: 12, y: 2, health: 160, maxHealth: 160, damage: 20, speed: 0.05, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e9', type: EnemyType.GHOST, x: 12, y: 21, health: 160, maxHealth: 160, damage: 20, speed: 0.05, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e10', type: EnemyType.MONSTER, x: 12, y: 13, health: 400, maxHealth: 400, damage: 25, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 2, collected: false, value: 100 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 22, y: 2, collected: false, value: 100 },
    { id: 'i3', type: ItemType.AMMO, x: 12, y: 9, collected: false, value: 80 },
    { id: 'i4', type: ItemType.AMMO, x: 12, y: 14, collected: false, value: 80 },
    { id: 'i5', type: ItemType.WEAPON, x: 12, y: 12, collected: false, weaponType: WeaponType.HEAVY_MG },
    { id: 'i6', type: ItemType.TREASURE, x: 12, y: 22, collected: false, value: 500 }
  ],
  wallPictures: [
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp2', x: 20, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 22,
  playerStartDirection: -Math.PI / 2
};
