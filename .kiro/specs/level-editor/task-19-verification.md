# Task 19 Verification: Map Data Management Hook

## Implementation Summary

Created `src/editor/hooks/useMapData.ts` with the following features:

### ✅ State Management for Current Map Data
- Manages `mapData` state (GameMap | null)
- Provides `setMapData()` for loading new levels
- Provides `updateMapData()` for making changes with undo support

### ✅ Dirty State Tracking
- Tracks `isDirty` flag automatically
- Compares current state with saved state
- Clears dirty flag when `markAsSaved()` is called
- Resets dirty flag when loading new level with `setMapData()`

### ✅ Undo/Redo Functionality with Command Pattern
- Implements Command interface with `execute()` and `undo()` methods
- Maintains separate undo and redo stacks
- Each command includes a description for better UX
- Provides `canUndo` and `canRedo` boolean flags
- Clears redo stack when new action is performed (standard undo/redo behavior)

### ✅ History Stack Management (Max 50 Entries)
- Uses `useRef` for history stacks to avoid re-renders
- Limits undo stack to MAX_HISTORY_SIZE (50 entries)
- Automatically removes oldest entry when limit is exceeded
- Clears history when loading new level

## API Reference

```typescript
interface UseMapDataReturn {
  // State
  mapData: GameMap | null;           // Current map data
  isDirty: boolean;                  // Has unsaved changes
  canUndo: boolean;                  // Can undo last action
  canRedo: boolean;                  // Can redo last undone action
  
  // Actions
  setMapData: (mapData: GameMap | null) => void;
  updateMapData: (updater: (prev: GameMap) => GameMap, description: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  markAsSaved: () => void;
}
```

## Usage Examples

### 1. Load a New Level
```typescript
const { setMapData } = useMapData();

// Clears history and marks as not dirty
setMapData(newMapData);
```

### 2. Make Changes with Undo Support
```typescript
const { updateMapData } = useMapData();

// Change tile type
updateMapData((prev) => ({
  ...prev,
  tiles: prev.tiles.map((row, y) =>
    y === tileY ? row.map((tile, x) => x === tileX ? newType : tile) : [...row]
  ),
}), 'Change tile type');

// Add enemy
updateMapData((prev) => ({
  ...prev,
  enemies: [...prev.enemies, newEnemy],
}), 'Add enemy');

// Remove item
updateMapData((prev) => ({
  ...prev,
  items: prev.items.filter(i => i.id !== itemId),
}), 'Remove item');
```

### 3. Undo/Redo
```typescript
const { undo, redo, canUndo, canRedo } = useMapData();

// Undo last action
if (canUndo) {
  undo();
}

// Redo last undone action
if (canRedo) {
  redo();
}
```

### 4. Save and Mark as Saved
```typescript
const { markAsSaved, isDirty } = useMapData();

// After successful save
await saveLevel(filename, mapData);
markAsSaved(); // Clears dirty flag
```

## Requirements Verification

### Requirement 10.1: Save Button Visibility
✅ The `isDirty` flag can be used to show unsaved changes indicator

### Requirement 10.8: Dirty State Tracking
✅ Automatically tracks dirty state
✅ Compares with saved state reference
✅ Clears on successful save via `markAsSaved()`
✅ Resets when loading new level

## Command Pattern Implementation

The hook implements the Command pattern for undo/redo:

```typescript
interface Command {
  execute: () => GameMap;    // Returns the new state
  undo: () => GameMap;       // Returns the previous state
  description: string;       // Human-readable action description
}
```

Each change creates a command that captures:
- The previous state (for undo)
- The new state (for redo)
- A description of the action

## History Management

- **Undo Stack**: Stores up to 50 history entries
- **Redo Stack**: Stores undone actions until new action is performed
- **Automatic Cleanup**: Oldest entries removed when limit exceeded
- **Clear on Load**: History cleared when loading new level

## Integration with Editor.tsx

The hook is ready to be integrated into Editor.tsx by:

1. Replacing `useState` for mapData with `useMapData()`
2. Replacing manual `isDirty` tracking with hook's `isDirty`
3. Using `updateMapData()` instead of direct state updates
4. Adding undo/redo buttons to Toolbar
5. Implementing keyboard shortcuts (Ctrl+Z, Ctrl+Y)

See `src/editor/hooks/useMapData.example.ts` for detailed integration examples.

## Testing Considerations

The hook can be tested by:

1. **State Management**: Verify setMapData updates state correctly
2. **Dirty Tracking**: Verify isDirty flag changes appropriately
3. **Undo/Redo**: Verify actions can be undone and redone
4. **History Limit**: Verify only 50 entries are kept
5. **Clear History**: Verify history clears on new level load
6. **Mark as Saved**: Verify dirty flag clears after save

## Files Created

- ✅ `src/editor/hooks/useMapData.ts` - Main hook implementation
- ✅ `src/editor/hooks/useMapData.example.ts` - Usage examples and integration guide
- ✅ `.kiro/specs/level-editor/task-19-verification.md` - This verification document

## Status

✅ **COMPLETE** - All sub-tasks implemented:
- ✅ Create `src/editor/hooks/useMapData.ts`
- ✅ Implement state management for current map data
- ✅ Implement dirty state tracking
- ✅ Implement undo/redo functionality with command pattern
- ✅ Maintain history stack (max 50 entries)

The hook is ready for integration into the Editor component.
