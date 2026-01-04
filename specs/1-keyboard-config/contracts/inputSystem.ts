/**
 * Input System Contract
 * 
 * Defines the interface for the input management system.
 */

import { ActionType, InputProfileType, ControlProfile, InputSettings } from '../data-model'; // Conceptual import

export interface IInputSystem {
  /**
   * Initializes event listeners and loads settings.
   */
  initialize(): void;

  /**
   * Cleans up event listeners.
   */
  cleanup(): void;

  /**
   * Checks if a specific game action is currently active (button held down).
   * Used in the game loop.
   * 
   * @param action The action to check
   * @returns true if any key bound to this action is pressed
   */
  isActionActive(action: ActionType): boolean;

  /**
   * Gets the list of keys bound to a specific action for the active profile.
   * Useful for displaying "Press [Key] to X" hints.
   * 
   * @param action The action to lookup
   * @returns Array of key names (e.g. ["W", "ArrowUp"])
   */
  getBoundKeys(action: ActionType): string[];

  /**
   * Sets the active input profile.
   * 
   * @param profileId 'modern', 'classic', or 'custom'
   */
  setProfile(profileId: InputProfileType): void;

  /**
   * Gets the current settings configuration.
   */
  getSettings(): InputSettings;

  /**
   * Updates a binding in the CUSTOM profile.
   * Handles conflict resolution automatically (unbinds conflicting actions).
   * 
   * @param action The action to bind
   * @param key The primary key to bind
   */
  remapKey(action: ActionType, key: string): void;

  /**
   * Resets the custom profile to default values (Modern).
   */
  resetCustomToDefaults(): void;

  /**
   * Persists current settings to localStorage.
   */
  saveSettings(): void;
}





