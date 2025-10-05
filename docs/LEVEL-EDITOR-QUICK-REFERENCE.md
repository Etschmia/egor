# Level Editor - Quick Reference Card

## Start Editor
```bash
npm run editor
```
Opens at: http://localhost:3000

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+S` | Save level |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Delete` | Remove selected entity |
| `Escape` | Close dialog / Deselect |

## Color Guide

### Tiles
- **Black** = Floor (0)
- **White** = Wall (1)
- **Brown** = Door (2)
- **Green** = Exit Door (3)

### Entities
- **Blue** = Player Start
- **Light Green** = Zombie
- **Red** = Monster
- **Purple** = Ghost
- **Gold** = Dog
- **Red Diamond** = Health
- **Orange Diamond** = Ammo
- **Gold Diamond** = Treasure
- **Silver Diamond** = Weapon
- **Gray Square** = Decorative Object
- **Brown Square** = Wall Picture

## Quick Actions

### Add Enemy
1. Click empty floor
2. Select "Add Enemy"
3. Choose type
4. Click enemy to edit properties

### Add Item
1. Click empty floor
2. Select "Add Item"
3. Choose type
4. For weapons, select weapon type

### Change Tile
1. Click any tile
2. Select "Change Type"
3. Choose new type

### Set Player Start
1. Click empty floor
2. Select "Set as Player Start"
3. Enter direction (0-360°)

### Create New Level
1. Click "New Level"
2. Enter level & variant numbers
3. Edit and save

### Resize Level
1. Enter new width/height
2. Click "Apply Size"
3. Confirm warning

## Entity Types

### Enemies
- ZOMBIE - Basic enemy
- MONSTER - Strong, high health
- GHOST - Fast, low health
- DOG - Fast, aggressive

### Items
- HEALTH_SMALL - Small health pack
- HEALTH_LARGE - Large health pack
- TREASURE - Points/score
- AMMO - Ammunition
- WEAPON - Weapon pickup

### Decorative Objects
- CEILING_LIGHT - Ceiling mounted
- VASE - Floor object
- CRATE - Floor object
- BENCH - Floor object
- TABLE - Floor object
- CHAIR - Floor object
- WINE_BOTTLE - Floor object
- SKELETON - Floor object

### Wall Pictures
- PORTRAIT - Wall decoration
- LANDSCAPE - Wall decoration
- ABSTRACT - Wall decoration

## File Naming
Format: `levelX-variantY.ts`
- Example: `level1-variant1.ts`
- X = level number (1-7)
- Y = variant number (1-5)

## Common Workflows

### Edit Existing Level
1. Select level from dropdown
2. Select variant from dropdown
3. Make changes
4. Press `Ctrl+S` to save

### Create New Variant
1. Click "New Variant"
2. Enter variant number
3. Edit empty level
4. Save

### Copy Level Design
1. Load source level
2. Click "New Variant"
3. Make modifications
4. Save as new variant

## Tips

- Always place outer walls
- Ensure player start is on floor
- Place at least one exit door
- Test in game after saving
- Save frequently (`Ctrl+S`)
- Use undo if you make mistakes

## Troubleshooting

**Can't save?**
- Check console for errors
- Verify filename format
- Ensure backend is running

**Changes not in game?**
- Restart game dev server
- Clear browser cache
- Check file was saved

**Editor won't start?**
- Check ports 3000/3001 available
- Run `npm install`
- Check Node.js version

## Documentation
Full docs: [LEVEL-EDITOR-README.md](LEVEL-EDITOR-README.md)

---
**Quick Tip**: Right-click on anything to see available actions!
