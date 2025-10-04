import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType } from '../types.ts';

export const LEVEL_4_VARIANT_5: GameMap = {
  width: 22,
  height: 22,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 11, y: 4, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e2', type: EnemyType.MONSTER, x: 5, y: 7, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 17, y: 7, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 11, y: 9, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e5', type: EnemyType.MONSTER, x: 5, y: 14, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e6', type: EnemyType.MONSTER, x: 17, y: 14, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 11, y: 11, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e8', type: EnemyType.ZOMBIE, x: 11, y: 16, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e9', type: EnemyType.GHOST, x: 11, y: 19, health: 100, maxHealth: 100, damage: 12, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 1000 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 2, collected: false, value: 50 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 20, y: 2, collected: false, value: 50 },
    { id: 'i3', type: ItemType.AMMO, x: 11, y: 8, collected: false, value: 50 },
    { id: 'i4', type: ItemType.AMMO, x: 11, y: 12, collected: false, value: 50 },
    { id: 'i5', type: ItemType.WEAPON, x: 11, y: 10, collected: false, weaponType: WeaponType.ASSAULT_RIFLE },
    { id: 'i6', type: ItemType.TREASURE, x: 2, y: 20, collected: false, value: 250 },
    { id: 'i7', type: ItemType.TREASURE, x: 20, y: 20, collected: false, value: 250 }
  ],
  wallPictures: [
    { id: 'wp1', x: 6, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp2', x: 15, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE }
  ],
  decorativeObjects: [],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
