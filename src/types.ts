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
  levelStartTime?: number; // Zeitstempel des Level-Starts (Date.now()) für Bewegungsverzögerung
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

// Gegner-Spawn-Sicherheit: Typen für Distanzberechnung und Validierung

export interface PathDistanceResult {
  distance: number; // Distanz in Sekunden (kann Infinity sein)
  pathLength: number; // Pfadlänge in Tiles
  doorOpeningTime: number; // Gesamte Türöffnungszeit in Sekunden
  hasPath: boolean; // Gibt es einen gültigen Pfad?
  pathThroughDoors: boolean; // Muss der Gegner durch geschlossene Türen?
}

export interface ValidationViolation {
  enemyId: string;
  enemyType: EnemyType;
  currentDistance: number; // Aktuelle Distanz in Sekunden
  requiredDistance: number; // Erforderliche Distanz (3 Sekunden)
  reason: string; // z.B. "Zu nah am Spieler-Startpunkt"
  suggestedPosition?: { x: number; y: number }; // Vorschlag für neue Position
}

export interface ValidationResult {
  levelNumber: number;
  variantNumber: number;
  isValid: boolean;
  violations: ValidationViolation[];
  adjustedEnemies?: Enemy[]; // Nur wenn Repositionierung nötig
  warnings: string[];
}

// Input System Interfaces

export enum ActionType {
  MOVE_FORWARD = 'MOVE_FORWARD',
  MOVE_BACKWARD = 'MOVE_BACKWARD',
  STRAFE_LEFT = 'STRAFE_LEFT',
  STRAFE_RIGHT = 'STRAFE_RIGHT',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  SHOOT = 'SHOOT',
  OPEN_DOOR = 'OPEN_DOOR',
  JUMP = 'JUMP',
  PAUSE = 'PAUSE',
  TOGGLE_STATS = 'TOGGLE_STATS',
  TOGGLE_MAP = 'TOGGLE_MAP',
  WEAPON_1 = 'WEAPON_1',
  WEAPON_2 = 'WEAPON_2',
  WEAPON_3 = 'WEAPON_3',
  WEAPON_4 = 'WEAPON_4',
  WEAPON_5 = 'WEAPON_5',
  WEAPON_6 = 'WEAPON_6'
}

export enum InputProfileType {
  MODERN = 'modern',
  CLASSIC = 'classic',
  CUSTOM = 'custom'
}

export type KeyBinding = string[];

export interface ControlProfile {
  id: InputProfileType;
  name: string;
  description: string;
  bindings: Record<ActionType, KeyBinding>;
  isEditable: boolean;
}

export interface InputSettings {
  activeProfileId: InputProfileType;
  customBindings: Record<ActionType, KeyBinding>;
  mouseSensitivity?: number;
  invertY?: boolean;
}
