import type { WallTypeDefinition } from '../design-tokens';
import { themeManager } from '../design-tokens';

export interface TextureGenerationOptions {
  width?: number;
  height?: number;
  wallTypeId: string;
  themeId?: string;
}

export interface CacheStatistics {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
}

export class TextureGenerator {
  private cache: Map<string, HTMLCanvasElement>;
  private maxCacheSize: number;
  private cacheHits: number;
  private cacheMisses: number;
  private cacheEvictions: number;
  private currentThemeId: string | null;

  constructor(maxCacheSize: number = 50) {
    this.cache = new Map();
    this.maxCacheSize = maxCacheSize;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.cacheEvictions = 0;
    this.currentThemeId = null;
  }

  // Main texture generation method
  public generateTexture(options: TextureGenerationOptions): HTMLCanvasElement {
    const themeId = options.themeId || themeManager.getActiveTheme()?.id || 'default';
    
    // Invalidate cache if theme has changed
    if (this.currentThemeId !== null && this.currentThemeId !== themeId) {
      this.invalidateThemeCache(this.currentThemeId);
    }
    this.currentThemeId = themeId;
    
    const cacheKey = this.createCacheKey(options);
    
    if (this.cache.has(cacheKey)) {
      // LRU: Move accessed item to end (most recently used)
      const texture = this.cache.get(cacheKey)!;
      this.cache.delete(cacheKey);
      this.cache.set(cacheKey, texture);
      this.cacheHits++;
      return texture;
    }

    this.cacheMisses++;
    const texture = this.createTexture(options);
    this.addToCache(cacheKey, texture);
    
    return texture;
  }

  private createTexture(options: TextureGenerationOptions): HTMLCanvasElement {
    const themeId = options.themeId || themeManager.getActiveTheme()?.id || 'default';
    const theme = themeManager.getTheme(themeId);
    
    if (!theme) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    const wallType = theme.wallTypes[options.wallTypeId];
    if (!wallType) {
      throw new Error(`Wall type '${options.wallTypeId}' not found in theme '${themeId}'`);
    }

    const canvas = document.createElement('canvas');
    canvas.width = options.width || 32;
    canvas.height = options.height || 32;
    const ctx = canvas.getContext('2d')!;

    // Generate texture based on wall type
    switch (wallType.id) {
      case 'brick':
        return this.generateBrickTexture(canvas, ctx, wallType);
      case 'wood':
        return this.generateWoodTexture(canvas, ctx, wallType);
      case 'stone':
        return this.generateStoneTexture(canvas, ctx, wallType);
      case 'door':
        return this.generateDoorTexture(canvas, ctx, wallType);
      default:
        throw new Error(`Unknown wall type: ${wallType.id}`);
    }
  }

  private generateBrickTexture(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, wallType: WallTypeDefinition): HTMLCanvasElement {
    const width = canvas.width;
    const height = canvas.height;

    // Extract colors from wall type definition
    const mortarColor = wallType.colors.primary.value;
    const brickColor = wallType.colors.secondary.value;
    const jointColor = wallType.colors.accent.value;

    // Extract dimensions
    const brickWidth = wallType.dimensions.width.value;
    const brickHeight = wallType.dimensions.height.value;
    const rowSpacing = wallType.dimensions.spacing.value;
    const jointWidth = wallType.dimensions.borderWidth.value;

    // Background - Mortar
    ctx.fillStyle = mortarColor;
    ctx.fillRect(0, 0, width, height);

    // Brick pattern
    ctx.fillStyle = brickColor;

    // Horizontal brick rows
    for (let y = 0; y < height; y += rowSpacing) {
      // Offset bricks for realistic masonry
      const offset = (y / rowSpacing) % 2 === 0 ? 0 : brickWidth;

      for (let x = 0; x < width; x += width) {
        ctx.fillRect(x + offset, y, brickWidth, brickHeight);
      }
    }

    // Vertical joints
    if (wallType.effects.shadow.enabled) {
      ctx.fillStyle = jointColor;
      for (let x = 0; x < width; x += brickWidth) {
        ctx.fillRect(x, 0, jointWidth, height);
      }
    }

    return canvas;
  }

  private generateWoodTexture(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, wallType: WallTypeDefinition): HTMLCanvasElement {
    const width = canvas.width;
    const height = canvas.height;

    // Extract colors
    const baseWoodColor = wallType.colors.primary.value;
    const plankColor = wallType.colors.secondary.value;
    const gapColor = wallType.colors.accent.value;
    const grainColor = wallType.colors.shadow.value;

    // Extract dimensions
    const plankWidth = wallType.dimensions.width.value;
    const plankSpacing = wallType.dimensions.spacing.value;
    const gapWidth = wallType.dimensions.borderWidth.value;

    // Base wood background
    ctx.fillStyle = baseWoodColor;
    ctx.fillRect(0, 0, width, height);

    // Wood planks - vertical boards
    ctx.fillStyle = plankColor;

    for (let x = 0; x < width; x += plankSpacing) {
      ctx.fillRect(x, 0, plankWidth, height);

      // Gaps between planks
      ctx.fillStyle = gapColor;
      ctx.fillRect(x + plankWidth, 0, gapWidth, height);
      ctx.fillStyle = plankColor;
    }

    // Wood grain - horizontal lines
    if (wallType.effects.shadow.enabled) {
      ctx.fillStyle = grainColor;
      for (let y = 4; y < height; y += plankSpacing) {
        ctx.fillRect(0, y, width, 1);
      }
    }

    return canvas;
  }

  private generateStoneTexture(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, wallType: WallTypeDefinition): HTMLCanvasElement {
    const width = canvas.width;
    const height = canvas.height;

    // Extract colors
    const baseStoneColor = wallType.colors.primary.value;
    const stoneVariant1 = wallType.colors.secondary.value;
    const stoneVariant2 = wallType.colors.accent.value;
    const shadowColor = wallType.colors.shadow.value;

    // Extract dimensions
    const blockWidth = wallType.dimensions.width.value;
    const blockHeight = wallType.dimensions.height.value;

    // Base stone background
    ctx.fillStyle = baseStoneColor;
    ctx.fillRect(0, 0, width, height);

    // Stone color variants (matching original implementation)
    const stoneColors = [stoneVariant1, stoneVariant2, baseStoneColor, shadowColor];

    // Large stone blocks
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        // Use deterministic color selection to maintain consistency
        const colorIndex = (i + j) % stoneColors.length;
        ctx.fillStyle = stoneColors[colorIndex];
        ctx.fillRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);

        // 3D shadow effect on block edges
        if (wallType.effects.shadow.enabled) {
          ctx.fillStyle = shadowColor;
          ctx.fillRect(i * blockWidth, j * blockHeight, blockWidth, 1); // Top edge
          ctx.fillRect(i * blockWidth, j * blockHeight, 1, blockHeight); // Left edge
        }
      }
    }

    return canvas;
  }

  private generateDoorTexture(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, wallType: WallTypeDefinition): HTMLCanvasElement {
    const width = canvas.width;
    const height = canvas.height;

    // Extract colors
    const baseWoodColor = wallType.colors.primary.value;
    const plankColor = wallType.colors.secondary.value;
    const handleColor = wallType.colors.accent.value;
    const hardwareColor = wallType.colors.shadow.value;
    const highlightColor = wallType.colors.highlight.value;

    // Extract dimensions
    const panelWidth = wallType.dimensions.width.value;
    const panelHeight = wallType.dimensions.height.value;
    const panelSpacing = wallType.dimensions.spacing.value;

    // Door background with gradient if enabled
    if (wallType.effects.gradient.enabled) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (wallType.effects.gradient.colors.length >= 2) {
        gradient.addColorStop(0, wallType.effects.gradient.colors[0].value);
        gradient.addColorStop(0.5, baseWoodColor);
        gradient.addColorStop(1, wallType.effects.gradient.colors[1].value);
      } else {
        gradient.addColorStop(0, baseWoodColor);
        gradient.addColorStop(1, baseWoodColor);
      }
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = baseWoodColor;
    }
    ctx.fillRect(0, 0, width, height);

    // 3D shadow and highlight effects for the door frame
    if (wallType.effects.shadow.enabled) {
      // Shadow on edges
      const shadowOffset = wallType.effects.shadow.offset.value;
      ctx.fillStyle = wallType.effects.shadow.color.value;
      ctx.fillRect(0, 0, shadowOffset, height); // Left edge
      ctx.fillRect(0, 0, width, shadowOffset); // Top edge
    }

    if (wallType.effects.highlight.enabled) {
      // Highlight on opposite edges
      ctx.fillStyle = wallType.effects.highlight.color.value;
      ctx.fillRect(width - 1, 0, 1, height); // Right edge
      ctx.fillRect(0, height - 1, width, 1); // Bottom edge
    }

    // Wood panels with plank color
    const plankGradient = ctx.createLinearGradient(0, 0, width, 0);
    plankGradient.addColorStop(0, baseWoodColor);
    plankGradient.addColorStop(0.5, plankColor);
    plankGradient.addColorStop(1, baseWoodColor);

    // Four vertical panels
    for (let x = 0; x < width; x += panelSpacing) {
      ctx.fillStyle = plankGradient;
      ctx.fillRect(x + panelSpacing, 2, panelWidth, panelHeight);

      // Wood grain texture
      ctx.fillStyle = wallType.colors.shadow.value;
      for (let y = 4; y < panelHeight; y += 6) {
        ctx.fillRect(x + panelSpacing, y, panelWidth, 1);
      }

      // Panel 3D effects
      if (wallType.effects.shadow.enabled) {
        ctx.fillStyle = 'rgba(42, 26, 10, 0.6)';
        ctx.fillRect(x + panelSpacing, 2, 1, panelHeight); // Left shadow
      }

      if (wallType.effects.highlight.enabled) {
        ctx.fillStyle = 'rgba(160, 82, 45, 0.4)';
        ctx.fillRect(x + panelWidth, 2, 1, panelHeight); // Right highlight
      }
    }

    // Metal hinges
    ctx.fillStyle = hardwareColor;
    // Top hinge
    ctx.fillRect(2, 6, 6, 3);
    // Bottom hinge
    ctx.fillRect(2, 23, 6, 3);

    // Hinge screws
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(3, 7, 1, 1);
    ctx.fillRect(6, 7, 1, 1);
    ctx.fillRect(3, 24, 1, 1);
    ctx.fillRect(6, 24, 1, 1);

    // Door handle with radial gradient
    const handleGradient = ctx.createRadialGradient(26, 16, 1, 26, 16, 4);
    handleGradient.addColorStop(0, handleColor);
    handleGradient.addColorStop(0.6, this.adjustBrightness(handleColor, -20));
    handleGradient.addColorStop(1, this.adjustBrightness(handleColor, -40));
    ctx.fillStyle = handleGradient;
    ctx.fillRect(24, 14, 4, 4);

    // Handle shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(24, 17, 4, 1);

    // Handle highlight
    ctx.fillStyle = highlightColor;
    ctx.fillRect(24, 14, 3, 1);
    ctx.fillRect(24, 14, 1, 2);

    return canvas;
  }

  // Utility method to adjust color brightness
  private adjustBrightness(color: string, amount: number): string {
    // Simple brightness adjustment for hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const num = parseInt(hex, 16);
      const r = Math.max(0, Math.min(255, (num >> 16) + amount));
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
      const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    return color;
  }

  // Cache management
  private createCacheKey(options: TextureGenerationOptions): string {
    const themeId = options.themeId || 'default';
    return `${themeId}:${options.wallTypeId}:${options.width || 32}x${options.height || 32}`;
  }

  private addToCache(key: string, texture: HTMLCanvasElement): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove least recently used entry (first entry in Map)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        this.cacheEvictions++;
      }
    }
    this.cache.set(key, texture);
  }

  /**
   * Invalidate all cache entries for a specific theme
   */
  public invalidateThemeCache(themeId: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${themeId}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.cacheEvictions++;
    });
  }

  /**
   * Clear entire cache and reset statistics
   */
  public clearCache(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.cacheEvictions = 0;
    this.currentThemeId = null;
  }

  /**
   * Get current cache size
   */
  public getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Get detailed cache statistics
   */
  public getCacheStatistics(): CacheStatistics {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: Math.round(hitRate * 100) / 100,
      evictions: this.cacheEvictions,
    };
  }

  /**
   * Reset cache statistics without clearing cache
   */
  public resetStatistics(): void {
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.cacheEvictions = 0;
  }

  // Color variant support (for backward compatibility)
  public applyColorVariant(texture: HTMLCanvasElement, variant: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = texture.width;
    canvas.height = texture.height;
    const ctx = canvas.getContext('2d')!;

    // Draw original texture
    ctx.drawImage(texture, 0, 0);

    // Apply HSL-based color shift
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple color variant implementation
    const hueShift = (variant * 30) % 360; // Shift hue by variant amount
    const saturationMultiplier = 1 + (variant * 0.1); // Slight saturation change

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert RGB to HSL, apply modifications, convert back
      const hsl = this.rgbToHsl(r, g, b);
      hsl[0] = (hsl[0] + hueShift) % 360;
      hsl[1] = Math.min(1, hsl[1] * saturationMultiplier);

      const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  // Color space conversion utilities
  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s, l];
  }

  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}

// Singleton instance for global use
export const textureGenerator = new TextureGenerator();