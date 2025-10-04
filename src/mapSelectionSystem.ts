import type { GameMap } from './types';

const STORAGE_KEY = 'egor_map_history';
const MAX_HISTORY_ENTRIES = 1000;

export interface MapHistoryEntry {
  level: number;
  variant: number;
  timestamp: number;
}

// In-memory fallback when LocalStorage is unavailable
let inMemoryHistory: MapHistoryEntry[] = [];
let useInMemoryFallback = false;

/**
 * Loads map history from LocalStorage
 * Returns empty array if no history exists or on error
 */
export function loadMapHistory(): MapHistoryEntry[] {
  if (useInMemoryFallback) {
    return [...inMemoryHistory];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Validate data structure
    if (!Array.isArray(parsed)) {
      console.warn('Map history data is not an array, resetting');
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    // Validate and clean entries
    const validEntries = parsed.filter((entry): entry is MapHistoryEntry => {
      return (
        typeof entry === 'object' &&
        entry !== null &&
        typeof entry.level === 'number' &&
        typeof entry.variant === 'number' &&
        typeof entry.timestamp === 'number' &&
        entry.level >= 0 &&
        entry.variant >= 0 &&
        entry.variant < 5
      );
    });

    // If we filtered out invalid entries, save the cleaned version
    if (validEntries.length !== parsed.length) {
      console.warn('Cleaned invalid entries from map history');
      saveMapHistory(validEntries);
    }

    return validEntries;
  } catch (error) {
    console.error('Error loading map history from LocalStorage:', error);
    // Try to clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // If we can't even remove, switch to in-memory
      useInMemoryFallback = true;
    }
    return [];
  }
}

/**
 * Saves map history to LocalStorage
 * Falls back to in-memory storage on error
 */
export function saveMapHistory(history: MapHistoryEntry[]): void {
  // Limit history size (FIFO)
  const limitedHistory = history.length > MAX_HISTORY_ENTRIES
    ? history.slice(-MAX_HISTORY_ENTRIES)
    : history;

  if (useInMemoryFallback) {
    inMemoryHistory = [...limitedHistory];
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving map history to LocalStorage:', error);
    console.warn('Falling back to in-memory storage');
    useInMemoryFallback = true;
    inMemoryHistory = [...limitedHistory];
  }
}

/**
 * Selects optimal map variant for a level based on play history
 * Prioritizes unplayed variants, then selects the oldest played variant
 * 
 * @param level - Level number (0-indexed)
 * @param history - Map play history
 * @returns Variant index (0-4)
 */
export function selectMapVariant(level: number, history: MapHistoryEntry[]): number {
  // Filter history for current level
  const levelHistory = history.filter(entry => entry.level === level);

  // If no history for this level, return random variant
  if (levelHistory.length === 0) {
    return Math.floor(Math.random() * 5);
  }

  // Find which variants have been played
  const playedVariants = new Set(levelHistory.map(entry => entry.variant));

  // Find unplayed variants
  const unplayedVariants: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (!playedVariants.has(i)) {
      unplayedVariants.push(i);
    }
  }

  // If there are unplayed variants, choose one randomly
  if (unplayedVariants.length > 0) {
    const randomIndex = Math.floor(Math.random() * unplayedVariants.length);
    return unplayedVariants[randomIndex];
  }

  // All variants have been played, find the oldest one
  const variantTimestamps = new Map<number, number>();
  
  for (const entry of levelHistory) {
    const currentTimestamp = variantTimestamps.get(entry.variant);
    if (currentTimestamp === undefined || entry.timestamp > currentTimestamp) {
      variantTimestamps.set(entry.variant, entry.timestamp);
    }
  }

  // Find variant with oldest (smallest) timestamp
  let oldestVariant = 0;
  let oldestTimestamp = Infinity;

  for (const [variant, timestamp] of variantTimestamps.entries()) {
    if (timestamp < oldestTimestamp) {
      oldestTimestamp = timestamp;
      oldestVariant = variant;
    }
  }

  return oldestVariant;
}

/**
 * Records a map play in the history
 * 
 * @param level - Level number (0-indexed)
 * @param variant - Variant index (0-4)
 * @param history - Current map play history
 * @returns Updated history
 */
export function recordMapPlay(
  level: number,
  variant: number,
  history: MapHistoryEntry[]
): MapHistoryEntry[] {
  const newEntry: MapHistoryEntry = {
    level,
    variant,
    timestamp: Date.now()
  };

  return [...history, newEntry];
}

/**
 * Gets a map based on level and variant from LEVELS_WITH_VARIANTS
 * Falls back to first variant if indices are invalid
 * 
 * @param level - Level number (0-indexed)
 * @param variant - Variant index (0-4)
 * @param levelsWithVariants - The LEVELS_WITH_VARIANTS array
 * @returns GameMap
 */
export function getMap(
  level: number,
  variant: number,
  levelsWithVariants: GameMap[][]
): GameMap {
  try {
    // Validate indices
    if (level < 0 || level >= levelsWithVariants.length) {
      console.error(`Invalid level index: ${level}, falling back to level 0`);
      level = 0;
    }

    const variants = levelsWithVariants[level];
    if (!variants || variant < 0 || variant >= variants.length) {
      console.error(`Invalid variant index: ${variant} for level ${level}, falling back to variant 0`);
      variant = 0;
    }

    return levelsWithVariants[level][variant];
  } catch (error) {
    console.error('Error getting map:', error);
    // Return first map as ultimate fallback
    return levelsWithVariants[0][0];
  }
}
