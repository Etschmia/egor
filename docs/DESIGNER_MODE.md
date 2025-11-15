# EGOR Designer Mode

A powerful visual design system for customizing wall textures and themes in the EGOR game engine.

## Overview

Designer Mode provides an intuitive interface for creating and managing wall texture themes without requiring knowledge of hexadecimal color codes or technical implementation details. The system replaces hardcoded visual values with configurable design tokens, enabling dynamic styling while maintaining consistency across all game levels.

## Features

### 🎨 Visual Design Tools
- **Color Picker**: Multiple input methods (color wheel, hex, RGB, HSL, named colors, presets)
- **Property Editor**: Intuitive controls for dimensions, patterns, and effects
- **Live Preview**: Real-time texture generation with instant visual feedback
- **Wall Type Selector**: Easy switching between brick, wood, stone, and door textures

### 🛠️ Theme Management
- **Theme Creation**: Create custom themes based on existing ones
- **Import/Export**: JSON and CSS export formats for theme sharing
- **Version Control**: Automatic backups and theme versioning
- **Validation**: Comprehensive theme validation with error reporting

### ⚡ Performance Features
- **Texture Caching**: LRU cache for generated textures
- **Debounced Updates**: Optimized rendering for smooth user experience
- **Background Generation**: Non-blocking texture creation
- **Progressive Loading**: Efficient loading for complex textures

## Quick Start

### 1. Installation
```bash
# Install dependencies (if not already done)
npm install

# Start Designer Mode
npm run designer
```

### 2. Access Designer Mode
- Frontend: http://localhost:3001/designer.html
- Backend API: http://localhost:3002/api

### 3. Basic Usage
1. Select a wall type (brick, wood, stone, door)
2. Modify colors, dimensions, and effects using the property editor
3. View real-time changes in the live preview
4. Save your theme when satisfied

## Architecture

### Design Token System
The Designer Mode is built on a comprehensive design token system that centralizes all visual definitions:

```typescript
interface WallTypeDefinition {
  id: string;
  displayName: string;
  colors: ColorScheme;      // Primary, secondary, accent, shadow, highlight
  dimensions: DimensionSettings;  // Width, height, spacing, borders
  texture: TextureProperties;     // Pattern type, intensity, blend mode
  effects: VisualEffects;         // Shadow, highlight, gradient effects
}
```

### Component Architecture
- **Designer.tsx**: Main application component
- **PropertyEditor**: Controls for modifying wall properties
- **ColorPicker**: Advanced color selection interface
- **LivePreview**: Real-time texture preview with zoom controls
- **ThemeManager**: Theme persistence and validation

### Backend Services
- **designer-server.mjs**: REST API for theme operations
- **Theme Storage**: JSON-based theme persistence
- **Backup System**: Automatic backups before modifications
- **Migration Scripts**: Backward compatibility support

## API Reference

### Theme Operations
```bash
# Get all themes
GET /api/themes

# Get specific theme
GET /api/themes/{id}

# Create new theme
POST /api/themes

# Update theme
PUT /api/themes/{id}

# Delete theme
DELETE /api/themes/{id}
```

### Import/Export
```bash
# Export theme as JSON
GET /api/themes/{id}/export?format=json

# Export theme as CSS
GET /api/themes/{id}/export?format=css

# Import theme
POST /api/themes/import
```

### Backup Management
```bash
# List backups
GET /api/backups

# Restore from backup
POST /api/backups/{filename}/restore
```

## File Structure

```
src/
├── designer/                 # Designer Mode application
│   ├── components/          # React components
│   │   ├── ColorPicker.tsx
│   │   ├── PropertyEditor.tsx
│   │   ├── LivePreview.tsx
│   │   └── WallTypeSelector.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useApiClient.ts
│   │   └── useThemeManager.ts
│   ├── Designer.tsx        # Main application
│   └── styles.css         # Component styles
├── shared/
│   ├── design-tokens/      # Theme management system
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── ThemeManager.ts # Core theme logic
│   │   └── defaultTheme.ts # Default theme definition
│   └── texture-generation/ # Texture generation engine
│       └── TextureGenerator.ts
└── migration/              # Backward compatibility
    └── textureSystemMigration.ts

themes/                     # Theme storage
├── default.json           # Default theme
├── custom-themes/         # User-created themes
└── migrations/           # Migration scripts

backups/                   # Automatic backups
```

## Usage Examples

### Creating a Custom Theme
```typescript
// Create new theme based on default
const newTheme = await createNewTheme('default');

// Modify properties
updateThemeProperty('brick.colors.primary.value', '#FF0000');
updateThemeProperty('wood.dimensions.width.value', 8);

// Save theme
await saveTheme();
```

### Exporting Themes
```typescript
// Export as JSON
await exportTheme('my-theme', 'json');

// Export as CSS custom properties
await exportTheme('my-theme', 'css');
```

### Importing Themes
```typescript
// Import from file
const file = event.target.files[0];
const theme = await importTheme(file);
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current theme |
| `Ctrl+Z` | Undo last change |
| `Ctrl+Y` | Redo last undone change |
| `Ctrl+N` | Create new theme |
| `F1` | Show keyboard shortcuts |
| `Esc` | Close dialogs/clear errors |

## Wall Type Configuration

### Brick Walls
- **Primary Color**: Mortar background (#8B4513)
- **Secondary Color**: Brick color (#D3D3D3)
- **Accent Color**: Joint/seam color (#A0522D)
- **Dimensions**: Brick width (16px), height (4px), spacing (8px)

### Wood Walls
- **Primary Color**: Base wood (#8B4513)
- **Secondary Color**: Plank color (#654321)
- **Accent Color**: Gap color (#4A4A4A)
- **Pattern**: Vertical planks with horizontal grain

### Stone Walls
- **Primary Color**: Base stone (#708090)
- **Secondary Color**: Stone variant 1 (#778899)
- **Accent Color**: Stone variant 2 (#696969)
- **Pattern**: Large stone blocks with variations

### Door Textures
- **Primary Color**: Door wood base (#654321)
- **Secondary Color**: Plank color (#8B4513)
- **Accent Color**: Handle color (#FFD700)
- **Details**: Metal hinges, wood grain, 3D effects

## Troubleshooting

### Common Issues

**Designer Mode won't start**
- Check that ports 3001 and 3002 are available
- Ensure all dependencies are installed: `npm install`
- Try clearing cache: `npm run clean` (if available)

**Textures not generating**
- Check browser console for JavaScript errors
- Verify theme data is valid
- Clear texture cache and refresh

**Server connection issues**
- Ensure backend server is running: `npm run designer:backend`
- Check firewall settings for ports 3001-3002
- Verify CORS settings in designer-server.mjs

**Performance issues**
- Reduce preview size for better performance
- Clear texture cache periodically
- Close other browser tabs using graphics resources

### Debug Mode
Add `?debug=true` to the URL to enable debug logging:
```
http://localhost:3001/designer.html?debug=true
```

## Development

### Running Tests
```bash
# Run Designer Mode integration tests
npm run test:designer
```

### Building for Production
```bash
# Build frontend
npm run build

# The built files will be in dist/ directory
```

### Adding New Wall Types
1. Define wall type in `defaultTheme.ts`
2. Add texture generation logic in `TextureGenerator.ts`
3. Update wall type selector component
4. Add preview generation in selector

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-wall-type`
3. Make your changes
4. Run tests: `npm run test:designer`
5. Commit changes: `git commit -am 'Add new wall type'`
6. Push to branch: `git push origin feature/new-wall-type`
7. Submit a pull request

## License

This Designer Mode is part of the EGOR game engine project. See the main project license for details.

## Support

For questions, issues, or feature requests:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed description
4. Include browser version, OS, and error messages

---

*Designer Mode v1.0.0 - Built with ❤️ for the EGOR community*