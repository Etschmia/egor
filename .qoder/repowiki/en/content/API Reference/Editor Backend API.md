# Editor Backend API

<cite>
**Referenced Files in This Document**   
- [editor-server.mjs](file://editor-server.mjs)
- [useApiClient.ts](file://src/editor/hooks/useApiClient.ts)
- [types.ts](file://src/types.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
3. [Security Measures](#security-measures)
4. [Code Generation Process](#code-generation-process)
5. [Client Implementation Guidelines](#client-implementation-guidelines)
6. [Error Handling and Retry Logic](#error-handling-and-retry-logic)
7. [Data Structures](#data-structures)

## Introduction

The Editor Backend API provides a RESTful interface for managing game level data in a level editor application. The API enables clients to retrieve, save, and manage level files stored as TypeScript modules in the `src/levels` directory. This documentation details the three primary endpoints, their request/response schemas, security measures, code generation process, and client-side implementation patterns.

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L1-L50)

## API Endpoints

### GET /api/levels

Retrieves a list of all available level files in the system.

**HTTP Method**: GET  
**URL Pattern**: `/api/levels`  
**Authentication**: None  
**Request Parameters**: None  
**Request Body**: None  

**Response Schema**:
```json
{
  "success": boolean,
  "levels": [
    {
      "filename": string,
      "level": number,
      "variant": number
    }
  ]
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "levels": [
    {
      "filename": "level1-variant1.ts",
      "level": 1,
      "variant": 1
    },
    {
      "filename": "level1-variant2.ts",
      "level": 2,
      "variant": 2
    }
  ]
}
```

**Error Responses**:
- 500 Internal Server Error: Failed to list level files

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L108-L138)

### GET /api/levels/:filename

Retrieves the content of a specific level file.

**HTTP Method**: GET  
**URL Pattern**: `/api/levels/:filename`  
**Authentication**: None  
**Request Parameters**:
- `filename` (path parameter): Name of the level file to retrieve (e.g., `level1-variant1.ts`)

**Request Body**: None  

**Response Schema**:
```json
{
  "success": boolean,
  "data": GameMap,
  "error": string
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "width": 10,
    "height": 10,
    "tiles": [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1]
    ],
    "enemies": [
      {
        "id": "enemy-1",
        "type": "ZOMBIE",
        "x": 5,
        "y": 5,
        "health": 100,
        "maxHealth": 100,
        "damage": 10,
        "speed": 0.5,
        "state": "alive",
        "direction": 0,
        "lastAttackTime": 0,
        "attackCooldown": 1000
      }
    ],
    "items": [],
    "wallPictures": [],
    "decorativeObjects": [],
    "playerStartX": 1.5,
    "playerStartY": 1.5,
    "playerStartDirection": 0
  }
}
```

**Error Responses**:
- 400 Bad Request: Invalid filename format
- 403 Forbidden: Path outside of levels directory
- 404 Not Found: Level file not found
- 500 Internal Server Error: Failed to read level file

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L141-L225)

### POST /api/levels

Saves or creates a level file with the provided data.

**HTTP Method**: POST  
**URL Pattern**: `/api/levels`  
**Authentication**: None  
**Request Parameters**: None  

**Request Body Schema**:
```json
{
  "filename": string,
  "data": GameMap
}
```

**Required Fields in Map Data**:
- width, height
- tiles (2D array)
- enemies, items, wallPictures, decorativeObjects
- playerStartX, playerStartY, playerStartDirection

**Response Schema**:
```json
{
  "success": boolean,
  "message": string,
  "error": string
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Level file level1-variant1.ts saved successfully"
}
```

**Error Responses**:
- 400 Bad Request: Missing required fields or invalid data structure
- 403 Forbidden: Path outside of levels directory
- 500 Internal Server Error: Failed to save level file

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L228-L349)

## Security Measures

The API implements several security measures to prevent directory traversal attacks and ensure data integrity:

### Path Validation
The `isPathSafe` function validates that all file operations remain within the designated `src/levels` directory:

```javascript
function isPathSafe(requestedPath) {
  const normalizedPath = resolve(requestedPath);
  const relativePath = relative(LEVELS_DIR, normalizedPath);
  return !relativePath.startsWith('..') && !relativePath.includes('..');
}
```

This function:
- Resolves the requested path to its absolute form
- Calculates the relative path from the levels directory
- Ensures the relative path doesn't start with `..` or contain `..` segments
- Prevents access to files outside the levels directory

### Filename Validation
The API validates filename format using a regular expression that ensures filenames follow the pattern `levelX-variantY.ts`:

```javascript
function parseFilename(filename) {
  const match = filename.match(/^level(\d+)-variant(\d+)\.ts$/);
  if (match) {
    return {
      level: parseInt(match[1], 10),
      variant: parseInt(match[2], 10)
    };
  }
  return null;
}
```

This validation:
- Ensures only properly formatted level files can be accessed
- Extracts level and variant numbers for sorting and organization
- Prevents access to arbitrary files in the levels directory

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L35-L55)
- [editor-server.mjs](file://editor-server.mjs#L68-L80)

## Code Generation Process

The API converts JSON game map data into TypeScript module format through a code generation process implemented in the `generateLevelCode` function.

### Process Flow
1. Parse the filename to extract level and variant numbers
2. Generate appropriate constant name (e.g., `LEVEL_1_VARIANT_1`)
3. Format each data structure (tiles, enemies, items, etc.) as TypeScript code
4. Determine required imports based on data content
5. Generate complete TypeScript module with proper formatting

### Dynamic Import Generation
The code generation process dynamically determines required imports based on the content:

```javascript
// Check if any item has a weaponType to determine if we need to import WeaponType
const needsWeaponType = mapData.items.some(item => item.weaponType !== undefined);
  
// Build import statement dynamically
const imports = ['type GameMap', 'EnemyType', 'ItemType', 'WallPictureType', 'DecorativeObjectType'];
if (needsWeaponType) {
  imports.push('WeaponType');
}
```

This ensures:
- Only necessary imports are included
- Type safety is maintained
- Generated code follows project conventions

### Output Format
The generated TypeScript code follows a consistent format with proper indentation and structure, making it readable and maintainable:

```typescript
import { type GameMap, EnemyType, ItemType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_1_VARIANT_1: GameMap = {
  width: 10,
  height: 10,
  tiles: [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1]
  ],
  // ... other properties
};
```

**Section sources**
- [editor-server.mjs](file://editor-server.mjs#L83-L105)
- [editor-server.mjs](file://editor-server.mjs#L105-L106)

## Client Implementation Guidelines

The frontend client uses the `useApiClient` hook to interact with the backend API endpoints. This hook provides a clean interface for level management operations.

### Hook Usage
The `useApiClient` hook exports three primary functions that map directly to backend endpoints:

```typescript
const { fetchLevels, loadLevel, saveLevel, isLoading, error } = useApiClient();
```

### Function Mapping

#### fetchLevels
Maps to GET /api/levels endpoint:

```typescript
const fetchLevels = useCallback(async (): Promise<LevelInfo[]> => {
  const response = await fetchWithRetry<FetchLevelsResponse>(
    `${API_BASE_URL}/levels`
  );
  return response.levels;
}, []);
```

#### loadLevel
Maps to GET /api/levels/:filename endpoint:

```typescript
const loadLevel = useCallback(async (filename: string): Promise<GameMap> => {
  const response = await fetchWithRetry<LoadLevelResponse>(
    `${API_BASE_URL}/levels/${encodeURIComponent(filename)}`
  );
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to load level data');
  }
  
  return response.data;
}, []);
```

#### saveLevel
Maps to POST /api/levels endpoint:

```typescript
const saveLevel = useCallback(async (
  filename: string,
  data: GameMap
): Promise<void> => {
  const response = await fetchWithRetry<SaveLevelResponse>(
    `${API_BASE_URL}/levels`,
    {
      method: 'POST',
      body: JSON.stringify({ filename, data }),
    }
  );
  
  if (!response.success) {
    throw new Error(response.error || 'Failed to save level');
  }
}, []);
```

**Section sources**
- [useApiClient.ts](file://src/editor/hooks/useApiClient.ts#L75-L150)

## Error Handling and Retry Logic

The client implements robust error handling and retry logic to ensure reliable communication with the backend API.

### Retry Mechanism
The `fetchWithRetry` function implements exponential retry logic for network requests:

```typescript
const fetchWithRetry = async <T,>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.error || `HTTP error! status: ${response.status}`,
        status: response.status,
      } as ApiError;
    }

    return await response.json();
  } catch (err) {
    // If we have retries left and it's a network error, retry
    if (retries > 0 && (err instanceof TypeError || (err as ApiError).status === undefined)) {
      await delay(RETRY_DELAY);
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw err;
  }
};
```

Key features:
- Maximum of 3 retries (configurable via MAX_RETRIES)
- 1-second delay between retries (configurable via RETRY_DELAY)
- Only retries on network errors (TypeError) or undefined status
- Preserves original error after retries are exhausted

### Error Classification
The retry logic distinguishes between different error types:
- **Network errors** (TypeError): Retried automatically
- **HTTP errors** (with status code): Not retried, treated as client/server errors
- **Validation errors**: Not retried, require user intervention

### State Management
The hook maintains loading and error states for UI feedback:

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

These states are updated before and after each request, enabling the UI to:
- Display loading spinners during requests
- Show error messages when operations fail
- Prevent concurrent operations

**Section sources**
- [useApiClient.ts](file://src/editor/hooks/useApiClient.ts#L25-L73)

## Data Structures

### GameMap Interface
The core data structure representing a game level:

```typescript
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
```

### Related Enumerations
The system uses several enumerations to define game entities:

- **EnemyType**: ZOMBIE, MONSTER, GHOST, DOG
- **ItemType**: HEALTH_SMALL, HEALTH_LARGE, TREASURE, AMMO, WEAPON
- **WallPictureType**: PORTRAIT, LANDSCAPE, ABSTRACT
- **DecorativeObjectType**: CEILING_LIGHT, VASE, CRATE, BENCH, TABLE, CHAIR, WINE_BOTTLE, SKELETON
- **WeaponType**: KNIFE, PISTOL, MACHINE_PISTOL, CHAINSAW, ASSAULT_RIFLE, HEAVY_MG

These data structures ensure type safety and consistency across the application.

**Section sources**
- [types.ts](file://src/types.ts#L113-L124)
- [types.ts](file://src/types.ts#L27-L32)
- [types.ts](file://src/types.ts#L52-L58)
- [types.ts](file://src/types.ts#L76-L80)
- [types.ts](file://src/types.ts#L91-L100)
- [types.ts](file://src/types.ts#L7-L14)