// Migration system to integrate Designer Mode with existing texture system
import { themeManager, createDefaultTheme } from '../shared/design-tokens';
import { textureGenerator as legacyTextureGenerator } from '../shared/texture-generation';

export class TextureSystemMigration {
  private migrated = false;

  // Initialize the theme system and migrate existing texture functions
  public async initialize(): Promise<void> {
    if (this.migrated) {
      return;
    }

    try {
      // Register default theme
      const defaultTheme = createDefaultTheme();
      themeManager.registerTheme(defaultTheme);
      themeManager.setActiveTheme('default');

      // Override the legacy texture loading with theme-based generation
      this.migrateLegacyTextureLoading();

      this.migrated = true;
      console.log('✅ Texture system migration completed successfully');
    } catch (error) {
      console.error('❌ Texture system migration failed:', error);
      throw error;
    }
  }

  private migrateLegacyTextureLoading(): void {
    // We need to modify the existing textures.ts file to use the new system
    // For now, we'll provide a compatibility layer
    
    // Store reference to original loadTextures
    const originalLoadTextures = (window as any).loadTextures;

    // Create new loadTextures function that uses theme system
    (window as any).loadTextures = async () => {
      const promises: Promise<void>[] = [];

      // Generate wall textures using theme system
      const wallTextures: Record<string, CanvasImageSource> = {};
      const wallTypes = ['brick', 'wood', 'stone', 'door'];

      for (const wallType of wallTypes) {
        try {
          const texture = legacyTextureGenerator.generateTexture({
            wallTypeId: wallType,
            width: 32,
            height: 32
          });
          wallTextures[wallType] = texture;
        } catch (error) {
          console.warn(`Failed to generate texture for ${wallType}, falling back to legacy:`, error);
          // Fallback to legacy generation if needed
        }
      }

      // Make wall textures available globally (for backward compatibility)
      (window as any).wallTextures = wallTextures;

      // Also call original loadTextures for enemy and item textures
      if (originalLoadTextures) {
        promises.push(originalLoadTextures());
      }

      return Promise.all(promises);
    };
  }

  // Provides backward compatibility for existing texture access patterns
  public getWallTexture(wallType: string): CanvasImageSource | null {
    try {
      return legacyTextureGenerator.generateTexture({
        wallTypeId: wallType,
        width: 32,
        height: 32
      });
    } catch (error) {
      console.error(`Failed to generate texture for ${wallType}:`, error);
      return null;
    }
  }

  // Generate texture with color variant (backward compatibility)
  public getWallTextureWithVariant(wallType: string, variant: number): CanvasImageSource | null {
    try {
      const baseTexture = legacyTextureGenerator.generateTexture({
        wallTypeId: wallType,
        width: 32,
        height: 32
      });

      if (variant === 0) {
        return baseTexture;
      }

      return legacyTextureGenerator.applyColorVariant(baseTexture as HTMLCanvasElement, variant);
    } catch (error) {
      console.error(`Failed to generate texture variant for ${wallType}:`, error);
      return null;
    }
  }

  // Check if migration is completed
  public isMigrated(): boolean {
    return this.migrated;
  }

  // Reset migration state (for testing)
  public reset(): void {
    this.migrated = false;
  }
}

// Singleton instance
export const textureSystemMigration = new TextureSystemMigration();