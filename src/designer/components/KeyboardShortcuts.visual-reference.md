# Keyboard Shortcuts Modal - Visual Reference

## Component Overview

The `KeyboardShortcuts` component displays all available keyboard shortcuts in a modal dialog, organized by category with platform-specific key labels (Windows/Linux vs Mac).

## Features

✅ **Platform Detection**: Automatically shows Mac-specific shortcuts (⌘) or Windows/Linux shortcuts (Ctrl)
✅ **Category Organization**: Shortcuts grouped by category (File Operations, Editing, Help, Navigation)
✅ **Responsive Design**: Adapts to mobile screens with stacked layout
✅ **Keyboard Accessible**: Full keyboard navigation support
✅ **Click Outside to Close**: Modal closes when clicking backdrop
✅ **Escape Key Support**: Press Escape to close the modal
✅ **Focus Management**: Automatically focuses close button when opened

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                                  ×  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ℹ️ Use these keyboard shortcuts to work more           │
│     efficiently in Designer Mode.                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ FILE OPERATIONS                                    │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Save current theme                    [Ctrl+S]    │ │
│  │ Create new theme                      [Ctrl+N]    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ EDITING                                            │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Undo last change                      [Ctrl+Z]    │ │
│  │ Redo last undone change               [Ctrl+Y]    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ HELP                                               │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Show keyboard shortcuts               [F1]        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ NAVIGATION                                         │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Close dialogs and modals              [Esc]       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ℹ️ Note: Most shortcuts are disabled when typing in    │
│     input fields, except for Escape and F1.             │
│                                                          │
│                                        [Got it]          │
└─────────────────────────────────────────────────────────┘
```

## Usage

### Opening the Modal

The modal can be opened by:
1. Pressing `F1` anywhere in the Designer Mode
2. Clicking the keyboard shortcuts button in the header (🎹 icon)

### Closing the Modal

The modal can be closed by:
1. Pressing `Escape`
2. Clicking the × button in the header
3. Clicking outside the modal (on the backdrop)
4. Clicking the "Got it" button

## Styling

The component uses the Level Editor color scheme:
- **Background**: Dark theme (#252525)
- **Categories**: Organized with colored headers (#4CAF50)
- **Keys**: Styled as keyboard keys with 3D effect
- **Hover Effects**: Subtle background changes on hover

## Accessibility

- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Semantic HTML

## Platform-Specific Keys

### Windows/Linux
- `Ctrl+S` - Save
- `Ctrl+N` - New Theme
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `F1` - Show Shortcuts
- `Escape` - Close Dialogs

### Mac
- `⌘S` - Save
- `⌘N` - New Theme
- `⌘Z` - Undo
- `⌘Y` - Redo
- `F1` - Show Shortcuts
- `Esc` - Close Dialogs

## Integration

The component is integrated into the Designer.tsx main component:

```tsx
<KeyboardShortcuts
  isOpen={state.showShortcuts}
  onClose={() => setState(prev => ({ ...prev, showShortcuts: false }))}
/>
```

## Responsive Behavior

### Desktop (> 768px)
- Modal width: 600px max
- Shortcuts displayed in two columns (description | keys)
- Full padding and spacing

### Mobile (≤ 768px)
- Modal width: 95% of screen
- Shortcuts stack vertically
- Reduced padding
- Keys align to the right

## Testing Checklist

- [ ] Modal opens when pressing F1
- [ ] Modal closes when pressing Escape
- [ ] Modal closes when clicking backdrop
- [ ] Modal closes when clicking × button
- [ ] Modal closes when clicking "Got it" button
- [ ] Correct keys shown on Mac vs Windows/Linux
- [ ] All shortcuts are listed and categorized
- [ ] Hover effects work on shortcut items
- [ ] Focus management works correctly
- [ ] Responsive layout works on mobile
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly

## Requirements Satisfied

✅ **Requirement 10.1**: Display all available shortcuts in a modal dialog
- All shortcuts from `KEYBOARD_SHORTCUTS` are displayed
- Organized by category for easy scanning
- Platform-specific key labels (Mac vs Windows/Linux)

✅ **Level Editor Theme**: Styled consistently with the Level Editor design
- Dark color scheme (#1e1e1e, #252525)
- Green accent color (#4CAF50)
- Consistent spacing and typography
- Smooth animations and transitions
