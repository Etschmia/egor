# Accessibility Visual Reference

This document provides visual examples of the accessibility features implemented in Designer Mode.

## Focus Indicators

### Standard Focus (Default)
```
┌─────────────────────────────────┐
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ ← 2px offset
│  ┃                         ┃  │
│  ┃      Save Button        ┃  │ ← 2px green outline (#4CAF50)
│  ┃                         ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────┘
```

### High Contrast Focus
```
┌─────────────────────────────────┐
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓  │ ← 3px offset
│  ┃                         ┃  │
│  ┃      Save Button        ┃  │ ← 3px green outline (#4CAF50)
│  ┃                         ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────┘
```

## Skip Links

### Hidden State (Default)
```
┌─────────────────────────────────────────┐
│ [Skip links hidden above viewport]     │ ← Position: top: -40px
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Designer Mode            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Visible State (On Focus)
```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ Skip to main content                │ │ ← Green background
│ └─────────────────────────────────────┘ │ ← Appears on Tab
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Designer Mode            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## ARIA Labels Examples

### Icon Button with ARIA Label
```tsx
// Visual: 💾
// Screen Reader: "Save theme, button"
<button aria-label="Save theme" title="Save (Ctrl+S)">
  💾
</button>
```

### Color Swatch with ARIA Label
```tsx
// Visual: [Green Square]
// Screen Reader: "Primary color: #4CAF50"
<div
  aria-label="Primary color: #4CAF50"
  title="Primary: #4CAF50"
  style={{ backgroundColor: '#4CAF50' }}
/>
```

### Dropdown with ARIA Attributes
```tsx
// Visual: [Wall Types ▼]
// Screen Reader: "Select asset type, button, collapsed"
<button
  aria-label="Select asset type"
  aria-expanded={false}
  aria-haspopup="listbox"
>
  Wall Types ▼
</button>
```

## Keyboard Navigation Flow

### Tab Order
```
1. Skip Links (hidden until focused)
   ↓
2. Header Controls
   - Theme Selector
   - Undo Button
   - Redo Button
   - Save Button
   - New Button
   - Import Button
   - Export Button
   - Shortcuts Button
   ↓
3. Toolbar
   - Asset Type Selector
   ↓
4. Sidebar
   - Toggle Button
   - Wall Type Items
   - Add New Button
   ↓
5. Preview Area
   - (Canvas - not focusable)
   ↓
6. Property Panel
   - Property Groups
   - Color Swatches
   - Number Sliders
   - Reset Button
```

### Keyboard Shortcuts
```
┌─────────────────────────────────────────┐
│  Keyboard Shortcuts                     │
│                                         │
│  File Operations                        │
│  Save                          Ctrl+S   │
│  New Theme                     Ctrl+N   │
│                                         │
│  Edit Operations                        │
│  Undo                          Ctrl+Z   │
│  Redo                          Ctrl+Y   │
│                                         │
│  Navigation                             │
│  Show Shortcuts                F1       │
│  Close Dialog                  Escape   │
└─────────────────────────────────────────┘
```

## Color Contrast Examples

### Primary Text on Primary Background
```
┌─────────────────────────────────┐
│  Background: #1e1e1e            │
│  Text: #ffffff                  │
│  Contrast: 15.3:1 ✓             │
│                                 │
│  This is primary text           │
└─────────────────────────────────┘
```

### Secondary Text on Primary Background
```
┌─────────────────────────────────┐
│  Background: #1e1e1e            │
│  Text: #cccccc                  │
│  Contrast: 11.6:1 ✓             │
│                                 │
│  This is secondary text         │
└─────────────────────────────────┘
```

### Muted Text on Primary Background
```
┌─────────────────────────────────┐
│  Background: #1e1e1e            │
│  Text: #888888                  │
│  Contrast: 5.1:1 ✓              │
│                                 │
│  This is muted text             │
└─────────────────────────────────┘
```

## Form Accessibility

### Labeled Input with Hint
```
┌─────────────────────────────────────────┐
│  Theme Name *                           │ ← Label with required indicator
│  ┌───────────────────────────────────┐  │
│  │ My Custom Theme                   │  │ ← Input field
│  └───────────────────────────────────┘  │
│  Enter a unique name for your theme    │ ← Hint text (aria-describedby)
└─────────────────────────────────────────┘
```

### Input with Error
```
┌─────────────────────────────────────────┐
│  Theme Name *                           │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │ ← Red border (aria-invalid)
│  └───────────────────────────────────┘  │
│  ⚠ Name is required                    │ ← Error message (role="alert")
└─────────────────────────────────────────┘
```

## Dialog Accessibility

### Modal Dialog Structure
```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │ Create New Wall Type        ✕   │   │ ← Title (aria-labelledby)
│  ├─────────────────────────────────┤   │
│  │                                 │   │
│  │  Name *                         │   │ ← First input (auto-focused)
│  │  ┌───────────────────────────┐  │   │
│  │  │                           │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  Based On (Optional)            │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │ Start from scratch      ▼ │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  ├─────────────────────────────────┤   │
│  │           [Cancel] [Create]     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Dark Backdrop - aria-hidden="true"]  │
└─────────────────────────────────────────┘

Attributes:
- role="dialog"
- aria-modal="true"
- aria-labelledby="dialog-title"
- Focus trapped within dialog
- Escape closes dialog
```

## Live Regions

### Toast Notification
```
┌─────────────────────────────────┐
│  ✓ Theme saved successfully!    │ ← role="alert"
│                              ✕  │ ← aria-live="polite"
└─────────────────────────────────┘

Screen Reader Announces:
"Alert: Theme saved successfully!"
```

### Loading Overlay
```
┌─────────────────────────────────┐
│                                 │
│         ⟳ Loading...            │ ← role="status"
│                                 │ ← aria-busy="true"
│    Generating texture...        │ ← aria-live="polite"
│                                 │
└─────────────────────────────────┘

Screen Reader Announces:
"Status: Generating texture..."
```

## Number Slider Accessibility

### Slider with ARIA Attributes
```
┌─────────────────────────────────────────┐
│  Width                            32 px │ ← Label and value
│  ┌───────────────────────────────────┐  │
│  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│  │ ← Slider track
│  └───────────────────────────────────┘  │
│  0 px                           64 px   │ ← Min/Max labels
└─────────────────────────────────────────┘

ARIA Attributes:
- aria-label="Width"
- aria-valuemin="0"
- aria-valuemax="64"
- aria-valuenow="32"
- aria-valuetext="32 pixels"

Screen Reader Announces:
"Width, slider, 32 pixels, minimum 0 pixels, maximum 64 pixels"
```

## Collapsible Sections

### Collapsed State
```
┌─────────────────────────────────┐
│  Colors                      ▶  │ ← aria-expanded="false"
└─────────────────────────────────┘
```

### Expanded State
```
┌─────────────────────────────────┐
│  Colors                      ▼  │ ← aria-expanded="true"
├─────────────────────────────────┤
│  Primary    [■] #4CAF50         │
│  Secondary  [■] #45a049         │
│  Accent     [■] #2196F3         │
└─────────────────────────────────┘
```

## Screen Reader Announcements

### Button Activation
```
User Action: Tab to Save button
Screen Reader: "Save theme, button"

User Action: Press Enter
Screen Reader: "Alert: Theme saved successfully!"
```

### Form Navigation
```
User Action: Tab to Theme Name input
Screen Reader: "Theme Name, required, edit text, Enter a unique name for your theme"

User Action: Type "My Theme"
Screen Reader: "M, y, space, T, h, e, m, e"

User Action: Tab to Based On select
Screen Reader: "Based On, Optional, combo box, Start from scratch"
```

### Dialog Opening
```
User Action: Click "New Theme" button
Screen Reader: "Dialog, Create New Wall Type"
Focus moves to: "Name, required, edit text"
```

## Testing Checklist

### Visual Testing
- [ ] Focus indicators visible on all interactive elements
- [ ] Skip links appear when Tab is pressed from top
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is readable at 200% zoom

### Keyboard Testing
- [ ] All interactive elements reachable via Tab
- [ ] Shift+Tab moves backwards through elements
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in dropdowns and sliders
- [ ] Escape closes dialogs
- [ ] Keyboard shortcuts work (Ctrl+S, Ctrl+Z, etc.)

### Screen Reader Testing
- [ ] All buttons announced with descriptive labels
- [ ] Form inputs announced with labels and hints
- [ ] Error messages announced
- [ ] Toast notifications announced
- [ ] Loading states announced
- [ ] Dialog titles announced
- [ ] Color values announced

### Mobile Testing
- [ ] Touch targets at least 44x44px or adequately spaced
- [ ] Focus indicators visible on touch
- [ ] Skip links work on mobile browsers
- [ ] Screen reader works on iOS/Android

## Resources

- **WCAG 2.1 Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Inclusive Components:** https://inclusive-components.design/

---

Last Updated: January 9, 2025
