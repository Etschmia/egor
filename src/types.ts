// Spieltypen und Interfaces

export interface Position {
  x: number;
  y: number;
}

export enum WeaponType {
  KNIFE = 'KNIFE',
  PISTOL = 'PISTOL',
  MACHINE_PISTOL = 'MACHINE_PISTOL',
  CHAINSAW = 'CHAINSAW',
  ASSAULT_RIFLE = 'ASSAULT_RIFLE',
  HEAVY_MG = 'HEAVY_MG'
}

export interface Weapon {
  type: WeaponType;
  name: string;
  damage: number;
  ammo: number;
  maxAmmo: number;
  fireRate: number;
  range: number;
  needsAmmo: boolean;
}

export enum EnemyType {
  ZOMBIE = 'ZOMBIE',
  MONSTER = 'MONSTER'
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  isAlive: boolean;
  direction: number;
  lastAttackTime: number;
  attackCooldown: number;
}

export enum ItemType {
  HEALTH_SMALL = 'HEALTH_SMALL',
  HEALTH_LARGE = 'HEALTH_LARGE',
  TREASURE = 'TREASURE',
  AMMO = 'AMMO',
  WEAPON = 'WEAPON'
}

export interface Item {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  collected: boolean;
  weaponType?: WeaponType;
  value?: number;
}

export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export enum WallPictureType {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
  ABSTRACT = 'ABSTRACT'
}

export interface WallPicture {
  id: string;
  x: number;      // Wand-Kachel X
  y: number;      // Wand-Kachel Y
  side: 0 | 1;    // 0 = Nord/Süd Wand, 1 = Ost/West Wand
  offset: number; // Position auf der Wand (0.0 - 1.0)
  type: WallPictureType;
}

export interface GameMap {
  width: number;
  height: number;
  tiles: number[][];
  enemies: Enemy[];
  items: Item[];
  wallPictures: WallPicture[];
  playerStartX: number;
  playerStartY: number;
  playerStartDirection: number;
}

export interface Player {
  x: number;
  y: number;
  direction: number;
  health: number;
  maxHealth: number;
  currentWeapon: WeaponType;
  weapons: WeaponType[];
  ammo: Record<WeaponType, number>;
  score: number;
}

export interface GameState {
  player: Player;
  currentLevel: number;
  difficulty: Difficulty;
  isPaused: boolean;
  isGameOver: boolean;
  enemies: Enemy[];
  items: Item[];
  currentMap: GameMap;
  gameStartTime: number;
}

export interface SaveGame {
  name: string;
  timestamp: number;
  gameState: GameState;
}
