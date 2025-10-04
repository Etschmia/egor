import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_3_VARIANT_3: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,1,1,1,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,1,2,1,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.ZOMBIE, x: 8.5, y: 4.5, health: 120, maxHealth: 120, damage: 12, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 900 },
    { id: 'e2', type: EnemyType.ZOMBIE, x: 12, y: 5, health: 120, maxHealth: 120, damage: 12, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 900 },
    { id: 'e3', type: EnemyType.MONSTER, x: 10, y: 8, health: 200, maxHealth: 200, damage: 15, speed: 0.02, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 8, y: 12, health: 120, maxHealth: 120, damage: 12, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 900 },
    { id: 'e5', type: EnemyType.ZOMBIE, x: 12, y: 12, health: 120, maxHealth: 120, damage: 12, speed: 0.025, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 900 },
    { id: 'e6', type: EnemyType.GHOST, x: 2, y: 2, health: 80, maxHealth: 80, damage: 8, speed: 0.035, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 1200 },
    { id: 'e7', type: EnemyType.GHOST, x: 18, y: 17, health: 80, maxHealth: 80, damage: 8, speed: 0.035, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 1200 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 16, collected: false, value: 50 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 18, y: 2, collected: false, value: 50 },
    { id: 'i3', type: ItemType.AMMO, x: 6, y: 8, collected: false, value: 40 },
    { id: 'i4', type: ItemType.AMMO, x: 14, y: 8, collected: false, value: 40 },
    { id: 'i5', type: ItemType.WEAPON, x: 10, y: 10, collected: false, weaponType: WeaponType.CHAINSAW },
    { id: 'i6', type: ItemType.TREASURE, x: 10, y: 17, collected: false, value: 200 }
  ],
  wallPictures: [
    { id: 'wp1', x: 4, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp2', x: 14, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT },
    { id: 'wp3', x: 8, y: 5, side: 1, offset: 0.5, type: WallPictureType.LANDSCAPE }
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
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 2.5, y: 8.5, colorVariant: 0.4, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 17.5, y: 8.5, colorVariant: 0.6, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 2.5, y: 16.5, colorVariant: 0.2, collisionRadius: 0.35 },
    { id: 'do15', type: DecorativeObjectType.BENCH, x: 17.5, y: 16.5, colorVariant: 0.8, collisionRadius: 0.4 },
    // Room furniture (large center room)
    { id: 'do16', type: DecorativeObjectType.TABLE, x: 8.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do17', type: DecorativeObjectType.CHAIR, x: 8.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do18', type: DecorativeObjectType.TABLE, x: 11.5, y: 8.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do19', type: DecorativeObjectType.WINE_BOTTLE, x: 11.5, y: 8.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.8, parentId: 'do18' },
    { id: 'do20', type: DecorativeObjectType.CHAIR, x: 11.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do21', type: DecorativeObjectType.TABLE, x: 8.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do22', type: DecorativeObjectType.TABLE, x: 11.5, y: 12.5, colorVariant: 0.5, collisionRadius: 0.45 },
    // Skeletons
    { id: 'do23', type: DecorativeObjectType.SKELETON, x: 6.5, y: 6.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do24', type: DecorativeObjectType.SKELETON, x: 13.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
