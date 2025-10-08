import { useState, useCallback } from 'react';
import type { Theme } from '../types';

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

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

/**
 * Converts technical error messages to user-friendly messages
 */
const getUserFriendlyErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();
  
  // Network errors
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }
  
  // Timeout errors
  if (message.includes('timeout')) {
    return 'The request took too long. Please try again.';
  }
  
  // Server errors
  if (message.includes('500') || message.includes('internal server')) {
    return 'The server encountered an error. Please try again later.';
  }
  
  // Not found errors
  if (message.includes('404') || message.includes('not found')) {
    return 'The requested resource was not found.';
  }
  
  // Permission errors
  if (message.includes('403') || message.includes('forbidden')) {
    return 'You do not have permission to perform this action.';
  }
  
  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return error.message; // Keep original validation messages
  }
  
  // Default to original message if it's already user-friendly
  if (error.message.length < 100 && !message.includes('error')) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Implements exponential backoff retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  requestFn: () => Promise<Response>,
  options: RetryOptions = {}
): Promise<Response> => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error: Error, attempt: number) => {
      // Retry on network errors or 5xx server errors
      const message = error.message.toLowerCase();
      return (
        attempt < maxRetries &&
        (message.includes('fetch') || 
         message.includes('network') || 
         message.includes('500') ||
         message.includes('502') ||
         message.includes('503') ||
         message.includes('504'))
      );
    }
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries && shouldRetry(lastError, attempt)) {
        // Calculate exponential backoff delay: initialDelay * 2^attempt
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        await sleep(delay);
        continue;
      }
      
      throw lastError;
    }
  }
  
  throw lastError!;
};

export const useApiClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3004/api';

  const handleRequest = useCallback(async <T = any>(
    requestFn: () => Promise<Response>,
    retryOptions?: RetryOptions
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry(requestFn, retryOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      const originalError = err instanceof Error ? err : new Error('Unknown error occurred');
      const userFriendlyMessage = getUserFriendlyErrorMessage(originalError);
      setError(userFriendlyMessage);
      console.error('API request failed:', originalError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Theme operations
  const getThemes = useCallback(async (): Promise<Theme[] | null> => {
    const response = await handleRequest<ThemeApiResponse>(
      () => fetch(`${baseUrl}/themes`),
      { maxRetries: 3 } // Retry GET requests
    );
    return (response?.themes as Theme[]) || null;
  }, [handleRequest, baseUrl]);

  const getTheme = useCallback(async (id: string): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(
      () => fetch(`${baseUrl}/themes/${id}`),
      { maxRetries: 3 } // Retry GET requests
    );
    return (response?.theme as Theme) || null;
  }, [handleRequest, baseUrl]);

  const createTheme = useCallback(async (theme: Theme): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(
      () => fetch(`${baseUrl}/themes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      }),
      { maxRetries: 1 } // Limited retries for POST
    );
    return (response?.theme as Theme) || null;
  }, [handleRequest, baseUrl]);

  const updateTheme = useCallback(async (id: string, theme: Theme): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(
      () => fetch(`${baseUrl}/themes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      }),
      { maxRetries: 1 } // Limited retries for PUT
    );
    return (response?.theme as Theme) || null;
  }, [handleRequest, baseUrl]);

  const deleteTheme = useCallback(async (id: string): Promise<boolean> => {
    const response = await handleRequest<ApiResponse>(
      () => fetch(`${baseUrl}/themes/${id}`, {
        method: 'DELETE',
      }),
      { maxRetries: 0 } // No retries for DELETE
    );
    return response?.success || false;
  }, [handleRequest, baseUrl]);

  // Import/Export operations
  const exportTheme = useCallback(async (id: string, format: 'json' | 'css' = 'json'): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithRetry(
        () => fetch(`${baseUrl}/themes/${id}/export?format=${format}`),
        { maxRetries: 3 }
      );
      
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
      const originalError = err instanceof Error ? err : new Error('Export failed');
      const userFriendlyMessage = getUserFriendlyErrorMessage(originalError);
      setError(userFriendlyMessage);
      console.error('Export failed:', originalError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const importTheme = useCallback(async (themeData: Theme, overwrite: boolean = false): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(
      () => fetch(`${baseUrl}/themes/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeData, overwrite }),
      }),
      { maxRetries: 1 } // Limited retries for import
    );
    return (response?.theme as Theme) || null;
  }, [handleRequest, baseUrl]);

  const importThemeFromFile = useCallback(async (file: File, overwrite: boolean = false): Promise<Theme | null> => {
    try {
      setLoading(true);
      setError(null);

      const text = await file.text();
      const themeData = JSON.parse(text);

      return await importTheme(themeData, overwrite);
    } catch (err) {
      const originalError = err instanceof Error ? err : new Error('Import failed');
      const userFriendlyMessage = getUserFriendlyErrorMessage(originalError);
      setError(userFriendlyMessage);
      console.error('Import failed:', originalError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [importTheme]);

  const downloadTheme = useCallback(async (id: string, format: 'json' | 'css' = 'json'): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithRetry(
        () => fetch(`${baseUrl}/themes/${id}/export?format=${format}`),
        { maxRetries: 3 }
      );
      
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
      const originalError = err instanceof Error ? err : new Error('Download failed');
      const userFriendlyMessage = getUserFriendlyErrorMessage(originalError);
      setError(userFriendlyMessage);
      console.error('Download failed:', originalError);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Backup operations
  const getBackups = useCallback(async (): Promise<BackupInfo[] | null> => {
    const response = await handleRequest<BackupApiResponse>(
      () => fetch(`${baseUrl}/backups`),
      { maxRetries: 3 } // Retry GET requests
    );
    return response?.backups || null;
  }, [handleRequest, baseUrl]);

  const restoreBackup = useCallback(async (filename: string): Promise<Theme | null> => {
    const response = await handleRequest<ThemeApiResponse>(
      () => fetch(`${baseUrl}/backups/${filename}/restore`, {
        method: 'POST',
      }),
      { maxRetries: 1 } // Limited retries for restore
    );
    return (response?.theme as Theme) || null;
  }, [handleRequest, baseUrl]);

  // Preview generation
  const generatePreview = useCallback(async (
    themeId: string,
    wallTypeId: string,
    width: number = 256,
    height: number = 256
  ): Promise<string | null> => {
    const response = await handleRequest<{ preview: { dataUrl: string } }>(
      () => fetch(`${baseUrl}/themes/${themeId}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallTypeId, width, height }),
      }),
      { maxRetries: 2 } // Some retries for preview generation
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