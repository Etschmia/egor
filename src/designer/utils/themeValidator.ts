/**
 * Theme Validation Utility
 * 
 * Validates theme structure, property values, and backward compatibility.
 * Requirements: 12.1, 12.2, 15.4
 */

import type {
  PatternType,
  BlendMode,
} from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  path: string;
  severity: 'error';
}

export interface ValidationWarning {
  code: string;
  message: string;
  path: string;
  severity: 'warning';
}

// Supported theme versions for backward compatibility
const SUPPORTED_VERSIONS = ['1.0.0', '1.0.1', '1.1.0'];
const CURRENT_VERSION = '1.0.0';

// Valid pattern types
const VALID_PATTERNS: PatternType[] = [
  'SOLID',
  'GRADIENT',
  'BRICK',
  'WOOD_GRAIN',
  'STONE_BLOCKS',
  'METAL',
];

// Valid blend modes
const VALID_BLEND_MODES: BlendMode[] = [
  'NORMAL',
  'MULTIPLY',
  'OVERLAY',
  'SOFT_LIGHT',
];

/**
 * Validates a complete theme object
 */
export function validateTheme(theme: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate theme structure
  if (!theme || typeof theme !== 'object') {
    errors.push({
      code: 'INVALID_THEME',
      message: 'Theme must be a valid object',
      path: 'theme',
      severity: 'error',
    });
    return { isValid: false, errors, warnings };
  }

  // Validate required top-level fields
  validateRequiredField(theme, 'id', 'string', errors);
  validateRequiredField(theme, 'name', 'string', errors);
  validateRequiredField(theme, 'version', 'string', errors);
  validateRequiredField(theme, 'wallTypes', 'object', errors);

  // Validate optional fields if present
  if (theme.createdAt !== undefined) {
    validateDateString(theme.createdAt, 'createdAt', errors);
  }
  if (theme.updatedAt !== undefined) {
    validateDateString(theme.updatedAt, 'updatedAt', errors);
  }
  if (theme.basedOn !== undefined && typeof theme.basedOn !== 'string') {
    errors.push({
      code: 'INVALID_BASED_ON',
      message: 'basedOn must be a string',
      path: 'basedOn',
      severity: 'error',
    });
  }

  // Validate version compatibility
  if (theme.version && !SUPPORTED_VERSIONS.includes(theme.version)) {
    warnings.push({
      code: 'UNSUPPORTED_VERSION',
      message: `Theme version ${theme.version} may not be fully compatible. Supported versions: ${SUPPORTED_VERSIONS.join(', ')}`,
      path: 'version',
      severity: 'warning',
    });
  }

  // Validate wallTypes
  if (theme.wallTypes && typeof theme.wallTypes === 'object') {
    const wallTypeIds = Object.keys(theme.wallTypes);
    
    if (wallTypeIds.length === 0) {
      warnings.push({
        code: 'EMPTY_WALL_TYPES',
        message: 'Theme has no wall types defined',
        path: 'wallTypes',
        severity: 'warning',
      });
    }

    wallTypeIds.forEach((wallTypeId) => {
      const wallType = theme.wallTypes[wallTypeId];
      validateWallType(wallType, `wallTypes.${wallTypeId}`, errors, warnings);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a wall type definition
 */
function validateWallType(
  wallType: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!wallType || typeof wallType !== 'object') {
    errors.push({
      code: 'INVALID_WALL_TYPE',
      message: 'Wall type must be a valid object',
      path,
      severity: 'error',
    });
    return;
  }

  // Validate required fields
  validateRequiredField(wallType, 'id', 'string', errors, path);
  validateRequiredField(wallType, 'displayName', 'string', errors, path);
  validateRequiredField(wallType, 'description', 'string', errors, path);
  validateRequiredField(wallType, 'colors', 'object', errors, path);
  validateRequiredField(wallType, 'dimensions', 'object', errors, path);
  validateRequiredField(wallType, 'texture', 'object', errors, path);
  validateRequiredField(wallType, 'effects', 'object', errors, path);

  // Validate colors
  if (wallType.colors) {
    validateColorScheme(wallType.colors, `${path}.colors`, errors, warnings);
  }

  // Validate dimensions
  if (wallType.dimensions) {
    validateDimensions(wallType.dimensions, `${path}.dimensions`, errors, warnings);
  }

  // Validate texture
  if (wallType.texture) {
    validateTexture(wallType.texture, `${path}.texture`, errors, warnings);
  }

  // Validate effects
  if (wallType.effects) {
    validateEffects(wallType.effects, `${path}.effects`, errors, warnings);
  }

  // Validate legacy mapping if present
  if (wallType.legacyMapping !== undefined && typeof wallType.legacyMapping !== 'object') {
    warnings.push({
      code: 'INVALID_LEGACY_MAPPING',
      message: 'legacyMapping should be an object',
      path: `${path}.legacyMapping`,
      severity: 'warning',
    });
  }
}

/**
 * Validates color scheme
 */
function validateColorScheme(
  colors: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  const requiredColors = ['primary', 'secondary', 'accent', 'shadow', 'highlight'];
  
  requiredColors.forEach((colorName) => {
    if (!colors[colorName]) {
      errors.push({
        code: 'MISSING_COLOR',
        message: `Required color '${colorName}' is missing`,
        path: `${path}.${colorName}`,
        severity: 'error',
      });
    } else {
      validateColorProperty(colors[colorName], `${path}.${colorName}`, errors, warnings);
    }
  });
}

/**
 * Validates a color property
 */
function validateColorProperty(
  color: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!color || typeof color !== 'object') {
    errors.push({
      code: 'INVALID_COLOR_PROPERTY',
      message: 'Color property must be an object',
      path,
      severity: 'error',
    });
    return;
  }

  validateRequiredField(color, 'value', 'string', errors, path);
  validateRequiredField(color, 'displayName', 'string', errors, path);

  // Validate color value format (hex color)
  if (color.value && typeof color.value === 'string') {
    if (!isValidHexColor(color.value)) {
      errors.push({
        code: 'INVALID_COLOR_VALUE',
        message: `Color value '${color.value}' is not a valid hex color`,
        path: `${path}.value`,
        severity: 'error',
      });
    }
  }

  // Validate presets if present
  if (color.presets !== undefined) {
    if (!Array.isArray(color.presets)) {
      warnings.push({
        code: 'INVALID_PRESETS',
        message: 'Color presets should be an array',
        path: `${path}.presets`,
        severity: 'warning',
      });
    } else {
      color.presets.forEach((preset: any, index: number) => {
        if (typeof preset !== 'string' || !isValidHexColor(preset)) {
          warnings.push({
            code: 'INVALID_PRESET_COLOR',
            message: `Preset color at index ${index} is not a valid hex color`,
            path: `${path}.presets[${index}]`,
            severity: 'warning',
          });
        }
      });
    }
  }
}

/**
 * Validates dimension settings
 */
function validateDimensions(
  dimensions: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  const requiredDimensions = ['width', 'height', 'spacing', 'borderWidth'];
  
  requiredDimensions.forEach((dimName) => {
    if (!dimensions[dimName]) {
      errors.push({
        code: 'MISSING_DIMENSION',
        message: `Required dimension '${dimName}' is missing`,
        path: `${path}.${dimName}`,
        severity: 'error',
      });
    } else {
      validateNumberProperty(dimensions[dimName], `${path}.${dimName}`, errors, warnings);
    }
  });
}

/**
 * Validates a number property
 */
function validateNumberProperty(
  prop: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!prop || typeof prop !== 'object') {
    errors.push({
      code: 'INVALID_NUMBER_PROPERTY',
      message: 'Number property must be an object',
      path,
      severity: 'error',
    });
    return;
  }

  validateRequiredField(prop, 'value', 'number', errors, path);
  validateRequiredField(prop, 'min', 'number', errors, path);
  validateRequiredField(prop, 'max', 'number', errors, path);

  // Validate value is within range
  if (typeof prop.value === 'number' && typeof prop.min === 'number' && typeof prop.max === 'number') {
    if (prop.value < prop.min || prop.value > prop.max) {
      errors.push({
        code: 'VALUE_OUT_OF_RANGE',
        message: `Value ${prop.value} is outside allowed range [${prop.min}, ${prop.max}]`,
        path: `${path}.value`,
        severity: 'error',
      });
    }

    if (prop.min > prop.max) {
      errors.push({
        code: 'INVALID_RANGE',
        message: `Min value ${prop.min} is greater than max value ${prop.max}`,
        path,
        severity: 'error',
      });
    }
  }

  // Validate step if present
  if (prop.step !== undefined && typeof prop.step !== 'number') {
    warnings.push({
      code: 'INVALID_STEP',
      message: 'Step should be a number',
      path: `${path}.step`,
      severity: 'warning',
    });
  }

  // Validate unit if present
  if (prop.unit !== undefined && typeof prop.unit !== 'string') {
    warnings.push({
      code: 'INVALID_UNIT',
      message: 'Unit should be a string',
      path: `${path}.unit`,
      severity: 'warning',
    });
  }
}

/**
 * Validates texture properties
 */
function validateTexture(
  texture: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!texture || typeof texture !== 'object') {
    errors.push({
      code: 'INVALID_TEXTURE',
      message: 'Texture must be an object',
      path,
      severity: 'error',
    });
    return;
  }

  validateRequiredField(texture, 'pattern', 'string', errors, path);
  validateRequiredField(texture, 'intensity', 'object', errors, path);
  validateRequiredField(texture, 'blendMode', 'string', errors, path);
  validateRequiredField(texture, 'procedural', 'boolean', errors, path);

  // Validate pattern type
  if (texture.pattern && !VALID_PATTERNS.includes(texture.pattern)) {
    errors.push({
      code: 'INVALID_PATTERN',
      message: `Pattern '${texture.pattern}' is not valid. Must be one of: ${VALID_PATTERNS.join(', ')}`,
      path: `${path}.pattern`,
      severity: 'error',
    });
  }

  // Validate blend mode
  if (texture.blendMode && !VALID_BLEND_MODES.includes(texture.blendMode)) {
    errors.push({
      code: 'INVALID_BLEND_MODE',
      message: `Blend mode '${texture.blendMode}' is not valid. Must be one of: ${VALID_BLEND_MODES.join(', ')}`,
      path: `${path}.blendMode`,
      severity: 'error',
    });
  }

  // Validate intensity
  if (texture.intensity) {
    validateNumberProperty(texture.intensity, `${path}.intensity`, errors, warnings);
  }
}

/**
 * Validates visual effects
 */
function validateEffects(
  effects: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!effects || typeof effects !== 'object') {
    errors.push({
      code: 'INVALID_EFFECTS',
      message: 'Effects must be an object',
      path,
      severity: 'error',
    });
    return;
  }

  // Validate shadow effect
  if (effects.shadow) {
    validateShadowEffect(effects.shadow, `${path}.shadow`, errors, warnings);
  } else {
    errors.push({
      code: 'MISSING_SHADOW_EFFECT',
      message: 'Shadow effect is required',
      path: `${path}.shadow`,
      severity: 'error',
    });
  }

  // Validate highlight effect
  if (effects.highlight) {
    validateHighlightEffect(effects.highlight, `${path}.highlight`, errors, warnings);
  } else {
    errors.push({
      code: 'MISSING_HIGHLIGHT_EFFECT',
      message: 'Highlight effect is required',
      path: `${path}.highlight`,
      severity: 'error',
    });
  }

  // Validate gradient effect
  if (effects.gradient) {
    validateGradientEffect(effects.gradient, `${path}.gradient`, errors, warnings);
  } else {
    errors.push({
      code: 'MISSING_GRADIENT_EFFECT',
      message: 'Gradient effect is required',
      path: `${path}.gradient`,
      severity: 'error',
    });
  }
}

/**
 * Validates shadow effect
 */
function validateShadowEffect(
  shadow: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  validateRequiredField(shadow, 'enabled', 'boolean', errors, path);
  validateRequiredField(shadow, 'color', 'object', errors, path);
  validateRequiredField(shadow, 'offset', 'object', errors, path);
  validateRequiredField(shadow, 'blur', 'object', errors, path);

  if (shadow.color) {
    validateColorProperty(shadow.color, `${path}.color`, errors, warnings);
  }
  if (shadow.offset) {
    validateNumberProperty(shadow.offset, `${path}.offset`, errors, warnings);
  }
  if (shadow.blur) {
    validateNumberProperty(shadow.blur, `${path}.blur`, errors, warnings);
  }
}

/**
 * Validates highlight effect
 */
function validateHighlightEffect(
  highlight: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  validateRequiredField(highlight, 'enabled', 'boolean', errors, path);
  validateRequiredField(highlight, 'color', 'object', errors, path);
  validateRequiredField(highlight, 'intensity', 'object', errors, path);

  if (highlight.color) {
    validateColorProperty(highlight.color, `${path}.color`, errors, warnings);
  }
  if (highlight.intensity) {
    validateNumberProperty(highlight.intensity, `${path}.intensity`, errors, warnings);
  }
}

/**
 * Validates gradient effect
 */
function validateGradientEffect(
  gradient: any,
  path: string,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  validateRequiredField(gradient, 'enabled', 'boolean', errors, path);
  validateRequiredField(gradient, 'type', 'string', errors, path);
  validateRequiredField(gradient, 'colors', 'object', errors, path);

  if (gradient.type && gradient.type !== 'linear' && gradient.type !== 'radial') {
    errors.push({
      code: 'INVALID_GRADIENT_TYPE',
      message: `Gradient type '${gradient.type}' is not valid. Must be 'linear' or 'radial'`,
      path: `${path}.type`,
      severity: 'error',
    });
  }

  if (gradient.colors) {
    if (!Array.isArray(gradient.colors)) {
      errors.push({
        code: 'INVALID_GRADIENT_COLORS',
        message: 'Gradient colors must be an array',
        path: `${path}.colors`,
        severity: 'error',
      });
    } else {
      gradient.colors.forEach((color: any, index: number) => {
        validateColorProperty(color, `${path}.colors[${index}]`, errors, warnings);
      });
    }
  }
}

/**
 * Validates that a required field exists and has the correct type
 */
function validateRequiredField(
  obj: any,
  field: string,
  expectedType: string,
  errors: ValidationError[],
  basePath?: string
): void {
  const path = basePath ? `${basePath}.${field}` : field;

  if (obj[field] === undefined || obj[field] === null) {
    errors.push({
      code: 'MISSING_FIELD',
      message: `Required field '${field}' is missing`,
      path,
      severity: 'error',
    });
    return;
  }

  const actualType = Array.isArray(obj[field]) ? 'array' : typeof obj[field];
  if (actualType !== expectedType) {
    errors.push({
      code: 'INVALID_TYPE',
      message: `Field '${field}' should be of type '${expectedType}' but got '${actualType}'`,
      path,
      severity: 'error',
    });
  }
}

/**
 * Validates a date string
 */
function validateDateString(dateStr: any, field: string, errors: ValidationError[]): void {
  if (typeof dateStr !== 'string') {
    errors.push({
      code: 'INVALID_DATE',
      message: `${field} must be a string`,
      path: field,
      severity: 'error',
    });
    return;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    errors.push({
      code: 'INVALID_DATE_FORMAT',
      message: `${field} is not a valid ISO date string`,
      path: field,
      severity: 'error',
    });
  }
}

/**
 * Validates a hex color string
 */
function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
}

/**
 * Validates theme for backward compatibility
 */
export function validateBackwardCompatibility(theme: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check if theme has legacy mapping for each wall type
  if (theme.wallTypes && typeof theme.wallTypes === 'object') {
    Object.keys(theme.wallTypes).forEach((wallTypeId) => {
      const wallType = theme.wallTypes[wallTypeId];
      
      if (!wallType.legacyMapping) {
        warnings.push({
          code: 'MISSING_LEGACY_MAPPING',
          message: `Wall type '${wallTypeId}' is missing legacy mapping for backward compatibility`,
          path: `wallTypes.${wallTypeId}.legacyMapping`,
          severity: 'warning',
        });
      }
    });
  }

  // Check version compatibility
  if (theme.version && theme.version !== CURRENT_VERSION) {
    warnings.push({
      code: 'VERSION_MISMATCH',
      message: `Theme version ${theme.version} differs from current version ${CURRENT_VERSION}. Migration may be required.`,
      path: 'version',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Quick validation for theme import
 */
export function quickValidate(theme: any): boolean {
  if (!theme || typeof theme !== 'object') return false;
  if (!theme.id || typeof theme.id !== 'string') return false;
  if (!theme.name || typeof theme.name !== 'string') return false;
  if (!theme.version || typeof theme.version !== 'string') return false;
  if (!theme.wallTypes || typeof theme.wallTypes !== 'object') return false;
  
  return true;
}

/**
 * Formats validation results for display
 */
export function formatValidationResults(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.isValid) {
    lines.push('✓ Theme validation passed');
  } else {
    lines.push('✗ Theme validation failed');
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:');
    result.errors.forEach((error) => {
      lines.push(`  • [${error.code}] ${error.path}: ${error.message}`);
    });
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:');
    result.warnings.forEach((warning) => {
      lines.push(`  • [${warning.code}] ${warning.path}: ${warning.message}`);
    });
  }

  return lines.join('\n');
}
