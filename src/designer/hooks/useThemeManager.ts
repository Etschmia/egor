import { useState, useCallback, useEffect, useRef } from 'react';
import type { Theme, WallTypeDefinition } from '../types';
import { useApiClient } from './useApiClient';

// Type for timeout to avoid NodeJS namespace dependency
type TimeoutId = ReturnType<typeof setTimeout>;

interface HistoryEntry {
  action: string;
  timestamp: number;
  previousState: Theme;
  newState: Theme;
}

interface ThemeManagerState {
  activeTheme: Theme | null;
  availableThemes: Theme[];
  isDirty: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
}

interface UseThemeManagerReturn {
  // State
  activeTheme: Theme | null;
  availableThemes: Theme[];
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Theme operations
  loadTheme: (themeId: string) => Promise<void>;
  loadAllThemes: () => Promise<void>;
  createTheme: (name: string, basedOn?: string) => Promise<void>;
  saveTheme: () => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
  
  // Property updates
  updateProperty: (path: string, value: any) => void;
  updateWallType: (wallTypeId: string, updates: Partial<WallTypeDefinition>) => void;
  addWallType: (name: string, basedOn?: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  
  // Utility
  clearError: () => void;
  resetDirtyState: () => void;
}

const MAX_HISTORY_ENTRIES = 50;
const DEBOUNCE_DELAY = 300;

export const useThemeManager = (): UseThemeManagerReturn => {
  const apiClient = useApiClient();
  
  const [state, setState] = useState<ThemeManagerState>({
    activeTheme: null,
    availableThemes: [],
    isDirty: false,
    history: [],
    historyIndex: -1,
    isLoading: false,
    error: null,
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<TimeoutId | null>(null);
  
  // Pending updates ref for debouncing
  const pendingUpdatesRef = useRef<Map<string, any>>(new Map());

  /**
   * Validate theme structure and data
   */
  const validateTheme = useCallback((theme: Theme): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!theme.id || theme.id.trim() === '') {
      errors.push('Theme must have a valid id');
    }

    if (!theme.name || theme.name.trim() === '') {
      errors.push('Theme must have a valid name');
    }

    if (!theme.version || !theme.version.match(/^\d+\.\d+\.\d+$/)) {
      errors.push('Theme must have a valid semantic version (x.y.z)');
    }

    if (!theme.wallTypes || Object.keys(theme.wallTypes).length === 0) {
      errors.push('Theme must define at least one wall type');
    } else {
      // Validate each wall type
      for (const [wallTypeId, wallType] of Object.entries(theme.wallTypes)) {
        if (!wallType.id || wallType.id.trim() === '') {
          errors.push(`Wall type '${wallTypeId}' must have a valid id`);
        }
        if (!wallType.displayName || wallType.displayName.trim() === '') {
          errors.push(`Wall type '${wallTypeId}' must have a display name`);
        }
        if (!wallType.colors) {
          errors.push(`Wall type '${wallTypeId}' must have a color scheme`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  /**
   * Add entry to history stack
   */
  const addToHistory = useCallback((action: string, previousTheme: Theme, newTheme: Theme) => {
    setState(prev => {
      // Remove any entries after current index (when undoing then making new changes)
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      
      // Add new entry
      newHistory.push({
        action,
        timestamp: Date.now(),
        previousState: previousTheme,
        newState: newTheme,
      });

      // Limit history size
      if (newHistory.length > MAX_HISTORY_ENTRIES) {
        newHistory.shift();
      }

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  /**
   * Load all available themes
   */
  const loadAllThemes = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const themes = await apiClient.getThemes();
      
      if (themes) {
        setState(prev => ({
          ...prev,
          availableThemes: themes,
          isLoading: false,
        }));
      } else {
        throw new Error('Failed to load themes');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load themes';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [apiClient]);

  /**
   * Load a specific theme
   */
  const loadTheme = useCallback(async (themeId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const theme = await apiClient.getTheme(themeId);
      
      if (theme) {
        // Validate theme before loading
        const validation = validateTheme(theme);
        if (!validation.isValid) {
          throw new Error(`Invalid theme: ${validation.errors.join(', ')}`);
        }

        setState(prev => ({
          ...prev,
          activeTheme: theme,
          isDirty: false,
          history: [],
          historyIndex: -1,
          isLoading: false,
        }));
      } else {
        throw new Error(`Theme '${themeId}' not found`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load theme';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [apiClient, validateTheme]);

  /**
   * Create a new theme
   */
  const createTheme = useCallback(async (name: string, basedOn?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let baseTheme: Theme | null = null;
      
      if (basedOn) {
        baseTheme = await apiClient.getTheme(basedOn);
        if (!baseTheme) {
          throw new Error(`Base theme '${basedOn}' not found`);
        }
      }

      const newTheme: Theme = {
        id: `custom-${Date.now()}`,
        name,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        basedOn,
        wallTypes: baseTheme ? { ...baseTheme.wallTypes } : {},
      };

      const createdTheme = await apiClient.createTheme(newTheme);
      
      if (createdTheme) {
        setState(prev => ({
          ...prev,
          activeTheme: createdTheme,
          availableThemes: [...prev.availableThemes, createdTheme],
          isDirty: false,
          history: [],
          historyIndex: -1,
          isLoading: false,
        }));
      } else {
        throw new Error('Failed to create theme');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create theme';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [apiClient]);

  /**
   * Save the active theme
   */
  const saveTheme = useCallback(async () => {
    if (!state.activeTheme) {
      setState(prev => ({ ...prev, error: 'No active theme to save' }));
      return;
    }

    // Validate before saving
    const validation = validateTheme(state.activeTheme);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: `Cannot save invalid theme: ${validation.errors.join(', ')}`,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedTheme = {
        ...state.activeTheme,
        updatedAt: new Date().toISOString(),
      };

      const savedTheme = await apiClient.updateTheme(state.activeTheme.id, updatedTheme);
      
      if (savedTheme) {
        setState(prev => ({
          ...prev,
          activeTheme: savedTheme,
          availableThemes: prev.availableThemes.map(t => 
            t.id === savedTheme.id ? savedTheme : t
          ),
          isDirty: false,
          isLoading: false,
        }));
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save theme';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [state.activeTheme, apiClient, validateTheme]);

  /**
   * Delete a theme
   */
  const deleteTheme = useCallback(async (themeId: string) => {
    if (themeId === 'default') {
      setState(prev => ({ ...prev, error: 'Cannot delete default theme' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await apiClient.deleteTheme(themeId);
      
      if (success) {
        setState(prev => {
          const newState = {
            ...prev,
            availableThemes: prev.availableThemes.filter(t => t.id !== themeId),
            isLoading: false,
          };

          // If deleted theme was active, clear it
          if (prev.activeTheme?.id === themeId) {
            newState.activeTheme = null;
            newState.isDirty = false;
            newState.history = [];
            newState.historyIndex = -1;
          }

          return newState;
        });
      } else {
        throw new Error('Failed to delete theme');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete theme';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [apiClient]);

  /**
   * Update a property in the active theme with debouncing
   */
  const updateProperty = useCallback((path: string, value: any) => {
    if (!state.activeTheme) {
      return;
    }

    // Store pending update
    pendingUpdatesRef.current.set(path, value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setState(prev => {
        if (!prev.activeTheme) {
          return prev;
        }

        const previousTheme = { ...prev.activeTheme };
        const newTheme = { ...prev.activeTheme };

        // Apply all pending updates
        pendingUpdatesRef.current.forEach((updateValue, updatePath) => {
          const parts = updatePath.split('.');
          let current: any = newTheme;

          // Navigate to the parent object
          for (let i = 0; i < parts.length - 1; i++) {
            if (current && typeof current === 'object' && parts[i] in current) {
              // Create a copy to avoid mutation
              current[parts[i]] = { ...current[parts[i]] };
              current = current[parts[i]];
            } else {
              console.error(`Invalid property path: ${updatePath}`);
              return;
            }
          }

          // Update the final property
          const finalKey = parts[parts.length - 1];
          if (current && typeof current === 'object') {
            if (typeof current[finalKey] === 'object' && current[finalKey] !== null && 'value' in current[finalKey]) {
              current[finalKey] = { ...current[finalKey], value: updateValue };
            } else {
              current[finalKey] = updateValue;
            }
          }
        });

        // Clear pending updates
        pendingUpdatesRef.current.clear();

        // Add to history
        addToHistory('Update property', previousTheme, newTheme);

        return {
          ...prev,
          activeTheme: newTheme,
          isDirty: true,
        };
      });
    }, DEBOUNCE_DELAY);
  }, [state.activeTheme, addToHistory]);

  /**
   * Update an entire wall type
   */
  const updateWallType = useCallback((wallTypeId: string, updates: Partial<WallTypeDefinition>) => {
    if (!state.activeTheme) {
      return;
    }

    setState(prev => {
      if (!prev.activeTheme || !prev.activeTheme.wallTypes[wallTypeId]) {
        return prev;
      }

      const previousTheme = { ...prev.activeTheme };
      const newTheme = {
        ...prev.activeTheme,
        wallTypes: {
          ...prev.activeTheme.wallTypes,
          [wallTypeId]: {
            ...prev.activeTheme.wallTypes[wallTypeId],
            ...updates,
          },
        },
      };

      // Add to history
      addToHistory(`Update wall type: ${wallTypeId}`, previousTheme, newTheme);

      return {
        ...prev,
        activeTheme: newTheme,
        isDirty: true,
      };
    });
  }, [state.activeTheme, addToHistory]);

  /**
   * Add a new wall type to the active theme
   */
  const addWallType = useCallback((name: string, basedOn?: string) => {
    if (!state.activeTheme) {
      return;
    }

    setState(prev => {
      if (!prev.activeTheme) {
        return prev;
      }

      const previousTheme = { ...prev.activeTheme };
      
      // Generate unique ID
      const id = name.toLowerCase().replace(/\s+/g, '-');
      
      // Get base wall type if specified
      let baseWallType: WallTypeDefinition | null = null;
      if (basedOn && prev.activeTheme.wallTypes[basedOn]) {
        baseWallType = prev.activeTheme.wallTypes[basedOn];
      }

      // Create new wall type
      const newWallType: WallTypeDefinition = baseWallType
        ? {
            ...baseWallType,
            id,
            displayName: name,
            description: `Custom wall type based on ${baseWallType.displayName}`,
          }
        : {
            id,
            displayName: name,
            description: 'Custom wall type',
            colors: {
              primary: { value: '#808080', displayName: 'Primary Color' },
              secondary: { value: '#606060', displayName: 'Secondary Color' },
              accent: { value: '#a0a0a0', displayName: 'Accent Color' },
              shadow: { value: '#404040', displayName: 'Shadow Color' },
              highlight: { value: '#c0c0c0', displayName: 'Highlight Color' },
            },
            dimensions: {
              width: { value: 64, min: 32, max: 128, step: 1, unit: 'px' },
              height: { value: 64, min: 32, max: 128, step: 1, unit: 'px' },
              spacing: { value: 2, min: 0, max: 10, step: 1, unit: 'px' },
              borderWidth: { value: 1, min: 0, max: 5, step: 1, unit: 'px' },
            },
            texture: {
              pattern: 'SOLID',
              intensity: { value: 1, min: 0, max: 2, step: 0.1 },
              blendMode: 'NORMAL',
              procedural: true,
            },
            effects: {
              shadow: {
                enabled: false,
                color: { value: '#000000', displayName: 'Shadow Color' },
                offset: { value: 2, min: 0, max: 10, step: 1, unit: 'px' },
                blur: { value: 4, min: 0, max: 20, step: 1, unit: 'px' },
              },
              highlight: {
                enabled: false,
                color: { value: '#ffffff', displayName: 'Highlight Color' },
                intensity: { value: 0.5, min: 0, max: 1, step: 0.1 },
              },
              gradient: {
                enabled: false,
                type: 'linear',
                colors: [
                  { value: '#808080', displayName: 'Gradient Start' },
                  { value: '#606060', displayName: 'Gradient End' },
                ],
              },
            },
            legacyMapping: {},
          };

      const newTheme = {
        ...prev.activeTheme,
        wallTypes: {
          ...prev.activeTheme.wallTypes,
          [id]: newWallType,
        },
      };

      // Add to history
      addToHistory(`Add wall type: ${name}`, previousTheme, newTheme);

      return {
        ...prev,
        activeTheme: newTheme,
        isDirty: true,
      };
    });
  }, [state.activeTheme, addToHistory]);

  /**
   * Undo last change
   */
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < 0) {
        return prev;
      }

      const entry = prev.history[prev.historyIndex];
      
      return {
        ...prev,
        activeTheme: entry.previousState,
        historyIndex: prev.historyIndex - 1,
        isDirty: true,
      };
    });
  }, []);

  /**
   * Redo last undone change
   */
  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) {
        return prev;
      }

      const entry = prev.history[prev.historyIndex + 1];
      
      return {
        ...prev,
        activeTheme: entry.newState,
        historyIndex: prev.historyIndex + 1,
        isDirty: true,
      };
    });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset dirty state
   */
  const resetDirtyState = useCallback(() => {
    setState(prev => ({ ...prev, isDirty: false }));
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Computed values
  const canUndo = state.historyIndex >= 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return {
    // State
    activeTheme: state.activeTheme,
    availableThemes: state.availableThemes,
    isDirty: state.isDirty,
    canUndo,
    canRedo,
    isLoading: state.isLoading || apiClient.loading,
    error: state.error || apiClient.error,
    
    // Theme operations
    loadTheme,
    loadAllThemes,
    createTheme,
    saveTheme,
    deleteTheme,
    
    // Property updates
    updateProperty,
    updateWallType,
    addWallType,
    
    // History operations
    undo,
    redo,
    
    // Utility
    clearError,
    resetDirtyState,
  };
};
