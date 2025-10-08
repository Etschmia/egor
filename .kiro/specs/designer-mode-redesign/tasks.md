# Implementation Plan

- [ ] 1. Setup project structure and configuration
  - Create `designer.html` entry point in project root
  - Create `vite.designer.config.ts` with port 3002 configuration
  - Create `designer-server.mjs` backend server file
  - Update `package.json` with designer scripts
  - Create `src/designer/` directory structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Implement backend API server
  - Set up Express server on port 3003 with CORS
  - Implement GET /api/themes endpoint to list all themes
  - Implement GET /api/themes/:id endpoint to load specific theme
  - Implement POST /api/themes endpoint to create new theme
  - Implement PUT /api/themes/:id endpoint to update theme
  - Implement DELETE /api/themes/:id endpoint (with default protection)
  - Implement POST /api/themes/:id/export endpoint for JSON/CSS export
  - Implement POST /api/themes/import endpoint for theme import
  - Add file system utilities for theme directory management
  - Add theme validation logic
  - _Requirements: 1.1, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [ ] 3. Create base designer application structure
  - Create `src/designer/main.tsx` entry point
  - Create `src/designer/Designer.tsx` main component
  - Create `src/designer/types.ts` with TypeScript interfaces
  - Create `src/designer/styles.css` with Level Editor color scheme
  - Implement basic layout structure (header, sidebar, preview, property panel)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Implement theme management hook
  - Create `src/designer/hooks/useThemeManager.ts`
  - Implement theme loading from API
  - Implement theme state management with React state
  - Implement undo/redo history stack (max 50 entries)
  - Implement dirty state tracking
  - Implement theme property update with debouncing (300ms)
  - Add theme validation before save
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 13.1_

- [ ] 5. Implement API client hook
  - Create `src/designer/hooks/useApiClient.ts`
  - Implement fetch wrapper with error handling
  - Implement retry logic with exponential backoff
  - Add loading state management
  - Add error state management with user-friendly messages
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 6. Create header component
  - Create `src/designer/components/Header.tsx`
  - Implement theme selector dropdown
  - Implement undo/redo buttons with enabled/disabled states
  - Implement save button with dirty state indicator
  - Implement new theme button
  - Implement import/export dropdown menu
  - Implement keyboard shortcuts button (F1)
  - Add visual feedback for all actions
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 10.1_

- [ ] 7. Create asset type selector component
  - Create `src/designer/components/AssetTypeSelector.tsx`
  - Implement dropdown with asset type options (Wall Types, Objects, Pictures, Lights, Enemies)
  - Add "Coming soon" message for non-implemented types
  - Style according to Level Editor design
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 8. Create sidebar component with wall type list
  - Create `src/designer/components/Sidebar.tsx`
  - Create `src/designer/components/WallTypeList.tsx`
  - Implement collapsible sidebar with toggle button
  - Display wall types with name, preview thumbnail, and color indicators
  - Implement selection highlighting
  - Add "Add New" button at bottom
  - Style with Level Editor dark theme
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 11.1, 11.2, 11.3, 11.4_

- [ ] 9. Create new wall type dialog
  - Create dialog component for wall type creation
  - Implement name input field
  - Implement "based on" selector dropdown
  - Add validation for name (required, unique)
  - Implement create and cancel actions
  - Style as modal overlay with Level Editor theme
  - _Requirements: 4.6, 4.7_

- [ ] 10. Create property panel component
  - Create `src/designer/components/PropertyPanel.tsx`
  - Create `src/designer/components/PropertyGroup.tsx` for collapsible groups
  - Implement collapsible property groups (Colors, Dimensions, Texture, Effects)
  - Set Colors group as default expanded
  - Add reset button for current wall type
  - Style with Level Editor dark theme
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 11. Create color picker component
  - Create `src/designer/components/ColorPicker.tsx`
  - Implement color preview box with click handler
  - Create color picker dialog with hex input
  - Add HSL sliders for fine-tuning
  - Implement preset color palette
  - Add color validation
  - Style as modal dialog with Level Editor theme
  - _Requirements: 5.5, 5.6_

- [ ] 12. Create number slider component
  - Create `src/designer/components/NumberSlider.tsx`
  - Implement slider with min/max/step from NumberProperty
  - Display current value with unit
  - Add real-time value updates
  - Style with Level Editor theme
  - _Requirements: 5.7, 5.8_

- [ ] 13. Create live preview component
  - Create `src/designer/components/LivePreview.tsx`
  - Implement canvas rendering with tiled texture display
  - Add texture generation integration with TextureGenerator
  - Implement debounced updates (100ms)
  - Add loading indicator during generation
  - Display performance statistics (generation time, render time)
  - Add error handling with user-friendly messages
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 13.2, 13.3_

- [ ] 14. Implement texture caching system
  - Add LRU cache to TextureGenerator (max 50 textures)
  - Implement cache invalidation on theme changes
  - Add cache statistics display
  - _Requirements: 13.3, 13.4, 13.5_

- [ ] 15. Create toast notification system
  - Create `src/designer/components/Toast.tsx`
  - Create `src/designer/hooks/useToast.ts`
  - Implement success, error, warning, and info toast types
  - Add auto-dismiss after 5 seconds
  - Add manual close button
  - Style with Level Editor theme
  - _Requirements: 12.3, 12.4, 12.5_

- [ ] 16. Create loading overlay component
  - Create `src/designer/components/LoadingOverlay.tsx`
  - Implement full-screen overlay with spinner
  - Add progress message display
  - Style with Level Editor theme
  - _Requirements: 12.6_

- [ ] 17. Implement keyboard shortcuts
  - Create `src/designer/hooks/useKeyboardShortcuts.ts`
  - Implement Ctrl+S for save
  - Implement Ctrl+Z for undo
  - Implement Ctrl+Y for redo
  - Implement Ctrl+N for new theme
  - Implement F1 for shortcuts modal
  - Implement Escape for closing dialogs
  - Disable shortcuts when in input fields
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 18. Create keyboard shortcuts modal
  - Create `src/designer/components/KeyboardShortcuts.tsx`
  - Display all available shortcuts in a grid
  - Style as modal dialog with Level Editor theme
  - _Requirements: 10.1_

- [ ] 19. Implement theme export functionality
  - Create `src/designer/utils/exportUtils.ts`
  - Implement JSON export format
  - Implement CSS variables export format
  - Add file download trigger
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 20. Implement theme import functionality
  - Add file input handler in Header component
  - Implement theme validation on import
  - Add error handling for invalid files
  - Display success/error messages
  - _Requirements: 9.5, 9.6, 9.7, 9.8_

- [ ] 21. Implement responsive layout
  - Add media queries for < 1200px (narrower sidebar)
  - Add media queries for < 768px (collapsible sidebar)
  - Implement sidebar overlay mode for mobile
  - Adjust preview size for small screens
  - Test on different screen sizes
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 22. Implement accessibility features
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout
  - Add visible focus indicators
  - Test with screen reader
  - Verify color contrast meets WCAG AA
  - Add alt texts for images/icons
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [ ] 23. Add performance optimizations
  - Implement debouncing for property changes (300ms)
  - Add requestAnimationFrame for canvas rendering
  - Implement lazy loading for components
  - Add code splitting for asset type modules
  - Optimize texture generation algorithm
  - _Requirements: 13.1, 13.2, 13.5, 13.6_

- [ ] 24. Create default theme
  - Create `themes/default.json` with all wall types
  - Define default colors for Brick, Wood, Stone, Door
  - Set default dimensions and texture properties
  - Add default effects configuration
  - _Requirements: 7.1_

- [ ] 25. Implement theme validation
  - Create `src/designer/utils/themeValidator.ts`
  - Validate theme structure on load
  - Validate property values (colors, numbers)
  - Add backward compatibility checks
  - _Requirements: 12.1, 12.2, 15.4_

- [ ] 26. Add error boundaries
  - Implement React error boundaries for main sections
  - Add fallback UI for errors
  - Log errors for debugging
  - _Requirements: 12.1, 12.2_

- [ ] 27. Wire up all components in Designer.tsx
  - Connect Header to theme management
  - Connect AssetTypeSelector to state
  - Connect Sidebar to wall type selection
  - Connect PropertyPanel to property changes
  - Connect LivePreview to theme updates
  - Ensure all data flows correctly
  - _Requirements: All_

- [ ] 28. Test complete workflow
  - Test theme loading and switching
  - Test wall type selection and editing
  - Test color changes with live preview
  - Test dimension changes
  - Test effect toggles
  - Test save functionality
  - Test undo/redo
  - Test theme creation
  - Test import/export
  - Test keyboard shortcuts
  - Test responsive layout
  - Test error scenarios
  - _Requirements: All_

- [ ] 29. Update documentation
  - Add Designer Mode section to README
  - Document keyboard shortcuts
  - Document theme file format
  - Add troubleshooting guide
  - _Requirements: All_

- [ ] 30. Final polish and cleanup
  - Remove console.log statements
  - Clean up unused code
  - Optimize bundle size
  - Verify no conflicts with dev/editor modes
  - Test parallel execution of all three modes
  - _Requirements: 1.2, 1.3, 1.4_
