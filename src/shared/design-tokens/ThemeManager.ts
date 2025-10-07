import type {
  Theme,
  ThemeRegistry,
  WallTypeDefinition,
  DesignToken,
  TokenResolutionContext,
  ValidationResult,
  ValidationError,
  MigrationPlan
} from './types';

export class ThemeManager {
  private registry: ThemeRegistry;
  private listeners: Map<string, ((theme: Theme) => void)[]>;
  private cache: Map<string, DesignToken>;

  constructor() {
    this.registry = {
      themes: {},
      activeThemeId: '',
      defaultThemeId: 'default'
    };
    this.listeners = new Map();
    this.cache = new Map();
  }

  // Theme Management
  public registerTheme(theme: Theme): void {
    const validation = this.validateTheme(theme);
    if (!validation.isValid) {
      throw new Error(`Invalid theme: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    this.registry.themes[theme.id] = { ...theme };
    
    if (!this.registry.activeThemeId) {
      this.registry.activeThemeId = theme.id;
    }

    this.invalidateCache();
    this.notifyListeners('themeRegistered', theme);
  }

  public getTheme(themeId: string): Theme | null {
    return this.registry.themes[themeId] || null;
  }

  public getActiveTheme(): Theme | null {
    if (!this.registry.activeThemeId) {
      return null;
    }
    return this.getTheme(this.registry.activeThemeId);
  }

  public setActiveTheme(themeId: string): void {
    if (!this.registry.themes[themeId]) {
      throw new Error(`Theme with id '${themeId}' not found`);
    }

    this.registry.activeThemeId = themeId;
    
    this.invalidateCache();
    this.notifyListeners('themeChanged', this.registry.themes[themeId]);
  }

  public getAllThemes(): Theme[] {
    return Object.values(this.registry.themes);
  }

  public removeTheme(themeId: string): void {
    if (themeId === this.registry.defaultThemeId) {
      throw new Error('Cannot remove default theme');
    }

    if (themeId === this.registry.activeThemeId) {
      this.setActiveTheme(this.registry.defaultThemeId);
    }

    delete this.registry.themes[themeId];
    this.invalidateCache();
    this.notifyListeners('themeRemoved', null);
  }

  // Token Resolution
  public resolveToken(context: TokenResolutionContext): DesignToken | null {
    const cacheKey = `${context.themeId}:${context.wallTypeId}:${context.tokenPath}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const theme = this.getTheme(context.themeId);
    if (!theme) {
      return null;
    }

    const wallType = theme.wallTypes[context.wallTypeId];
    if (!wallType) {
      return null;
    }

    const token = this.extractTokenFromPath(wallType, context.tokenPath);
    if (token) {
      this.cache.set(cacheKey, token);
    }

    return token;
  }

  private extractTokenFromPath(wallType: WallTypeDefinition, path: string): DesignToken | null {
    const parts = path.split('.');
    let current: any = wallType;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    if (current && typeof current === 'object' && 'value' in current) {
      return {
        path,
        value: current.value,
        type: this.inferTokenType(current.value),
        category: this.inferTokenCategory(path)
      };
    }

    return null;
  }

  private inferTokenType(value: any): 'color' | 'number' | 'string' | 'boolean' {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      // Check if it's a color (hex, rgb, hsl, named color)
      if (value.match(/^#[0-9A-Fa-f]{6}$/) || 
          value.match(/^rgb\(/) || 
          value.match(/^hsl\(/) ||
          value.match(/^[a-zA-Z]+$/)) {
        return 'color';
      }
      return 'string';
    }
    return 'string';
  }

  private inferTokenCategory(path: string): 'color' | 'dimension' | 'pattern' | 'effect' {
    if (path.includes('colors') || path.includes('color')) return 'color';
    if (path.includes('dimensions') || path.includes('width') || path.includes('height')) return 'dimension';
    if (path.includes('pattern') || path.includes('texture')) return 'pattern';
    if (path.includes('effects') || path.includes('shadow') || path.includes('highlight')) return 'effect';
    return 'color'; // default
  }

  // Token Updates
  public updateToken(context: TokenResolutionContext, newValue: any): void {
    const theme = this.getTheme(context.themeId);
    if (!theme) {
      throw new Error(`Theme '${context.themeId}' not found`);
    }

    const wallType = theme.wallTypes[context.wallTypeId];
    if (!wallType) {
      throw new Error(`Wall type '${context.wallTypeId}' not found in theme '${context.themeId}'`);
    }

    this.updateTokenInPath(wallType, context.tokenPath, newValue);
    theme.modified = new Date();

    // Invalidate cache for this specific token
    const cacheKey = `${context.themeId}:${context.wallTypeId}:${context.tokenPath}`;
    this.cache.delete(cacheKey);

    this.notifyListeners('tokenUpdated', theme);
  }

  private updateTokenInPath(wallType: WallTypeDefinition, path: string, newValue: any): void {
    const parts = path.split('.');
    let current: any = wallType;

    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
      if (current && typeof current === 'object' && parts[i] in current) {
        current = current[parts[i]];
      } else {
        throw new Error(`Invalid token path: ${path}`);
      }
    }

    // Update the final property
    const finalKey = parts[parts.length - 1];
    if (current && typeof current === 'object' && finalKey in current) {
      if (typeof current[finalKey] === 'object' && 'value' in current[finalKey]) {
        current[finalKey].value = newValue;
      } else {
        current[finalKey] = newValue;
      }
    } else {
      throw new Error(`Invalid token path: ${path}`);
    }
  }

  // Theme Validation
  public validateTheme(theme: Theme): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Basic validation
    if (!theme.id || theme.id.trim() === '') {
      errors.push({
        code: 'MISSING_ID',
        message: 'Theme must have a valid id',
        path: 'id',
        severity: 'error'
      });
    }

    if (!theme.name || theme.name.trim() === '') {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Theme must have a valid name',
        path: 'name',
        severity: 'error'
      });
    }

    if (!theme.version || !theme.version.match(/^\d+\.\d+\.\d+$/)) {
      errors.push({
        code: 'INVALID_VERSION',
        message: 'Theme must have a valid semantic version (x.y.z)',
        path: 'version',
        severity: 'error'
      });
    }

    // Validate wall types
    if (!theme.wallTypes || Object.keys(theme.wallTypes).length === 0) {
      errors.push({
        code: 'NO_WALL_TYPES',
        message: 'Theme must define at least one wall type',
        path: 'wallTypes',
        severity: 'error'
      });
    } else {
      for (const [wallTypeId, wallType] of Object.entries(theme.wallTypes)) {
        const wallTypeErrors = this.validateWallType(wallType, `wallTypes.${wallTypeId}`);
        errors.push(...wallTypeErrors.filter(e => e.severity === 'error'));
        warnings.push(...wallTypeErrors.filter(e => e.severity === 'warning'));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.map(w => ({
        code: w.code,
        message: w.message,
        path: w.path,
        severity: 'warning' as const
      }))
    };
  }

  private validateWallType(wallType: WallTypeDefinition, basePath: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!wallType.id || wallType.id.trim() === '') {
      errors.push({
        code: 'MISSING_WALL_TYPE_ID',
        message: 'Wall type must have a valid id',
        path: `${basePath}.id`,
        severity: 'error'
      });
    }

    if (!wallType.displayName || wallType.displayName.trim() === '') {
      errors.push({
        code: 'MISSING_DISPLAY_NAME',
        message: 'Wall type must have a display name',
        path: `${basePath}.displayName`,
        severity: 'error'
      });
    }

    // Validate color scheme
    if (!wallType.colors) {
      errors.push({
        code: 'MISSING_COLORS',
        message: 'Wall type must have a color scheme',
        path: `${basePath}.colors`,
        severity: 'error'
      });
    } else {
      const requiredColors = ['primary', 'secondary', 'accent', 'shadow', 'highlight'];
      for (const colorKey of requiredColors) {
        if (!wallType.colors[colorKey as keyof typeof wallType.colors]) {
          errors.push({
            code: 'MISSING_COLOR',
            message: `Missing required color: ${colorKey}`,
            path: `${basePath}.colors.${colorKey}`,
            severity: 'error'
          });
        }
      }
    }

    return errors;
  }

  // Event System
  public addEventListener(event: string, callback: (theme: Theme) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public removeEventListener(event: string, callback: (theme: Theme) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, theme: Theme | null): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners && theme) {
      eventListeners.forEach(callback => callback(theme));
    }
  }

  // Cache Management
  private invalidateCache(): void {
    this.cache.clear();
  }

  public clearCache(): void {
    this.invalidateCache();
  }

  // Migration Support
  public createMigrationPlan(fromVersion: string, toVersion: string): MigrationPlan {
    // This would be implemented based on available migration scripts
    return {
      currentVersion: fromVersion,
      targetVersion: toVersion,
      scripts: [],
      estimatedDuration: 0,
      backupRequired: true
    };
  }

  public executeMigration(plan: MigrationPlan, theme: Theme): Theme {
    let migratedTheme = { ...theme };
    
    for (const script of plan.scripts) {
      if (script.validate(migratedTheme)) {
        migratedTheme = script.execute(migratedTheme);
      } else {
        throw new Error(`Migration script ${script.id} validation failed`);
      }
    }

    return migratedTheme;
  }

  // Serialization
  public exportTheme(themeId: string): string {
    const theme = this.getTheme(themeId);
    if (!theme) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    return JSON.stringify(theme, null, 2);
  }

  public importTheme(themeData: string): Theme {
    try {
      const theme = JSON.parse(themeData) as Theme;
      const validation = this.validateTheme(theme);
      
      if (!validation.isValid) {
        throw new Error(`Invalid theme data: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      return theme;
    } catch (error) {
      throw new Error(`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Singleton instance
export const themeManager = new ThemeManager();