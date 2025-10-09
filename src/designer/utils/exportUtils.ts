/**
 * Export Utilities for Designer Mode
 * Handles theme export in various formats (JSON, CSS)
 */

import type { Theme, WallTypeDefinition } from '../types';

export type ExportFormat = 'json' | 'css';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  minify?: boolean;
  prettify?: boolean;
}

export interface ExportResult {
  success: boolean;
  content: string;
  filename: string;
  mimeType: string;
  error?: string;
}

/**
 * Main export function - routes to appropriate format handler
 */
export function exportTheme(theme: Theme, options: ExportOptions): ExportResult {
  try {
    switch (options.format) {
      case 'json':
        return exportAsJSON(theme, options);
      case 'css':
        return exportAsCSS(theme, options);
      default:
        return {
          success: false,
          content: '',
          filename: '',
          mimeType: '',
          error: `Unsupported export format: ${options.format}`
        };
    }
  } catch (error) {
    return {
      success: false,
      content: '',
      filename: '',
      mimeType: '',
      error: error instanceof Error ? error.message : 'Unknown export error'
    };
  }
}

/**
 * Export theme as JSON
 */
function exportAsJSON(theme: Theme, options: ExportOptions): ExportResult {
  const themeData = options.includeMetadata !== false ? theme : {
    ...theme,
    // Remove metadata fields if requested
    createdAt: undefined,
    updatedAt: undefined,
    basedOn: undefined
  };

  const content = options.minify
    ? JSON.stringify(themeData)
    : JSON.stringify(themeData, null, 2);

  const filename = `${sanitizeFilename(theme.name)}-${theme.version}.json`;

  return {
    success: true,
    content,
    filename,
    mimeType: 'application/json'
  };
}

/**
 * Export theme as CSS variables
 */
function exportAsCSS(theme: Theme, options: ExportOptions): ExportResult {
  const lines: string[] = [];
  const indent = options.minify ? '' : '  ';
  const newline = options.minify ? '' : '\n';

  // Header comment
  if (!options.minify) {
    lines.push(`/**`);
    lines.push(` * Theme: ${theme.name}`);
    lines.push(` * Version: ${theme.version}`);
    lines.push(` * Generated: ${new Date().toISOString()}`);
    if (theme.basedOn) {
      lines.push(` * Based on: ${theme.basedOn}`);
    }
    lines.push(` */`);
    lines.push('');
  }

  // Root CSS variables
  lines.push(':root {');

  // Theme metadata
  if (options.includeMetadata !== false && !options.minify) {
    lines.push(`${indent}/* Theme Metadata */`);
    lines.push(`${indent}--theme-id: "${theme.id}";`);
    lines.push(`${indent}--theme-name: "${theme.name}";`);
    lines.push(`${indent}--theme-version: "${theme.version}";`);
    lines.push('');
  }

  // Wall types
  Object.entries(theme.wallTypes).forEach(([wallTypeId, wallType]) => {
    if (!options.minify) {
      lines.push(`${indent}/* ${wallType.displayName} */`);
    }

    // Colors
    lines.push(...generateColorVariables(wallTypeId, wallType, indent));

    // Dimensions
    lines.push(...generateDimensionVariables(wallTypeId, wallType, indent));

    // Texture properties
    lines.push(...generateTextureVariables(wallTypeId, wallType, indent));

    // Effects
    lines.push(...generateEffectVariables(wallTypeId, wallType, indent));

    if (!options.minify) {
      lines.push('');
    }
  });

  lines.push('}');

  const content = lines.join(newline);
  const filename = `${sanitizeFilename(theme.name)}-${theme.version}.css`;

  return {
    success: true,
    content,
    filename,
    mimeType: 'text/css'
  };
}

/**
 * Generate CSS variables for colors
 */
function generateColorVariables(
  wallTypeId: string,
  wallType: WallTypeDefinition,
  indent: string
): string[] {
  const lines: string[] = [];
  const prefix = `--wall-${wallTypeId}`;

  Object.entries(wallType.colors).forEach(([colorKey, colorProp]) => {
    lines.push(`${indent}${prefix}-color-${colorKey}: ${colorProp.value};`);
  });

  return lines;
}

/**
 * Generate CSS variables for dimensions
 */
function generateDimensionVariables(
  wallTypeId: string,
  wallType: WallTypeDefinition,
  indent: string
): string[] {
  const lines: string[] = [];
  const prefix = `--wall-${wallTypeId}`;

  Object.entries(wallType.dimensions).forEach(([dimKey, dimProp]) => {
    const unit = dimProp.unit || '';
    lines.push(`${indent}${prefix}-${dimKey}: ${dimProp.value}${unit};`);
  });

  return lines;
}

/**
 * Generate CSS variables for texture properties
 */
function generateTextureVariables(
  wallTypeId: string,
  wallType: WallTypeDefinition,
  indent: string
): string[] {
  const lines: string[] = [];
  const prefix = `--wall-${wallTypeId}`;

  lines.push(`${indent}${prefix}-texture-pattern: "${wallType.texture.pattern}";`);
  lines.push(`${indent}${prefix}-texture-intensity: ${wallType.texture.intensity.value};`);
  lines.push(`${indent}${prefix}-texture-blend-mode: "${wallType.texture.blendMode}";`);
  lines.push(`${indent}${prefix}-texture-procedural: ${wallType.texture.procedural};`);

  return lines;
}

/**
 * Generate CSS variables for visual effects
 */
function generateEffectVariables(
  wallTypeId: string,
  wallType: WallTypeDefinition,
  indent: string
): string[] {
  const lines: string[] = [];
  const prefix = `--wall-${wallTypeId}`;

  // Shadow effect
  const shadow = wallType.effects.shadow;
  lines.push(`${indent}${prefix}-shadow-enabled: ${shadow.enabled};`);
  if (shadow.enabled) {
    lines.push(`${indent}${prefix}-shadow-color: ${shadow.color.value};`);
    lines.push(`${indent}${prefix}-shadow-offset: ${shadow.offset.value}${shadow.offset.unit || 'px'};`);
    lines.push(`${indent}${prefix}-shadow-blur: ${shadow.blur.value}${shadow.blur.unit || 'px'};`);
  }

  // Highlight effect
  const highlight = wallType.effects.highlight;
  lines.push(`${indent}${prefix}-highlight-enabled: ${highlight.enabled};`);
  if (highlight.enabled) {
    lines.push(`${indent}${prefix}-highlight-color: ${highlight.color.value};`);
    lines.push(`${indent}${prefix}-highlight-intensity: ${highlight.intensity.value};`);
  }

  // Gradient effect
  const gradient = wallType.effects.gradient;
  lines.push(`${indent}${prefix}-gradient-enabled: ${gradient.enabled};`);
  if (gradient.enabled) {
    lines.push(`${indent}${prefix}-gradient-type: "${gradient.type}";`);
    gradient.colors.forEach((color, index) => {
      lines.push(`${indent}${prefix}-gradient-color-${index}: ${color.value};`);
    });
  }

  return lines;
}

/**
 * Sanitize filename for safe file system usage
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Trigger browser download of exported content
 */
export function downloadExport(result: ExportResult): void {
  if (!result.success) {
    throw new Error(result.error || 'Export failed');
  }

  const blob = new Blob([result.content], { type: result.mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = result.filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Convenience function to export and download in one step
 */
export function exportAndDownload(theme: Theme, options: ExportOptions): ExportResult {
  const result = exportTheme(theme, options);
  
  if (result.success) {
    downloadExport(result);
  }
  
  return result;
}

/**
 * Validate theme before export
 */
export function validateThemeForExport(theme: Theme): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!theme.id) {
    errors.push('Theme ID is required');
  }

  if (!theme.name) {
    errors.push('Theme name is required');
  }

  if (!theme.version) {
    errors.push('Theme version is required');
  }

  if (!theme.wallTypes || Object.keys(theme.wallTypes).length === 0) {
    errors.push('Theme must contain at least one wall type');
  }

  // Validate each wall type
  Object.entries(theme.wallTypes).forEach(([id, wallType]) => {
    if (!wallType.id) {
      errors.push(`Wall type ${id} is missing an ID`);
    }

    if (!wallType.displayName) {
      errors.push(`Wall type ${id} is missing a display name`);
    }

    // Validate colors
    if (!wallType.colors) {
      errors.push(`Wall type ${id} is missing color definitions`);
    } else {
      Object.entries(wallType.colors).forEach(([colorKey, colorProp]) => {
        if (!isValidHexColor(colorProp.value)) {
          errors.push(`Wall type ${id}: Invalid color value for ${colorKey}: ${colorProp.value}`);
        }
      });
    }

    // Validate dimensions
    if (!wallType.dimensions) {
      errors.push(`Wall type ${id} is missing dimension definitions`);
    }

    // Validate texture
    if (!wallType.texture) {
      errors.push(`Wall type ${id} is missing texture properties`);
    }

    // Validate effects
    if (!wallType.effects) {
      errors.push(`Wall type ${id} is missing effect definitions`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate hex color format
 */
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'json':
      return '.json';
    case 'css':
      return '.css';
    default:
      return '.txt';
  }
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: ExportFormat): string {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}
