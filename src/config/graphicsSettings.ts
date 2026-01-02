// src/config/graphicsSettings.ts

export enum TextureQuality {
  LOW = 64,
  MEDIUM = 128,
  HIGH = 256,
  ULTRA = 512
}

export interface GraphicsSettings {
  textureQuality: TextureQuality;
  enableMipmaps: boolean;
  spriteInterpolation: 'nearest' | 'linear';
  particleCount: number;
  enableDynamicLighting: boolean;
  animationFrames: number;
}

export interface QualityPresets {
  low: GraphicsSettings;
  medium: GraphicsSettings;
  high: GraphicsSettings;
  ultra: GraphicsSettings;
}

export const QUALITY_PRESETS: QualityPresets = {
  low: {
    textureQuality: TextureQuality.LOW,      // 64x64
    enableMipmaps: false,
    spriteInterpolation: 'nearest',
    particleCount: 50,
    enableDynamicLighting: false,
    animationFrames: 1
  },
  medium: {
    textureQuality: TextureQuality.MEDIUM,   // 128x128
    enableMipmaps: true,
    spriteInterpolation: 'linear',
    particleCount: 100,
    enableDynamicLighting: false,
    animationFrames: 2
  },
  high: {
    textureQuality: TextureQuality.HIGH,     // 256x256
    enableMipmaps: true,
    spriteInterpolation: 'linear',
    particleCount: 150,
    enableDynamicLighting: true,
    animationFrames: 4
  },
  ultra: {
    textureQuality: TextureQuality.ULTRA,    // 512x512
    enableMipmaps: true,
    spriteInterpolation: 'linear',
    particleCount: 200,
    enableDynamicLighting: true,
    animationFrames: 8
  }
};

class GraphicsSystem {
  private currentSettings: GraphicsSettings;
  private currentPresetName: 'low' | 'medium' | 'high' | 'ultra' = 'medium';

  constructor() {
    this.currentSettings = QUALITY_PRESETS.medium;
    this.load();
  }

  public getSettings(): GraphicsSettings {
    return this.currentSettings;
  }

  public getPresetName(): string {
    return this.currentPresetName;
  }

  public setQuality(quality: 'low' | 'medium' | 'high' | 'ultra') {
    this.currentPresetName = quality;
    this.currentSettings = QUALITY_PRESETS[quality];
    this.save();
  }

  private save() {
    try {
      localStorage.setItem('hundefelsen_graphics', this.currentPresetName);
    } catch (e) {
      console.warn('Could not save graphics settings:', e);
    }
  }

  private load() {
    try {
      const saved = localStorage.getItem('hundefelsen_graphics');
      if (saved && (saved === 'low' || saved === 'medium' || saved === 'high' || saved === 'ultra')) {
        this.currentPresetName = saved;
        this.currentSettings = QUALITY_PRESETS[saved];
      }
    } catch (e) {
      console.warn('Could not load graphics settings:', e);
    }
  }
}

export const graphicsSystem = new GraphicsSystem();
