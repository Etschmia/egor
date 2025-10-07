# API Reference

<cite>
**Referenced Files in This Document**   
- [gameEngine.ts](file://src/gameEngine.ts) - *Updated in recent commit*
- [raycasting.ts](file://src/raycasting.ts)
- [types.ts](file://src/types.ts) - *Updated in recent commit*
- [editor-server.mjs](file://editor-server.mjs)
- [types.ts](file://src/editor/types.ts)
</cite>

## Update Summary
**Changes Made**   
- Updated GameState interface documentation to include new item tracking properties
- Updated collectItem function documentation to reflect new return value and parameters
- Added explanation of item collection tracking system
- Updated code examples to show usage of new item tracking features

## Table of Contents
1. [Introduction](#introduction)
2. [Frontend API](#frontend-api)
3. [Editor Backend API](#editor-backend-api)
4. [Data Models](#data-models)
5. [Client Implementation Guidelines](#client-implementation-guidelines)
6. [Versioning and Backward Compatibility](#versioning-and-backward-compatibility)
7. [Code Examples](#code-examples)

## Introduction
This document provides comprehensive API documentation for the egor project, covering both frontend game engine interfaces and backend editor services. The documentation includes exported functions, RESTful endpoints, data models, and integration guidelines to support development and maintenance of the game and level editor components.

## Frontend API

This section documents the public interfaces from the core game modules, including function signatures, parameters, return values, and usage patterns.

### Game Engine Functions

The gameEngine.ts module provides core gameplay functionality for player actions, enemy AI, combat mechanics, and level progression.

**Section sources**
- [gameEngine.ts](file://src/gameEngine.ts#L7-L703)

#### Player Initialization
```typescript
export function createInitialPlayer(difficulty: Difficulty): Player
```
Creates a new player object with stats based on difficulty level.

**Parameters:**
- `difficulty`: Game difficulty setting (EASY, NORMAL, HARD)

**Returns:**
- `Player`: Initialized player object with appropriate health, weapons, and stats

```typescript
export function createInitialGameState(difficulty: Difficulty): GameState
```
Creates a complete game state for a new game session.

**Parameters:**
- `difficulty`: Game difficulty setting

**Returns:**
- `GameState`: Fully initialized game state including player, enemies, and current level

#### Movement and Collision
```typescript
export function movePlayer(
  player: Player,
  moveX: number,
  moveY: number,
  tiles: number[][],
  decorativeObjects: DecorativeObject[] = []
): Player
```
Moves the player with collision detection against walls and decorative objects.

**Parameters:**
- `player`: Current player state
- `moveX`: Horizontal movement vector
- `moveY`: Vertical movement vector
- `tiles`: 2D array representing the level layout
- `decorativeObjects`: Array of decorative objects that may block movement

**Returns:**
- `Player`: Updated player position if movement was successful

```typescript
export function checkCollision(x: number, y: number, tiles: number[][]): boolean
```
Checks for wall collisions at the specified coordinates.

**Parameters:**
- `x`: X coordinate to check
- `y`: Y coordinate to check
- `tiles`: Level tile grid

**Returns:**
- `boolean`: True if collision detected

```typescript
export function checkDecorativeObjectCollision(
  x: number,
  y: number,
  decorativeObjects: DecorativeObject[]
): boolean
```
Checks for collisions with decorative objects in the level.

**Parameters:**
- `x`: X coordinate to check
- `y`: Y coordinate to check
- `decorativeObjects`: Array of decorative objects in the level

**Returns:**
- `boolean`: True if collision detected

#### Player Actions
```typescript
export function rotatePlayer(player: Player, rotation: number): Player
```
Rotates the player by the specified angle.

**Parameters:**
- `player`: Current player state
- `rotation`: Angle to rotate (in radians)

**Returns:**
- `Player`: Player with updated direction

```typescript
export function startJump(player: Player): Player
```
Initiates a jump action for the player.

**Parameters:**
- `player`: Current player state

**Returns:**
- `Player`: Player with jump state activated

```typescript
export function updateJump(player: Player): Player
```
Updates the player's jump state based on elapsed time.

**Parameters:**
- `player`: Current player state

**Returns:**
- `Player`: Player with updated jump state (may be completed)

#### Combat System
```typescript
export function fireWeapon(
  player: Player,
  enemies: Enemy[],
  playerDirX: number,
  playerDirY: number
): { player: Player; enemies: Enemy[]; hit: boolean; enemyHit?: Enemy; outOfAmmo?: boolean }
```
Processes a weapon firing action and checks for enemy hits.

**Parameters:**
- `player`: Current player state
- `enemies`: Array of enemies in the current level
- `playerDirX`: Player's horizontal facing direction
- `playerDirY`: Player's vertical facing direction

**Returns:**
- Object containing updated player and enemies, hit status, and optional enemy reference

```typescript
export function collectItem(player: Player, items: Item[], collectedItemsInLevel: number): { player: Player; notification?: string; newCollectedItemsInLevel: number }
```
Processes item collection when player is near an item and updates item collection tracking.

**Parameters:**
- `player`: Current player state
- `items`: Array of items in the current level
- `collectedItemsInLevel`: Current count of collected items in the level

**Returns:**
- Object containing updated player, optional notification message, and updated collected items count

#### Level Management
```typescript
export function checkLevelComplete(enemies: Enemy[]): boolean
```
Checks if all enemies in the current level have been defeated.

**Parameters:**
- `enemies`: Array of enemies in the current level

**Returns:**
- `boolean`: True if level is complete (all enemies defeated)

```typescript
export function loadNextLevel(gameState: GameState): GameState
```
Loads the next level in the game sequence.

**Parameters:**
- `gameState`: Current game state

**Returns:**
- `GameState`: Updated game state with next level loaded

```typescript
export function openDoor(player: Player, tiles: number[][], enemies: Enemy[]): { tiles: number[][]; doorOpened: boolean; isExitDoor?: boolean }
```
Attempts to open a door in front of the player.

**Parameters:**
- `player`: Current player state
- `tiles`: Current level tile grid
- `enemies`: Array of enemies in the current level

**Returns:**
- Object containing updated tiles (if door opened), door status, and exit door flag

### Raycasting Functions

The raycasting.ts module provides rendering calculations for the 3D view.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L18-L227)

```typescript
export function castRay(
  posX: number,
  posY: number,
  dirX: number,
  dirY: number,
  map: GameMap
): RaycastResult
```
Casts a ray from the player position to determine wall intersections.

**Parameters:**
- `posX`: Starting X coordinate
- `posY`: Starting Y coordinate
- `dirX`: Ray direction X component
- `dirY`: Ray direction Y component
- `map`: Current game map

**Returns:**
- `RaycastResult`: Information about the ray intersection

```typescript
export function getSpritesToRender(
  posX: number,
  posY: number,
  dirX: number,
  dirY: number,
  planeX: number,
  planeY: number,
  enemies: Enemy[],
  items: Item[],
  decorativeObjects: DecorativeObject[] = []
): SpriteRender[]
```
Calculates which sprites should be rendered and their screen positions.

**Parameters:**
- `posX`: Camera X position
- `posY`: Camera Y position
- `dirX`: Camera direction X component
- `dirY`: Camera direction Y component
- `planeX`: Camera plane X component
- `planeY`: Camera plane Y component
- `enemies`: Array of enemies to consider
- `items`: Array of items to consider
- `decorativeObjects`: Array of decorative objects to consider

**Returns:**
- `SpriteRender[]`: Array of sprites to render, sorted by distance

## Editor Backend API

The editor backend provides RESTful endpoints for level management operations.

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L0-L350)

### API Endpoints

#### GET /api/levels
Retrieves a list of all available level files.

**Request:**
- Method: GET
- URL: /api/levels
- Headers: None
- Body: None

**Response:**
```json
{
  "success": true,
  "levels": [
    {
      "filename": "level1-variant1.ts",
      "level": 1,
      "variant": 1
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

#### GET /api/levels/:filename
Retrieves the content of a specific level file.

**Request:**
- Method: GET
- URL: /api/levels/{filename}
- Headers: None
- Body: None

**Path Parameters:**
- `filename`: Name of the level file (format: levelX-variantY.ts)

**Response:**
```json
{
  "success": true,
  "data": {
    "width": 20,
    "height": 20,
    "tiles": [[0,0,1],[0,0,0]],
    "enemies": [],
    "items": [],
    "wallPictures": [],
    "decorativeObjects": [],
    "playerStartX": 2,
    "playerStartY": 2,
    "playerStartDirection": 0
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid filename format
- 403: Access denied (path traversal attempt)
- 404: File not found
- 500: Server error

#### POST /api/levels
Saves or creates a level file with the provided data.

**Request:**
- Method: POST
- URL: /api/levels
- Headers: Content-Type: application/json
- Body: 
```json
{
  "filename": "level1-variant1.ts",
  "data": {
    "width": 20,
    "height": 20,
    "tiles": [[0,0,1],[0,0,0]],
    "enemies": [],
    "items": [],
    "wallPictures": [],
    "decorativeObjects": [],
    "playerStartX": 2,
    "playerStartY": 2,
    "playerStartDirection": 0
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Level file level1-variant1.ts saved successfully"
}
```

**Status Codes:**
- 200: Success
- 400: Missing required fields or invalid data
- 403: Access denied (path traversal attempt)
- 500: Server error

### Authentication
The editor API does not require authentication for local development. In production environments, authentication should be implemented via middleware.

### Security Considerations
- Path validation prevents directory traversal attacks
- Input validation ensures data integrity
- CORS enabled for frontend integration
- File operations restricted to levels directory

## Data Models

This section documents the core data structures used throughout the application.

**Section sources**
- [types.ts](file://src/types.ts#L7-L162)
- [types.ts](file://src/editor/types.ts#L0-L30)

### Core Game Models

#### Player
Represents the player character state.

```typescript
interface Player {
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
```

**Properties:**
- `x`, `y`: Position coordinates
- `direction`: Facing direction (radians)
- `health`, `maxHealth`: Current and maximum health points
- `currentWeapon`: Currently selected weapon
- `weapons`: Array of available weapons
- `ammo`: Ammo count for each weapon type
- `score`: Current score
- `collectedItems`: Count of collected items by type
- `killedEnemies`: Count of defeated enemies by type
- `isJumping`, `jumpStartTime`, `jumpDuration`: Jump state properties

#### Enemy
Represents an enemy entity in the game world.

```typescript
interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  state: 'alive' | 'dying' | 'dead';
  timeOfDeath?: number;
  direction: number;
  lastAttackTime: number;
  attackCooldown: number;
  texture?: CanvasImageSource;
}
```

**Properties:**
- `id`: Unique identifier
- `type`: Enemy type (ZOMBIE, MONSTER, GHOST, DOG)
- `x`, `y`: Position coordinates
- `health`, `maxHealth`: Current and maximum health points
- `damage`: Damage dealt to player
- `speed`: Movement speed
- `state`: Current state (alive, dying, dead)
- `timeOfDeath`: Timestamp when enemy started dying
- `direction`: Facing direction
- `lastAttackTime`: Timestamp of last attack
- `attackCooldown`: Minimum time between attacks
- `texture`: Visual representation

#### Item
Represents a collectible item in the game world.

```typescript
interface Item {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  collected: boolean;
  weaponType?: WeaponType;
  value?: number;
}
```

**Properties:**
- `id`: Unique identifier
- `type`: Item type (HEALTH_SMALL, HEALTH_LARGE, TREASURE, AMMO, WEAPON)
- `x`, `y`: Position coordinates
- `collected`: Collection status
- `weaponType`: Weapon type (for weapon items)
- `value`: Numeric value (health points, score, ammo amount)

#### GameMap
Represents a complete level layout.

```typescript
interface GameMap {
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
```

**Properties:**
- `width`, `height`: Map dimensions
- `tiles`: 2D array of tile types (0=empty, 1=wall, 2=door, 3=exit)
- `enemies`: Array of enemy entities
- `items`: Array of collectible items
- `wallPictures`: Array of wall decorations
- `decorativeObjects`: Array of interactive objects
- `playerStartX`, `playerStartY`: Player spawn position
- `playerStartDirection`: Player initial facing direction

#### GameState
Represents the complete state of a game session.

```typescript
interface GameState {
  player: Player;
  currentLevel: number;
  currentVariant?: number;
  difficulty: Difficulty;
  isPaused: boolean;
  isGameOver: boolean;
  enemies: Enemy[];
  items: Item[];
  currentMap: GameMap;
  totalItemsInLevel: number; // Total number of items in this level
  collectedItemsInLevel: number; // Number of collected items in this level
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
```

**Properties:**
- `player`: Current player state
- `currentLevel`: Current level number
- `currentVariant`: Current level variant
- `difficulty`: Game difficulty
- `isPaused`: Pause state
- `isGameOver`: Game over state
- `enemies`: Current enemies in level
- `items`: Current items in level
- `currentMap`: Current game map
- `totalItemsInLevel`: Total number of items in the current level
- `collectedItemsInLevel`: Number of items collected in the current level
- `gameStartTime`: Timestamp when game started
- `lastItemNotification`: Recent item collection notification
- `allEnemiesDefeatedNotification`: Level completion notification

### Editor Models

#### EditorState
Represents the state of the level editor.

```typescript
interface EditorState {
  currentLevel: number | null;
  currentVariant: number | null;
  mapData: GameMap | null;
  selectedEntity: SelectedEntity | null;
  isDirty: boolean;
  contextMenu: ContextMenuState | null;
}
```

**Properties:**
- `currentLevel`: Currently edited level number
- `currentVariant`: Currently edited variant number
- `mapData`: Current map data being edited
- `selectedEntity`: Currently selected entity
- `isDirty`: Flag indicating unsaved changes
- `contextMenu`: Context menu state

#### SelectedEntity
Represents the currently selected entity in the editor.

```typescript
type SelectedEntity = 
  | { type: 'tile', x: number, y: number }
  | { type: 'enemy', id: string }
  | { type: 'item', id: string }
  | { type: 'decorative', id: string }
  | { type: 'wallPicture', id: string }
  | { type: 'playerStart' };
```

### Enumerations

#### WeaponType
Available weapon types in the game.

```typescript
enum WeaponType {
  KNIFE = 'KNIFE',
  PISTOL = 'PISTOL',
  MACHINE_PISTOL = 'MACHINE_PISTOL',
  CHAINSAW = 'CHAINSAW',
  ASSAULT_RIFLE = 'ASSAULT_RIFLE',
  HEAVY_MG = 'HEAVY_MG'
}
```

#### EnemyType
Available enemy types in the game.

```typescript
enum EnemyType {
  ZOMBIE = 'ZOMBIE',
  MONSTER = 'MONSTER',
  GHOST = 'GHOST',
  DOG = 'DOG'
}
```

#### ItemType
Available item types in the game.

```typescript
enum ItemType {
  HEALTH_SMALL = 'HEALTH_SMALL',
  HEALTH_LARGE = 'HEALTH_LARGE',
  TREASURE = 'TREASURE',
  AMMO = 'AMMO',
  WEAPON = 'WEAPON'
}
```

#### Difficulty
Game difficulty levels.

```typescript
enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}
```

## Client Implementation Guidelines

### Game API Integration

When integrating with the game engine APIs, follow these guidelines:

1. **Initialize Game State**: Always use `createInitialGameState()` to start a new game rather than manually constructing state objects.

2. **Frame Rate Management**: Call game update functions (movePlayer, updateEnemies, etc.) within the game loop at consistent intervals.

3. **State Updates**: The game engine modifies state objects in place. When maintaining game history, create deep copies of state objects before passing them to engine functions.

4. **Raycasting Optimization**: Cache raycasting results when possible and limit the number of rays cast per frame based on screen resolution.

5. **Memory Management**: Remove event listeners and clear intervals when changing levels or ending the game to prevent memory leaks.

### Editor API Integration

When integrating with the editor backend API:

1. **Error Handling**: Always handle potential errors from API calls, especially network failures and validation errors.

2. **Loading Sequence**: Follow this sequence when loading a level:
   - GET /api/levels to get available levels
   - GET /api/levels/{filename} to retrieve level data
   - Update editor UI with retrieved data

3. **Saving Workflow**: Implement a save confirmation workflow:
   - Check if current changes are dirty
   - Prompt user to save before loading another level
   - Show success/error notifications after save operations

4. **Filename Validation**: Validate level filenames follow the pattern "levelX-variantY.ts" before making API calls.

5. **Data Validation**: Validate map data structure before sending to the server to catch errors early.

## Versioning and Backward Compatibility

### API Versioning Strategy

The current API does not include versioning in the endpoints. Future versions should implement URL-based versioning:

```
/api/v1/levels
/api/v2/levels
```

### Backward Compatibility

The system maintains backward compatibility through:

1. **Data Migration**: The `backwardCompatibilityTests.ts` file contains tests for data migration between versions.

2. **Optional Properties**: New properties should be optional to maintain compatibility with older clients.

3. **Enum Extensibility**: New enum values can be added without breaking existing code that uses switch statements with default cases.

4. **Function Parameters**: New parameters should be added as optional parameters to avoid breaking existing function calls.

### Breaking Changes Policy

When breaking changes are necessary:

1. Maintain both old and new APIs for one major version cycle
2. Deprecate old endpoints with appropriate HTTP headers
3. Provide migration guides for affected clients
4. Update documentation to reflect changes

## Code Examples

### Game Engine Usage

```typescript
// Initialize a new game
const gameState = createInitialGameState(Difficulty.NORMAL);

// Game loop example
function gameLoop() {
  const deltaTime = 16.67; // ~60 FPS
  
  // Handle player movement
  const moveX = Math.cos(player.direction) * 0.05;
  const moveY = Math.sin(player.direction) * 0.05;
  movePlayer(gameState.player, moveX, moveY, gameState.currentMap.tiles);
  
  // Update enemies
  const { enemies, player, tilesUpdated } = updateEnemies(
    gameState.enemies,
    gameState.player,
    gameState.currentMap.tiles,
    deltaTime,
    gameState.difficulty
  );
  
  // Process item collection
  const { player: updatedPlayer, notification, newCollectedItemsInLevel } = collectItem(
    gameState.player,
    gameState.items,
    gameState.collectedItemsInLevel
  );
  
  // Update game state with new collection count
  gameState.collectedItemsInLevel = newCollectedItemsInLevel;
  
  // Cast rays for rendering
  const rays = [];
  for (let x = 0; x < screenWidth; x++) {
    const cameraX = 2 * x / screenWidth - 1;
    const rayDirX = player.directionX + planeX * cameraX;
    const rayDirY = player.directionY + planeY * cameraX;
    
    const rayResult = castRay(
      player.x,
      player.y,
      rayDirX,
      rayDirY,
      gameState.currentMap
    );
    rays.push(rayResult);
  }
  
  // Request next frame
  requestAnimationFrame(gameLoop);
}
```

### Editor API Integration

```typescript
// Client-side API wrapper
class LevelEditorClient {
  private baseUrl = 'http://localhost:3001';
  
  async getLevels(): Promise<{ filename: string; level: number; variant: number }[]> {
    const response = await fetch(`${this.baseUrl}/api/levels`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data.levels;
  }
  
  async loadLevel(filename: string): Promise<GameMap> {
    const response = await fetch(`${this.baseUrl}/api/levels/${filename}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data.data;
  }
  
  async saveLevel(filename: string, data: GameMap): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/levels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, data }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }
  }
}

// Usage example
async function editLevel() {
  const client = new LevelEditorClient();
  
  try {
    // Get available levels
    const levels = await client.getLevels();
    console.log('Available levels:', levels);
    
    // Load a specific level
    const mapData = await client.loadLevel('level1-variant1.ts');
    console.log('Loaded level:', mapData);
    
    // Modify the map (example: add an enemy)
    mapData.enemies.push({
      id: `enemy-${Date.now()}`,
      type: EnemyType.ZOMBIE,
      x: 10,
      y: 10,
      health: 100,
      maxHealth: 100,
      damage: 10,
      speed: 0.02,
      state: 'alive',
      direction: 0,
      lastAttackTime: 0,
      attackCooldown: 1000
    });
    
    // Save changes
    await client.saveLevel('level1-variant1.ts', mapData);
    console.log('Level saved successfully');
  } catch (error) {
    console.error('Error editing level:', error);
  }
}
```