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
