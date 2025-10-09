/**
 * Theme Validator Tests
 * 
 * Tests for theme validation functionality
 */

import { describe, it, expect } from 'vitest';
import {
  validateTheme,
  validateBackwardCompatibility,
  quickValidate,
  formatValidationResults,
} from './themeValidator';

describe('themeValidator', () => {
  describe('quickValidate', () => {
    it('should return true for valid theme structure', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
        wallTypes: {},
      };
      
      expect(quickValidate(theme)).toBe(true);
    });

    it('should return false for missing id', () => {
      const theme = {
        name: 'Test Theme',
        version: '1.0.0',
        wallTypes: {},
      };
      
      expect(quickValidate(theme)).toBe(false);
    });

    it('should return false for missing name', () => {
      const theme = {
        id: 'test',
        version: '1.0.0',
        wallTypes: {},
      };
      
      expect(quickValidate(theme)).toBe(false);
    });

    it('should return false for missing version', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        wallTypes: {},
      };
      
      expect(quickValidate(theme)).toBe(false);
    });

    it('should return false for missing wallTypes', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
      };
      
      expect(quickValidate(theme)).toBe(false);
    });

    it('should return false for null theme', () => {
      expect(quickValidate(null)).toBe(false);
    });
  });

  describe('validateTheme', () => {
    it('should validate a complete valid theme', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        wallTypes: {
          brick: {
            id: 'brick',
            displayName: 'Brick Wall',
            description: 'A brick wall',
            colors: {
              primary: { value: '#8B4513', displayName: 'Primary' },
              secondary: { value: '#D3D3D3', displayName: 'Secondary' },
              accent: { value: '#A0522D', displayName: 'Accent' },
              shadow: { value: '#5A3D1A', displayName: 'Shadow' },
              highlight: { value: '#B85A2A', displayName: 'Highlight' },
            },
            dimensions: {
              width: { value: 16, min: 8, max: 32, step: 1, unit: 'px' },
              height: { value: 4, min: 2, max: 8, step: 1, unit: 'px' },
              spacing: { value: 8, min: 4, max: 16, step: 1, unit: 'px' },
              borderWidth: { value: 1, min: 1, max: 3, step: 1, unit: 'px' },
            },
            texture: {
              pattern: 'BRICK',
              intensity: { value: 1.0, min: 0.1, max: 2.0, step: 0.1 },
              blendMode: 'NORMAL',
              procedural: true,
            },
            effects: {
              shadow: {
                enabled: true,
                color: { value: '#5A3D1A', displayName: 'Shadow Color' },
                offset: { value: 1, min: 0, max: 5, step: 1, unit: 'px' },
                blur: { value: 0, min: 0, max: 10, step: 1, unit: 'px' },
              },
              highlight: {
                enabled: true,
                color: { value: '#B85A2A', displayName: 'Highlight Color' },
                intensity: { value: 0.5, min: 0.0, max: 1.0, step: 0.1 },
              },
              gradient: {
                enabled: false,
                type: 'linear',
                colors: [],
              },
            },
            legacyMapping: {},
          },
        },
      };

      const result = validateTheme(theme);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const theme = {
        wallTypes: {},
      };

      const result = validateTheme(theme);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid color values', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
        wallTypes: {
          brick: {
            id: 'brick',
            displayName: 'Brick Wall',
            description: 'A brick wall',
            colors: {
              primary: { value: 'invalid-color', displayName: 'Primary' },
              secondary: { value: '#D3D3D3', displayName: 'Secondary' },
              accent: { value: '#A0522D', displayName: 'Accent' },
              shadow: { value: '#5A3D1A', displayName: 'Shadow' },
              highlight: { value: '#B85A2A', displayName: 'Highlight' },
            },
            dimensions: {
              width: { value: 16, min: 8, max: 32 },
              height: { value: 4, min: 2, max: 8 },
              spacing: { value: 8, min: 4, max: 16 },
              borderWidth: { value: 1, min: 1, max: 3 },
            },
            texture: {
              pattern: 'BRICK',
              intensity: { value: 1.0, min: 0.1, max: 2.0 },
              blendMode: 'NORMAL',
              procedural: true,
            },
            effects: {
              shadow: {
                enabled: true,
                color: { value: '#5A3D1A', displayName: 'Shadow Color' },
                offset: { value: 1, min: 0, max: 5 },
                blur: { value: 0, min: 0, max: 10 },
              },
              highlight: {
                enabled: true,
                color: { value: '#B85A2A', displayName: 'Highlight Color' },
                intensity: { value: 0.5, min: 0.0, max: 1.0 },
              },
              gradient: {
                enabled: false,
                type: 'linear',
                colors: [],
              },
            },
            legacyMapping: {},
          },
        },
      };

      const result = validateTheme(theme);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_COLOR_VALUE')).toBe(true);
    });

    it('should detect value out of range', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
        wallTypes: {
          brick: {
            id: 'brick',
            displayName: 'Brick Wall',
            description: 'A brick wall',
            colors: {
              primary: { value: '#8B4513', displayName: 'Primary' },
              secondary: { value: '#D3D3D3', displayName: 'Secondary' },
              accent: { value: '#A0522D', displayName: 'Accent' },
              shadow: { value: '#5A3D1A', displayName: 'Shadow' },
              highlight: { value: '#B85A2A', displayName: 'Highlight' },
            },
            dimensions: {
              width: { value: 100, min: 8, max: 32 }, // Out of range!
              height: { value: 4, min: 2, max: 8 },
              spacing: { value: 8, min: 4, max: 16 },
              borderWidth: { value: 1, min: 1, max: 3 },
            },
            texture: {
              pattern: 'BRICK',
              intensity: { value: 1.0, min: 0.1, max: 2.0 },
              blendMode: 'NORMAL',
              procedural: true,
            },
            effects: {
              shadow: {
                enabled: true,
                color: { value: '#5A3D1A', displayName: 'Shadow Color' },
                offset: { value: 1, min: 0, max: 5 },
                blur: { value: 0, min: 0, max: 10 },
              },
              highlight: {
                enabled: true,
                color: { value: '#B85A2A', displayName: 'Highlight Color' },
                intensity: { value: 0.5, min: 0.0, max: 1.0 },
              },
              gradient: {
                enabled: false,
                type: 'linear',
                colors: [],
              },
            },
            legacyMapping: {},
          },
        },
      };

      const result = validateTheme(theme);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'VALUE_OUT_OF_RANGE')).toBe(true);
    });

    it('should detect invalid pattern type', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
        wallTypes: {
          brick: {
            id: 'brick',
            displayName: 'Brick Wall',
            description: 'A brick wall',
            colors: {
              primary: { value: '#8B4513', displayName: 'Primary' },
              secondary: { value: '#D3D3D3', displayName: 'Secondary' },
              accent: { value: '#A0522D', displayName: 'Accent' },
              shadow: { value: '#5A3D1A', displayName: 'Shadow' },
              highlight: { value: '#B85A2A', displayName: 'Highlight' },
            },
            dimensions: {
              width: { value: 16, min: 8, max: 32 },
              height: { value: 4, min: 2, max: 8 },
              spacing: { value: 8, min: 4, max: 16 },
              borderWidth: { value: 1, min: 1, max: 3 },
            },
            texture: {
              pattern: 'INVALID_PATTERN', // Invalid!
              intensity: { value: 1.0, min: 0.1, max: 2.0 },
              blendMode: 'NORMAL',
              procedural: true,
            },
            effects: {
              shadow: {
                enabled: true,
                color: { value: '#5A3D1A', displayName: 'Shadow Color' },
                offset: { value: 1, min: 0, max: 5 },
                blur: { value: 0, min: 0, max: 10 },
              },
              highlight: {
                enabled: true,
                color: { value: '#B85A2A', displayName: 'Highlight Color' },
                intensity: { value: 0.5, min: 0.0, max: 1.0 },
              },
              gradient: {
                enabled: false,
                type: 'linear',
                colors: [],
              },
            },
            legacyMapping: {},
          },
        },
      };

      const result = validateTheme(theme);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_PATTERN')).toBe(true);
    });
  });

  describe('validateBackwardCompatibility', () => {
    it('should warn about missing legacy mapping', () => {
      const theme = {
        id: 'test',
        name: 'Test Theme',
        version: '1.0.0',
        wallTypes: {
          brick: {
            id: 'brick',
            displayName: 'Brick Wall',
            description: 'A brick wall',
            colors: {
              primary: { value: '#8B4513', displayName: 'Primary' },
              secondary: { value: '#D3D3D3', displayName: 'Secondary' },
              accent: { value: '#A0522D', displayName: 'Accent' },
              shadow: { value: '#5A3D1A', displayName: 'Shadow' },
              highlight: { value: '#B85A2A', displayName: 'Highlight' },
            },
            dimensions: {
              width: { value: 16, min: 8, max: 32 },
              height: { value: 4, min: 2, max: 8 },
              spacing: { value: 8, min: 4, max: 16 },
              borderWidth: { value: 1, min: 1, max: 3 },
            },
            texture: {
              pattern: 'BRICK',
              intensity: { value: 1.0, min: 0.1, max: 2.0 },
              blendMode: 'NORMAL',
              procedural: true,
            },
            effects: {
              shadow: {
                enabled: true,
                color: { value: '#5A3D1A', displayName: 'Shadow Color' },
                offset: { value: 1, min: 0, max: 5 },
                blur: { value: 0, min: 0, max: 10 },
              },
              highlight: {
                enabled: true,
                color: { value: '#B85A2A', displayName: 'Highlight Color' },
                intensity: { value: 0.5, min: 0.0, max: 1.0 },
              },
              gradient: {
                enabled: false,
                type: 'linear',
                colors: [],
              },
            },
            // No legacyMapping!
          },
        },
      };

      const result = validateBackwardCompatibility(theme);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.code === 'MISSING_LEGACY_MAPPING')).toBe(true);
    });
  });

  describe('formatValidationResults', () => {
    it('should format successful validation', () => {
      const result = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      const formatted = formatValidationResults(result);
      expect(formatted).toContain('✓ Theme validation passed');
    });

    it('should format validation with errors', () => {
      const result = {
        isValid: false,
        errors: [
          {
            code: 'MISSING_FIELD',
            message: 'Required field is missing',
            path: 'theme.id',
            severity: 'error' as const,
          },
        ],
        warnings: [],
      };

      const formatted = formatValidationResults(result);
      expect(formatted).toContain('✗ Theme validation failed');
      expect(formatted).toContain('Errors:');
      expect(formatted).toContain('MISSING_FIELD');
    });

    it('should format validation with warnings', () => {
      const result = {
        isValid: true,
        errors: [],
        warnings: [
          {
            code: 'MISSING_LEGACY_MAPPING',
            message: 'Legacy mapping is missing',
            path: 'wallTypes.brick.legacyMapping',
            severity: 'warning' as const,
          },
        ],
      };

      const formatted = formatValidationResults(result);
      expect(formatted).toContain('Warnings:');
      expect(formatted).toContain('MISSING_LEGACY_MAPPING');
    });
  });
});
