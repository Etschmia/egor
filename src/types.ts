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
  MONSTER = 'MONSTER',
  GHOST = 'GHOST',
  DOG = 'DOG'
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
  state: 'alive' | 'dying' | 'dead';
  isAlive?: boolean;
  timeOfDeath?: number;
  direction: number;
  lastAttackTime: number;
  attackCooldown: number;
  texture?: CanvasImageSource;
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

export enum DecorativeObjectType {
  CEILING_LIGHT = 'CEILING_LIGHT',
  VASE = 'VASE',
  CRATE = 'CRATE',
  BENCH = 'BENCH',
  TABLE = 'TABLE',
  CHAIR = 'CHAIR',
  WINE_BOTTLE = 'WINE_BOTTLE',
  SKELETON = 'SKELETON'
}

export interface DecorativeObject {
  id: string;
  type: DecorativeObjectType;
  x: number;
  y: number;
  colorVariant: number;
  collisionRadius: number;
  renderHeight?: number;
  parentId?: string;
}

export interface GameMap {
  width: number;
  height: number;
  tiles: number[][];
  enemies: Enemy[];
  items: Item[];
  wallPictures: WallPicture[];
  decorativeObjects: DecorativeObject[];
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
  collectedItems: Record<ItemType, number>;
  killedEnemies: Record<EnemyType, number>;
  isJumping?: boolean;
  jumpStartTime?: number;
  jumpDuration?: number;
}

export interface GameState {
  player: Player;
  currentLevel: number;
  currentVariant?: number;
  difficulty: Difficulty;
  isPaused: boolean;
  isGameOver: boolean;
  enemies: Enemy[];
  items: Item[];
  currentMap: GameMap;
  totalItemsInLevel: number; // Gesamtanzahl der Items in diesem Level
  collectedItemsInLevel: number; // Anzahl der gesammelten Items in diesem Level
  gameStartTime: number;
  lastItemNotification?: {
    message: string;
    timestamp: number;
  };
  allEnemiesDefeatedNotification?: {
    message: string;
    timestamp: number;
  };
}

export interface MapHistoryEntry {
  level: number;
  variant: number;
  timestamp: number;
}

export interface SaveGame {
  name: string;
  timestamp: number;
  gameState: GameState;
}
