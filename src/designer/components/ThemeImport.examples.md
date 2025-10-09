# Theme Import - Usage Examples

## Example 1: Basic Theme Import

### Valid Theme File
**Filename:** `my-theme.json`

```json
{
  "name": "My Custom Theme",
  "version": "1.0.0",
  "wallTypes": {
    "brick": {
      "id": "brick",
      "displayName": "Brick Wall",
      "description": "A classic brick wall",
      "colors": {
        "primary": {
          "value": "#8B4513",
          "displayName": "Primary Color"
        },
        "secondary": {
          "value": "#654321",
          "displayName": "Secondary Color"
        },
        "accent": {
          "value": "#A0522D",
          "displayName": "Accent Color"
        },
        "shadow": {
          "value": "#3E2723",
          "displayName": "Shadow Color"
        },
        "highlight": {
          "value": "#D2691E",
          "displayName": "Highlight Color"
        }
      },
      "dimensions": {
        "width": { "value": 64, "min": 32, "max": 128, "step": 1, "unit": "px" },
        "height": { "value": 64, "min": 32, "max": 128, "step": 1, "unit": "px" },
        "spacing": { "value": 2, "min": 0, "max": 10, "step": 1, "unit": "px" },
        "borderWidth": { "value": 1, "min": 0, "max": 5, "step": 1, "unit": "px" }
      },
      "texture": {
        "pattern": "BRICK",
        "intensity": { "value": 1, "min": 0, "max": 2, "step": 0.1 },
        "blendMode": "NORMAL",
        "procedural": true
      },
      "effects": {
        "shadow": {
          "enabled": false,
          "color": { "value": "#000000", "displayName": "Shadow Color" },
          "offset": { "value": 2, "min": 0, "max": 10, "step": 1, "unit": "px" },
          "blur": { "value": 4, "min": 0, "max": 20, "step": 1, "unit": "px" }
        },
        "highlight": {
          "enabled": false,
          "color": { "value": "#ffffff", "displayName": "Highlight Color" },
          "intensity": { "value": 0.5, "min": 0, "max": 1, "step": 0.1 }
        },
        "gradient": {
          "enabled": false,
          "type": "linear",
          "colors": [
            { "value": "#8B4513", "displayName": "Gradient Start" },
            { "value": "#654321", "displayName": "Gradient End" }
          ]
        }
      },
      "legacyMapping": {}
    }
  }
}
```

### Steps to Import
1. Save the above JSON to a file
2. Open Designer Mode
3. Click the Import button (📥)
4. Select the file
5. See success message: "Theme 'My Custom Theme' imported successfully!"

### Result
- Theme appears in theme selector dropdown
- Theme is automatically set as active
- You can now edit the theme

---

## Example 2: Multi-Wall-Type Theme

### Theme with Multiple Wall Types
**Filename:** `dungeon-theme.json`

```json
{
  "name": "Dungeon Theme",
  "version": "1.0.0",
  "basedOn": "default",
  "wallTypes": {
    "stone": {
      "id": "stone",
      "displayName": "Stone Wall",
      "description": "Dark dungeon stone",
      "colors": {
        "primary": { "value": "#4A4A4A", "displayName": "Primary Color" },
        "secondary": { "value": "#2E2E2E", "displayName": "Secondary Color" },
        "accent": { "value": "#5A5A5A", "displayName": "Accent Color" },
        "shadow": { "value": "#1A1A1A", "displayName": "Shadow Color" },
        "highlight": { "value": "#6A6A6A", "displayName": "Highlight Color" }
      },
      "dimensions": {
        "width": { "value": 64, "min": 32, "max": 128, "step": 1, "unit": "px" },
        "height": { "value": 64, "min": 32, "max": 128, "step": 1, "unit": "px" },
        "spacing": { "value": 2, "min": 0, "max": 10, "step": 1, "unit": "px" },
        "borderWidth": { "value": 1, "min": 0, "max": 5, "step": 1, "unit": "px" }
      },
      "texture": {
        "pattern": "STONE_BLOCKS",
        "intensity": { "value": 1.2, "min": 0, "max": 2, "step": 0.1 },
        "blendMode": "MULTIPLY",
        "procedural": true
      },
      "effects": {
        "shadow": {
          "enabled": true,
          "color": { "value": "#000000", "displayName": "Shadow Color" },
          "offset": { "value": 3, "min": 0, "max": 10, "step": 1, "unit": "px" },
          "blur": { "value": 5, "min": 0, "max": 20, "step": 1, "unit": "px" }
        },
        "highlight": {
          "enabled": false,
          "color": { "value": "#ffffff", "displayName": "Highlight Color" },
          "intensity": { "value": 0.3, "min": 0, "max": 1, "step": 0.1 }
        },
        "gradient": {
          "enabled": false,
          "type": "linear",
          "colors": []
        }
      },
      "legacyMapping": {}
    },
    "iron-door": {
      "id": "iron-door",
      "displayName": "Iron Door",
      "description": "Heavy iron door",
      "colors": {
        "primary": { "value": "#3C3C3C", "displayName": "Primary Color" },
        "secondary": { "value": "#2A2A2A", "displayName": "Secondary Color" },
        "accent": { "value": "#8B7355", "displayName": "Accent Color" },
        "shadow": { "value": "#1A1A1A", "displayName": "Shadow Color" },
        "highlight": { "value": "#5A5A5A", "displayName": "Highlight Color" }
      },
      "dimensions": {
        "width": { "value": 64, "min": 32, "max": 128, "step": 1, "unit": "px" },
        "height": { "value": 64, "min": 32, "max": 128, "step": 1, "unit": "px" },
        "spacing": { "value": 1, "min": 0, "max": 10, "step": 1, "unit": "px" },
        "borderWidth": { "value": 2, "min": 0, "max": 5, "step": 1, "unit": "px" }
      },
      "texture": {
        "pattern": "METAL",
        "intensity": { "value": 1.5, "min": 0, "max": 2, "step": 0.1 },
        "blendMode": "OVERLAY",
        "procedural": true
      },
      "effects": {
        "shadow": {
          "enabled": true,
          "color": { "value": "#000000", "displayName": "Shadow Color" },
          "offset": { "value": 4, "min": 0, "max": 10, "step": 1, "unit": "px" },
          "blur": { "value": 6, "min": 0, "max": 20, "step": 1, "unit": "px" }
        },
        "highlight": {
          "enabled": true,
          "color": { "value": "#ffffff", "displayName": "Highlight Color" },
          "intensity": { "value": 0.4, "min": 0, "max": 1, "step": 0.1 }
        },
        "gradient": {
          "enabled": false,
          "type": "linear",
          "colors": []
        }
      },
      "legacyMapping": {}
    }
  }
}
```

### Result
- Theme with 2 wall types imported
- Both "Stone Wall" and "Iron Door" available in sidebar
- Can switch between and edit both

---

## Example 3: Error Cases

### Error Case 1: Missing Name
**Filename:** `invalid-no-name.json`

```json
{
  "version": "1.0.0",
  "wallTypes": {
    "brick": { /* ... */ }
  }
}
```

**Error Message:**
```
Invalid theme structure: Theme must have a valid name
```

---

### Error Case 2: Missing Wall Types
**Filename:** `invalid-no-walls.json`

```json
{
  "name": "Empty Theme",
  "version": "1.0.0",
  "wallTypes": {}
}
```

**Error Message:**
```
Invalid theme structure: Theme must define at least one wall type
```

---

### Error Case 3: Invalid Version
**Filename:** `invalid-version.json`

```json
{
  "name": "Bad Version Theme",
  "version": "1.0",
  "wallTypes": {
    "brick": { /* ... */ }
  }
}
```

**Error Message:**
```
Invalid theme structure: Theme must have a valid semantic version (x.y.z)
```

---

### Error Case 4: Malformed JSON
**Filename:** `malformed.json`

```json
{
  "name": "Broken Theme",
  "version": "1.0.0"
  "wallTypes": {}
}
```
*(Note: Missing comma after version)*

**Error Message:**
```
Invalid JSON file. Please check the file format.
```

---

## Example 4: Programmatic Usage

### Using the API Client Directly

```typescript
import { useApiClient } from './hooks/useApiClient';

function MyComponent() {
  const apiClient = useApiClient();

  const handleImport = async () => {
    const themeData = {
      name: "Programmatic Theme",
      version: "1.0.0",
      wallTypes: { /* ... */ }
    };

    const importedTheme = await apiClient.importTheme(themeData, false);
    
    if (importedTheme) {
      console.log('Theme imported:', importedTheme.id);
    } else {
      console.error('Import failed:', apiClient.error);
    }
  };

  return <button onClick={handleImport}>Import</button>;
}
```

---

### Using the Theme Manager

```typescript
import { useThemeManager } from './hooks/useThemeManager';

function MyComponent() {
  const themeManager = useThemeManager();

  const handleImport = async () => {
    const themeData = {
      name: "Manager Theme",
      version: "1.0.0",
      wallTypes: { /* ... */ }
    };

    const success = await themeManager.importTheme(themeData);
    
    if (success) {
      console.log('Theme imported and activated');
    } else {
      console.error('Import failed:', themeManager.error);
    }
  };

  return <button onClick={handleImport}>Import</button>;
}
```

---

## Example 5: Batch Import Script

### Node.js Script to Import Multiple Themes

```javascript
// import-themes.mjs
import fs from 'fs/promises';
import path from 'path';

const API_URL = 'http://localhost:3004/api';

async function importTheme(themePath) {
  try {
    const themeData = JSON.parse(await fs.readFile(themePath, 'utf-8'));
    
    const response = await fetch(`${API_URL}/themes/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeData, overwrite: false })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✓ Imported: ${result.theme.name}`);
    } else {
      console.error(`✗ Failed: ${themePath} - ${result.error}`);
    }
  } catch (error) {
    console.error(`✗ Error: ${themePath} - ${error.message}`);
  }
}

async function importAll() {
  const themesDir = './themes-to-import';
  const files = await fs.readdir(themesDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      await importTheme(path.join(themesDir, file));
    }
  }
}

importAll();
```

**Usage:**
```bash
node import-themes.mjs
```

---

## Example 6: Export and Re-import

### Workflow
1. **Export existing theme:**
   - Select theme in Designer Mode
   - Click Export → JSON
   - Save as `my-theme-backup.json`

2. **Modify exported theme:**
   - Open `my-theme-backup.json` in editor
   - Change colors, dimensions, etc.
   - Save changes

3. **Re-import modified theme:**
   - Click Import button
   - Select `my-theme-backup.json`
   - New theme created with modifications

### Example Modification

**Original Export:**
```json
{
  "id": "custom-123",
  "name": "My Theme",
  "wallTypes": {
    "brick": {
      "colors": {
        "primary": { "value": "#8B4513", "displayName": "Primary Color" }
      }
    }
  }
}
```

**Modified for Re-import:**
```json
{
  "name": "My Theme - Dark Version",
  "version": "1.1.0",
  "basedOn": "custom-123",
  "wallTypes": {
    "brick": {
      "colors": {
        "primary": { "value": "#4A2511", "displayName": "Primary Color" }
      }
    }
  }
}
```

**Result:**
- New theme created: "My Theme - Dark Version"
- Original theme unchanged
- Both available in theme selector

---

## Tips & Best Practices

### 1. Theme Naming
- Use descriptive names: "Dark Dungeon" not "Theme1"
- Include version in name for major changes: "Dungeon v2"
- Use consistent naming convention

### 2. Version Management
- Follow semantic versioning: MAJOR.MINOR.PATCH
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes

### 3. File Organization
```
themes/
  ├── production/
  │   ├── default.json
  │   └── dark-mode.json
  ├── development/
  │   ├── test-theme.json
  │   └── experimental.json
  └── backups/
      ├── default-backup-2024-01-15.json
      └── dark-mode-backup-2024-01-15.json
```

### 4. Validation Before Import
- Test in JSON validator first
- Check all required fields present
- Verify color values are valid hex codes
- Ensure numeric values are within ranges

### 5. Backup Strategy
- Export themes regularly
- Keep dated backups
- Store in version control
- Document changes in commit messages
