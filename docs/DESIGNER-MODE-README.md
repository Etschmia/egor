# Designer Mode - Complete Guide

Comprehensive documentation for the Designer Mode visual theme editor.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [User Interface](#user-interface)
- [Working with Themes](#working-with-themes)
- [Editing Wall Types](#editing-wall-types)
- [Advanced Features](#advanced-features)
- [Workflows](#workflows)
- [Tips & Best Practices](#tips--best-practices)

---

## Overview

Designer Mode is a visual theme editor for creating and customizing game assets. It provides an intuitive interface for designing wall textures, managing color schemes, and creating cohesive visual themes without writing code.

### Key Features

- **Real-time Preview**: See changes instantly as you edit
- **Theme Management**: Create, save, and switch between multiple themes
- **Visual Property Editors**: Intuitive controls for colors, dimensions, and effects
- **Undo/Redo**: Full history with up to 50 steps
- **Import/Export**: Share themes as JSON or CSS files
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation
- **Responsive Design**: Works on various screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

### Architecture

Designer Mode consists of two components:

1. **Frontend** (Port 3002): React-based UI with Vite
2. **Backend** (Port 3003): Express.js API for theme persistence

Both run independently and can be started together or separately.

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Install dependencies (if not already done)
npm install
```

### Starting Designer Mode

**Option 1: Start both servers together**
```bash
npm run designer
```

**Option 2: Start servers separately**
```bash
# Terminal 1 - Frontend
npm run designer:frontend

# Terminal 2 - Backend
npm run designer:backend
```

### Accessing Designer Mode

Open your browser and navigate to:
```
http://localhost:3002/designer.html
```

### First Launch

On first launch, Designer Mode will:
1. Load the default theme
2. Display the brick wall type
3. Show the live preview
4. Enable all editing features

---

## User Interface

### Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                      │
│  [Asset Type ▼] [Theme ▼]  [Undo][Redo][Save][Export][F1]  │
├──────────┬──────────────────────────────────┬───────────────┤
│          │                                  │               │
│ Sidebar  │      Live Preview Area           │  Property     │
│          │                                  │  Panel        │
│ Wall     │                                  │               │
│ Types    │      [Canvas Preview]            │  Colors       │
│          │                                  │  Dimensions   │
│ • Brick  │                                  │  Texture      │
│ • Wood   │                                  │  Effects      │
│ • Stone  │      [Performance Stats]         │               │
│ • Door   │                                  │               │
│          │                                  │  [Reset]      │
│ [+ Add]  │                                  │               │
│          │                                  │               │
└──────────┴──────────────────────────────────┴───────────────┘
```

### Header Components

#### Asset Type Selector
- Dropdown to select asset category
- Currently supports: Wall Types
- Coming soon: Objects, Pictures, Lights, Enemies

#### Theme Selector
- Dropdown showing all available themes
- Click to switch between themes
- Shows unsaved changes indicator (●)

#### Action Buttons
- **Undo** (Ctrl+Z): Revert last change
- **Redo** (Ctrl+Y): Reapply undone change
- **Save** (Ctrl+S): Save current theme
- **Export**: Export theme as JSON or CSS
- **Import**: Import theme from file
- **New Theme** (Ctrl+N): Create new theme
- **Shortcuts** (F1): Show keyboard shortcuts

### Sidebar

#### Wall Type List
- Shows all wall types in current theme
- Each item displays:
  - Wall type name
  - Color preview thumbnail
  - Selection indicator
- Click to select and edit
- **Add New** button at bottom

#### Sidebar Controls
- Toggle button to collapse/expand
- Responsive: auto-collapses on small screens
- Keyboard navigation with arrow keys

### Live Preview

#### Preview Canvas
- Shows tiled texture preview
- Updates in real-time (100ms debounce)
- Displays current wall type texture
- Zoom and pan controls (coming soon)

#### Performance Stats
- **Generation Time**: Texture creation time
- **Render Time**: Canvas drawing time
- **Cache Status**: Hit/miss information
- **Texture Size**: Canvas dimensions

### Property Panel

#### Property Groups
- **Colors**: Color scheme properties
- **Dimensions**: Size and spacing
- **Texture**: Pattern and blend settings
- **Effects**: Shadows, highlights, gradients

#### Group Behavior
- Click header to expand/collapse
- Colors group expanded by default
- Remembers expansion state
- Keyboard navigation with Space

#### Property Controls
- **Color Picker**: Click color preview to edit
- **Number Slider**: Drag or use arrow keys
- **Dropdown**: Select from predefined options
- **Toggle**: Enable/disable effects

---

## Working with Themes

### Creating a New Theme

1. Click **New Theme** button (or press Ctrl+N)
2. Enter theme name
3. Optionally select base theme
4. Click **Create**
5. New theme is created and activated

### Loading a Theme

1. Click theme dropdown in header
2. Select theme from list
3. Theme loads immediately
4. All wall types update

### Saving Changes

**Auto-save is NOT enabled** - you must save manually:

1. Make your changes
2. Notice unsaved indicator (●) in header
3. Click **Save** button (or press Ctrl+S)
4. Success notification appears
5. Indicator disappears

### Switching Themes

**Warning**: Unsaved changes will be lost!

1. If you have unsaved changes, save first
2. Click theme dropdown
3. Select different theme
4. Confirm if prompted
5. New theme loads

### Deleting a Theme

1. Load the theme you want to delete
2. Click theme dropdown
3. Click delete icon next to theme name
4. Confirm deletion
5. Theme is removed (except default theme)

**Note**: Default theme cannot be deleted.

---

## Editing Wall Types

### Selecting a Wall Type

1. Look at sidebar on the left
2. Click on a wall type (Brick, Wood, Stone, Door)
3. Wall type is highlighted
4. Properties appear in right panel
5. Preview updates

### Editing Colors

#### Using Color Picker

1. Click on color preview box
2. Color picker dialog opens
3. Choose color using:
   - **Hex Input**: Type hex code directly
   - **HSL Sliders**: Fine-tune hue, saturation, lightness
   - **Presets**: Click preset color
4. Click **Apply** or press Enter
5. Preview updates immediately

#### Color Properties

Each wall type has 5 color properties:

- **Primary**: Main base color (e.g., mortar, base wood)
- **Secondary**: Secondary element (e.g., brick, plank)
- **Accent**: Detail color (e.g., joints, grain)
- **Shadow**: Shadow/depth color
- **Highlight**: Light reflection color

### Editing Dimensions

#### Using Number Sliders

1. Find dimension property in panel
2. Drag slider left/right
3. Or click and use arrow keys
4. Or type value directly
5. Preview updates in real-time

#### Dimension Properties

- **Width**: Element width (e.g., brick width)
- **Height**: Element height (e.g., brick height)
- **Spacing**: Gap between elements (e.g., mortar)
- **Border Width**: Border thickness

### Editing Texture Properties

#### Pattern Type
- Select from dropdown:
  - SOLID: Flat color
  - GRADIENT: Color gradient
  - BRICK: Brick pattern
  - WOOD_GRAIN: Wood texture
  - STONE_BLOCKS: Stone pattern
  - METAL: Metallic surface

#### Intensity
- Controls pattern strength (0-1)
- 0 = no pattern
- 1 = full pattern
- Adjust with slider

#### Blend Mode
- How pattern blends with colors:
  - NORMAL: Standard
  - MULTIPLY: Darken
  - OVERLAY: Contrast
  - SOFT_LIGHT: Subtle

### Editing Effects

#### Shadow Effect
- **Enabled**: Toggle on/off
- **Color**: Shadow color
- **Offset**: Distance from element
- **Blur**: Blur radius

#### Highlight Effect
- **Enabled**: Toggle on/off
- **Color**: Highlight color
- **Intensity**: Strength (0-1)

#### Gradient Effect
- **Enabled**: Toggle on/off
- **Type**: Linear or radial
- **Colors**: Gradient stops

### Resetting Properties

To reset a wall type to defaults:

1. Select the wall type
2. Scroll to bottom of property panel
3. Click **Reset to Default** button
4. Confirm reset
5. All properties revert to defaults

---

## Advanced Features

### Undo/Redo System

#### How It Works
- Every property change creates history entry
- History stores up to 50 entries
- Oldest entries removed when limit reached
- History persists during session
- Cleared on theme switch

#### Using Undo/Redo
- **Undo**: Ctrl+Z or click Undo button
- **Redo**: Ctrl+Y or click Redo button
- Buttons disabled when no history available

#### What Creates History
- Color changes
- Dimension changes
- Texture property changes
- Effect toggles
- Effect property changes

#### What Doesn't Create History
- Selecting different wall type
- Switching themes
- Expanding/collapsing groups
- Opening dialogs

### Import/Export

#### Exporting Themes

**Export as JSON:**
1. Click **Export** button
2. Select **Export as JSON**
3. File downloads: `theme-name.json`
4. Contains complete theme data
5. Can be imported later

**Export as CSS:**
1. Click **Export** button
2. Select **Export as CSS**
3. File downloads: `theme-name.css`
4. Contains CSS custom properties
5. Can be used in stylesheets

#### Importing Themes

1. Click **Import** button
2. Select theme JSON file
3. Theme is validated
4. If valid, theme is imported
5. Theme becomes active
6. Appears in theme list

#### Import Validation

Imported themes must:
- Be valid JSON format
- Have all required fields
- Have valid color values (hex)
- Have valid number ranges
- Match theme structure

### Texture Caching

#### How It Works
- Generated textures are cached
- Cache stores up to 50 textures
- LRU (Least Recently Used) eviction
- Cache cleared on theme switch
- Improves performance significantly

#### Cache Statistics
- View in performance stats
- Shows hit/miss ratio
- Shows cache size
- Shows generation time savings

### Keyboard Shortcuts

See [Keyboard Shortcuts Guide](DESIGNER-MODE-KEYBOARD-SHORTCUTS.md) for complete reference.

**Most Used:**
- `Ctrl+S`: Save
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `F1`: Show shortcuts
- `Escape`: Close dialog

---

## Workflows

### Creating a New Theme from Scratch

1. **Start with base theme:**
   - Click **New Theme** (Ctrl+N)
   - Name it descriptively
   - Select "default" as base
   - Click **Create**

2. **Customize brick walls:**
   - Select "Brick" in sidebar
   - Adjust primary color (mortar)
   - Adjust secondary color (brick)
   - Adjust accent color (joints)
   - Fine-tune dimensions
   - Test in preview

3. **Customize wood walls:**
   - Select "Wood" in sidebar
   - Adjust wood colors
   - Adjust plank width
   - Adjust grain intensity
   - Test in preview

4. **Customize stone walls:**
   - Select "Stone" in sidebar
   - Adjust stone colors
   - Adjust block size
   - Test in preview

5. **Customize doors:**
   - Select "Door" in sidebar
   - Adjust door colors
   - Test in preview

6. **Save and export:**
   - Press Ctrl+S to save
   - Click Export > JSON for backup
   - Share with team if needed

### Modifying an Existing Theme

1. **Load theme:**
   - Select theme from dropdown
   - Wait for load

2. **Make changes:**
   - Select wall type
   - Adjust properties
   - Preview updates

3. **Save or save as:**
   - Save: Ctrl+S (overwrites)
   - Save as: Create new theme first

### Creating Theme Variations

1. **Load base theme:**
   - Select theme to base on

2. **Create new theme:**
   - Click **New Theme**
   - Name with variation suffix
   - Select current theme as base

3. **Make variations:**
   - Adjust specific properties
   - Keep most properties same
   - Create cohesive variation

4. **Save:**
   - Press Ctrl+S
   - Export for backup

### Rapid Prototyping

1. **Use presets:**
   - Click color presets for quick changes
   - Try different combinations
   - Use undo if needed

2. **Adjust in real-time:**
   - Drag sliders while watching preview
   - Find sweet spot visually
   - No need to save until satisfied

3. **Experiment freely:**
   - Undo is always available
   - Changes not saved until you save
   - Can always reload theme

### Sharing Themes

1. **Export theme:**
   - Click Export > JSON
   - Save file

2. **Share file:**
   - Email, Slack, etc.
   - Include screenshot
   - Document any special notes

3. **Recipient imports:**
   - Click Import
   - Select your JSON file
   - Theme appears in their list

---

## Tips & Best Practices

### Design Tips

#### Color Selection
- **Contrast**: Ensure sufficient contrast for visibility
- **Harmony**: Use color wheel for harmonious schemes
- **Accessibility**: Consider color blindness
- **Consistency**: Keep similar elements similar colors
- **Testing**: Test in actual game environment

#### Dimension Tuning
- **Proportions**: Keep realistic proportions
- **Scale**: Consider game resolution
- **Spacing**: Adequate spacing improves clarity
- **Consistency**: Similar elements should have similar sizes

#### Texture Design
- **Intensity**: Start low, increase gradually
- **Patterns**: Match pattern to wall type
- **Blend Modes**: Experiment with different modes
- **Performance**: Complex patterns may be slower

#### Effects Usage
- **Subtlety**: Less is often more
- **Shadows**: Add depth and realism
- **Highlights**: Suggest lighting
- **Gradients**: Use sparingly

### Workflow Tips

#### Save Frequently
- Press Ctrl+S after each major change
- Export backups of important themes
- Don't rely on undo history

#### Use Undo Liberally
- Don't be afraid to experiment
- Undo is fast and reliable
- Up to 50 steps available

#### Preview Constantly
- Watch preview while adjusting
- Verify changes look good
- Check at different zoom levels

#### Organize Themes
- Use descriptive names
- Include version numbers
- Document theme purpose
- Tag themes appropriately

### Performance Tips

#### Optimize Textures
- Keep dimensions reasonable
- Avoid extreme intensity values
- Use simpler patterns when possible
- Monitor generation times

#### Manage Cache
- Cache improves performance
- Automatic management
- Clear by refreshing page

#### Browser Performance
- Close unused tabs
- Use Chrome for best performance
- Update browser regularly
- Check system resources

### Collaboration Tips

#### Naming Conventions
- Use clear, descriptive names
- Include creator initials
- Add version numbers
- Use consistent format

#### Documentation
- Document design decisions
- Note color meanings
- Explain theme purpose
- Include usage guidelines

#### Version Control
- Export themes regularly
- Keep backups
- Track changes
- Use meaningful commit messages

### Troubleshooting Tips

#### Preview Issues
- Check console for errors
- Verify property values
- Try refreshing page
- Test in different browser

#### Save Issues
- Check file permissions
- Verify disk space
- Check backend logs
- Try saving as new theme

#### Performance Issues
- Reduce texture complexity
- Close other applications
- Check system resources
- Try different browser

---

## Common Use Cases

### Game Artist Workflow
1. Create theme for new level
2. Design cohesive color palette
3. Adjust textures for atmosphere
4. Export for integration
5. Iterate based on feedback

### Level Designer Workflow
1. Load existing theme
2. Create variation for specific level
3. Adjust colors for mood
4. Test in game
5. Refine based on gameplay

### Developer Workflow
1. Create prototype theme
2. Test technical constraints
3. Verify performance
4. Document properties
5. Hand off to artists

---

## Keyboard Shortcuts Quick Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save Theme |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+N` | New Theme |
| `Ctrl+E` | Export |
| `Ctrl+I` | Import |
| `F1` | Show Shortcuts |
| `Escape` | Close Dialog |
| `Tab` | Next Element |

See [complete shortcuts guide](DESIGNER-MODE-KEYBOARD-SHORTCUTS.md) for all shortcuts.

---

## Related Documentation

- **[Keyboard Shortcuts](DESIGNER-MODE-KEYBOARD-SHORTCUTS.md)**: Complete shortcut reference
- **[Theme File Format](DESIGNER-MODE-THEME-FORMAT.md)**: Theme structure specification
- **[Troubleshooting Guide](DESIGNER-MODE-TROUBLESHOOTING.md)**: Common issues and solutions

---

## Support

### Getting Help

1. Check [Troubleshooting Guide](DESIGNER-MODE-TROUBLESHOOTING.md)
2. Review browser console for errors
3. Check backend logs
4. Gather reproduction steps
5. Report issue with details

### Reporting Bugs

Include:
- Environment details (OS, browser, versions)
- Steps to reproduce
- Expected vs actual behavior
- Console errors
- Screenshots

### Feature Requests

Designer Mode is actively developed. Feature requests welcome!

---

## Version History

### Version 1.0.0 (Current)
- Initial release
- Wall type editing
- Theme management
- Import/export
- Undo/redo
- Keyboard shortcuts
- Responsive design
- Accessibility features

### Planned Features
- Additional asset types (Objects, Pictures, Lights, Enemies)
- Theme marketplace
- Collaborative editing
- Version control integration
- AI-assisted color schemes
- Advanced preview modes
- Batch operations

---

## Credits

Designer Mode is part of the Hundefelsen game project, developed as a modern take on classic first-person shooters.

**Developed by**: Tobias Brendler
**License**: See LICENSE file
**Repository**: [Project Repository]

---

*Last Updated: January 2025*
