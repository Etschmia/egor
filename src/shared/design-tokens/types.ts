// Design Token System Types
// This file defines the comprehensive type system for the Designer Mode

export interface ColorProperty {
  value: string;
  displayName: string;
  allowedRange?: ColorRange;
  presets?: PresetOption[];
}

export interface ColorRange {
  minSaturation?: number;
  maxSaturation?: number;
  minLightness?: number;
  maxLightness?: number;
  allowedHues?: number[];
}

export interface PresetOption {
  name: string;
  value: string;
  description?: string;
}

export interface NumberProperty {
  value: number;
  displayName: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface ColorScheme {
  primary: ColorProperty;
  secondary: ColorProperty;
  accent: ColorProperty;
  shadow: ColorProperty;
  highlight: ColorProperty;
}

export interface DimensionSettings {
  width: NumberProperty;
  height: NumberProperty;
  spacing: NumberProperty;
  borderWidth: NumberProperty;
}

export enum PatternType {
  SOLID = 'SOLID',
  GRADIENT = 'GRADIENT',
  BRICK = 'BRICK',
  WOOD_GRAIN = 'WOOD_GRAIN',
  STONE_BLOCKS = 'STONE_BLOCKS',
  METAL = 'METAL'
}

export enum BlendMode {
  NORMAL = 'NORMAL',
  MULTIPLY = 'MULTIPLY',
  OVERLAY = 'OVERLAY',
  SOFT_LIGHT = 'SOFT_LIGHT'
}

export interface TextureProperties {
  pattern: PatternType;
  intensity: NumberProperty;
  blendMode: BlendMode;
  procedural: boolean;
}

export interface VisualEffects {
  shadow: {
    enabled: boolean;
    color: ColorProperty;
    offset: NumberProperty;
    blur: NumberProperty;
  };
  highlight: {
    enabled: boolean;
    color: ColorProperty;
    intensity: NumberProperty;
  };
  gradient: {
    enabled: boolean;
    type: 'linear' | 'radial';
    colors: ColorProperty[];
    direction?: number;
  };
}

export interface WallTypeDefinition {
  id: string;
  displayName: string;
  description: string;
  colors: ColorScheme;
  dimensions: DimensionSettings;
  texture: TextureProperties;
  effects: VisualEffects;
  // Legacy mapping for backward compatibility
  legacyMapping?: {
    [key: string]: string; // Maps legacy hardcoded values to token paths
  };
}

export interface Theme {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  created: Date;
  modified: Date;
  wallTypes: {
    [wallTypeId: string]: WallTypeDefinition;
  };
  metadata?: {
    [key: string]: any;
  };
}

export interface ThemeRegistry {
  themes: {
    [themeId: string]: Theme;
  };
  activeThemeId: string;
  defaultThemeId: string;
}

// Design Token Resolution
export interface DesignToken {
  path: string;
  value: any;
  type: 'color' | 'number' | 'string' | 'boolean';
  category: 'color' | 'dimension' | 'pattern' | 'effect';
}

export interface TokenResolutionContext {
  themeId: string;
  wallTypeId: string;
  tokenPath: string;
}

// Theme Validation
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  path: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning extends ValidationError {
  severity: 'warning';
}

// Theme Migration
export interface MigrationScript {
  id: string;
  name: string;
  description: string;
  fromVersion: string;
  toVersion: string;
  execute: (theme: Theme) => Theme;
  validate: (theme: Theme) => boolean;
}

export interface MigrationPlan {
  currentVersion: string;
  targetVersion: string;
  scripts: MigrationScript[];
  estimatedDuration: number;
  backupRequired: boolean;
}

// Export System
export interface ExportOptions {
  format: 'json' | 'css' | 'scss' | 'js';
  includeMetadata: boolean;
  minify: boolean;
  compatibilityMode: boolean;
}

export interface ExportResult {
  success: boolean;
  content: string;
  format: string;
  size: number;
  warnings?: string[];
}