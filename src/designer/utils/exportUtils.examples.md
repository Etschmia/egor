# Export Utils - Example Outputs

This document shows example outputs from the export utilities for reference.

## JSON Export Example

### Formatted JSON Output

```json
{
  "id": "demo-theme",
  "name": "Demo Theme",
  "version": "1.0.0",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "wallTypes": {
    "brick": {
      "id": "brick",
      "displayName": "Brick Wall",
      "description": "Traditional brick masonry",
      "colors": {
        "primary": {
          "value": "#8B4513",
          "displayName": "Mortar Color"
        },
        "secondary": {
          "value": "#D3D3D3",
          "displayName": "Brick Color"
        }
      },
      "dimensions": {
        "width": {
          "value": 16,
          "displayName": "Width",
          "min": 8,
          "max": 32,
          "step": 1,
          "unit": "px"
        }
      }
    }
  }
}
```

### Minified JSON Output

```json
{"id":"demo-theme","name":"Demo Theme","version":"1.0.0","createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z","wallTypes":{"brick":{"id":"brick","displayName":"Brick Wall","description":"Traditional brick masonry","colors":{"primary":{"value":"#8B4513","displayName":"Mortar Color"}}}}}
```

## CSS Export Example

### Formatted CSS Output

```css
/**
 * Theme: Demo Theme
 * Version: 1.0.0
 * Generated: 2024-01-09T16:45:00.000Z
 */

:root {
  /* Theme Metadata */
  --theme-id: "demo-theme";
  --theme-name: "Demo Theme";
  --theme-version: "1.0.0";

  /* Brick Wall */
  --wall-brick-color-primary: #8B4513;
  --wall-brick-color-secondary: #D3D3D3;
  --wall-brick-color-accent: #A0522D;
  --wall-brick-color-shadow: #5A3D1A;
  --wall-brick-color-highlight: #B85A2A;
  --wall-brick-width: 16px;
  --wall-brick-height: 4px;
  --wall-brick-spacing: 8px;
  --wall-brick-borderWidth: 1px;
  --wall-brick-texture-pattern: "BRICK";
  --wall-brick-texture-intensity: 1;
  --wall-brick-texture-blend-mode: "NORMAL";
  --wall-brick-texture-procedural: true;
  --wall-brick-shadow-enabled: true;
  --wall-brick-shadow-color: #5A3D1A;
  --wall-brick-shadow-offset: 1px;
  --wall-brick-shadow-blur: 0px;
  --wall-brick-highlight-enabled: true;
  --wall-brick-highlight-color: #B85A2A;
  --wall-brick-highlight-intensity: 0.5;
  --wall-brick-gradient-enabled: false;

  /* Wood Paneling */
  --wall-wood-color-primary: #8B4513;
  --wall-wood-color-secondary: #654321;
  --wall-wood-color-accent: #4A4A4A;
  --wall-wood-color-shadow: #5D4037;
  --wall-wood-color-highlight: #A0522D;
  --wall-wood-width: 4px;
  --wall-wood-height: 32px;
  --wall-wood-spacing: 8px;
  --wall-wood-borderWidth: 1px;
  --wall-wood-texture-pattern: "WOOD_GRAIN";
  --wall-wood-texture-intensity: 1;
  --wall-wood-texture-blend-mode: "NORMAL";
  --wall-wood-texture-procedural: true;
  --wall-wood-shadow-enabled: true;
  --wall-wood-shadow-color: #3D2914;
  --wall-wood-shadow-offset: 1px;
  --wall-wood-shadow-blur: 0px;
  --wall-wood-highlight-enabled: true;
  --wall-wood-highlight-color: #A0522D;
  --wall-wood-highlight-intensity: 0.3;
  --wall-wood-gradient-enabled: false;
}
```

### Minified CSS Output

```css
:root{--wall-brick-color-primary:#8B4513;--wall-brick-color-secondary:#D3D3D3;--wall-brick-color-accent:#A0522D;--wall-brick-color-shadow:#5A3D1A;--wall-brick-color-highlight:#B85A2A;--wall-brick-width:16px;--wall-brick-height:4px;--wall-brick-spacing:8px;--wall-brick-borderWidth:1px;--wall-brick-texture-pattern:"BRICK";--wall-brick-texture-intensity:1;--wall-brick-texture-blend-mode:"NORMAL";--wall-brick-texture-procedural:true;--wall-brick-shadow-enabled:true;--wall-brick-shadow-color:#5A3D1A;--wall-brick-shadow-offset:1px;--wall-brick-shadow-blur:0px;--wall-brick-highlight-enabled:true;--wall-brick-highlight-color:#B85A2A;--wall-brick-highlight-intensity:0.5;--wall-brick-gradient-enabled:false;}
```

## Filename Examples

The export utilities automatically generate safe filenames:

| Theme Name | Version | Format | Generated Filename |
|------------|---------|--------|-------------------|
| Demo Theme | 1.0.0 | JSON | `demo-theme-1.0.0.json` |
| Demo Theme | 1.0.0 | CSS | `demo-theme-1.0.0.css` |
| My Custom Theme! | 2.1.3 | JSON | `my-custom-theme-2.1.3.json` |
| Test_Theme-v1 | 1.0.0 | CSS | `test-theme-v1-1.0.0.css` |

## Validation Examples

### Valid Theme

```typescript
const validation = validateThemeForExport(validTheme);
// Result:
{
  valid: true,
  errors: []
}
```

### Invalid Theme (Missing Required Fields)

```typescript
const validation = validateThemeForExport(invalidTheme);
// Result:
{
  valid: false,
  errors: [
    "Theme ID is required",
    "Theme name is required",
    "Wall type brick: Invalid color value for primary: invalid-color"
  ]
}
```

## Usage in Components

### Basic Export

```typescript
import { exportAndDownload } from '@/designer/utils/exportUtils';

function handleExportJSON() {
  const result = exportAndDownload(currentTheme, {
    format: 'json',
    prettify: true,
    includeMetadata: true
  });
  
  if (result.success) {
    showToast('Theme exported successfully!', 'success');
  } else {
    showToast(`Export failed: ${result.error}`, 'error');
  }
}
```

### Export with Validation

```typescript
import { validateThemeForExport, exportAndDownload } from '@/designer/utils/exportUtils';

function handleExportWithValidation() {
  // Validate first
  const validation = validateThemeForExport(currentTheme);
  
  if (!validation.valid) {
    showToast(`Cannot export: ${validation.errors.join(', ')}`, 'error');
    return;
  }
  
  // Export
  const result = exportAndDownload(currentTheme, {
    format: 'css',
    minify: false
  });
  
  if (result.success) {
    showToast('CSS exported successfully!', 'success');
  }
}
```

### Custom Export Options

```typescript
// Export minified JSON without metadata
exportAndDownload(theme, {
  format: 'json',
  minify: true,
  includeMetadata: false
});

// Export formatted CSS with comments
exportAndDownload(theme, {
  format: 'css',
  minify: false,
  includeMetadata: true
});
```

## CSS Variable Usage

Once exported, the CSS variables can be used in stylesheets:

```css
/* Use exported theme variables */
.brick-wall {
  background-color: var(--wall-brick-color-primary);
  border: var(--wall-brick-borderWidth) solid var(--wall-brick-color-accent);
  width: var(--wall-brick-width);
  height: var(--wall-brick-height);
}

.wood-panel {
  background-color: var(--wall-wood-color-primary);
  box-shadow: var(--wall-wood-shadow-offset) var(--wall-wood-shadow-offset) 
              var(--wall-wood-shadow-blur) var(--wall-wood-shadow-color);
}
```

## Integration with Backend

The export utilities can also be used server-side:

```typescript
// Backend endpoint example
app.post('/api/themes/:id/export', async (req, res) => {
  const { format } = req.body;
  const theme = await loadTheme(req.params.id);
  
  const result = exportTheme(theme, { format });
  
  if (result.success) {
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.content);
  } else {
    res.status(400).json({ error: result.error });
  }
});
```
