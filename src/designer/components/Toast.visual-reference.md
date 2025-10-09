# Toast Notification System - Visual Reference

## Layout Position

```
┌─────────────────────────────────────────────────────────────┐
│  Header (60px height)                                        │
│  [Designer Mode] [Theme ▼] [Undo][Redo][Save]              │
├─────────────────────────────────────────────────────────────┤
│                                                         ┌───┐│
│                                                         │ ✓ ││ Success Toast
│                                                         └───┘│
│                                                         ┌───┐│
│  Main Content Area                                      │ ✕ ││ Error Toast
│                                                         └───┘│
│                                                         ┌───┐│
│                                                         │ ⚠ ││ Warning Toast
│                                                         └───┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Toast Types

### Success Toast
```
┌────────────────────────────────────────────┐
│ ┌───┐                                      │
│ │ ✓ │  Theme saved successfully!        ✕ │
│ └───┘                                      │
└────────────────────────────────────────────┘
  Green border-left (4px)
  Green icon background
  Dark background (#252525)
```

### Error Toast
```
┌────────────────────────────────────────────┐
│ ┌───┐                                      │
│ │ ✕ │  Failed to load theme.            ✕ │
│ └───┘                                      │
└────────────────────────────────────────────┘
  Red border-left (4px)
  Red icon background
  Dark background (#252525)
```

### Warning Toast
```
┌────────────────────────────────────────────┐
│ ┌───┐                                      │
│ │ ⚠ │  This action cannot be undone.    ✕ │
│ └───┘                                      │
└────────────────────────────────────────────┘
  Orange border-left (4px)
  Orange icon background
  Dark background (#252525)
```

### Info Toast
```
┌────────────────────────────────────────────┐
│ ┌───┐                                      │
│ │ ℹ │  New features are available.      ✕ │
│ └───┘                                      │
└────────────────────────────────────────────┘
  Blue border-left (4px)
  Blue icon background
  Dark background (#252525)
```

## Color Scheme

### Success
- Border: `#4CAF50` (--accent-primary)
- Icon Background: `#4CAF50`
- Icon Color: `#1e1e1e` (--bg-primary)

### Error
- Border: `#f44336` (--accent-danger)
- Icon Background: `#f44336`
- Icon Color: `#1e1e1e` (--bg-primary)

### Warning
- Border: `#ff9800` (--accent-warning)
- Icon Background: `#ff9800`
- Icon Color: `#1e1e1e` (--bg-primary)

### Info
- Border: `#2196F3` (--accent-info)
- Icon Background: `#2196F3`
- Icon Color: `#1e1e1e` (--bg-primary)

### Common Elements
- Background: `#252525` (--bg-secondary)
- Text: `#ffffff` (--text-primary)
- Border: `#333333` (--border-color)
- Close Button Border: `#333333`
- Close Button Hover: `#2a2a2a` (--bg-tertiary)

## Dimensions

### Desktop
- Width: 300px - 400px
- Min Height: ~60px (depends on message length)
- Padding: 16px (--spacing-md)
- Gap between toasts: 8px (--spacing-sm)
- Position: Top-right corner
- Offset from top: Header height (60px) + 16px
- Offset from right: 16px

### Mobile (< 768px)
- Width: Full width minus 16px margins
- Same height and padding
- Position: Top of screen
- Offset from top: 8px (--spacing-sm)
- Offset from sides: 8px

## Animation

### Slide In (0.3s ease)
```
From: opacity: 0, translateX(100%)
To:   opacity: 1, translateX(0)
```

### Auto-dismiss
- Default: 5 seconds
- Configurable per toast
- Smooth fade out (handled by React removal)

## Interactive States

### Close Button
- Default: Border `#333333`, Background transparent
- Hover: Border `#444444`, Background `#2a2a2a`
- Focus: 2px outline `#4CAF50`, 2px offset
- Active: Slight press effect

### Toast Container
- Pointer-events: none (allows clicking through gaps)
- Individual toasts: pointer-events: auto

## Accessibility

### ARIA Attributes
```html
<div role="alert" aria-live="polite">
  <!-- Toast content -->
  <button aria-label="Close notification">✕</button>
</div>
```

### Keyboard Navigation
- Tab: Focus close button
- Enter/Space: Close toast
- Escape: (Could be added to close all toasts)

### Screen Reader
- Announces toast message when shown
- Announces "Close notification" for close button
- Polite announcement (doesn't interrupt)

## Stacking Behavior

Multiple toasts stack vertically:

```
┌────────────────────┐  ← Newest (top)
│ Success toast      │
└────────────────────┘
      ↓ 8px gap
┌────────────────────┐
│ Warning toast      │
└────────────────────┘
      ↓ 8px gap
┌────────────────────┐
│ Info toast         │  ← Oldest (bottom)
└────────────────────┘
```

## Responsive Breakpoints

### Desktop (> 768px)
- Fixed position top-right
- Max-width: 400px
- Offset: 16px from edges

### Mobile (≤ 768px)
- Fixed position top-center
- Full width (minus 16px margins)
- Offset: 8px from edges
- Stacks vertically

## Z-Index Hierarchy

```
2000 - Toast Container
1001 - Dialog Content
1000 - Dialog Backdrop
100  - Sidebar/Property Panel (mobile)
10   - Sidebar Toggle
1    - Base content
```

## Typography

- Message: 14px, line-height 1.5
- Icon: 16px
- Close button: 14px
- Font: System font stack (same as app)

## Shadow

```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
```

Provides depth and separation from background.

## Border Radius

- Toast: 4px
- Icon background: 50% (circle)
- Close button: 4px

## Example Messages

### Success
- "Theme saved successfully!"
- "Wall type created!"
- "Changes applied!"
- "Export completed!"

### Error
- "Failed to save theme. Please try again."
- "Unable to load theme. Check your connection."
- "Invalid theme file format."
- "Server error. Please try again later."

### Warning
- "This action cannot be undone."
- "Theme name already exists."
- "Unsaved changes will be lost."
- "Some properties may not be compatible."

### Info
- "New features are available."
- "Theme imported successfully."
- "Using default theme."
- "Keyboard shortcuts: Press F1 for help."

## Implementation Notes

- Toasts appear in order of creation (newest on top)
- Each toast is independent (can be closed individually)
- Auto-dismiss timer starts when toast is shown
- Timer is cleared when toast is manually closed
- Container is hidden when no toasts are present
- Smooth animations for better UX
- No limit on number of toasts (but should be used sparingly)
