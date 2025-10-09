# Theme Import - Visual Reference

## UI Components

### Import Button (Header)
```
┌─────────────────────────────────────────────────────────────┐
│  Designer Mode  [Theme: Default ▼]  [↶][↷]  [💾][+][📥][📤▼][⌨️] │
└─────────────────────────────────────────────────────────────┘
                                              ↑
                                         Import Button
```

**Location:** Header, right section
**Icon:** 📥
**Label:** "Import"
**Tooltip:** "Import theme"

### File Picker Dialog
```
┌─────────────────────────────────────────┐
│  Select a file to import                │
├─────────────────────────────────────────┤
│  📁 Documents                            │
│    📄 test-theme-import.json            │
│    📄 my-custom-theme.json              │
│    📄 dark-theme.json                   │
│                                         │
│  File type: JSON files (*.json)         │
│                                         │
│              [Cancel]  [Open]           │
└─────────────────────────────────────────┘
```

**Filter:** Only .json files shown
**Action:** Opens on Import button click

## Toast Notifications

### Success Toast
```
┌─────────────────────────────────────────┐
│  ✓  Theme "Test Import Theme"           │
│     imported successfully!          ✕   │
└─────────────────────────────────────────┘
```

**Style:**
- Background: Green (#4CAF50)
- Icon: ✓ (checkmark)
- Position: Top-right corner
- Duration: 5 seconds auto-dismiss
- Close button: ✕

### Error Toast - Invalid File Type
```
┌─────────────────────────────────────────┐
│  ✕  Invalid file type. Please           │
│     select a JSON file.             ✕   │
└─────────────────────────────────────────┘
```

**Style:**
- Background: Red (#f44336)
- Icon: ✕ (X mark)
- Position: Top-right corner
- Duration: 5 seconds auto-dismiss

### Error Toast - File Too Large
```
┌─────────────────────────────────────────┐
│  ✕  File is too large. Maximum          │
│     size is 10MB.                   ✕   │
└─────────────────────────────────────────┘
```

### Error Toast - Invalid JSON
```
┌─────────────────────────────────────────┐
│  ✕  Invalid JSON file. Please           │
│     check the file format.          ✕   │
└─────────────────────────────────────────┘
```

### Error Toast - Invalid Structure
```
┌─────────────────────────────────────────┐
│  ✕  Invalid theme structure:            │
│     Theme must have a valid name,   ✕   │
│     Theme must define at least one      │
│     wall type                           │
└─────────────────────────────────────────┘
```

**Note:** Error messages are specific and actionable

## User Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Click Import    │
│ Button (📥)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ File Picker     │
│ Opens           │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Select JSON     │
│ File            │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐     ┌─────────────────┐
│ Validate File   │────▶│ Invalid?        │
│ Type & Size     │     │ Show Error      │
└──────┬──────────┘     └─────────────────┘
       │ Valid
       ▼
┌─────────────────┐     ┌─────────────────┐
│ Parse JSON      │────▶│ Invalid?        │
│                 │     │ Show Error      │
└──────┬──────────┘     └─────────────────┘
       │ Valid
       ▼
┌─────────────────┐     ┌─────────────────┐
│ Validate Theme  │────▶│ Invalid?        │
│ Structure       │     │ Show Error      │
└──────┬──────────┘     └─────────────────┘
       │ Valid
       ▼
┌─────────────────┐     ┌─────────────────┐
│ Import via API  │────▶│ Failed?         │
│                 │     │ Show Error      │
└──────┬──────────┘     └─────────────────┘
       │ Success
       ▼
┌─────────────────┐
│ Show Success    │
│ Toast           │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Theme Added to  │
│ Selector        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Theme Set as    │
│ Active          │
└─────────────────┘
```

## State Changes

### Before Import
```
State:
  activeTheme: "default"
  availableThemes: ["default", "custom-123"]
  isDirty: false
```

### During Import
```
State:
  isLoading: true
  error: null
```

### After Successful Import
```
State:
  activeTheme: "custom-1234567890"  ← New imported theme
  availableThemes: ["default", "custom-123", "custom-1234567890"]
  isDirty: false
  isLoading: false
  
Toast:
  type: "success"
  message: "Theme 'Test Import Theme' imported successfully!"
```

### After Failed Import
```
State:
  activeTheme: "default"  ← Unchanged
  availableThemes: ["default", "custom-123"]  ← Unchanged
  isDirty: false
  isLoading: false
  error: "Invalid theme structure: ..."
  
Toast:
  type: "error"
  message: "Invalid theme structure: ..."
```

## Keyboard Accessibility

### Tab Navigation
```
[Theme Selector] → [Undo] → [Redo] → [Save] → [New] → [Import] → [Export] → [Shortcuts]
                                                         ↑
                                                    Focus here
```

### Activation
- **Enter** or **Space**: Opens file picker
- **Escape**: Closes file picker (if supported by browser)

### Focus Indicator
```
┌─────────────────┐
│  📥  Import     │  ← Blue border when focused
└─────────────────┘
```

## Responsive Behavior

### Desktop (> 1200px)
- Import button fully visible with icon and text
- Toast appears in top-right corner

### Tablet (768px - 1200px)
- Import button visible with icon and text
- Toast width adjusts to screen

### Mobile (< 768px)
- Import button may show icon only
- Toast full width at top

## Animation & Timing

### Toast Appearance
- **Fade in:** 200ms ease-in
- **Display:** 5000ms
- **Fade out:** 200ms ease-out

### Loading State
- **Spinner:** Appears immediately
- **Minimum display:** 300ms (prevents flicker)

### File Processing
- **Read file:** < 100ms (for typical theme files)
- **Parse JSON:** < 50ms
- **Validate:** < 50ms
- **API call:** 100-500ms
- **Total:** Usually < 1 second

## Color Scheme

### Success Toast
```css
background: #4CAF50 (Green)
color: #ffffff (White)
border: 1px solid #45a049
```

### Error Toast
```css
background: #f44336 (Red)
color: #ffffff (White)
border: 1px solid #da190b
```

### Import Button
```css
background: #2a2a2a (Dark gray)
color: #ffffff (White)
border: 1px solid #333333

hover:
  background: #252525
  border: 1px solid #444444

focus:
  border: 1px solid #4CAF50
```

## Accessibility Features

- ✅ ARIA labels on Import button
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader announcements for toasts
- ✅ Color contrast meets WCAG AA
- ✅ Error messages are descriptive
- ✅ Success feedback is clear

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ File API support required
- ✅ JSON.parse support required
