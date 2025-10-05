# Level Editor Documentation

## Overview

The Level Editor is a development-only tool that allows you to visually create and edit level files for Hundefelsen. It runs as a separate application alongside the main game and provides an intuitive interface for designing levels without manually writing TypeScript code.

## Getting Started

### Starting the Editor

```bash
# Start both frontend and backend
npm run editor

# Or start them separately:
npm run editor:frontend  # Frontend on port 3000
npm run editor:backend   # Backend on port 3001
```

The editor will open in your browser at `http://localhost:3000`.

### Architecture

The editor consists of two components:
- **Frontend**: React-based UI (Vite + React on port 3000)
- **Backend**: Express.js file server (port 3001) that provides access to `src/levels/` directory

## Features

### Visual Level Design
- Interactive 2D top-down view of your level
- Color-coded tiles and entities for easy identification
- Hover effects and selection highlighting
- Based on the in-game minimap design

### Level Management
- Load existing levels and variants
- Create new levels and variants
- Save changes as properly formatted TypeScript files
- Resize level dimensions

### Entity Editing
- Place, edit, and remove enemies (Zombies, Monsters, Ghosts, Dogs)
- Add items (Health, Ammo, Treasure, Weapons)
- Place decorative objects (Vases, Crates, Furniture, etc.)
- Add wall pictures (Portraits, Landscapes, Abstract art)
- Set player start position and direction

### Tile Editing
- Change tile types (Floor, Wall, Door, Exit Door)
- Click-based editing with context menus

## User Interface

### Toolbar
Located at the top of the editor:
- **Level Selector**: Dropdown to choose level number
- **Variant Selector**: Dropdown to choose variant number
- **Save Button**: Save current changes to file
- **New Level Button**: Create a new level
- **New Variant Button**: Create a new variant for current level
- **Width/Height Fields**: Adjust level dimensions
- **Apply Size Button**: Apply dimension changes
- **Dirty Indicator**: Shows when there are unsaved changes

### Map Canvas
The main editing area:
- Interactive grid showing the level layout
- Click on tiles to open context menu
- Visual representation of all entities
- Hover effects show which tile you're targeting

### Context Menu
Right-click menu with options based on what you clicked:
- **Empty Floor**: Add Enemy, Add Item, Add Decorative Object, Set Player Start
- **Wall**: Change Type, Add Wall Picture
- **Entity**: Edit, Remove

### Entity Dialog
Modal dialog for editing entity properties:
- Dynamic form fields based on entity type
- Input validation
- Save/Cancel buttons

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current level |
| `Ctrl+Z` | Undo last change |
| `Ctrl+Y` | Redo |
| `Delete` | Remove selected entity |
| `Escape` | Close dialog / Deselect |

## Color Coding

### Tiles
- **Floor (0)**: Black (#000000)
- **Wall (1)**: White (#FFFFFF)
- **Door (2)**: Brown (#8B4513)
- **Exit Door (3)**: Green (#00FF00)

### Entities
- **Player Start**: Blue (#0000FF) with direction arrow
- **Zombies**: Light Green (#90EE90)
- **Monsters**: Red (#FF6347)
- **Ghosts**: Purple (#DDA0DD)
- **Dogs**: Gold (#FFD700)
- **Health Items**: Red (#FF0000)
- **Ammo**: Orange (#FFA500)
- **Treasure**: Gold (#FFD700)
- **Weapons**: Silver (#C0C0C0)
- **Decorative Objects**: Gray (#808080)
- **Wall Pictures**: Brown (#8B4513)

### Visual Feedback
- **Hover**: Semi-transparent overlay
- **Selection**: Yellow border

## Workflow

### Creating a New Level

1. Click "New Level" button
2. Enter level number and variant number
3. A new empty level (20x20) with outer walls is created
4. Edit the level as needed
5. Click "Save" to write the file to `src/levels/`

### Editing an Existing Level

1. Select level from "Level" dropdown
2. Select variant from "Variant" dropdown
3. Level loads automatically
4. Make your changes
5. Click "Save" to update the file

### Adding Entities

**Enemies:**
1. Click on empty floor tile
2. Select "Add Enemy"
3. Choose enemy type (ZOMBIE, MONSTER, GHOST, DOG)
4. Enemy is created with default properties
5. Click enemy to edit properties (health, damage, speed)

**Items:**
1. Click on empty floor tile
2. Select "Add Item"
3. Choose item type (HEALTH_SMALL, HEALTH_LARGE, TREASURE, AMMO, WEAPON)
4. For weapons, select weapon type
5. Click item to edit properties (value, weaponType)

**Decorative Objects:**
1. Click on empty floor tile
2. Select "Add Decorative Object"
3. Choose object type (CEILING_LIGHT, VASE, CRATE, BENCH, TABLE, CHAIR, WINE_BOTTLE, SKELETON)
4. Object is created with default properties
5. Click object to edit properties

**Wall Pictures:**
1. Click on a wall tile
2. Select "Add Wall Picture"
3. Choose picture type (PORTRAIT, LANDSCAPE, ABSTRACT)
4. Picture is added to the wall

### Setting Player Start Position

1. Click on empty floor tile
2. Select "Set as Player Start"
3. Enter direction in degrees (0-360)
   - 0° = North
   - 90° = East
   - 180° = South
   - 270° = West
4. Player start marker moves to new position

### Changing Tile Types

1. Click on any tile
2. Select "Change Type"
3. Choose new type (Floor, Wall, Door, Exit Door)
4. Tile updates immediately

### Resizing Levels

1. Enter new width and height in toolbar fields
2. Click "Apply Size"
3. Confirm the warning dialog
4. Level is resized:
   - **Expanding**: New tiles filled with floor (0)
   - **Shrinking**: Excess tiles and entities are removed

## API Endpoints

The backend server provides these endpoints:

### GET /api/levels
Lists all level files in `src/levels/` directory.

**Response:**
```json
{
  "levels": [
    {
      "filename": "level1-variant1.ts",
      "level": 1,
      "variant": 1
    },
    ...
  ]
}
```

### GET /api/levels/:filename
Loads a specific level file.

**Parameters:**
- `filename`: Name of the file (e.g., "level1-variant1.ts")

**Response:**
```json
{
  "success": true,
  "data": {
    "width": 20,
    "height": 20,
    "tiles": [[...]],
    "enemies": [...],
    "items": [...],
    ...
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### POST /api/levels
Saves or creates a level file.

**Request Body:**
```json
{
  "filename": "level1-variant1.ts",
  "data": {
    "width": 20,
    "height": 20,
    "tiles": [[...]],
    ...
  }
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## File Format

The editor generates TypeScript files in this format:

```typescript
import { type GameMap, EnemyType, ItemType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_X_VARIANT_Y: GameMap = {
  width: 20,
  height: 20,
  tiles: [
    [1, 1, 1, ...],
    [1, 0, 0, ...],
    ...
  ],
  enemies: [
    {
      id: 'enemy-1',
      type: EnemyType.ZOMBIE,
      x: 5,
      y: 5,
      health: 50,
      damage: 10,
      speed: 0.02
    }
  ],
  items: [...],
  wallPictures: [...],
  decorativeObjects: [...],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
```

## Best Practices

### Level Design Tips
- Always place outer walls (tile type 1) around the level perimeter
- Ensure player start position is on a floor tile (0)
- Place at least one exit door (tile type 3) per level
- Test enemy placement - avoid blocking critical paths
- Balance item distribution throughout the level
- Use decorative objects to add visual interest
- Consider line of sight when placing enemies

### Performance Considerations
- Keep level dimensions reasonable (20x20 to 40x40)
- Don't place too many entities in one area
- Limit the number of decorative objects per level
- Test levels in the main game to verify performance

### File Management
- Use consistent naming: `levelX-variantY.ts`
- Create multiple variants for variety
- Save frequently to avoid losing work
- Keep backups of important levels

## Troubleshooting

### Editor Won't Start
- Ensure ports 3000 and 3001 are available
- Check that `npm install` completed successfully
- Verify Node.js version is compatible

### Can't Load Levels
- Check that `src/levels/` directory exists
- Verify file permissions
- Look for errors in browser console
- Check backend server logs

### Save Fails
- Ensure write permissions for `src/levels/` directory
- Check for invalid characters in filename
- Verify level data is valid
- Look for backend server errors

### Changes Not Appearing in Game
- Ensure you saved the level in the editor
- Restart the main game development server
- Clear browser cache if needed
- Check that the level file was actually updated

## Security Notes

- The editor is **development-only** and should never be deployed to production
- File access is restricted to the `src/levels/` directory only
- The backend validates all file paths to prevent directory traversal
- CORS is configured for localhost only

## Production Build

The editor code is automatically excluded from production builds:

```bash
npm run build  # Only builds the main game, not the editor
```

The editor files are kept separate and won't be included in the `dist/` directory.

## Future Enhancements

Potential features for future versions:
- Copy/paste entities
- Multi-select for batch operations
- Room templates
- Preview mode (play level directly in editor)
- Collision visualization
- Grid snapping
- Zoom controls
- Export/import as JSON
- Automatic validation (unreachable areas, etc.)

## Support

For issues or questions:
1. Check this documentation
2. Review the design document at `.kiro/specs/level-editor/design.md`
3. Check the requirements at `.kiro/specs/level-editor/requirements.md`
4. Look at existing level files for examples

---

**Note**: This editor is a development tool. Always test your levels in the actual game before considering them complete.
