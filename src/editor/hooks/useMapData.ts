import { useState, useCallback, useRef } from 'react';
import type { GameMap } from '../../types';

// Command interface for undo/redo pattern
interface Command {
  execute: () => GameMap;
  undo: () => GameMap;
  description: string;
}

// History entry containing the command and the state after execution
interface HistoryEntry {
  command: Command;
  mapData: GameMap;
}

interface UseMapDataReturn {
  mapData: GameMap | null;
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  setMapData: (mapData: GameMap | null) => void;
  updateMapData: (updater: (prev: GameMap) => GameMap, description: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  markAsSaved: () => void;
}

const MAX_HISTORY_SIZE = 50;

export function useMapData(): UseMapDataReturn {
  const [mapData, setMapDataState] = useState<GameMap | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // History stacks for undo/redo
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);
  
  // Track the saved state to determine if dirty
  const savedStateRef = useRef<GameMap | null>(null);

  // Set map data (used when loading a new level)
  const setMapData = useCallback((newMapData: GameMap | null) => {
    setMapDataState(newMapData);
    savedStateRef.current = newMapData;
    setIsDirty(false);
    // Clear history when loading a new level
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  // Update map data with undo/redo support
  const updateMapData = useCallback((
    updater: (prev: GameMap) => GameMap,
    description: string
  ) => {
    if (!mapData) return;

    const previousMapData = mapData;
    const newMapData = updater(previousMapData);

    // Create command for this change
    const command: Command = {
      execute: () => newMapData,
      undo: () => previousMapData,
      description,
    };

    // Add to undo stack
    const historyEntry: HistoryEntry = {
      command,
      mapData: newMapData,
    };

    undoStack.current.push(historyEntry);

    // Limit history size
    if (undoStack.current.length > MAX_HISTORY_SIZE) {
      undoStack.current.shift();
    }

    // Clear redo stack when a new action is performed
    redoStack.current = [];

    // Update state
    setMapDataState(newMapData);
    setIsDirty(true);
  }, [mapData]);

  // Undo last action
  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;

    const lastEntry = undoStack.current.pop()!;
    const previousMapData = lastEntry.command.undo();

    // Add to redo stack
    redoStack.current.push(lastEntry);

    // Update state
    setMapDataState(previousMapData);
    
    // Check if we're back to saved state
    const isBackToSaved = JSON.stringify(previousMapData) === JSON.stringify(savedStateRef.current);
    setIsDirty(!isBackToSaved && undoStack.current.length > 0);
  }, []);

  // Redo last undone action
  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;

    const lastEntry = redoStack.current.pop()!;
    const redoneMapData = lastEntry.command.execute();

    // Add back to undo stack
    undoStack.current.push(lastEntry);

    // Update state
    setMapDataState(redoneMapData);
    setIsDirty(true);
  }, []);

  // Clear history (useful when loading a new level)
  const clearHistory = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  // Mark current state as saved
  const markAsSaved = useCallback(() => {
    savedStateRef.current = mapData;
    setIsDirty(false);
  }, [mapData]);

  return {
    mapData,
    isDirty,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    setMapData,
    updateMapData,
    undo,
    redo,
    clearHistory,
    markAsSaved,
  };
}
