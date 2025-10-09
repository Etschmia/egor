# useKeyboardShortcuts Hook

## Overview

The `useKeyboardShortcuts` hook manages keyboard shortcuts for the Designer Mode application. It provides a centralized way to handle keyboard events while respecting input field focus states.

## Features

- ✅ **Ctrl+S / ⌘S** - Save current theme
- ✅ **Ctrl+Z / ⌘Z** - Undo last change
- ✅ **Ctrl+Y / ⌘Y** - Redo last undone change
- ✅ **Ctrl+N / ⌘N** - Create new theme
- ✅ **F1** - Show keyboard shortcuts modal
- ✅ **Escape** - Close dialogs and modals
- ✅ **Cross-platform support** - Works with both Ctrl (Windows/Linux) and Cmd (Mac)
- ✅ **Input field awareness** - Shortcuts (except Escape and F1) are disabled when typing in input fields

## Usage

```typescript
import { useKeyboardShortcuts } from './hooks';

function MyComponent() {
  useKeyboardShortcuts({
    onSave: () => console.log('Save triggered'),
    onUndo: () => console.log('Undo triggered'),
    onRedo: () => console.log('Redo triggered'),
    onNewTheme: () => console.log('New theme triggered'),
    onShowShortcuts: () => console.log('Show shortcuts triggered'),
    onEscape: () => console.log('Escape triggered'),
  });

  return <div>My Component</div>;
}
```

## Configuration

The hook accepts a configuration object with optional callback functions:

```typescript
interface KeyboardShortcutsConfig {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNewTheme?: () => void;
  onShowShortcuts?: () => void;
  onEscape?: () => void;
}
```

## Keyboard Shortcuts List

The hook also exports a `KEYBOARD_SHORTCUTS` constant that contains metadata about all available shortcuts. This can be used to display a shortcuts reference in the UI:

```typescript
import { KEYBOARD_SHORTCUTS } from './hooks';

// Example: Display shortcuts in a modal
KEYBOARD_SHORTCUTS.forEach(shortcut => {
  console.log(`${shortcut.key} (${shortcut.mac}): ${shortcut.description}`);
});
```

## Behavior

### Input Field Detection

The hook automatically detects when the user is typing in an input field and disables most shortcuts to prevent conflicts. The following elements are considered input fields:

- `<input>` elements
- `<textarea>` elements
- `<select>` elements
- Elements with `contenteditable="true"`

### Special Cases

- **Escape** and **F1** work even when input fields are focused
- All other shortcuts are disabled when typing in input fields
- Shortcuts work with both `Ctrl` (Windows/Linux) and `Cmd` (Mac)
- Key matching is case-insensitive

## Integration with Designer Component

The hook is integrated into the main Designer component:

```typescript
import { useKeyboardShortcuts } from './hooks';

export default function Designer() {
  // ... other code ...

  useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onNewTheme: handleNewTheme,
    onShowShortcuts: handleShowShortcuts,
    onEscape: handleEscape,
  });

  // ... rest of component ...
}
```

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **10.1** - F1 shows keyboard shortcuts dialog
- **10.2** - Escape closes open dialogs
- **10.3** - Ctrl+N opens new theme dialog
- **10.4** - Shortcuts are disabled when in input fields (except Escape)
- **10.5** - Visual feedback is provided through the UI components that are triggered

## Testing

To manually test the keyboard shortcuts:

1. Start the Designer Mode: `npm run designer`
2. Open the application in your browser
3. Try each keyboard shortcut:
   - Press **Ctrl+S** (or **⌘S** on Mac) - Should trigger save
   - Press **Ctrl+Z** - Should undo last change
   - Press **Ctrl+Y** - Should redo last undone change
   - Press **Ctrl+N** - Should open new theme dialog
   - Press **F1** - Should show shortcuts modal
   - Press **Escape** - Should close any open dialogs
4. Click in an input field and try shortcuts - Most should be disabled
5. Press **Escape** or **F1** while in an input field - Should still work
