import { type GameMap, EnemyType, ItemType, WeaponType } from './types.ts';

// 1 = Wand, 0 = freier Raum, 2 = Tür
// Map-Größe: 20x20

export const LEVEL_1: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
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
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 15,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.HEALTH_SMALL,
      x: 7,
      y: 7,
      collected: false,
      value: 25
    },
    {
      id: 'i2',
      type: ItemType.AMMO,
      x: 13,
      y: 7,
      collected: false,
      value: 30
    },
    {
      id: 'i3',
      type: ItemType.TREASURE,
      x: 10,
      y: 10,
      collected: false,
      value: 100
    }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_2: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,1,1,1,0,0,1,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,1,0,0,1,0,0,2,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,0,0,1,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.ZOMBIE,
      x: 7,
      y: 5,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 10,
      y: 10,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.03,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 13,
      y: 5,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    },
    {
      id: 'e4',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 15,
      health: 120,
      maxHealth: 120,
      damage: 12,
      speed: 0.025,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.WEAPON,
      x: 5,
      y: 10,
      collected: false,
      weaponType: WeaponType.MACHINE_PISTOL
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 15,
      y: 10,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.AMMO,
      x: 10,
      y: 3,
      collected: false,
      value: 50
    }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_3: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.MONSTER,
      x: 5,
      y: 5,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 15,
      y: 5,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 10,
      health: 150,
      maxHealth: 150,
      damage: 15,
      speed: 0.03,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 900
    },
    {
      id: 'e4',
      type: EnemyType.MONSTER,
      x: 5,
      y: 15,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e5',
      type: EnemyType.MONSTER,
      x: 15,
      y: 15,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.WEAPON,
      x: 10,
      y: 3,
      collected: false,
      weaponType: WeaponType.CHAINSAW
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 3,
      y: 10,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.HEALTH_LARGE,
      x: 17,
      y: 10,
      collected: false,
      value: 50
    },
    {
      id: 'i4',
      type: ItemType.TREASURE,
      x: 10,
      y: 17,
      collected: false,
      value: 200
    }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_4: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,2,0,0,2,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,2,0,0,2,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.MONSTER,
      x: 3,
      y: 3,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.04,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 17,
      y: 3,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.04,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e3',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 10,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    },
    {
      id: 'e4',
      type: EnemyType.MONSTER,
      x: 3,
      y: 17,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.04,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e5',
      type: EnemyType.MONSTER,
      x: 17,
      y: 17,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.04,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 600
    },
    {
      id: 'e6',
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 5,
      health: 180,
      maxHealth: 180,
      damage: 18,
      speed: 0.035,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 800
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.WEAPON,
      x: 5,
      y: 10,
      collected: false,
      weaponType: WeaponType.ASSAULT_RIFLE
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 15,
      y: 10,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.AMMO,
      x: 10,
      y: 15,
      collected: false,
      value: 75
    },
    {
      id: 'i4',
      type: ItemType.TREASURE,
      x: 10,
      y: 7,
      collected: false,
      value: 250
    }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVEL_5: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  enemies: [
    {
      id: 'e1',
      type: EnemyType.MONSTER,
      x: 5,
      y: 5,
      health: 250,
      maxHealth: 250,
      damage: 25,
      speed: 0.045,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e2',
      type: EnemyType.MONSTER,
      x: 15,
      y: 5,
      health: 250,
      maxHealth: 250,
      damage: 25,
      speed: 0.045,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e3',
      type: EnemyType.MONSTER,
      x: 10,
      y: 10,
      health: 300,
      maxHealth: 300,
      damage: 30,
      speed: 0.05,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 400
    },
    {
      id: 'e4',
      type: EnemyType.MONSTER,
      x: 5,
      y: 15,
      health: 250,
      maxHealth: 250,
      damage: 25,
      speed: 0.045,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e5',
      type: EnemyType.MONSTER,
      x: 15,
      y: 15,
      health: 250,
      maxHealth: 250,
      damage: 25,
      speed: 0.045,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 500
    },
    {
      id: 'e6',
      type: EnemyType.ZOMBIE,
      x: 7,
      y: 10,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.04,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    },
    {
      id: 'e7',
      type: EnemyType.ZOMBIE,
      x: 13,
      y: 10,
      health: 200,
      maxHealth: 200,
      damage: 20,
      speed: 0.04,
      isAlive: true,
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 700
    }
  ],
  items: [
    {
      id: 'i1',
      type: ItemType.WEAPON,
      x: 3,
      y: 10,
      collected: false,
      weaponType: WeaponType.HEAVY_MG
    },
    {
      id: 'i2',
      type: ItemType.HEALTH_LARGE,
      x: 17,
      y: 10,
      collected: false,
      value: 50
    },
    {
      id: 'i3',
      type: ItemType.AMMO,
      x: 10,
      y: 3,
      collected: false,
      value: 100
    },
    {
      id: 'i4',
      type: ItemType.TREASURE,
      x: 10,
      y: 17,
      collected: false,
      value: 500
    },
    {
      id: 'i5',
      type: ItemType.HEALTH_LARGE,
      x: 5,
      y: 10,
      collected: false,
      value: 50
    },
    {
      id: 'i6',
      type: ItemType.HEALTH_LARGE,
      x: 15,
      y: 10,
      collected: false,
      value: 50
    }
  ],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];

