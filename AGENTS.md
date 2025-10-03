# Agent Instructions & Project Overview

This document provides a guide for AI agents to understand and modify this project.

## Project Overview

This is a 2.5D raycasting game, similar to Wolfenstein 3D, built with React, TypeScript, and Vite. The game features multiple levels, different enemy types, weapons, and items. All assets like textures and sounds are generated procedurally.

## Core Components

The main logic is located in the `src/` directory.

*   **`gameEngine.ts`**: This is the most important file. It contains the core game state management and logic, including:
    *   Player movement and collision detection (`movePlayer`, `checkCollision`).
    *   Enemy AI and behavior (`updateEnemies`).
    *   Combat mechanics (`fireWeapon`).
    *   Level progression (`loadNextLevel`).
    *   State initialization (`createInitialGameState`).

*   **`App.tsx`**: The main React component that orchestrates the game. It contains:
    *   The main game loop (`requestAnimationFrame`).
    *   Rendering of the game world, HUD, and menus.
    *   Handling user input (keyboard and mouse).

*   **`types.ts`**: Defines all the core data structures and enums used throughout the application. Key types include `GameState`, `Player`, `Enemy`, `Item`, and enums like `EnemyType`, `ItemType`, and `WeaponType`.

*   **`levels.ts`**: Contains the definitions for all game levels (`LEVEL_1`, `LEVEL_2`, etc.). Each level object defines:
    *   The map layout (`tiles`).
    *   Initial enemy placements (`enemies`).
    *   Item locations (`items`).
    *   Player start position (`playerStartX`, `playerStartY`).

*   **`textures.ts`**: Handles the procedural generation of all visual textures. Each enemy, item, and wall type has a corresponding function (e.g., `createZombieTexture`, `createBrickTexture`) that draws it onto an HTML canvas.

*   **`soundSystem.ts`**: Manages all audio. Sounds are generated procedurally using the Web Audio API.

*   **`raycasting.ts`**: The rendering engine. It takes the game state and map data to draw the 3D world view on the main canvas.

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

#### How to Add a New Level

1.  **`levels.ts`**:
    *   Create a new `GameMap` object (e.g., `LEVEL_6`).
    *   Define its `tiles`, `enemies`, and `items`.
    *   Add the new level object to the `LEVELS` array at the end of the file.
