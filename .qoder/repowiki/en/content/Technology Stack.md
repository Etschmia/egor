# Technology Stack

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json)
- [vite.config.ts](file://vite.config.ts)
- [vite.editor.config.ts](file://vite.editor.config.ts)
- [editor-server.mjs](file://editor-server.mjs)
- [main.tsx](file://src/main.tsx)
- [raycasting.ts](file://src/raycasting.ts)
- [soundSystem.ts](file://src/soundSystem.ts)
- [saveLoadSystem.ts](file://src/saveLoadSystem.ts)
- [gameEngine.ts](file://src/gameEngine.ts)
- [types.ts](file://src/types.ts)
- [textures.ts](file://src/textures.ts)
- [levels.ts](file://src/levels.ts)
- [mapSelectionSystem.ts](file://src/mapSelectionSystem.ts)
- [weapons.ts](file://src/weapons.ts)
</cite>

## Table of Contents
1. [Frontend Technology](#frontend-technology)
2. [Backend Technology](#backend-technology)
3. [Core Libraries and APIs](#core-libraries-and-apis)
4. [Modern JavaScript Features](#modern-javascript-features)
5. [Technology Integration](#technology-integration)
6. [Version Compatibility](#version-compatibility)

## Frontend Technology

The egor project utilizes a modern frontend stack centered around React 19, TypeScript, and Vite to deliver a high-performance raycasting game and interactive level editor. The application is structured into two main entry points: the game interface and the level editor, each with dedicated configuration.

React 19 serves as the foundation for component architecture, enabling the creation of reusable UI components such as the MapCanvas, Toolbar, and EntityDialog. The StrictMode rendering ensures detection of potential problems in the application, while the component-based structure facilitates maintainable code organization. The editor interface, located in the `src/editor` directory, implements a comprehensive set of React components including ContextMenu, LevelSelector, and Toast for user interaction.

TypeScript provides robust type safety across the entire codebase, defining comprehensive interfaces for game entities including Player, Enemy, Item, and GameMap. The type system enforces data integrity for critical game mechanics such as weapon properties, enemy behaviors, and map configurations. Enum types like WeaponType, EnemyType, and DecorativeObjectType ensure type-safe handling of game elements, while complex interfaces define the structure of game state, map data, and rendering parameters.

Vite acts as the build tooling and development server, offering rapid startup times and efficient hot module replacement. The project employs two Vite configurations: `vite.config.ts` for the main game application and `vite.editor.config.ts` for the level editor. Both configurations leverage the `@vitejs/plugin-react` plugin with the React Compiler enabled via `babel-plugin-react-compiler`, which optimizes component rendering by automatically memoizing components. The editor configuration specifies a custom root and build input to serve the editor interface from `editor.html` on port 3000.

**Section sources**
- [package.json](file://package.json#L1-L20)
- [vite.config.ts](file://vite.config.ts#L1-L14)
- [vite.editor.config.ts](file://vite.editor.config.ts#L1-L24)
- [main.tsx](file://src/main.tsx#L1-L10)
- [src/editor/main.tsx](file://src/editor/main.tsx#L1-L12)
- [types.ts](file://src/types.ts#L1-L176)

## Backend Technology

The egor project features a lightweight Node.js backend implemented in `editor-server.mjs` that powers the level editor functionality. This server enables persistent storage and retrieval of level data through a RESTful API, facilitating the creation and modification of game levels.

The backend is built using Express.js, a minimal and flexible Node.js web application framework, and utilizes the `cors` middleware to enable cross-origin resource sharing between the frontend editor and the server. The server exposes three primary endpoints: `GET /api/levels` to list all available level files, `GET /api/levels/:filename` to read a specific level file, and `POST /api/levels` to save or create level files. These endpoints operate on the `src/levels` directory, where level data is stored as TypeScript files.

The server implements robust security measures to prevent path traversal attacks by validating that requested file paths remain within the designated levels directory. It includes comprehensive error handling and input validation to ensure data integrity. When saving levels, the server generates valid TypeScript code that exports a `GameMap` constant, complete with appropriate imports and properly formatted data structures for tiles, enemies, items, and decorative objects.

The backend leverages modern JavaScript features through the ES module system (`"type": "module"` in package.json), allowing the use of `import` statements for dependency management. The server runs on port 3001 and is launched alongside the frontend editor using the `concurrently` package, enabling a seamless development experience where both the editor interface and its backend service start with a single command.

**Section sources**
- [package.json](file://package.json#L1-L20)
- [editor-server.mjs](file://editor-server.mjs#L1-L351)
- [vite.editor.config.ts](file://vite.editor.config.ts#L1-L24)

## Core Libraries and APIs

The egor project leverages several key web APIs to implement its core functionality, including the HTML Canvas API for 3D rendering, the Web Audio API for procedural sound generation, and localStorage for persistent data storage.

The HTML Canvas API is central to the raycasting engine implementation in `raycasting.ts`. The engine uses the Digital Differential Analysis (DDA) algorithm to cast rays from the player's position, calculating wall distances and rendering them with proper perspective. The Canvas API enables real-time rendering of the 3D environment, sprites, and UI elements. The `getSpritesToRender` function transforms enemy, item, and decorative object positions into screen coordinates, sorting them by distance for proper depth rendering. The raycasting implementation includes optimizations such as view frustum culling to improve performance by only rendering sprites within the player's field of view.

The Web Audio API powers the procedural sound generation system in `soundSystem.ts`. The `SoundSystem` class creates an `AudioContext` and uses oscillators to generate tones of specific frequencies, durations, and waveforms (sine, square, sawtooth, triangle). This approach allows for lightweight sound effects without requiring audio files, including weapon sounds (shoot, knife attack, chainsaw), enemy reactions (hit, death), player feedback (pickup, hit), and UI sounds (menu select, error). The system implements 3D positional audio through the `play3dSound` method, which calculates distance-based volume attenuation to create an immersive audio experience.

localStorage provides persistent data storage for game saves and map history. The `saveLoadSystem.ts` module implements functions to save, load, list, and delete game states, using a prefix (`egor_save_`) to organize stored data. The map selection system in `mapSelectionSystem.ts` uses localStorage to track which level variants have been played, enabling the game to offer new experiences by selecting unplayed variants or the least recently played ones. The system includes error handling and fallback mechanisms to gracefully handle cases where localStorage is unavailable.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L1-L230)
- [soundSystem.ts](file://src/soundSystem.ts#L1-L128)
- [saveLoadSystem.ts](file://src/saveLoadSystem.ts#L1-L66)
- [mapSelectionSystem.ts](file://src/mapSelectionSystem.ts#L1-L215)

## Modern JavaScript Features

The egor project takes advantage of modern JavaScript features enabled by its module-based configuration and tooling setup. The `package.json` file specifies `"type": "module"`, which enables ES module syntax throughout the codebase, allowing the use of `import` and `export` statements for modular code organization.

The project leverages TypeScript 5.9.3 to provide static typing, interfaces, enums, and advanced type features such as generics and mapped types. This enables robust type checking across the entire application, from game state management to API interactions. The use of modern JavaScript syntax includes destructuring assignment, arrow functions, template literals, and optional chaining, which enhance code readability and maintainability.

The Vite build system, configured with the React Compiler plugin, enables cutting-edge React features such as automatic memoization and optimized component rendering. This reduces the need for manual performance optimizations and improves the application's responsiveness. The project also utilizes modern JavaScript features like `async`/`await` for asynchronous operations in the editor server, making file system operations and API endpoints more readable and easier to maintain.

The codebase demonstrates the use of advanced JavaScript patterns including factory functions (e.g., `createInitialPlayer`, `createDog`), functional programming concepts in game logic, and object-oriented design principles through classes like `SoundSystem`. The use of `Map` and `Set` data structures in the map selection system provides efficient data management for tracking played levels and variants.

**Section sources**
- [package.json](file://package.json#L1-L20)
- [vite.config.ts](file://vite.config.ts#L1-L14)
- [gameEngine.ts](file://src/gameEngine.ts#L1-L705)
- [soundSystem.ts](file://src/soundSystem.ts#L1-L128)
- [mapSelectionSystem.ts](file://src/mapSelectionSystem.ts#L1-L215)

## Technology Integration

The technologies in the egor project work together seamlessly to enable the raycasting engine, real-time rendering, and interactive editor functionality. The integration of React, TypeScript, Vite, Node.js, and web APIs creates a cohesive system where each component plays a specific role in delivering the overall gaming and editing experience.

The raycasting engine, implemented in `raycasting.ts`, integrates with the Canvas API to render the 3D environment in real-time. This engine works in conjunction with the game engine in `gameEngine.ts`, which handles player movement, collision detection, enemy AI, and combat mechanics. The game engine uses the raycasting results to determine what the player sees and interacts with, creating a responsive first-person perspective.

The interactive level editor combines the React frontend with the Node.js backend to provide a complete editing workflow. The editor components in `src/editor` allow users to create and modify levels visually, while the `editor-server.mjs` backend persists these changes to disk as TypeScript files. This integration enables developers to design levels with a graphical interface while maintaining the benefits of code-based level definitions.

The sound system integrates with game events to provide audio feedback for player actions and enemy behaviors. When a player fires a weapon or an enemy is hit, the game engine calls the appropriate methods on the `soundSystem` singleton, which uses the Web Audio API to generate the corresponding sounds. The 3D positional audio feature enhances immersion by adjusting sound volume based on the distance between the player and sound sources.

Data persistence is achieved through the integration of localStorage with the game's state management. The save/load system allows players to save their progress, while the map selection system uses localStorage to track gameplay history and provide varied experiences across sessions. This integration ensures that player progress and preferences are maintained between sessions without requiring a backend database.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L1-L230)
- [gameEngine.ts](file://src/gameEngine.ts#L1-L705)
- [soundSystem.ts](file://src/soundSystem.ts#L1-L128)
- [saveLoadSystem.ts](file://src/saveLoadSystem.ts#L1-L66)
- [mapSelectionSystem.ts](file://src/mapSelectionSystem.ts#L1-L215)
- [editor-server.mjs](file://editor-server.mjs#L1-L351)

## Version Compatibility

The egor project maintains compatibility across its technology stack through careful version management in the `package.json` file. The project uses React 19.1.1 and React DOM 19.1.1, which are compatible with the React Compiler plugin version 19.1.0-rc.3 specified in the dependencies. This combination enables the use of React 19's latest features while benefiting from the performance optimizations of the React Compiler.

TypeScript version 5.9.3 is used across the project, with corresponding type definitions for React (@types/react 19.1.16), React DOM (@types/react-dom 19.1.9), and Node.js (@types/node 24.6.0). These versions are compatible with the Vite 7.1.7 build tool and the @vitejs/plugin-react 5.0.4 plugin, ensuring smooth compilation and development server operation.

The backend dependencies, including Express 5.1.0 and CORS 2.8.5, are compatible with Node.js's ES module system and provide the necessary functionality for the level editor API. The development dependencies include ESLint 9.36.0 with React-specific plugins for code quality enforcement.

The project's version choices reflect a balance between using modern features and maintaining stability. The use of caret versions (e.g., ^19.1.1) allows for minor and patch updates while preventing breaking changes. This approach ensures that the project can benefit from bug fixes and performance improvements without risking compatibility issues.

**Section sources**
- [package.json](file://package.json#L1-L40)