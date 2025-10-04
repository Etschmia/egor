import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_7_VARIANT_5: GameMap = {
  width: 24,
  height: 24,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,1,2,2,1,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,2,0,0,1],
    [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,1,2,2,1,0,0,1],
    [1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 12, y: 4, health: 400, maxHealth: 400, damage: 25, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 },
    { id: 'e2', type: EnemyType.MONSTER, x: 5, y: 7, health: 400, maxHealth: 400, damage: 25, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 19, y: 7, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 12, y: 10, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e5', type: EnemyType.MONSTER, x: 12, y: 12, health: 450, maxHealth: 450, damage: 30, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 400 },
    { id: 'e6', type: EnemyType.ZOMBIE, x: 5, y: 16, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 19, y: 16, health: 220, maxHealth: 220, damage: 22, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 600 },
    { id: 'e8', type: EnemyType.GHOST, x: 12, y: 2, health: 160, maxHealth: 160, damage: 20, speed: 0.05, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e9', type: EnemyType.GHOST, x: 12, y: 21, health: 160, maxHealth: 160, damage: 20, speed: 0.05, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e10', type: EnemyType.MONSTER, x: 12, y: 18, health: 400, maxHealth: 400, damage: 25, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 500 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 2, collected: false, value: 100 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 22, y: 2, collected: false, value: 100 },
    { id: 'i3', type: ItemType.AMMO, x: 12, y: 9, collected: false, value: 80 },
    { id: 'i4', type: ItemType.AMMO, x: 12, y: 13, collected: false, value: 80 },
    { id: 'i5', type: ItemType.WEAPON, x: 12, y: 11, collected: false, weaponType: WeaponType.HEAVY_MG },
    { id: 'i6', type: ItemType.TREASURE, x: 12, y: 21, collected: false, value: 500 }
  ],
  wallPictures: [
    { id: 'wp1', x: 6, y: 3, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE },
    { id: 'wp2', x: 17, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT }
  ],
  decorativeObjects: [
    // Ceiling lights (every 4-6 tiles)
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 6.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.CEILING_LIGHT, x: 12.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do3', type: DecorativeObjectType.CEILING_LIGHT, x: 18.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do4', type: DecorativeObjectType.CEILING_LIGHT, x: 6.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do5', type: DecorativeObjectType.CEILING_LIGHT, x: 12.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do6', type: DecorativeObjectType.CEILING_LIGHT, x: 18.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do7', type: DecorativeObjectType.CEILING_LIGHT, x: 6.5, y: 18.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do8', type: DecorativeObjectType.CEILING_LIGHT, x: 12.5, y: 18.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do9', type: DecorativeObjectType.CEILING_LIGHT, x: 18.5, y: 18.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    // Hallway decorations
    { id: 'do10', type: DecorativeObjectType.VASE, x: 6.5, y: 2.5, colorVariant: 0.4, collisionRadius: 0.25 },
    { id: 'do11', type: DecorativeObjectType.CRATE, x: 18.5, y: 2.5, colorVariant: 0.6, collisionRadius: 0.35 },
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 2.5, y: 10.5, colorVariant: 0.7, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 21.5, y: 10.5, colorVariant: 0.3, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 2.5, y: 16.5, colorVariant: 0.5, collisionRadius: 0.35 },
    { id: 'do15', type: DecorativeObjectType.BENCH, x: 21.5, y: 16.5, colorVariant: 0.8, collisionRadius: 0.4 },
    { id: 'do16', type: DecorativeObjectType.VASE, x: 12.5, y: 21.5, colorVariant: 0.2, collisionRadius: 0.25 },
    // Room furniture (nested rooms)
    { id: 'do17', type: DecorativeObjectType.TABLE, x: 11.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do18', type: DecorativeObjectType.CHAIR, x: 11.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do19', type: DecorativeObjectType.TABLE, x: 13.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do20', type: DecorativeObjectType.WINE_BOTTLE, x: 13.5, y: 9.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.5, parentId: 'do19' },
    { id: 'do21', type: DecorativeObjectType.CHAIR, x: 13.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do22', type: DecorativeObjectType.TABLE, x: 11.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do23', type: DecorativeObjectType.TABLE, x: 13.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do24', type: DecorativeObjectType.CHAIR, x: 13.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.3 },
    // Skeletons
    { id: 'do25', type: DecorativeObjectType.SKELETON, x: 12.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do26', type: DecorativeObjectType.SKELETON, x: 6.5, y: 21.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do27', type: DecorativeObjectType.SKELETON, x: 18.5, y: 21.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 22,
  playerStartDirection: -Math.PI / 2
};
