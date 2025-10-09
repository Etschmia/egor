/**
 * Asset Type Module Loader
 * Provides code-split modules for different asset types
 * Each asset type is loaded on-demand to reduce initial bundle size
 */

import type { AssetType } from '../types';

/**
 * Asset type module interface
 * Each asset type module should implement this interface
 */
export interface AssetTypeModule {
  // Component for displaying the asset list
  AssetList: React.ComponentType<any>;
  
  // Component for editing asset properties
  PropertyEditor: React.ComponentType<any>;
  
  // Component for creating new assets
  CreateDialog: React.ComponentType<any>;
  
  // Asset type metadata
  metadata: {
    displayName: string;
    description: string;
    icon: string;
  };
}

/**
 * Lazy load asset type modules
 * This enables code splitting - each module is loaded only when needed
 */
export const assetTypeModules: Record<AssetType, () => Promise<AssetTypeModule>> = {
  wallTypes: () => import('./wallTypes').then(m => m.default),
  objects: () => import('./objects').then(m => m.default),
  pictures: () => import('./pictures').then(m => m.default),
  lights: () => import('./lights').then(m => m.default),
  enemies: () => import('./enemies').then(m => m.default),
};

/**
 * Get asset type module dynamically
 */
export async function getAssetTypeModule(assetType: AssetType): Promise<AssetTypeModule> {
  const loader = assetTypeModules[assetType];
  if (!loader) {
    throw new Error(`Unknown asset type: ${assetType}`);
  }
  return loader();
}

/**
 * Preload an asset type module
 * Useful for prefetching modules that will likely be used soon
 */
export function preloadAssetTypeModule(assetType: AssetType): void {
  const loader = assetTypeModules[assetType];
  if (loader) {
    loader().catch(err => {
      console.warn(`Failed to preload asset type module: ${assetType}`, err);
    });
  }
}

/**
 * Preload all asset type modules
 * Use this sparingly - only when you know the user will need all modules
 */
export function preloadAllAssetTypeModules(): void {
  Object.keys(assetTypeModules).forEach(assetType => {
    preloadAssetTypeModule(assetType as AssetType);
  });
}
