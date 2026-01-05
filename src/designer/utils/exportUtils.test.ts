/**
 * Tests for export utilities
 */

import { describe, it, expect } from 'vitest';
import { 
  exportTheme, 
  validateThemeForExport, 
  getFileExtension,
  getMimeType
} from './exportUtils';
import type { Theme } from '../types';

// Mock theme for testing
const mockTheme: Theme = {
  id: 'test-theme',
  name: 'Test Theme',
  version: '1.0.0',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  wallTypes: {
    brick: {
      id: 'brick',
      displayName: 'Brick Wall',
      description: 'Test brick wall',
      colors: {
        primary: { value: '#8B4513', displayName: 'Primary' },
        secondary: { value: '#D3D3D3', displayName: 'Secondary' },
        accent: { value: '#A0522D', displayName: 'Accent' },
        shadow: { value: '#5A3D1A', displayName: 'Shadow' },
        highlight: { value: '#B85A2A', displayName: 'Highlight' }
      },
      dimensions: {
        width: { value: 16, displayName: 'Width', min: 8, max: 32, step: 1, unit: 'px' },
        height: { value: 4, displayName: 'Height', min: 2, max: 8, step: 1, unit: 'px' },
        spacing: { value: 8, displayName: 'Spacing', min: 4, max: 16, step: 1, unit: 'px' },
        borderWidth: { value: 1, displayName: 'Border', min: 1, max: 3, step: 1, unit: 'px' }
      },
      texture: {
        pattern: 'BRICK',
        intensity: { value: 1.0, displayName: 'Intensity', min: 0.1, max: 2.0, step: 0.1 },
        blendMode: 'NORMAL',
        procedural: true
      },
      effects: {
        shadow: {
          enabled: true,
          color: { value: '#5A3D1A', displayName: 'Shadow Color' },
          offset: { value: 1, displayName: 'Offset', min: 0, max: 5, step: 1, unit: 'px' },
          blur: { value: 0, displayName: 'Blur', min: 0, max: 10, step: 1, unit: 'px' }
        },
        highlight: {
          enabled: true,
          color: { value: '#B85A2A', displayName: 'Highlight Color' },
          intensity: { value: 0.5, displayName: 'Intensity', min: 0, max: 1, step: 0.1 }
        },
        gradient: {
          enabled: false,
          type: 'linear',
          colors: []
        }
      },
      legacyMapping: {}
    }
  }
};

describe('exportTheme', () => {
  it('should export theme as JSON', () => {
    const result = exportTheme(mockTheme, { format: 'json' });
    
    expect(result.success).toBe(true);
    expect(result.mimeType).toBe('application/json');
    expect(result.filename).toContain('test-theme');
    expect(result.filename).toContain('.json');
    
    // Verify content is valid JSON
    const parsed = JSON.parse(result.content);
    expect(parsed.id).toBe('test-theme');
    expect(parsed.name).toBe('Test Theme');
  });

  it('should export theme as minified JSON', () => {
    const result = exportTheme(mockTheme, { format: 'json', minify: true });
    
    expect(result.success).toBe(true);
    expect(result.content).not.toContain('\n');
    expect(result.content).not.toContain('  ');
  });

  it('should export theme as CSS', () => {
    const result = exportTheme(mockTheme, { format: 'css' });
    
    expect(result.success).toBe(true);
    expect(result.mimeType).toBe('text/css');
    expect(result.filename).toContain('test-theme');
    expect(result.filename).toContain('.css');
    
    // Verify CSS content
    expect(result.content).toContain(':root {');
    expect(result.content).toContain('--wall-brick-color-primary: #8B4513;');
    expect(result.content).toContain('--wall-brick-width: 16px;');
  });

  it('should export theme as minified CSS', () => {
    const result = exportTheme(mockTheme, { format: 'css', minify: true });
    
    expect(result.success).toBe(true);
    expect(result.content).not.toContain('\n');
    expect(result.content).not.toContain('  ');
    expect(result.content).toContain(':root{');
  });

  it('should handle unsupported format', () => {
    const result = exportTheme(mockTheme, { format: 'xml' as any });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported export format');
  });
});

describe('validateThemeForExport', () => {
  it('should validate a valid theme', () => {
    const validation = validateThemeForExport(mockTheme);
    
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should detect missing theme ID', () => {
    const invalidTheme = { ...mockTheme, id: '' };
    const validation = validateThemeForExport(invalidTheme);
    
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Theme ID is required');
  });

  it('should detect missing theme name', () => {
    const invalidTheme = { ...mockTheme, name: '' };
    const validation = validateThemeForExport(invalidTheme);
    
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Theme name is required');
  });

  it('should detect missing wall types', () => {
    const invalidTheme = { ...mockTheme, wallTypes: {} };
    const validation = validateThemeForExport(invalidTheme);
    
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Theme must contain at least one wall type');
  });

  it('should detect invalid hex colors', () => {
    const invalidTheme = {
      ...mockTheme,
      wallTypes: {
        brick: {
          ...mockTheme.wallTypes.brick,
          colors: {
            ...mockTheme.wallTypes.brick.colors,
            primary: { value: 'invalid-color', displayName: 'Primary' }
          }
        }
      }
    };
    const validation = validateThemeForExport(invalidTheme);
    
    expect(validation.valid).toBe(false);
    expect(validation.errors.some(e => e.includes('Invalid color value'))).toBe(true);
  });
});

describe('utility functions', () => {
  it('should get correct file extension', () => {
    expect(getFileExtension('json')).toBe('.json');
    expect(getFileExtension('css')).toBe('.css');
  });

  it('should get correct MIME type', () => {
    expect(getMimeType('json')).toBe('application/json');
    expect(getMimeType('css')).toBe('text/css');
  });
});
