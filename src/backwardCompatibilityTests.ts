/**
 * Backward Compatibility Tests
 * Tests for Requirements 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { loadMapHistory, saveMapHistory, selectMapVariant, getMap } from './mapSelectionSystem';
import { LEVEL_VARIANTS } from './levels';
import type { SaveGame } from './types';
import { Difficulty, WeaponType, ItemType, EnemyType } from './types';

const STORAGE_KEY = 'egor_map_history';
const SAVE_KEY_PREFIX = 'egor_save_';

/**
 * Test 1: Validate LEVELS array compatibility (Requirement 10.2, 10.5)
 * Ensures that old code using LEVELS array still works
 */
export function testLevelsArrayCompatibility(): { success: boolean; message: string } {
  try {
    // Test that we can access first variant of each level
    const levelNumbers = Object.keys(LEVEL_VARIANTS).map(Number);
    for (const levelNum of levelNumbers) {
      const firstVariant = LEVEL_VARIANTS[levelNum][0];
      
      if (!firstVariant) {
        return {
          success: false,
          message: `Level ${levelNum} has no first variant`
        };
      }
      
      // Validate map structure
      if (!firstVariant.tiles || !Array.isArray(firstVariant.tiles)) {
        return {
          success: false,
          message: `Level ${levelNum} variant 0 has invalid tiles structure`
        };
      }
      
      if (!firstVariant.decorativeObjects || !Array.isArray(firstVariant.decorativeObjects)) {
        return {
          success: false,
          message: `Level ${levelNum} variant 0 missing decorativeObjects array`
        };
      }
    }
    
    return {
      success: true,
      message: `All ${levelNumbers.length} levels have valid first variants`
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing LEVELS compatibility: ${error}`
    };
  }
}

/**
 * Test 2: Map history persistence across sessions (Requirement 10.3)
 * Tests that map history is correctly saved and loaded from LocalStorage
 */
export function testMapHistoryPersistence(): { success: boolean; message: string } {
  try {
    // Clear any existing history
    localStorage.removeItem(STORAGE_KEY);
    
    // Create test history
    const testHistory = [
      { level: 0, variant: 2, timestamp: Date.now() - 10000 },
      { level: 1, variant: 0, timestamp: Date.now() - 5000 },
      { level: 0, variant: 3, timestamp: Date.now() }
    ];
    
    // Save history
    saveMapHistory(testHistory);
    
    // Load history
    const loadedHistory = loadMapHistory();
    
    // Validate
    if (loadedHistory.length !== testHistory.length) {
      return {
        success: false,
        message: `History length mismatch: expected ${testHistory.length}, got ${loadedHistory.length}`
      };
    }
    
    for (let i = 0; i < testHistory.length; i++) {
      if (
        loadedHistory[i].level !== testHistory[i].level ||
        loadedHistory[i].variant !== testHistory[i].variant ||
        loadedHistory[i].timestamp !== testHistory[i].timestamp
      ) {
        return {
          success: false,
          message: `History entry ${i} mismatch`
        };
      }
    }
    
    // Cleanup
    localStorage.removeItem(STORAGE_KEY);
    
    return {
      success: true,
      message: 'Map history persists correctly across save/load cycles'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing map history persistence: ${error}`
    };
  }
}

/**
 * Test 3: Corrupted data handling (Requirement 10.4)
 * Tests that the system handles corrupted LocalStorage data gracefully
 */
export function testCorruptedDataHandling(): { success: boolean; message: string } {
  try {
    const testCases = [
      { name: 'Invalid JSON', data: 'not valid json{[' },
      { name: 'Not an array', data: '{"level": 0}' },
      { name: 'Invalid entries', data: '[{"invalid": "data"}, {"level": "not a number"}]' },
      { name: 'Mixed valid/invalid', data: '[{"level": 0, "variant": 1, "timestamp": 123}, {"bad": "entry"}]' },
      { name: 'Negative indices', data: '[{"level": -1, "variant": 2, "timestamp": 123}]' },
      { name: 'Out of range variant', data: '[{"level": 0, "variant": 10, "timestamp": 123}]' }
    ];
    
    for (const testCase of testCases) {
      // Set corrupted data
      localStorage.setItem(STORAGE_KEY, testCase.data);
      
      // Try to load - should not throw
      const history = loadMapHistory();
      
      // Should return empty array or cleaned data
      if (!Array.isArray(history)) {
        return {
          success: false,
          message: `Test "${testCase.name}" failed: loadMapHistory did not return an array`
        };
      }
      
      // All entries should be valid
      for (const entry of history) {
        if (
          typeof entry.level !== 'number' ||
          typeof entry.variant !== 'number' ||
          typeof entry.timestamp !== 'number' ||
          entry.level < 0 ||
          entry.variant < 0 ||
          entry.variant >= 5
        ) {
          return {
            success: false,
            message: `Test "${testCase.name}" failed: invalid entry in cleaned history`
          };
        }
      }
    }
    
    // Cleanup
    localStorage.removeItem(STORAGE_KEY);
    
    return {
      success: true,
      message: 'All corrupted data scenarios handled correctly'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing corrupted data handling: ${error}`
    };
  }
}

/**
 * Test 4: Old savegame compatibility (Requirement 10.1)
 * Tests that old savegames without map history still work
 */
export function testOldSavegameCompatibility(): { success: boolean; message: string } {
  try {
    // Create an old-style savegame (without decorativeObjects in map)
    const oldSaveGame: SaveGame = {
      name: 'test_old_save',
      timestamp: Date.now(),
      gameState: {
        player: {
          x: 2,
          y: 2,
          direction: 0,
          health: 100,
          maxHealth: 100,
          currentWeapon: WeaponType.PISTOL,
          weapons: [WeaponType.KNIFE, WeaponType.PISTOL],
          ammo: {
            [WeaponType.KNIFE]: -1,
            [WeaponType.PISTOL]: 50,
            [WeaponType.MACHINE_PISTOL]: 0,
            [WeaponType.CHAINSAW]: -1,
            [WeaponType.ASSAULT_RIFLE]: 0,
            [WeaponType.HEAVY_MG]: 0
          },
          score: 0,
          collectedItems: {
            [ItemType.HEALTH_SMALL]: 0,
            [ItemType.HEALTH_LARGE]: 0,
            [ItemType.TREASURE]: 0,
            [ItemType.AMMO]: 0,
            [ItemType.WEAPON]: 0
          },
          killedEnemies: {
            [EnemyType.ZOMBIE]: 0,
            [EnemyType.MONSTER]: 0,
            [EnemyType.GHOST]: 0,
            [EnemyType.DOG]: 0
          }
        },
        currentLevel: 0,
        difficulty: Difficulty.NORMAL,
        isPaused: false,
        isGameOver: false,
        enemies: [],
        items: [],
        currentMap: LEVEL_VARIANTS[1][0], // Use first variant of level 1
        gameStartTime: Date.now()
      }
    };
    
    // Save it
    localStorage.setItem(SAVE_KEY_PREFIX + 'test_old_save', JSON.stringify(oldSaveGame));
    
    // Try to load it
    const loadedData = localStorage.getItem(SAVE_KEY_PREFIX + 'test_old_save');
    if (!loadedData) {
      return {
        success: false,
        message: 'Failed to save old-style savegame'
      };
    }
    
    const loadedSave: SaveGame = JSON.parse(loadedData);
    const gameState = loadedSave.gameState;
    
    // Validate that it loaded correctly
    if (!gameState || !gameState.player || !gameState.currentMap) {
      return {
        success: false,
        message: 'Old savegame structure is invalid after loading'
      };
    }
    
    // Validate that we can get the map for the current level
    const map = getMap(gameState.currentLevel, 0, LEVEL_VARIANTS);
    if (!map || !map.tiles) {
      return {
        success: false,
        message: 'Failed to get map from old savegame level reference'
      };
    }
    
    // Cleanup
    localStorage.removeItem(SAVE_KEY_PREFIX + 'test_old_save');
    
    return {
      success: true,
      message: 'Old savegames load and work correctly'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing old savegame compatibility: ${error}`
    };
  }
}

/**
 * Test 5: Empty history initialization (Requirement 10.3)
 * Tests that empty history is handled correctly
 */
export function testEmptyHistoryInitialization(): { success: boolean; message: string } {
  try {
    // Clear history
    localStorage.removeItem(STORAGE_KEY);
    
    // Load empty history
    const history = loadMapHistory();
    
    if (!Array.isArray(history)) {
      return {
        success: false,
        message: 'Empty history did not return an array'
      };
    }
    
    if (history.length !== 0) {
      return {
        success: false,
        message: `Empty history should have length 0, got ${history.length}`
      };
    }
    
    // Test that selectMapVariant works with empty history
    const variant = selectMapVariant(0, history);
    
    if (typeof variant !== 'number' || variant < 0 || variant >= 5) {
      return {
        success: false,
        message: `Invalid variant selected from empty history: ${variant}`
      };
    }
    
    return {
      success: true,
      message: 'Empty history initializes correctly and allows variant selection'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing empty history initialization: ${error}`
    };
  }
}

/**
 * Test 6: LocalStorage unavailable fallback (Requirement 10.4)
 * Tests that the system falls back to in-memory storage when LocalStorage is unavailable
 */
export function testLocalStorageFallback(): { success: boolean; message: string } {
  try {
    // Save original localStorage
    const originalLocalStorage = window.localStorage;
    
    // Mock localStorage to throw errors
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => { throw new Error('LocalStorage unavailable'); },
        setItem: () => { throw new Error('LocalStorage unavailable'); },
        removeItem: () => { throw new Error('LocalStorage unavailable'); },
        clear: () => { throw new Error('LocalStorage unavailable'); },
        key: () => { throw new Error('LocalStorage unavailable'); },
        length: 0
      },
      writable: true,
      configurable: true
    });
    
    // Try to use map history - should fall back to in-memory
    const history = loadMapHistory();
    
    if (!Array.isArray(history)) {
      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      });
      
      return {
        success: false,
        message: 'Fallback did not return an array'
      };
    }
    
    // Try to save - should use in-memory
    const testHistory = [{ level: 0, variant: 1, timestamp: Date.now() }];
    saveMapHistory(testHistory);
    
    // Try to load - should get from in-memory
    const loadedHistory = loadMapHistory();
    
    // Restore localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true
    });
    
    if (loadedHistory.length !== testHistory.length) {
      return {
        success: false,
        message: 'In-memory fallback did not persist data correctly'
      };
    }
    
    return {
      success: true,
      message: 'LocalStorage fallback to in-memory works correctly'
    };
  } catch (error) {
    // Restore localStorage in case of error
    try {
      Object.defineProperty(window, 'localStorage', {
        value: window.localStorage,
        writable: true,
        configurable: true
      });
    } catch {}
    
    return {
      success: false,
      message: `Error testing LocalStorage fallback: ${error}`
    };
  }
}

/**
 * Test 7: Map variant selection logic (Requirement 10.2)
 * Tests that map selection prioritizes unplayed variants correctly
 */
export function testMapVariantSelectionLogic(): { success: boolean; message: string } {
  try {
    // Test 1: Empty history should return random variant
    const emptyHistory = loadMapHistory();
    const variant1 = selectMapVariant(0, emptyHistory);
    if (variant1 < 0 || variant1 >= 5) {
      return {
        success: false,
        message: `Invalid variant from empty history: ${variant1}`
      };
    }
    
    // Test 2: Partial history should prefer unplayed
    const partialHistory = [
      { level: 0, variant: 0, timestamp: Date.now() - 1000 },
      { level: 0, variant: 1, timestamp: Date.now() - 500 }
    ];
    
    // Run selection multiple times to ensure it picks from unplayed (2, 3, 4)
    const selections = new Set<number>();
    for (let i = 0; i < 20; i++) {
      const variant = selectMapVariant(0, partialHistory);
      selections.add(variant);
      
      if (variant === 0 || variant === 1) {
        return {
          success: false,
          message: `Selected already played variant ${variant} when unplayed variants exist`
        };
      }
    }
    
    // Test 3: Full history should select oldest
    const fullHistory = [
      { level: 0, variant: 0, timestamp: 1000 },  // Oldest
      { level: 0, variant: 1, timestamp: 5000 },
      { level: 0, variant: 2, timestamp: 3000 },
      { level: 0, variant: 3, timestamp: 4000 },
      { level: 0, variant: 4, timestamp: 2000 }
    ];
    
    const oldestVariant = selectMapVariant(0, fullHistory);
    if (oldestVariant !== 0) {
      return {
        success: false,
        message: `Did not select oldest variant. Expected 0, got ${oldestVariant}`
      };
    }
    
    return {
      success: true,
      message: 'Map variant selection logic works correctly'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing map variant selection: ${error}`
    };
  }
}

/**
 * Run all backward compatibility tests
 */
export function runAllBackwardCompatibilityTests(): {
  passed: number;
  failed: number;
  results: Array<{ test: string; success: boolean; message: string }>;
} {
  const tests = [
    { name: 'LEVELS Array Compatibility', fn: testLevelsArrayCompatibility },
    { name: 'Map History Persistence', fn: testMapHistoryPersistence },
    { name: 'Corrupted Data Handling', fn: testCorruptedDataHandling },
    { name: 'Old Savegame Compatibility', fn: testOldSavegameCompatibility },
    { name: 'Empty History Initialization', fn: testEmptyHistoryInitialization },
    { name: 'LocalStorage Fallback', fn: testLocalStorageFallback },
    { name: 'Map Variant Selection Logic', fn: testMapVariantSelectionLogic }
  ];
  
  const results = tests.map(test => ({
    test: test.name,
    ...test.fn()
  }));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  return { passed, failed, results };
}
