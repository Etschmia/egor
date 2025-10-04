import { type GameMap, EnemyType, ItemType, WeaponType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_4_VARIANT_3: GameMap = {
  width: 22,
  height: 22,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,1,1,1,1,1,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,0,0,0,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,1,1,1,2,1,1,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    { id: 'e1', type: EnemyType.MONSTER, x: 8.5, y: 4.5, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e2', type: EnemyType.MONSTER, x: 14, y: 5, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e3', type: EnemyType.ZOMBIE, x: 9, y: 10, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e4', type: EnemyType.ZOMBIE, x: 12.5, y: 10.5, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e5', type: EnemyType.MONSTER, x: 8, y: 17, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e6', type: EnemyType.MONSTER, x: 14, y: 17, health: 250, maxHealth: 250, damage: 18, speed: 0.022, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 700 },
    { id: 'e7', type: EnemyType.ZOMBIE, x: 11, y: 8, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e8', type: EnemyType.ZOMBIE, x: 11, y: 14, health: 150, maxHealth: 150, damage: 15, speed: 0.03, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 800 },
    { id: 'e9', type: EnemyType.GHOST, x: 2, y: 2, health: 100, maxHealth: 100, damage: 12, speed: 0.04, state: 'alive', isAlive: true, direction: 0, lastAttackTime: 0, attackCooldown: 1000 }
  ],
  items: [
    { id: 'i1', type: ItemType.HEALTH_LARGE, x: 2, y: 20, collected: false, value: 50 },
    { id: 'i2', type: ItemType.HEALTH_LARGE, x: 20, y: 2, collected: false, value: 50 },
    { id: 'i3', type: ItemType.AMMO, x: 9, y: 11, collected: false, value: 50 },
    { id: 'i4', type: ItemType.AMMO, x: 13, y: 11, collected: false, value: 50 },
    { id: 'i5', type: ItemType.WEAPON, x: 11, y: 11, collected: false, weaponType: WeaponType.ASSAULT_RIFLE },
    { id: 'i6', type: ItemType.TREASURE, x: 11, y: 2, collected: false, value: 250 },
    { id: 'i7', type: ItemType.TREASURE, x: 11, y: 20, collected: false, value: 250 }
  ],
  wallPictures: [
    { id: 'wp1', x: 4, y: 3, side: 1, offset: 0.5, type: WallPictureType.ABSTRACT },
    { id: 'wp2', x: 16, y: 3, side: 1, offset: 0.5, type: WallPictureType.PORTRAIT }
  ],
  decorativeObjects: [
    // Ceiling lights (every 4-6 tiles)
    { id: 'do1', type: DecorativeObjectType.CEILING_LIGHT, x: 6.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do2', type: DecorativeObjectType.CEILING_LIGHT, x: 11.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do3', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 5.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do4', type: DecorativeObjectType.CEILING_LIGHT, x: 6.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do5', type: DecorativeObjectType.CEILING_LIGHT, x: 11.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do6', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 11.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do7', type: DecorativeObjectType.CEILING_LIGHT, x: 6.5, y: 17.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do8', type: DecorativeObjectType.CEILING_LIGHT, x: 11.5, y: 17.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    { id: 'do9', type: DecorativeObjectType.CEILING_LIGHT, x: 15.5, y: 17.5, colorVariant: 0.5, collisionRadius: 0, renderHeight: 1.5 },
    // Hallway decorations
    { id: 'do10', type: DecorativeObjectType.VASE, x: 2.5, y: 5.5, colorVariant: 0.3, collisionRadius: 0.25 },
    { id: 'do11', type: DecorativeObjectType.CRATE, x: 19.5, y: 5.5, colorVariant: 0.7, collisionRadius: 0.35 },
    { id: 'do12', type: DecorativeObjectType.BENCH, x: 2.5, y: 11.5, colorVariant: 0.4, collisionRadius: 0.4 },
    { id: 'do13', type: DecorativeObjectType.VASE, x: 19.5, y: 11.5, colorVariant: 0.6, collisionRadius: 0.25 },
    { id: 'do14', type: DecorativeObjectType.CRATE, x: 6.5, y: 19.5, colorVariant: 0.2, collisionRadius: 0.35 },
    { id: 'do15', type: DecorativeObjectType.BENCH, x: 15.5, y: 19.5, colorVariant: 0.8, collisionRadius: 0.4 },
    // Room furniture (center room)
    { id: 'do16', type: DecorativeObjectType.TABLE, x: 9.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do17', type: DecorativeObjectType.CHAIR, x: 9.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do18', type: DecorativeObjectType.TABLE, x: 12.5, y: 9.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do19', type: DecorativeObjectType.WINE_BOTTLE, x: 12.5, y: 9.5, colorVariant: 0.6, collisionRadius: 0.1, renderHeight: 0.5, parentId: 'do18' },
    { id: 'do20', type: DecorativeObjectType.CHAIR, x: 12.5, y: 10.5, colorVariant: 0.5, collisionRadius: 0.3 },
    { id: 'do21', type: DecorativeObjectType.TABLE, x: 9.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.45 },
    { id: 'do22', type: DecorativeObjectType.TABLE, x: 12.5, y: 13.5, colorVariant: 0.5, collisionRadius: 0.45 },
    // Skeletons
    { id: 'do23', type: DecorativeObjectType.SKELETON, x: 11.5, y: 6.5, colorVariant: 0.5, collisionRadius: 0.2 },
    { id: 'do24', type: DecorativeObjectType.SKELETON, x: 2.5, y: 19.5, colorVariant: 0.5, collisionRadius: 0.2 }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
