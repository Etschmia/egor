import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_6_VARIANT_4: GameMap = {
  width: 24,
  height: 24,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
    [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,1,2,2,2,2,2,2,1,0,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,1,0,0,1,2,2,2,2,2,2,1,0,0,1,0,1,0,0,1],
    [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 4.5, y: 4.5, health: 350, maxHealth: 350, damage: 22, speed: 0.027, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 550 },
    { id: 'e2', type: EnemyType.MONSTER, x: 19, y: 4, health: 350, maxHealth: 350, damage: 22, speed: 0.027, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 550 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 12, y: 7, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 12, y: 16, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e5', type: EnemyType.MONSTER, x: 12, y: 11, health: 400, maxHealth: 400, damage: 28, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 450 },
    { id: 'e6', type: EnemyType.ZOMBIE, x: 4.5, y: 19.5, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 19, y: 19, health: 200, maxHealth: 200, damage: 20, speed: 0.037, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 650 },
    { id: 'e8', type: EnemyType.GHOST, x: 12, y: 2, health: 140, maxHealth: 140, damage: 18, speed: 0.048, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 850 },
    { id: 'e9', type: EnemyType.GHOST, x: 12, y: 21, health: 140, maxHealth: 140, damage: 18, speed: 0.048, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 850 },
    { id: 'e10', type: EnemyType.MONSTER, x: 12, y: 13, health: 350, maxHealth: 350, damage: 22, speed: 0.027, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 550 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 2, collected: false, value: 50 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 22, y: 2, collected: false, value: 50 },
    { id: 'i3', type: ItemType.AMMO, x: 12, y: 9, collected: false, value: 70 },
    { id: 'i4', type: ItemType.AMMO, x: 12, y: 14, collected: false, value: 70 },
    { id: 'i5', type: ItemType.WEAPON, x: 12, y: 12, collected: false, weaponType: WeaponType.HEAVY_MG },
    { id: 'i6', type: ItemType.WEAPON, x: 12, y: 6, collected: false, weaponType: WeaponType.ASSAULT_RIFLE },
    { id: 'i7', type: ItemType.TREASURE, x: 2, y: 22, collected: false, value: 350 },
    { id: 'i8', type: ItemType.TREASURE, x: 22, y: 22, collected: false, value: 350 }
  ],
  wallPictures: [
    { id: 'wp1', x: 3, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp2', x: 20, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT }
  ],
  decorativeObjects: [
    // Ceiling lights (every 4-6 tiles)
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.CEILING_LIGHT, x: 12.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do3', type: DecorativeObjectType.CEILING_LIGHT, x: 19.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do4', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do5', type: DecorativeObjectType.CEILING_LIGHT, x: 12.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do6', type: DecorativeObjectType.CEILING_LIGHT, x: 19.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do7', type: DecorativeObjectType.CEILING_LIGHT, x: 5.5, y: 19.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do8', type: DecorativeObjectType.CEILING_LIGHT, x: 12.5, y: 19.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do9', type: DecorativeObjectType.CEILING_LIGHT, x: 19.5, y: 19.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    // Hallway decorations
    { id: 'do10', type: DecorativeObjectType.VASE, x: 5.5, y: 2.5, colorVariant: 0.7, collisionRadius: 0.25 },
    { id: 'do11', type: DecorativeObjectType.CRATE, x: 19.5, y: 2.5, colorVariant: 0.3, collisionRadius: 0.35 },
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 2.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 21.5, y: 9.5, colorVariant: 0.2, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 2.5, y: 14.5, colorVariant: 0.8, collisionRadius: 0.35 },
    { id: 'do15', type: DecorativeObjectType.BENCH, x: 21.5, y: 14.5, colorVariant: 0.4, collisionRadius: 0.4 },
    { id: 'do16', type: DecorativeObjectType.VASE, x: 12.5, y: 21.5, colorVariant: 0.6, collisionRadius: 0.25 },
    // Room furniture (central room)
    { id: 'do17', type: DecorativeObjectType.TABLE, x: 10.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do18', type: DecorativeObjectType.CHAIR, x: 10.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do19', type: DecorativeObjectType.TABLE, x: 14.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do20', type: DecorativeObjectType.CHAIR, x: 14.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do21', type: DecorativeObjectType.TABLE, x: 10.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do22', type: DecorativeObjectType.WINE_BOTTLE, x: 10.5, y: 15.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.5, parentId: 'do21' },
    { id: 'do23', type: DecorativeObjectType.TABLE, x: 14.5, y: 15.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do24', type: DecorativeObjectType.CHAIR, x: 14.5, y: 14.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Skeletons
    { id: 'do25', type: DecorativeObjectType.SKELETON, x: 12.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do26', type: DecorativeObjectType.SKELETON, x: 5.5, y: 21.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do27', type: DecorativeObjectType.SKELETON, x: 19.5, y: 21.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
