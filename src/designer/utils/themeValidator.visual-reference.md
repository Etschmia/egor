# Theme Validator - Visual Reference

## Validation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Theme Validation Flow                     │
└─────────────────────────────────────────────────────────────┘

                         Theme Data
                              ↓
                    ┌─────────────────┐
                    │ Quick Validate  │
                    │  (Fast Check)   │
                    └─────────────────┘
                              ↓
                         Valid? ────No──→ Return Error
                              ↓ Yes
                    ┌─────────────────┐
                    │   Validate      │
                    │   Structure     │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   Validate      │
                    │  Wall Types     │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   Validate      │
                    │   Properties    │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   Backward      │
                    │ Compatibility   │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Return Results  │
                    │ (Errors/Warns)  │
                    └─────────────────┘
```

## Validation Hierarchy

```
Theme
├── id ✓ Required
├── name ✓ Required
├── version ✓ Required (x.y.z format)
├── createdAt ○ Optional (ISO date)
├── updatedAt ○ Optional (ISO date)
├── basedOn ○ Optional
└── wallTypes ✓ Required
    └── [wallTypeId]
        ├── id ✓ Required
        ├── displayName ✓ Required
        ├── description ✓ Required
        ├── colors ✓ Required
        │   ├── primary ✓ Required
        │   │   ├── value ✓ Required (hex color)
        │   │   ├── displayName ✓ Required
        │   │   └── presets ○ Optional (hex colors[])
        │   ├── secondary ✓ Required
        │   ├── accent ✓ Required
        │   ├── shadow ✓ Required
        │   └── highlight ✓ Required
        ├── dimensions ✓ Required
        │   ├── width ✓ Required
        │   │   ├── value ✓ Required (in range)
        │   │   ├── min ✓ Required
        │   │   ├── max ✓ Required
        │   │   ├── step ○ Optional
        │   │   └── unit ○ Optional
        │   ├── height ✓ Required
        │   ├── spacing ✓ Required
        │   └── borderWidth ✓ Required
        ├── texture ✓ Required
        │   ├── pattern ✓ Required (enum)
        │   ├── intensity ✓ Required (number property)
        │   ├── blendMode ✓ Required (enum)
        │   └── procedural ✓ Required (boolean)
        ├── effects ✓ Required
        │   ├── shadow ✓ Required
        │   │   ├── enabled ✓ Required
        │   │   ├── color ✓ Required
        │   │   ├── offset ✓ Required
        │   │   └── blur ✓ Required
        │   ├── highlight ✓ Required
        │   │   ├── enabled ✓ Required
        │   │   ├── color ✓ Required
        │   │   └── intensity ✓ Required
        │   └── gradient ✓ Required
        │       ├── enabled ✓ Required
        │       ├── type ✓ Required ('linear'|'radial')
        │       └── colors ✓ Required (array)
        └── legacyMapping ⚠ Warning if missing
```

## Error Severity Levels

```
┌──────────────────────────────────────────────────────────┐
│                    Severity Levels                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  🔴 ERROR (Blocks Operation)                             │
│  ├─ Invalid structure                                    │
│  ├─ Missing required fields                              │
│  ├─ Invalid data types                                   │
│  ├─ Invalid color formats                                │
│  ├─ Values out of range                                  │
│  └─ Invalid enum values                                  │
│                                                           │
│  🟡 WARNING (Allows Operation)                           │
│  ├─ Missing legacy mapping                               │
│  ├─ Version mismatch                                     │
│  ├─ Empty wall types                                     │
│  ├─ Invalid optional fields                              │
│  └─ Compatibility issues                                 │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Validation Result Structure

```typescript
{
  isValid: boolean,
  errors: [
    {
      code: 'ERROR_CODE',
      message: 'Human-readable message',
      path: 'theme.wallTypes.brick.colors.primary.value',
      severity: 'error'
    }
  ],
  warnings: [
    {
      code: 'WARNING_CODE',
      message: 'Human-readable message',
      path: 'theme.wallTypes.brick.legacyMapping',
      severity: 'warning'
    }
  ]
}
```

## Common Validation Scenarios

### ✓ Valid Theme

```
Input: Complete theme with all required fields
       ↓
Quick Validate: ✓ Pass
       ↓
Comprehensive Validate: ✓ Pass
       ↓
Backward Compatibility: ⚠ 1 Warning
       ↓
Result: isValid = true
        errors = []
        warnings = [MISSING_LEGACY_MAPPING]
```

### ✗ Invalid Color

```
Input: Theme with invalid color value
       ↓
Quick Validate: ✓ Pass
       ↓
Comprehensive Validate: ✗ Fail
       ↓
Result: isValid = false
        errors = [INVALID_COLOR_VALUE]
        warnings = []
```

### ✗ Missing Required Field

```
Input: Theme without 'name' field
       ↓
Quick Validate: ✗ Fail
       ↓
Result: isValid = false
        errors = [MISSING_FIELD]
        warnings = []
```

### ✗ Value Out of Range

```
Input: Theme with width = 100 (max = 32)
       ↓
Quick Validate: ✓ Pass
       ↓
Comprehensive Validate: ✗ Fail
       ↓
Result: isValid = false
        errors = [VALUE_OUT_OF_RANGE]
        warnings = []
```

## Integration Points

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend Integration                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Designer.tsx                                            │
│  └─ handleImport()                                       │
│     ├─ File validation                                   │
│     ├─ JSON parsing                                      │
│     └─ Theme validation ──→ useThemeManager              │
│                                                          │
│  useThemeManager.ts                                      │
│  ├─ loadTheme()                                          │
│  │  └─ validateThemeData() ──→ themeValidator           │
│  ├─ saveTheme()                                          │
│  │  └─ validateThemeData() ──→ themeValidator           │
│  └─ importTheme()                                        │
│     ├─ quickValidate() ──→ themeValidator                │
│     ├─ validateThemeData() ──→ themeValidator            │
│     └─ validateBackwardCompatibility() ──→ themeValidator│
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Backend Integration                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  designer-server.mjs                                     │
│  ├─ POST /api/themes                                     │
│  │  └─ validateTheme()                                   │
│  ├─ PUT /api/themes/:id                                  │
│  │  └─ validateTheme()                                   │
│  └─ POST /api/themes/import                              │
│     └─ validateTheme()                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Error Code Reference

### Critical Errors (🔴)

| Code | Description | Example |
|------|-------------|---------|
| `INVALID_THEME` | Theme is not a valid object | `theme = null` |
| `MISSING_FIELD` | Required field is missing | Missing `id` field |
| `INVALID_TYPE` | Field has wrong type | `id = 123` (should be string) |
| `INVALID_COLOR_VALUE` | Color is not valid hex | `value = "red"` |
| `VALUE_OUT_OF_RANGE` | Number outside min/max | `value = 100, max = 32` |
| `INVALID_RANGE` | Min > Max | `min = 10, max = 5` |
| `INVALID_PATTERN` | Pattern not in enum | `pattern = "INVALID"` |
| `INVALID_BLEND_MODE` | Blend mode not in enum | `blendMode = "INVALID"` |
| `INVALID_GRADIENT_TYPE` | Type not linear/radial | `type = "circular"` |
| `INVALID_DATE_FORMAT` | Date not ISO format | `createdAt = "2024-01-01"` |

### Warnings (🟡)

| Code | Description | Example |
|------|-------------|---------|
| `UNSUPPORTED_VERSION` | Version not in supported list | `version = "2.0.0"` |
| `EMPTY_WALL_TYPES` | No wall types defined | `wallTypes = {}` |
| `MISSING_LEGACY_MAPPING` | No legacy mapping | `legacyMapping` missing |
| `VERSION_MISMATCH` | Version differs from current | `version = "1.0.1"` |
| `INVALID_PRESETS` | Preset colors invalid | `presets = ["red"]` |
| `INVALID_STEP` | Step is not a number | `step = "1"` |
| `INVALID_UNIT` | Unit is not a string | `unit = 1` |

## Performance Characteristics

```
┌─────────────────────────────────────────────────────────┐
│              Validation Performance                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Quick Validate:           O(1)     ~0.1ms              │
│  Comprehensive Validate:   O(n)     ~1-5ms              │
│  Backward Compatibility:   O(n)     ~0.5ms              │
│                                                          │
│  Where n = number of wall types                          │
│                                                          │
│  Typical theme (4 wall types):                           │
│  Total validation time: ~2-6ms                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Import Validation

```typescript
// User selects theme file
const file = event.target.files[0];

// Read file
const text = await file.text();
const themeData = JSON.parse(text);

// Quick check
if (!quickValidate(themeData)) {
  showError('Invalid theme file');
  return;
}

// Comprehensive validation
const result = validateTheme(themeData);

if (!result.isValid) {
  const formatted = formatValidationResults(result);
  showError(formatted);
  return;
}

// Check compatibility
const compat = validateBackwardCompatibility(themeData);
if (compat.warnings.length > 0) {
  console.warn('Compatibility warnings:', compat.warnings);
}

// Import theme
await importTheme(themeData);
showSuccess('Theme imported successfully!');
```

### Example 2: Save Validation

```typescript
// User clicks save
const handleSave = async () => {
  // Validate before saving
  const result = validateTheme(activeTheme);
  
  if (!result.isValid) {
    const errors = result.errors.map(e => e.message).join('\n');
    showError(`Cannot save invalid theme:\n${errors}`);
    return;
  }
  
  // Save theme
  await saveTheme(activeTheme);
  showSuccess('Theme saved successfully!');
};
```

### Example 3: Load Validation

```typescript
// Load theme from API
const theme = await apiClient.getTheme(themeId);

// Validate before loading
const result = validateTheme(theme);

if (!result.isValid) {
  showError('Failed to load theme: Invalid structure');
  return;
}

// Check compatibility
const compat = validateBackwardCompatibility(theme);
if (compat.warnings.length > 0) {
  console.warn('[Theme Load]', compat.warnings);
}

// Load theme
setActiveTheme(theme);
```

## Best Practices Checklist

- ✓ Always validate before save
- ✓ Use quick validate before comprehensive validate
- ✓ Check backward compatibility on import
- ✓ Log warnings to console
- ✓ Show user-friendly error messages
- ✓ Provide specific error paths
- ✓ Don't block on warnings
- ✓ Validate on both frontend and backend
- ✓ Handle validation errors gracefully
- ✓ Test with invalid themes

## Troubleshooting

### Theme Won't Load

1. Check console for validation errors
2. Verify all required fields are present
3. Check color values are valid hex colors
4. Verify number values are within ranges
5. Check pattern and blend mode values

### Theme Won't Save

1. Run validation manually
2. Check for missing required fields
3. Verify all values are within ranges
4. Check for invalid color formats
5. Review validation error messages

### Import Fails

1. Verify file is valid JSON
2. Check file size (< 10MB)
3. Run quick validation
4. Check comprehensive validation errors
5. Review compatibility warnings

## Summary

The theme validator provides:

✓ Comprehensive structure validation
✓ Property value validation
✓ Backward compatibility checks
✓ Detailed error reporting
✓ Fast performance
✓ Easy integration
✓ Clear documentation
✓ Production-ready code
