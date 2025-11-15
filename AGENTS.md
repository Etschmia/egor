# Agent Instructions & Project Overview

This document provides a guide for AI agents to understand and modify this project.

## Project Overview

This is a 2.5D raycasting game, similar to Wolfenstein 3D, built with React, TypeScript, and Vite. The game features 8 levels with multiple variants, 4 enemy types, weapons, items, decorative objects, and wall pictures. All assets like textures and sounds are generated procedurally. The game includes a dynamic map selection system that rotates level variants for replayability.

## Technology Stack

### Core Dependencies
- **React**: `^19.1.1` - UI framework with React 19 features
- **React DOM**: `^19.1.1` - React renderer for DOM
- **TypeScript**: `~5.9.3` - Type-safe JavaScript with strict mode
- **Vite**: `^7.1.7` - Modern build tool and development server
- **React Compiler**: `babel-plugin-react-compiler@^19.1.0-rc.3` - Automatic React optimizations

### Development Tools
- **ESLint**: `^9.36.0` - Code linting with flat config
- **TypeScript ESLint**: `^8.45.0` - TypeScript-specific linting rules
- **React Hooks ESLint Plugin**: `^5.2.0` - React Hooks best practices
- **Express**: `^5.1.0` - Backend server for editor/designer modes
- **Concurrently**: `^9.2.1` - Run multiple npm scripts in parallel

### Web APIs Used
- **Canvas API**: 2D rendering for game world and textures
- **Web Audio API**: Procedural sound generation
- **localStorage**: Save game persistence
- **requestAnimationFrame**: Game loop timing

### Build Configuration
- **Module System**: ESM (ECMAScript Modules) - `"type": "module"` in package.json
- **Target**: ES2022 (TypeScript and JavaScript output)
- **Module Resolution**: `bundler` (Vite-compatible)
- **JSX**: `react-jsx` (React 17+ transform)

## Project Structure

```
egor/
├── src/                      # Main source code
│   ├── App.tsx              # Main React component (game loop, rendering, input)
│   ├── types.ts             # All TypeScript type definitions and enums
│   ├── gameEngine.ts        # Core game logic (movement, combat, AI, state)
│   ├── raycasting.ts        # 3D rendering engine (ray casting, sprites)
│   ├── textures.ts          # Procedural texture generation
│   ├── soundSystem.ts       # Procedural sound generation (Web Audio API)
│   ├── weapons.ts           # Weapon definitions and properties
│   ├── levels.ts            # Level management and variant system
│   ├── mapSelectionSystem.ts # Dynamic level variant selection
│   ├── saveLoadSystem.ts    # Game state persistence (localStorage)
│   ├── performanceMonitor.ts # Performance monitoring utilities
│   ├── main.tsx             # React app entry point
│   ├── index.css            # Global styles
│   │
│   ├── levels/              # Level variant files
│   │   ├── level1-variant1.ts
│   │   ├── level1-variant2.ts
│   │   └── ...              # 7 levels × 5 variants = 35 level files
│   │
│   ├── shared/              # Shared code (game + editor + designer)
│   │   ├── design-tokens/   # Theme management system
│   │   └── texture-generation/ # Centralized texture generation
│   │
│   ├── editor/              # Visual level editor (dev only)
│   │   ├── Editor.tsx       # Main editor component
│   │   ├── components/      # Editor UI components
│   │   ├── hooks/           # Editor-specific React hooks
│   │   └── utils/           # Editor utilities
│   │
│   ├── designer/            # Visual theme editor (dev only)
│   │   ├── Designer.tsx     # Main designer component
│   │   ├── components/      # Designer UI components
│   │   ├── hooks/           # Designer-specific React hooks
│   │   ├── utils/           # Designer utilities
│   │   └── asset-types/     # Asset type definitions
│   │
│   └── migration/           # Migration utilities for compatibility
│
├── public/                  # Static assets
├── themes/                  # Theme files (designer output)
│   ├── default.json
│   └── custom-themes/
│
├── docs/                    # Documentation files
├── dist/                    # Build output (gitignored)
├── node_modules/            # Dependencies (gitignored)
│
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript root config
├── tsconfig.app.json        # App TypeScript config
├── tsconfig.node.json       # Node TypeScript config
├── vite.config.ts           # Vite config (main app)
├── vite.editor.config.ts    # Vite config (editor)
├── vite.designer.config.ts  # Vite config (designer)
├── eslint.config.js         # ESLint configuration
├── editor-server.mjs        # Express server for level editor
├── designer-server.mjs      # Express server for theme designer
└── AGENTS.md                # This file
```

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

*   **`weapons.ts`**: Defines all weapon types and their properties (damage, fire rate, range, etc.).

*   **`saveLoadSystem.ts`**: Handles game state persistence using localStorage. Provides save/load functionality.

*   **`shared/`**: Shared utilities and systems:
    *   **`design-tokens/`**: Theme management and design system
    *   **`texture-generation/`**: Centralized texture generation system

*   **`editor/`**: Visual level editor (development only) - allows creating and editing levels without code.

*   **`designer/`**: Visual theme editor (development only) - allows creating and editing wall textures and themes.

*   **`migration/`**: Migration utilities for backward compatibility when system changes occur.

*   **`performanceMonitor.ts`**: Performance monitoring utilities for development and debugging.

*   **`utils/levelValidator.ts`**: Level validation tool for enemy spawn safety. Validates all level variants against safety rules (minimum 3-second distance, 2-second movement delay). See [Enemy Spawn Safety Documentation](../docs/enemy-spawn-safety.md) for details.

## TypeScript Configuration

### Compiler Options (tsconfig.app.json)
- **Target**: ES2022
- **Module**: ESNext
- **Module Resolution**: `bundler` (for Vite)
- **JSX**: `react-jsx` (automatic JSX runtime)
- **Strict Mode**: Enabled (all strict TypeScript checks)
- **Lib**: `["ES2022", "DOM", "DOM.Iterable"]`
- **Unused Variables**: Checked (`noUnusedLocals: true`, `noUnusedParameters: true`)
- **Verbatim Module Syntax**: Enabled (enforces explicit `.ts` extensions in imports)

### Important TypeScript Rules
- Always use explicit file extensions in imports: `import { x } from './file.ts'` (not `'./file'`)
- Unused variables and parameters are errors (must be removed or prefixed with `_`)
- All code must pass strict type checking
- Use `type` for type-only imports: `import type { X } from './types.ts'`

## Coding Guidelines

### Import/Export Style
- Use ESM syntax: `import` / `export`
- Always include `.ts` extension in relative imports (TypeScript requirement with `verbatimModuleSyntax`)
- Group imports: React first, then types, then local imports
- Use `type` keyword for type-only imports to enable tree-shaking

**Example:**
```typescript
import { useEffect, useRef, useState } from 'react';
import type { GameState, Player } from './types.ts';
import { createInitialGameState } from './gameEngine.ts';
```

### Naming Conventions
- **Files**: camelCase for `.ts` files, PascalCase for React components (`.tsx`)
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Enums**: PascalCase with UPPER_CASE values
- **Constants**: UPPER_SNAKE_CASE for module-level constants

### React Best Practices
- Use functional components with hooks
- Prefer `useCallback` for event handlers passed to children
- Use `useRef` for mutable values that don't trigger re-renders
- Keep game state in `useRef` for performance-critical game loop, sync to `useState` for UI updates
- React Compiler is enabled - avoid manual memoization unless necessary

### Code Organization
- Keep pure game logic separate from React components (e.g., `gameEngine.ts`)
- Render logic in components, update logic in engine functions
- Use TypeScript interfaces for all data structures
- Group related functionality in modules
- Export only public APIs from modules

### ESLint Configuration
- React Hooks rules enforced (hooks must be in correct order, dependencies must be specified)
- TypeScript strict rules enabled
- Recommended JavaScript rules from ESLint
- Unused imports/variables are errors

## Build & Development Process

### Available Scripts
- `npm run dev`: Start development server (Vite on default port)
- `npm run build`: Build for production (`tsc -b && vite build`)
- `npm run lint`: Run ESLint on all files
- `npm run preview`: Preview production build
- `npm run editor`: Start level editor (frontend + backend)
- `npm run designer`: Start theme designer (frontend + backend)

### Build Process
1. TypeScript compilation (`tsc -b`) - type checking and compilation
2. Vite bundling - code bundling, minification, asset optimization
3. Output goes to `dist/` directory

### Development Workflow
- Hot Module Replacement (HMR) enabled in development
- Type checking happens during build, not during dev (for speed)
- Editor and Designer run on separate ports (3000-3003) with Express backends

### File Structure Rules
- Source files in `src/`
- Level variants in `src/levels/`
- Shared utilities in `src/shared/`
- Editor tools in `src/editor/` and `src/designer/`
- Build output in `dist/` (gitignored)

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

## Best Practices for AI Agents

### Before Making Changes
1. **Understand the Architecture**: Review the relevant files mentioned in "Core Components" before modifying them
2. **Check Type Definitions**: Always review `types.ts` to understand data structures
3. **Verify Import Paths**: Ensure all imports include `.ts` extensions for relative paths
4. **Test Type Safety**: Run `npm run build` to verify TypeScript compilation passes

### When Adding New Features
1. **Follow Existing Patterns**: Look at similar implementations (e.g., how enemies are added, how levels are structured)
2. **Update Type Definitions First**: Add new types to `types.ts` before implementing functionality
3. **Maintain Separation of Concerns**: Game logic goes in `gameEngine.ts`, rendering in `App.tsx` or `raycasting.ts`
4. **Use Existing Systems**: Leverage texture generation, sound system, save/load system instead of creating new ones

### Code Quality Requirements
1. **Pass ESLint**: All code must pass `npm run lint` without errors
2. **Type Safety**: All functions must have proper TypeScript types
3. **No Unused Code**: Remove unused imports, variables, and parameters (or prefix with `_`)
4. **Performance**: Consider performance implications - this is a game with 60 FPS target
5. **LocalStorage Compatibility**: When modifying save/load system, consider backward compatibility

### File Organization
- **Game Logic**: `src/gameEngine.ts`, `src/raycasting.ts`, `src/weapons.ts`
- **Data**: `src/types.ts`, `src/levels.ts`, `src/levels/*.ts`
- **Systems**: `src/textures.ts`, `src/soundSystem.ts`, `src/saveLoadSystem.ts`
- **Components**: `src/App.tsx`, `src/MiniMap.tsx`
- **Shared Code**: `src/shared/` (used by main game, editor, and designer)

### Common Pitfalls to Avoid
1. **Missing `.ts` Extensions**: Always include `.ts` in relative imports
2. **State Management**: Don't trigger React re-renders in the game loop (use `useRef` for game state)
3. **Memory Leaks**: Clean up event listeners, animation frames, and intervals
4. **Performance**: Avoid creating new objects/arrays in render loop, reuse when possible
5. **Type Coercion**: Don't use `any` types - use proper TypeScript types

### Testing Changes
1. **Build Test**: Run `npm run build` to verify compilation
2. **Lint Check**: Run `npm run lint` to verify code style
3. **Runtime Test**: Run `npm run dev` and test in browser
4. **Save/Load Test**: Verify save/load functionality still works after changes
5. **Performance Test**: Monitor frame rate, especially when adding new features

### When Modifying Core Systems
- **gameEngine.ts**: Changes here affect all game mechanics - be careful with state mutations
- **types.ts**: Changing types may require updates across multiple files
- **textures.ts**: Texture changes affect visual appearance - test in game
- **raycasting.ts**: Rendering changes affect performance - profile carefully
- **levels.ts**: Level changes affect gameplay - verify all variants still work
