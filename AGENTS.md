# Agent Instructions & Project Overview

This document provides a guide for AI agents to understand and modify this project.

## Project Overview

This is a 2.5D raycasting game, similar to Wolfenstein 3D, built with React, TypeScript, and Vite. The game features 8 levels with multiple variants, 4 enemy types, weapons, items, decorative objects, and wall pictures. All assets like textures and sounds are generated procedurally. The game includes a dynamic map selection system that rotates level variants for replayability.

## Core Components

The main logic is located in the `src/` directory.

*   **`gameEngine.ts`**: This is the most important file. It contains the core game state management and logic, including:
    *   Player movement and collision detection (`movePlayer`, `checkCollision`, `checkDecorativeObjectCollision`).
    *   Enemy AI and behavior (`updateEnemies`) with pathfinding and door opening.
    *   Combat mechanics (`fireWeapon`).
    *   Level progression (`loadNextLevel`) with variant selection.
    *   State initialization (`createInitialGameState`).
    *   Door interaction (`openDoor`) for both normal and exit doors.

*   **`App.tsx`**: The main React component that orchestrates the game. It contains:
    *   The main game loop (`requestAnimationFrame`).
    *   Rendering of the game world, HUD, and menus.
    *   Handling user input (keyboard and mouse).

*   **`types.ts`**: Defines all the core data structures and enums used throughout the application. Key types include `GameState`, `Player`, `Enemy`, `Item`, and enums like `EnemyType`, `ItemType`, and `WeaponType`.

*   **`levels.ts`**: Contains the definitions for all game levels and the level variant system (`LEVELS_WITH_VARIANTS`). Each level can have multiple variants. Each level object defines:
    *   The map layout (`tiles`).
    *   Initial enemy placements (`enemies`).
    *   Item locations (`items`).
    *   Decorative objects (`decorativeObjects`).
    *   Wall pictures (`wallPictures`).
    *   Player start position (`playerStartX`, `playerStartY`).

*   **`levels/`**: Directory containing level variant files (e.g., `level2-variant3.ts`, `level3-variant1.ts`). Each file exports a complete level configuration.

*   **`mapSelectionSystem.ts`**: Manages dynamic level variant selection. It tracks which variants have been played and rotates through them to ensure variety. Uses localStorage to persist play history.

*   **`textures.ts`**: Handles the procedural generation of all visual textures. Each enemy, item, and wall type has a corresponding function (e.g., `createZombieTexture`, `createBrickTexture`) that draws it onto an HTML canvas.

*   **`soundSystem.ts`**: Manages all audio. Sounds are generated procedurally using the Web Audio API.

*   **`raycasting.ts`**: The rendering engine. It takes the game state and map data to draw the 3D world view on the main canvas. Includes:
    *   Ray casting algorithm (`castRay`).
    *   Sprite rendering with view frustum culling (`getSpritesToRender`).
    *   Optimized visibility checks to improve performance.

## Key Game Logic

### Game Loop

The game loop is in `App.tsx`. On each frame, it:
1.  Calculates `deltaTime`.
2.  Handles player input (movement, shooting).
3.  Calls `updateEnemies` from `gameEngine.ts` to move enemies and handle their attacks.
4.  Calls the rendering functions in `raycasting.ts`.
5.  Updates the React state to re-render the HUD.

### Adding New Content

#### How to Add a New Enemy

1.  **`types.ts`**: Add the new enemy to the `EnemyType` enum.
2.  **`textures.ts`**: Create two new functions, `create[EnemyName]Texture` and `create[EnemyName]CorpseTexture`, and add them to the `loadTextures` function.
3.  **`gameEngine.ts`**:
    *   Add the new enemy type to the `killedEnemies` object in `createInitialPlayer`.
    *   If the enemy has unique behavior (e.g., the dog's barking), add the logic to `updateEnemies`.
4.  **`levels.ts`**: Place the new enemy in the desired levels by adding it to the `enemies` array of a level object.

#### How to Add a New Level or Level Variant

1.  **Create a new level file** in `src/levels/` (e.g., `level9-variant1.ts`):
    *   Export a `GameMap` object with all required properties.
    *   Define `tiles`, `enemies`, `items`, `decorativeObjects`, and `wallPictures`.
    
2.  **`levels.ts`**:
    *   Import the new level variant.
    *   Add it to the appropriate level array in `LEVELS_WITH_VARIANTS`.
    *   If it's a completely new level (not a variant), create a new array entry.

#### How to Add a New Decorative Object Type

1.  **`types.ts`**: Add the new object to the `DecorativeObjectType` enum.
2.  **`textures.ts`**: Create a new texture generation function (e.g., `createVaseTexture`) and add it to `getDecorativeTexture`.
3.  **`gameEngine.ts`**: Add collision radius to `DECORATIVE_OBJECT_COLLISION_RADII` (0 for no collision).
4.  **`App.tsx`**: If the object needs special rendering (like ceiling lights), add logic to the decorative object rendering section.

#### Performance Considerations

- **View Frustum Culling**: Only sprites within the camera's view are rendered. This is handled in `raycasting.ts`.
- **Collision Optimization**: Early distance checks prevent unnecessary calculations in `checkDecorativeObjectCollision`.
- **Texture Caching**: All textures are generated once and cached in `textures.ts`.

#### Bug Fix: Ceiling Light Positioning

Ceiling lights are rendered with a special Y-offset calculation to keep them fixed at the ceiling:
```typescript
adjustedDrawStartY = -spriteHeight / 2 + height / 2 - spriteHeight * 0.8;
```
This ensures they scale correctly with perspective and don't float toward the player.
