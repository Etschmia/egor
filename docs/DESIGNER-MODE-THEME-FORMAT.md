# Designer Mode - Theme File Format

Complete specification of the theme file format used by Designer Mode.

## Overview

Themes are stored as JSON files in the `themes/` directory. Each theme defines visual properties for all game assets including wall types, objects, pictures, lights, and enemies.

## File Location

```
themes/
├── default.json              # Default theme (cannot be deleted)
├── custom-themes/            # User-created themes
│   ├── custom-1234567890.json
│   ├── my-theme.json
│   └── ...
└── migrations/               # Theme migration scripts (internal)
```

## Basic Structure

```json
{
  "id": "default",
  "name": "Default Theme",
  "version": "1.0.0",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "basedOn": null,
  "wallTypes": {
    "brick": { /* wall type definition */ },
    "wood": { /* wall type definition */ },
    "stone": { /* wall type definition */ },
    "door": { /* wall type definition */ }
  }
}
```

## Top-Level Properties

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (auto-generated for custom themes) |
| `name` | string | Display name shown in UI |
| `version` | string | Semantic version (e.g., "1.0.0") |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |
| `wallTypes` | object | Wall type definitions (see below) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `basedOn` | string \| null | ID of parent theme (for inheritance) |
| `description` | string | Theme description |
| `author` | string | Theme creator name |
| `tags` | string[] | Searchable tags |

## Wall Type Definition

Each wall type (brick, wood, stone, door) has the following structure:

```json
{
  "id": "brick",
  "displayName": "Brick Wall",
  "description": "Traditional brick wall with mortar",
  "colors": { /* color scheme */ },
  "dimensions": { /* dimension settings */ },
  "texture": { /* texture properties */ },
  "effects": { /* visual effects */ },
  "legacyMapping": { /* backward compatibility */ }
}
```

### Wall Type Properties

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier within theme |
| `displayName` | string | Human-readable name |
| `description` | string | Brief description |
| `colors` | ColorScheme | Color definitions |
| `dimensions` | DimensionSettings | Size and spacing |
| `texture` | TextureProperties | Texture generation settings |
| `effects` | VisualEffects | Visual effects configuration |
| `legacyMapping` | object | Maps to old texture system |

## Color Scheme

Defines the color palette for a wall type:

```json
{
  "colors": {
    "primary": {
      "value": "#8B4513",
      "displayName": "Mortar Color",
      "presets": ["#8B4513", "#A0522D", "#CD853F"]
    },
    "secondary": {
      "value": "#A0522D",
      "displayName": "Brick Color",
      "presets": ["#A0522D", "#CD853F", "#DEB887"]
    },
    "accent": {
      "value": "#654321",
      "displayName": "Joint Color",
      "presets": ["#654321", "#8B4513", "#A0522D"]
    },
    "shadow": {
      "value": "#000000",
      "displayName": "Shadow Color",
      "presets": ["#000000", "#1a1a1a", "#333333"]
    },
    "highlight": {
      "value": "#FFFFFF",
      "displayName": "Highlight Color",
      "presets": ["#FFFFFF", "#F0F0F0", "#E0E0E0"]
    }
  }
}
```

### Color Property

| Field | Type | Description |
|-------|------|-------------|
| `value` | string | Hex color code (e.g., "#FF0000") |
| `displayName` | string | Label shown in UI |
| `presets` | string[] | Quick-select color options |

### Color Roles

- **primary**: Main base color (e.g., mortar for brick, base wood for wood)
- **secondary**: Secondary element color (e.g., brick color, plank color)
- **accent**: Detail color (e.g., joints, grain)
- **shadow**: Shadow/depth color
- **highlight**: Highlight/light reflection color

## Dimension Settings

Defines size and spacing properties:

```json
{
  "dimensions": {
    "width": {
      "value": 64,
      "min": 32,
      "max": 128,
      "step": 8,
      "unit": "px"
    },
    "height": {
      "value": 32,
      "min": 16,
      "max": 64,
      "step": 4,
      "unit": "px"
    },
    "spacing": {
      "value": 4,
      "min": 0,
      "max": 16,
      "step": 1,
      "unit": "px"
    },
    "borderWidth": {
      "value": 2,
      "min": 0,
      "max": 8,
      "step": 1,
      "unit": "px"
    }
  }
}
```

### Number Property

| Field | Type | Description |
|-------|------|-------------|
| `value` | number | Current value |
| `min` | number | Minimum allowed value |
| `max` | number | Maximum allowed value |
| `step` | number | Increment/decrement step |
| `unit` | string | Display unit (e.g., "px", "%", "deg") |

### Dimension Roles

- **width**: Element width (e.g., brick width, plank width)
- **height**: Element height (e.g., brick height)
- **spacing**: Gap between elements (e.g., mortar width, plank spacing)
- **borderWidth**: Border or outline thickness

## Texture Properties

Defines how textures are generated:

```json
{
  "texture": {
    "pattern": "BRICK",
    "intensity": {
      "value": 0.8,
      "min": 0,
      "max": 1,
      "step": 0.1,
      "unit": ""
    },
    "blendMode": "MULTIPLY",
    "procedural": true
  }
}
```

### Texture Fields

| Field | Type | Description |
|-------|------|-------------|
| `pattern` | PatternType | Texture pattern algorithm |
| `intensity` | NumberProperty | Pattern strength (0-1) |
| `blendMode` | BlendMode | How pattern blends with colors |
| `procedural` | boolean | Use procedural generation |

### Pattern Types

- `SOLID`: Flat color, no pattern
- `GRADIENT`: Linear or radial gradient
- `BRICK`: Brick pattern with mortar
- `WOOD_GRAIN`: Vertical wood grain
- `STONE_BLOCKS`: Stone block pattern
- `METAL`: Metallic surface

### Blend Modes

- `NORMAL`: Standard blending
- `MULTIPLY`: Darken effect
- `OVERLAY`: Contrast enhancement
- `SOFT_LIGHT`: Subtle lighting effect

## Visual Effects

Defines additional visual enhancements:

```json
{
  "effects": {
    "shadow": {
      "enabled": true,
      "color": {
        "value": "#000000",
        "displayName": "Shadow Color"
      },
      "offset": {
        "value": 2,
        "min": 0,
        "max": 10,
        "step": 1,
        "unit": "px"
      },
      "blur": {
        "value": 4,
        "min": 0,
        "max": 20,
        "step": 1,
        "unit": "px"
      }
    },
    "highlight": {
      "enabled": true,
      "color": {
        "value": "#FFFFFF",
        "displayName": "Highlight Color"
      },
      "intensity": {
        "value": 0.3,
        "min": 0,
        "max": 1,
        "step": 0.1,
        "unit": ""
      }
    },
    "gradient": {
      "enabled": false,
      "type": "linear",
      "colors": [
        {
          "value": "#FF0000",
          "displayName": "Start Color"
        },
        {
          "value": "#0000FF",
          "displayName": "End Color"
        }
      ]
    }
  }
}
```

### Effect Types

#### Shadow Effect
- `enabled`: Toggle shadow on/off
- `color`: Shadow color
- `offset`: Distance from element
- `blur`: Blur radius

#### Highlight Effect
- `enabled`: Toggle highlight on/off
- `color`: Highlight color
- `intensity`: Highlight strength (0-1)

#### Gradient Effect
- `enabled`: Toggle gradient on/off
- `type`: "linear" or "radial"
- `colors`: Array of gradient stop colors

## Legacy Mapping

Maintains backward compatibility with old texture system:

```json
{
  "legacyMapping": {
    "textureId": 1,
    "colorMap": {
      "primary": "baseColor",
      "secondary": "accentColor"
    }
  }
}
```

This section is automatically managed by the system and should not be manually edited.

## Complete Example

Here's a complete theme file example:

```json
{
  "id": "dark-dungeon",
  "name": "Dark Dungeon",
  "version": "1.0.0",
  "description": "A dark, atmospheric dungeon theme",
  "author": "Game Designer",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z",
  "basedOn": "default",
  "tags": ["dark", "dungeon", "atmospheric"],
  "wallTypes": {
    "brick": {
      "id": "brick",
      "displayName": "Dungeon Brick",
      "description": "Dark, weathered dungeon bricks",
      "colors": {
        "primary": {
          "value": "#2a2a2a",
          "displayName": "Mortar Color",
          "presets": ["#2a2a2a", "#1a1a1a", "#3a3a3a"]
        },
        "secondary": {
          "value": "#4a4a4a",
          "displayName": "Brick Color",
          "presets": ["#4a4a4a", "#3a3a3a", "#5a5a5a"]
        },
        "accent": {
          "value": "#1a1a1a",
          "displayName": "Joint Color",
          "presets": ["#1a1a1a", "#0a0a0a", "#2a2a2a"]
        },
        "shadow": {
          "value": "#000000",
          "displayName": "Shadow Color",
          "presets": ["#000000"]
        },
        "highlight": {
          "value": "#6a6a6a",
          "displayName": "Highlight Color",
          "presets": ["#6a6a6a", "#7a7a7a", "#8a8a8a"]
        }
      },
      "dimensions": {
        "width": {
          "value": 64,
          "min": 32,
          "max": 128,
          "step": 8,
          "unit": "px"
        },
        "height": {
          "value": 32,
          "min": 16,
          "max": 64,
          "step": 4,
          "unit": "px"
        },
        "spacing": {
          "value": 4,
          "min": 0,
          "max": 16,
          "step": 1,
          "unit": "px"
        },
        "borderWidth": {
          "value": 2,
          "min": 0,
          "max": 8,
          "step": 1,
          "unit": "px"
        }
      },
      "texture": {
        "pattern": "BRICK",
        "intensity": {
          "value": 0.9,
          "min": 0,
          "max": 1,
          "step": 0.1,
          "unit": ""
        },
        "blendMode": "MULTIPLY",
        "procedural": true
      },
      "effects": {
        "shadow": {
          "enabled": true,
          "color": {
            "value": "#000000",
            "displayName": "Shadow Color"
          },
          "offset": {
            "value": 3,
            "min": 0,
            "max": 10,
            "step": 1,
            "unit": "px"
          },
          "blur": {
            "value": 6,
            "min": 0,
            "max": 20,
            "step": 1,
            "unit": "px"
          }
        },
        "highlight": {
          "enabled": true,
          "color": {
            "value": "#6a6a6a",
            "displayName": "Highlight Color"
          },
          "intensity": {
            "value": 0.2,
            "min": 0,
            "max": 1,
            "step": 0.1,
            "unit": ""
          }
        },
        "gradient": {
          "enabled": false,
          "type": "linear",
          "colors": []
        }
      },
      "legacyMapping": {
        "textureId": 1
      }
    }
  }
}
```

## Validation Rules

The theme validator checks for:

### Required Fields
- All top-level required fields must be present
- Each wall type must have all required properties
- Color values must be valid hex codes
- Number values must be within min/max range

### Type Validation
- `id`: Non-empty string
- `name`: Non-empty string
- `version`: Valid semantic version (x.y.z)
- `createdAt`, `updatedAt`: Valid ISO 8601 timestamps
- Color values: Valid hex format (#RRGGBB or #RGB)
- Number values: Valid numbers within constraints

### Structural Validation
- `wallTypes` must contain at least one wall type
- Each wall type must have complete color scheme
- Dimension properties must have valid min/max/step
- Pattern type must be one of allowed values
- Blend mode must be one of allowed values

### Logical Validation
- `min` must be less than `max`
- `value` must be between `min` and `max`
- `step` must be positive
- `updatedAt` must be >= `createdAt`

## Import/Export

### JSON Export
Exports the complete theme as formatted JSON:
```json
{
  "id": "my-theme",
  "name": "My Theme",
  ...
}
```

### CSS Export
Exports theme as CSS custom properties:
```css
:root {
  /* Brick Wall Colors */
  --brick-primary: #8B4513;
  --brick-secondary: #A0522D;
  --brick-accent: #654321;
  
  /* Brick Wall Dimensions */
  --brick-width: 64px;
  --brick-height: 32px;
  --brick-spacing: 4px;
  
  /* ... */
}
```

## Backward Compatibility

The theme system maintains backward compatibility through:

1. **Legacy Mapping**: Maps new properties to old texture IDs
2. **Migration Scripts**: Automatically updates old theme formats
3. **Default Values**: Provides sensible defaults for missing properties
4. **Version Detection**: Identifies and upgrades old theme versions

## Best Practices

### Creating Themes
1. Start with "based on" an existing theme
2. Make incremental changes
3. Test in live preview frequently
4. Save regularly (Ctrl+S)
5. Export for backup

### Naming Conventions
- Use descriptive IDs (e.g., "dark-dungeon", not "theme1")
- Use clear display names (e.g., "Dark Dungeon Theme")
- Add meaningful descriptions
- Use relevant tags for searchability

### Color Selection
- Maintain sufficient contrast for visibility
- Consider color blindness accessibility
- Test in different lighting conditions
- Use preset colors for consistency

### Performance
- Avoid extreme dimension values
- Keep texture intensity reasonable (0.5-0.9)
- Limit gradient complexity
- Test performance in live preview

## Related Documentation
- [Designer Mode README](DESIGNER-MODE-README.md)
- [Keyboard Shortcuts](DESIGNER-MODE-KEYBOARD-SHORTCUTS.md)
- [Troubleshooting Guide](DESIGNER-MODE-TROUBLESHOOTING.md)
