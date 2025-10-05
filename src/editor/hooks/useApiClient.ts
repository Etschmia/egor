import { useState, useCallback } from 'react';
import type { GameMap } from '../../types';

const API_BASE_URL = 'http://localhost:3001/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

interface LevelInfo {
  filename: string;
  level: number;
  variant: number;
}

interface FetchLevelsResponse {
  levels: LevelInfo[];
}

interface LoadLevelResponse {
  success: boolean;
  data?: GameMap;
  error?: string;
}

interface SaveLevelResponse {
  success: boolean;
  error?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export function useApiClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to delay execution
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to perform fetch with retry logic
  const fetchWithRetry = async <T,>(
    url: string,
    options: RequestInit = {},
    retries = MAX_RETRIES
  ): Promise<T> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.error || `HTTP error! status: ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (err) {
      // If we have retries left and it's a network error, retry
      if (retries > 0 && (err instanceof TypeError || (err as ApiError).status === undefined)) {
        await delay(RETRY_DELAY);
        return fetchWithRetry<T>(url, options, retries - 1);
      }
      throw err;
    }
  };

  // Fetch all available levels
  const fetchLevels = useCallback(async (): Promise<LevelInfo[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry<FetchLevelsResponse>(
        `${API_BASE_URL}/levels`
      );
      return response.levels;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as ApiError).message || 'Failed to fetch levels';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a specific level file
  const loadLevel = useCallback(async (filename: string): Promise<GameMap> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry<LoadLevelResponse>(
        `${API_BASE_URL}/levels/${encodeURIComponent(filename)}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load level data');
      }

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as ApiError).message || 'Failed to load level';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save level data to a file
  const saveLevel = useCallback(async (
    filename: string,
    data: GameMap
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithRetry<SaveLevelResponse>(
        `${API_BASE_URL}/levels`,
        {
          method: 'POST',
          body: JSON.stringify({ filename, data }),
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to save level');
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as ApiError).message || 'Failed to save level';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchLevels,
    loadLevel,
    saveLevel,
    isLoading,
    error,
  };
}
