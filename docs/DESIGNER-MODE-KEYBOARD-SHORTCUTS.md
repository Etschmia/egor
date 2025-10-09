# Designer Mode - Keyboard Shortcuts

Complete reference for all keyboard shortcuts available in Designer Mode.

## Global Shortcuts

### File Operations
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+S` | Save Theme | Save current theme changes to disk |
| `Ctrl+N` | New Theme | Create a new theme (opens dialog) |
| `Ctrl+E` | Export Theme | Export current theme as JSON or CSS |
| `Ctrl+I` | Import Theme | Import a theme from file |

### Edit Operations
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Z` | Undo | Undo last change (up to 50 steps) |
| `Ctrl+Y` | Redo | Redo previously undone change |
| `Ctrl+Shift+Z` | Redo (Alt) | Alternative redo shortcut |

### Navigation
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Tab` | Next Element | Move focus to next interactive element |
| `Shift+Tab` | Previous Element | Move focus to previous interactive element |
| `Escape` | Close Dialog | Close any open dialog or modal |
| `F1` | Show Shortcuts | Display this keyboard shortcuts reference |

### View Controls
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+B` | Toggle Sidebar | Show/hide the asset list sidebar |
| `Ctrl+P` | Toggle Properties | Show/hide the properties panel |
| `Ctrl+L` | Toggle Preview | Show/hide the live preview panel |

## Context-Specific Shortcuts

### In Color Picker Dialog
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Enter` | Confirm Color | Apply selected color and close dialog |
| `Escape` | Cancel | Close dialog without applying changes |
| `Tab` | Next Input | Move between hex input and HSL sliders |
| `Arrow Keys` | Adjust Slider | Fine-tune HSL slider values |

### In Property Panel
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Space` | Expand/Collapse | Toggle property group expansion |
| `Enter` | Edit Property | Start editing focused property |
| `Arrow Up/Down` | Navigate Properties | Move between properties |

### In Sidebar (Asset List)
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Arrow Up/Down` | Navigate Assets | Move selection between assets |
| `Enter` | Select Asset | Select focused asset for editing |
| `Delete` | Delete Asset | Delete selected custom asset (not default) |
| `Ctrl+D` | Duplicate Asset | Create a copy of selected asset |

### In Number Slider
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Arrow Left/Right` | Adjust Value | Decrease/increase value by step |
| `Shift+Arrow` | Fine Adjust | Adjust value by smaller increment |
| `Home` | Minimum Value | Set to minimum allowed value |
| `End` | Maximum Value | Set to maximum allowed value |

## Disabled Contexts

Keyboard shortcuts are automatically disabled when:
- Typing in text input fields (except `Escape`)
- Typing in number input fields (except `Escape`)
- Color picker hex input is focused (except `Escape`, `Enter`)
- Any modal dialog is open (only dialog-specific shortcuts work)

## Tips for Efficient Workflow

### Quick Save Workflow
1. Make changes to properties
2. Press `Ctrl+S` to save immediately
3. Changes are persisted to disk

### Rapid Iteration
1. Select asset with `Arrow Keys` + `Enter`
2. Adjust properties with `Tab` and `Arrow Keys`
3. Preview updates in real-time
4. Press `Ctrl+Z` if you don't like the result

### Theme Management
1. Press `Ctrl+N` to create new theme
2. Make your changes
3. Press `Ctrl+S` to save
4. Press `Ctrl+E` to export for sharing

### Undo/Redo Best Practices
- Undo history stores up to 50 changes
- Each property change creates one history entry
- Switching assets does not create history entries
- Saving does not clear history

## Accessibility Features

All keyboard shortcuts are designed with accessibility in mind:
- **Visible Focus Indicators**: Clear visual feedback for keyboard navigation
- **Logical Tab Order**: Intuitive flow through interface elements
- **Screen Reader Support**: ARIA labels announce shortcut availability
- **No Mouse Required**: Complete functionality via keyboard alone

## Customization

Currently, keyboard shortcuts are not customizable. This may be added in a future version based on user feedback.

## Platform Differences

### macOS
Replace `Ctrl` with `Cmd` (⌘) for all shortcuts:
- `Cmd+S` for Save
- `Cmd+Z` for Undo
- `Cmd+Y` for Redo
- etc.

### Linux
Use `Ctrl` as documented above.

### Windows
Use `Ctrl` as documented above.

## Troubleshooting

### Shortcut Not Working?
1. Check if you're in an input field (shortcuts disabled)
2. Verify no modal dialog is open
3. Check browser console for errors
4. Try clicking outside input fields first

### Conflicts with Browser Shortcuts?
Some shortcuts may conflict with browser defaults:
- `Ctrl+S` may trigger browser save dialog
- `Ctrl+N` may open new browser window
- Use the UI buttons as alternative

### Focus Issues?
If keyboard navigation stops working:
1. Click anywhere in the Designer Mode window
2. Press `Tab` to restore focus
3. Check browser console for JavaScript errors

## Quick Reference Card

Print or save this quick reference:

```
┌─────────────────────────────────────────┐
│     Designer Mode Quick Reference       │
├─────────────────────────────────────────┤
│ Ctrl+S    Save Theme                    │
│ Ctrl+Z    Undo                          │
│ Ctrl+Y    Redo                          │
│ Ctrl+N    New Theme                     │
│ Ctrl+E    Export                        │
│ Ctrl+I    Import                        │
│ F1        Show Shortcuts                │
│ Escape    Close Dialog                  │
│ Tab       Next Element                  │
│ Shift+Tab Previous Element              │
└─────────────────────────────────────────┘
```

## Related Documentation
- [Designer Mode README](DESIGNER-MODE-README.md)
- [Theme File Format](DESIGNER-MODE-THEME-FORMAT.md)
- [Troubleshooting Guide](DESIGNER-MODE-TROUBLESHOOTING.md)
