import type { GameState, SaveGame } from './types.ts';

const SAVE_KEY_PREFIX = 'egor_save_';

export function saveGame(gameState: GameState, saveName: string): boolean {
  try {
    const saveGame: SaveGame = {
      name: saveName,
      timestamp: Date.now(),
      gameState: JSON.parse(JSON.stringify(gameState))
    };

    localStorage.setItem(SAVE_KEY_PREFIX + saveName, JSON.stringify(saveGame));
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    return false;
  }
}

export function loadGame(saveName: string): GameState | null {
  try {
    const saveData = localStorage.getItem(SAVE_KEY_PREFIX + saveName);
    if (!saveData) {
      return null;
    }

    const saveGame: SaveGame = JSON.parse(saveData);
    return saveGame.gameState;
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    return null;
  }
}

export function getAllSaveGames(): SaveGame[] {
  const saves: SaveGame[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SAVE_KEY_PREFIX)) {
      try {
        const saveData = localStorage.getItem(key);
        if (saveData) {
          saves.push(JSON.parse(saveData));
        }
      } catch (error) {
        console.error('Fehler beim Laden der Spielstände:', error);
      }
    }
  }

  return saves.sort((a, b) => b.timestamp - a.timestamp);
}

export function deleteSaveGame(saveName: string): boolean {
  try {
    localStorage.removeItem(SAVE_KEY_PREFIX + saveName);
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    return false;
  }
}

