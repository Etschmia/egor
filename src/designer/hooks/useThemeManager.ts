import { useState, useEffect, useCallback, useRef } from 'react';
import type { Theme } from '../../shared/design-tokens';
import { themeManager, createDefaultTheme } from '../../shared/design-tokens';
import { useApiClient } from './useApiClient';

export interface ThemeManagerState {
  themes: Theme[];
  activeTheme: Theme | null;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
  lastSaved: Date | null;
}

export const useThemeManager = () => {
  const [state, setState] = useState<ThemeManagerState>({
    themes: [],
    activeTheme: null,
    isDirty: false,
    isLoading: false,
    error: null,
    lastSaved: null,
  });

  const apiClient = useApiClient();
  const autoSaveTimeoutRef = useRef<number | undefined>(undefined);
  const changeHistoryRef = useRef<Theme[]>([]);
  const currentHistoryIndexRef = useRef(-1);

  // Initialize theme system
  useEffect(() => {
    initializeThemes();
  }, []);

  // Set up auto-save
  useEffect(() => {
    if (state.isDirty && state.activeTheme) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (5 seconds)
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (state.activeTheme && state.isDirty) {
          saveTheme();
        }
      }, 5000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [state.isDirty, state.activeTheme]);

  const initializeThemes = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load default theme
      const defaultTheme = createDefaultTheme();
      themeManager.registerTheme(defaultTheme);

      // Load themes from server
      const serverThemes = await apiClient.getThemes();
      if (serverThemes) {
        serverThemes.forEach(theme => {
          if (theme.id !== 'default') {
            themeManager.registerTheme(theme);
          }
        });
      }

      const allThemes = themeManager.getAllThemes();
      const activeTheme = themeManager.getActiveTheme() || defaultTheme;

      setState(prev => ({
        ...prev,
        themes: allThemes,
        activeTheme,
        isLoading: false,
      }));

      // Initialize change history
      if (activeTheme) {
        changeHistoryRef.current = [{ ...activeTheme }];
        currentHistoryIndexRef.current = 0;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize themes';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [apiClient]);

  const setActiveTheme = useCallback((themeId: string) => {
    const theme = themeManager.getTheme(themeId);
    if (theme) {
      themeManager.setActiveTheme(themeId);
      setState(prev => ({
        ...prev,
        activeTheme: theme,
        isDirty: false,
      }));

      // Reset change history
      changeHistoryRef.current = [{ ...theme }];
      currentHistoryIndexRef.current = 0;
    }
  }, []);

  const updateThemeProperty = useCallback((path: string, value: any) => {
    console.log('🌎 useThemeManager: updateThemeProperty called', { path, value, activeTheme: state.activeTheme?.id });
    if (!state.activeTheme) {
      console.warn('⚠️ useThemeManager: No active theme - cannot update property');
      return;
    }

    try {
      console.log('🌎 useThemeManager: Attempting to update token...');
      // Update the theme in memory
      themeManager.updateToken(
        {
          themeId: state.activeTheme.id,
          wallTypeId: path.split('.')[0], // Extract wall type from path
          tokenPath: path.substring(path.indexOf('.') + 1), // Remove wall type from path
        },
        value
      );
      console.log('🌎 useThemeManager: Token update successful');

      const updatedTheme = themeManager.getActiveTheme();
      if (updatedTheme) {
        console.log('🌎 useThemeManager: Setting updated theme', updatedTheme.id);
        setState(prev => ({
          ...prev,
          activeTheme: updatedTheme,
          isDirty: true,
        }));

        // Add to change history
        addToHistory(updatedTheme);
        console.log('🌎 useThemeManager: Theme update complete');
      } else {
        console.error('❌ useThemeManager: Failed to get updated theme');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update property';
      console.error('❌ useThemeManager: Error updating property:', error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [state.activeTheme]);

  const addToHistory = useCallback((theme: Theme) => {
    // Remove any future history if we're not at the end
    if (currentHistoryIndexRef.current < changeHistoryRef.current.length - 1) {
      changeHistoryRef.current = changeHistoryRef.current.slice(0, currentHistoryIndexRef.current + 1);
    }

    // Add new state
    changeHistoryRef.current.push({ ...theme });
    currentHistoryIndexRef.current = changeHistoryRef.current.length - 1;

    // Limit history size to prevent memory issues
    if (changeHistoryRef.current.length > 50) {
      changeHistoryRef.current.shift();
      currentHistoryIndexRef.current--;
    }
  }, []);

  const undo = useCallback(() => {
    if (currentHistoryIndexRef.current > 0) {
      currentHistoryIndexRef.current--;
      const previousTheme = changeHistoryRef.current[currentHistoryIndexRef.current];
      
      themeManager.registerTheme(previousTheme);
      themeManager.setActiveTheme(previousTheme.id);

      setState(prev => ({
        ...prev,
        activeTheme: previousTheme,
        isDirty: true,
      }));
    }
  }, []);

  const redo = useCallback(() => {
    if (currentHistoryIndexRef.current < changeHistoryRef.current.length - 1) {
      currentHistoryIndexRef.current++;
      const nextTheme = changeHistoryRef.current[currentHistoryIndexRef.current];
      
      themeManager.registerTheme(nextTheme);
      themeManager.setActiveTheme(nextTheme.id);

      setState(prev => ({
        ...prev,
        activeTheme: nextTheme,
        isDirty: true,
      }));
    }
  }, []);

  const canUndo = currentHistoryIndexRef.current > 0;
  const canRedo = currentHistoryIndexRef.current < changeHistoryRef.current.length - 1;

  const saveTheme = useCallback(async () => {
    if (!state.activeTheme) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let result;
      if (state.activeTheme.id === 'default') {
        // Create a copy of default theme with new ID
        const newTheme = {
          ...state.activeTheme,
          id: `custom-${Date.now()}`,
          name: `${state.activeTheme.name} (Custom)`,
          created: new Date(),
          modified: new Date(),
        };
        result = await apiClient.createTheme(newTheme);
      } else {
        result = await apiClient.updateTheme(state.activeTheme.id, state.activeTheme);
      }

      if (result) {
        setState(prev => ({
          ...prev,
          activeTheme: result,
          isDirty: false,
          isLoading: false,
          lastSaved: new Date(),
        }));
        return true;
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save theme';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [state.activeTheme, apiClient]);

  const createNewTheme = useCallback(async (basedOn?: string) => {
    const baseTheme = basedOn ? themeManager.getTheme(basedOn) : createDefaultTheme();
    if (!baseTheme) return null;

    const newTheme: Theme = {
      ...baseTheme,
      id: `theme-${Date.now()}`,
      name: `New Theme ${new Date().toLocaleDateString()}`,
      description: 'Custom theme created in Designer Mode',
      author: 'Designer Mode',
      created: new Date(),
      modified: new Date(),
    };

    try {
      const result = await apiClient.createTheme(newTheme);
      if (result) {
        themeManager.registerTheme(result);
        setState(prev => ({
          ...prev,
          themes: [...prev.themes, result],
        }));
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create theme';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
    return null;
  }, [apiClient]);

  const deleteTheme = useCallback(async (themeId: string) => {
    if (themeId === 'default') {
      setState(prev => ({ ...prev, error: 'Cannot delete default theme' }));
      return false;
    }

    try {
      const success = await apiClient.deleteTheme(themeId);
      if (success) {
        themeManager.removeTheme(themeId);
        setState(prev => ({
          ...prev,
          themes: prev.themes.filter(t => t.id !== themeId),
        }));

        // If deleted theme was active, switch to default
        if (state.activeTheme?.id === themeId) {
          setActiveTheme('default');
        }
        return true;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete theme';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
    return false;
  }, [apiClient, state.activeTheme, setActiveTheme]);

  const resetTheme = useCallback(() => {
    if (!state.activeTheme) return;

    const originalTheme = changeHistoryRef.current[0];
    if (originalTheme) {
      themeManager.registerTheme(originalTheme);
      themeManager.setActiveTheme(originalTheme.id);

      setState(prev => ({
        ...prev,
        activeTheme: originalTheme,
        isDirty: false,
      }));

      // Reset history
      changeHistoryRef.current = [{ ...originalTheme }];
      currentHistoryIndexRef.current = 0;
    }
  }, [state.activeTheme]);

  const importTheme = useCallback(async (file: File, overwrite: boolean = false) => {
    try {
      const result = await apiClient.importThemeFromFile(file, overwrite);
      if (result) {
        themeManager.registerTheme(result);
        setState(prev => ({
          ...prev,
          themes: prev.themes.some(t => t.id === result.id)
            ? prev.themes.map(t => t.id === result.id ? result : t)
            : [...prev.themes, result],
        }));
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import theme';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
    return null;
  }, [apiClient]);

  const exportTheme = useCallback(async (themeId: string, format: 'json' | 'css' = 'json') => {
    try {
      await apiClient.downloadTheme(themeId, format);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export theme';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [apiClient]);

  const addWallTypeToTheme = useCallback((wallType: any) => {
    if (!state.activeTheme) {
      console.warn('⚠️ useThemeManager: No active theme - cannot add wall type');
      return;
    }

    try {
      console.log('🏗️ useThemeManager: Adding new wall type:', wallType.id);
      
      // Create a new theme with the added wall type
      const updatedTheme = {
        ...state.activeTheme,
        wallTypes: {
          ...state.activeTheme.wallTypes,
          [wallType.id]: wallType
        },
        modified: new Date()
      };
      
      // Register the updated theme
      themeManager.registerTheme(updatedTheme);
      themeManager.setActiveTheme(updatedTheme.id);
      
      setState(prev => ({
        ...prev,
        activeTheme: updatedTheme,
        isDirty: true,
      }));
      
      // Add to change history
      addToHistory(updatedTheme);
      console.log('🏗️ useThemeManager: Wall type added successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add wall type';
      console.error('❌ useThemeManager: Error adding wall type:', error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [state.activeTheme, addToHistory]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    canUndo,
    canRedo,

    // Theme management
    setActiveTheme,
    updateThemeProperty,
    saveTheme,
    createNewTheme,
    deleteTheme,
    resetTheme,
    addWallTypeToTheme,

    // History
    undo,
    redo,

    // Import/Export
    importTheme,
    exportTheme,

    // Utility
    clearError,
    refreshThemes: initializeThemes,
  };
};