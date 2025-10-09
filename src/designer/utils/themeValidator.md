# Theme Validator

Comprehensive validation utility for Designer Mode themes.

## Overview

The theme validator provides robust validation for theme structure, property values, and backward compatibility. It ensures themes meet all requirements before being loaded, saved, or imported.

## Features

- **Structure Validation**: Validates complete theme structure including all required fields
- **Property Validation**: Validates colors (hex format), numbers (range checks), patterns, and blend modes
- **Backward Compatibility**: Checks for legacy mapping and version compatibility
- **Quick Validation**: Fast pre-check for basic structure before comprehensive validation
- **Detailed Error Reporting**: Provides specific error codes, messages, and paths for easy debugging

## Usage

### Basic Validation

```typescript
import { validateTheme } from './themeValidator';

const theme = {
  id: 'my-theme',
  name: 'My Theme',
  version: '1.0.0',
  wallTypes: { /* ... */ }
};

const result = validateTheme(theme);

if (result.isValid) {
  console.log('Theme is valid!');
} else {
  console.error('Validation errors:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('Validation warnings:', result.warnings);
}
```

### Quick Validation

Use `quickValidate` for a fast pre-check before comprehensive validation:

```typescript
import { quickValidate } from './themeValidator';

if (!quickValidate(theme)) {
  console.error('Theme is missing required fields');
  return;
}

// Proceed with comprehensive validation
const result = validateTheme(theme);
```

### Backward Compatibility Check

```typescript
import { validateBackwardCompatibility } from './themeValidator';

const compatResult = validateBackwardCompatibility(theme);

if (compatResult.warnings.length > 0) {
  console.warn('Compatibility warnings:', compatResult.warnings);
}
```

### Format Validation Results

```typescript
import { formatValidationResults } from './themeValidator';

const result = validateTheme(theme);
const formatted = formatValidationResults(result);

console.log(formatted);
// Output:
// ✓ Theme validation passed
// or
// ✗ Theme validation failed
// Errors:
//   • [MISSING_FIELD] theme.id: Required field 'id' is missing
```

## Validation Rules

### Theme Level

- **id**: Required, non-empty string
- **name**: Required, non-empty string
- **version**: Required, semantic version format (x.y.z)
- **wallTypes**: Required, object with at least one wall type
- **createdAt**: Optional, valid ISO date string
- **updatedAt**: Optional, valid ISO date string
- **basedOn**: Optional, string

### Wall Type Level

Each wall type must have:

- **id**: Required, non-empty string
- **displayName**: Required, non-empty string
- **description**: Required, string
- **colors**: Required, object with 5 required colors
- **dimensions**: Required, object with 4 required dimensions
- **texture**: Required, object with pattern, intensity, blendMode, procedural
- **effects**: Required, object with shadow, highlight, gradient
- **legacyMapping**: Optional, object (warning if missing)

### Color Properties

- **value**: Required, valid hex color (#RGB or #RRGGBB)
- **displayName**: Required, string
- **presets**: Optional, array of valid hex colors

### Number Properties

- **value**: Required, number within min/max range
- **min**: Required, number
- **max**: Required, number (must be >= min)
- **step**: Optional, number
- **unit**: Optional, string

### Texture Properties

- **pattern**: Required, one of: SOLID, GRADIENT, BRICK, WOOD_GRAIN, STONE_BLOCKS, METAL
- **intensity**: Required, number property
- **blendMode**: Required, one of: NORMAL, MULTIPLY, OVERLAY, SOFT_LIGHT
- **procedural**: Required, boolean

### Effect Properties

**Shadow Effect:**
- enabled: boolean
- color: color property
- offset: number property
- blur: number property

**Highlight Effect:**
- enabled: boolean
- color: color property
- intensity: number property

**Gradient Effect:**
- enabled: boolean
- type: 'linear' or 'radial'
- colors: array of color properties

## Error Codes

### Critical Errors (Prevent Loading/Saving)

- `INVALID_THEME`: Theme is not a valid object
- `MISSING_FIELD`: Required field is missing
- `INVALID_TYPE`: Field has wrong type
- `INVALID_COLOR_VALUE`: Color is not a valid hex color
- `VALUE_OUT_OF_RANGE`: Number value is outside allowed range
- `INVALID_RANGE`: Min value is greater than max value
- `INVALID_PATTERN`: Texture pattern is not valid
- `INVALID_BLEND_MODE`: Blend mode is not valid
- `INVALID_GRADIENT_TYPE`: Gradient type is not 'linear' or 'radial'
- `INVALID_DATE_FORMAT`: Date string is not valid ISO format

### Warnings (Allow Loading/Saving)

- `UNSUPPORTED_VERSION`: Theme version may not be fully compatible
- `EMPTY_WALL_TYPES`: Theme has no wall types defined
- `MISSING_LEGACY_MAPPING`: Wall type is missing legacy mapping
- `VERSION_MISMATCH`: Theme version differs from current version
- `INVALID_PRESETS`: Color presets are not valid
- `INVALID_STEP`: Step value is not a number
- `INVALID_UNIT`: Unit value is not a string

## Integration

### In useThemeManager Hook

The validator is integrated into the theme manager for:

1. **Theme Loading**: Validates theme before loading
2. **Theme Saving**: Validates theme before saving
3. **Theme Import**: Quick validation + comprehensive validation + compatibility check

```typescript
// In useThemeManager.ts
import { validateTheme, validateBackwardCompatibility, quickValidate } from '../utils/themeValidator';

// Quick check on import
if (!quickValidate(themeData)) {
  return false;
}

// Comprehensive validation
const validation = validateTheme(themeData);
if (!validation.isValid) {
  setState(prev => ({ ...prev, error: validation.errors.join(', ') }));
  return false;
}

// Compatibility check
const compatCheck = validateBackwardCompatibility(themeData);
if (compatCheck.warnings.length > 0) {
  console.warn('[Compatibility]', compatCheck.warnings);
}
```

### In Backend Server

The backend server has its own validation implementation for security:

```javascript
// In designer-server.mjs
const validation = validateTheme(theme);
if (!validation.valid) {
  return res.status(400).json({ 
    success: false, 
    error: 'Invalid theme structure',
    details: validation.errors 
  });
}

if (validation.warnings.length > 0) {
  console.warn('[Theme Warnings]', validation.warnings);
}
```

## Supported Versions

The validator supports the following theme versions:
- 1.0.0 (current)
- 1.0.1
- 1.1.0

Themes with other versions will generate a compatibility warning but can still be loaded.

## Best Practices

1. **Always validate before saving**: Prevent invalid themes from being persisted
2. **Use quick validation first**: Save processing time on obviously invalid themes
3. **Check compatibility on import**: Warn users about potential issues
4. **Log warnings**: Don't block on warnings, but inform users
5. **Provide detailed errors**: Help users fix validation issues quickly

## Example: Complete Validation Flow

```typescript
async function importTheme(themeData: any): Promise<boolean> {
  // Step 1: Quick validation
  if (!quickValidate(themeData)) {
    showError('Theme is missing required fields');
    return false;
  }

  // Step 2: Comprehensive validation
  const validation = validateTheme(themeData);
  
  if (!validation.isValid) {
    const formatted = formatValidationResults(validation);
    showError(formatted);
    return false;
  }

  // Step 3: Compatibility check
  const compatCheck = validateBackwardCompatibility(themeData);
  
  if (compatCheck.warnings.length > 0) {
    compatCheck.warnings.forEach(warning => {
      console.warn(`[${warning.code}] ${warning.path}: ${warning.message}`);
    });
    
    // Optionally show warning to user
    showWarning('Theme has compatibility warnings. See console for details.');
  }

  // Step 4: Import theme
  await apiClient.importTheme(themeData);
  
  return true;
}
```

## Testing

The validator includes comprehensive tests covering:

- Quick validation for various invalid structures
- Complete theme validation
- Color format validation
- Number range validation
- Pattern and blend mode validation
- Backward compatibility checks
- Error formatting

Run tests with:
```bash
npm test -- src/designer/utils/themeValidator.test.ts
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **12.1**: Error handling with clear messages
- **12.2**: Validation before save/load operations
- **15.4**: Backward compatibility checks

## Future Enhancements

Potential improvements for future versions:

1. **Schema Validation**: Use JSON Schema for more declarative validation
2. **Custom Validators**: Allow plugins to add custom validation rules
3. **Auto-Fix**: Automatically fix common validation issues
4. **Migration Support**: Automatically migrate themes between versions
5. **Validation Profiles**: Different validation levels (strict, lenient, etc.)
