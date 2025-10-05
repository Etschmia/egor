# Implementation Plan

- [x] 1. Setup project structure and dependencies
  - Install required npm packages (express, @types/express, concurrently, cors, @types/cors)
  - Create `editor.html` entry point in project root
  - Create `src/editor/` directory structure with subdirectories (components, hooks, utils)
  - Create `vite.editor.config.ts` configuration file
  - Update `package.json` with new scripts (editor, editor:frontend, editor:backend)
  - _Requirements: 1.1, 1.4_

- [x] 2. Implement File-API backend server
  - Create `editor-server.mjs` in project root
  - Implement Express server setup with CORS configuration
  - Implement GET /api/levels endpoint to list all level files
  - Implement GET /api/levels/:filename endpoint to read level file content
  - Implement POST /api/levels endpoint to save level data as TypeScript file
  - Write TypeScript code generation function that creates properly formatted level files with imports
  - Add error handling and validation for file operations
  - Add security checks to restrict access to src/levels directory only
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 3. Create editor entry point and main component
  - Create `editor.html` with basic structure and link to editor entry script
  - Create `src/editor/main.tsx` as React entry point
  - Create `src/editor/Editor.tsx` main component with state management
  - Create `src/editor/types.ts` with EditorState, SelectedEntity, and ContextMenuState interfaces
  - _Requirements: 1.1_

- [x] 4. Implement API client hook
  - Create `src/editor/hooks/useApiClient.ts` hook
  - Implement fetchLevels function to call GET /api/levels
  - Implement loadLevel function to call GET /api/levels/:filename
  - Implement saveLevel function to call POST /api/levels
  - Add error handling and retry logic
  - _Requirements: 2.2, 2.3, 2.4, 10.1, 10.7_

- [x] 5. Implement level selector component
  - Create `src/editor/components/LevelSelector.tsx`
  - Implement level dropdown that lists available levels
  - Implement variant dropdown that lists variants for selected level
  - Add onChange handlers to load selected level/variant
  - Integrate with useApiClient hook to fetch and load level data
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Implement map canvas rendering
  - Create `src/editor/components/MapCanvas.tsx`
  - Create `src/editor/utils/mapRenderer.ts` with rendering logic
  - Implement canvas setup with appropriate tile size (20-30px)
  - Implement tile rendering (floor, walls, doors, exit doors) with correct colors
  - Implement player start position marker with direction arrow
  - Implement enemy markers with color coding by type
  - Implement item markers with color coding by type
  - Implement decorative object markers
  - Implement wall picture markers
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [x] 7. Implement interactive canvas features
  - Add mouse click event handler to MapCanvas
  - Add hover effect visualization
  - Add selection highlighting (yellow border)
  - Create `src/editor/hooks/useSelection.ts` for selection state management
  - Implement coordinate conversion from screen to map coordinates
  - _Requirements: 5.1_

- [x] 8. Implement context menu component
  - Create `src/editor/components/ContextMenu.tsx`
  - Implement context menu positioning at mouse coordinates
  - Implement dynamic menu options based on clicked element type
  - Add options for empty floor tiles (add enemy, add item, add decorative object, set player start)
  - Add options for walls (change type, add wall picture)
  - Add options for entities (edit, remove)
  - Implement click-outside-to-close functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Implement tile editing functionality
  - Add tile type change logic in Editor.tsx
  - Update map data when tile type is changed
  - Implement immediate visual update after tile change
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 10. Implement entity dialog component
  - Create `src/editor/components/EntityDialog.tsx`
  - Implement modal dialog with form fields
  - Create dynamic form fields based on entity type
  - Add validation for input fields
  - Implement save and cancel handlers
  - _Requirements: 6.5, 6.6, 7.6_

- [x] 11. Implement enemy management
  - Add "Add Enemy" action to context menu for floor tiles
  - Implement enemy type selection dialog (ZOMBIE, MONSTER, GHOST, DOG)
  - Create enemy with default properties (health, damage, speed) at clicked position
  - Add "Edit Enemy" functionality with property editing dialog
  - Add "Remove Enemy" functionality
  - Update visual representation immediately after changes
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 12. Implement item management
  - Add "Add Item" action to context menu for floor tiles
  - Implement item type selection dialog (HEALTH_SMALL, HEALTH_LARGE, TREASURE, AMMO, WEAPON)
  - Add weapon type selection for WEAPON items
  - Create item with default properties at clicked position
  - Add "Edit Item" functionality with property editing dialog (value, weaponType)
  - Add "Remove Item" functionality
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 13. Implement decorative objects and wall pictures
  - Add "Add Decorative Object" action to context menu for floor tiles
  - Implement decorative object type selection dialog (CEILING_LIGHT, VASE, CRATE, BENCH, TABLE, CHAIR, WINE_BOTTLE, SKELETON)
  - Add "Add Wall Picture" action to context menu for walls
  - Implement wall picture type selection dialog (PORTRAIT, LANDSCAPE, ABSTRACT)
  - Initialize objects with default properties (colorVariant, collisionRadius, renderHeight)
  - Add edit and remove functionality for decorative objects and wall pictures
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 14. Implement player start position management
  - Add "Set as Player Start" action to context menu for floor tiles
  - Implement direction input dialog (0-360 degrees)
  - Update playerStartX, playerStartY, and playerStartDirection in map data
  - Move player start marker to new position
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [-] 15. Implement toolbar component
  - Create `src/editor/components/Toolbar.tsx`
  - Add "Save" button with click handler
  - Add "New Level" button with click handler
  - Add "New Variant" button with click handler
  - Add width and height input fields
  - Add "Apply Size" button
  - Add dirty state indicator (unsaved changes)
  - _Requirements: 10.1, 11.1, 11.2, 11.3_

- [ ] 16. Implement save functionality
  - Connect Save button to saveLevel API call
  - Show success notification on successful save
  - Show error notification on save failure
  - Clear dirty state after successful save
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [ ] 17. Implement new level creation
  - Create dialog for new level/variant input
  - Validate level and variant numbers
  - Generate empty map with default dimensions (20x20) and outer walls
  - Load new map in editor
  - Generate correct filename (levelX-variantY.ts)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 18. Implement map dimension editing
  - Add width and height input fields to toolbar
  - Implement "Apply Size" button handler
  - Show warning dialog about potential data loss
  - Resize map: expand with floor tiles (0) or truncate excess tiles/entities
  - Update canvas rendering to accommodate new dimensions
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 19. Implement map data management hook
  - Create `src/editor/hooks/useMapData.ts`
  - Implement state management for current map data
  - Implement dirty state tracking
  - Implement undo/redo functionality with command pattern
  - Maintain history stack (max 50 entries)
  - _Requirements: 10.1, 10.8_

- [ ] 20. Add keyboard shortcuts
  - Implement Ctrl+S for save
  - Implement Ctrl+Z for undo
  - Implement Ctrl+Y for redo
  - Implement Delete for removing selected entity
  - Implement Escape for closing dialogs and deselecting
  - _Requirements: 5.5_

- [ ] 21. Add visual feedback and polish
  - Implement toast notification system for user feedback
  - Add loading indicators during API calls
  - Add hover effects on interactive elements
  - Implement smooth transitions for dialogs
  - Add icons to context menu options
  - Style all components with consistent design
  - _Requirements: 10.7, 10.8_

- [ ]* 22. Write unit tests for core functionality
  - Write tests for mapRenderer.ts rendering functions
  - Write tests for API client hook functions
  - Write tests for entity validation functions
  - Write tests for TypeScript code generation in backend
  - Write tests for backend API endpoints
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ]* 23. Write integration tests
  - Write end-to-end test for load → edit → save flow
  - Write test for frontend-backend API communication
  - Write test for file system operations
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 10.1_

- [ ] 24. Create documentation and finalize
  - Add README for editor usage instructions
  - Document keyboard shortcuts
  - Document API endpoints
  - Add inline code comments
  - Test editor with all existing level files
  - Verify that `npm run build` excludes editor code from production build
  - _Requirements: 1.4_
