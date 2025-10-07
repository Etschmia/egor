import { useState, useCallback } from 'react';
import type { Theme } from '../../shared/design-tokens';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ThemeApiResponse extends ApiResponse {
  theme?: Theme;
  themes?: Theme[];
  count?: number;
}

export interface BackupInfo {
  filename: string;
  themeId: string;
  themeName: string;
  created: string;
  size: number;
}

export interface BackupApiResponse extends ApiResponse {
  backups?: BackupInfo[];
  count?: number;
}

export const useApiClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3002/api';

  const handleRequest = useCallback(async <T = any>(
    requestFn: () => Promise<Response>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestFn();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('API request failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Theme operations
  const getThemes = useCallback(async (): Promise<Theme[] | null> => {
    const response = await handleRequest<ThemeApiResponse>(() =>
      fetch(`${baseUrl}/themes`)
    );
    return response?.themes || null;
  }, [handleRequest, baseUrl]);

  const getTheme = useCallback(async (id: string): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(() =>
      fetch(`${baseUrl}/themes/${id}`)
    );
    return response?.theme || null;
  }, [handleRequest, baseUrl]);

  const createTheme = useCallback(async (theme: Theme): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(() =>
      fetch(`${baseUrl}/themes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      })
    );
    return response?.theme || null;
  }, [handleRequest, baseUrl]);

  const updateTheme = useCallback(async (id: string, theme: Theme): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(() =>
      fetch(`${baseUrl}/themes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      })
    );
    return response?.theme || null;
  }, [handleRequest, baseUrl]);

  const deleteTheme = useCallback(async (id: string): Promise<boolean> => {
    const response = await handleRequest<ApiResponse>(() =>
      fetch(`${baseUrl}/themes/${id}`, {
        method: 'DELETE',
      })
    );
    return response?.success || false;
  }, [handleRequest, baseUrl]);

  // Import/Export operations
  const exportTheme = useCallback(async (id: string, format: 'json' | 'css' = 'json'): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/themes/${id}/export?format=${format}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Export failed');
      }

      if (format === 'json') {
        const theme = await response.json();
        return JSON.stringify(theme, null, 2);
      } else {
        return await response.text();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      console.error('Export failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const importTheme = useCallback(async (themeData: Theme, overwrite: boolean = false): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(() =>
      fetch(`${baseUrl}/themes/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeData, overwrite }),
      })
    );
    return response?.theme || null;
  }, [handleRequest, baseUrl]);

  const importThemeFromFile = useCallback(async (file: File, overwrite: boolean = false): Promise<Theme | null> => {
    try {
      setLoading(true);
      setError(null);

      const text = await file.text();
      const themeData = JSON.parse(text);

      return await importTheme(themeData, overwrite);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed';
      setError(errorMessage);
      console.error('Import failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [importTheme]);

  const downloadTheme = useCallback(async (id: string, format: 'json' | 'css' = 'json'): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/themes/${id}/export?format=${format}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Download failed');
      }

      // Get the filename from Content-Disposition header or create one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${id}-theme.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
      console.error('Download failed:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Backup operations
  const getBackups = useCallback(async (): Promise<BackupInfo[] | null> => {
    const response = await handleRequest<BackupApiResponse>(() =>
      fetch(`${baseUrl}/backups`)
    );
    return response?.backups || null;
  }, [handleRequest, baseUrl]);

  const restoreBackup = useCallback(async (filename: string): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(() =>
      fetch(`${baseUrl}/backups/${filename}/restore`, {
        method: 'POST',
      })
    );
    return response?.theme || null;
  }, [handleRequest, baseUrl]);

  // Preview generation
  const generatePreview = useCallback(async (
    themeId: string,
    wallTypeId: string,
    width: number = 256,
    height: number = 256
  ): Promise<string | null> => {
    const response = await handleRequest<{ preview: { dataUrl: string } }>(() =>
      fetch(`${baseUrl}/themes/${themeId}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallTypeId, width, height }),
      })
    );
    return response?.preview?.dataUrl || null;
  }, [handleRequest, baseUrl]);

  // Server health check
  const checkServerHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/themes`);
      return response.ok;
    } catch {
      return false;
    }
  }, [baseUrl]);

  return {
    loading,
    error,
    
    // Theme CRUD operations
    getThemes,
    getTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    
    // Import/Export
    exportTheme,
    importTheme,
    importThemeFromFile,
    downloadTheme,
    
    // Backup operations
    getBackups,
    restoreBackup,
    
    // Utility
    generatePreview,
    checkServerHealth,
    
    // Error handling
    clearError: () => setError(null),
  };
};