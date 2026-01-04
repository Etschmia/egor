import { ActionType, InputProfileType } from './types.ts';
import type { ControlProfile, InputSettings, KeyBinding } from './types.ts';

const DEFAULT_MODERN_PROFILE: ControlProfile = {
  id: InputProfileType.MODERN,
  name: 'Modern (WASD)',
  description: 'Standard WASD controls with Mouse for turning/shooting.',
  isEditable: false,
  bindings: {
    [ActionType.MOVE_FORWARD]: ['w', 'ArrowUp'],
    [ActionType.MOVE_BACKWARD]: ['s', 'ArrowDown'],
    [ActionType.STRAFE_LEFT]: ['a'],
    [ActionType.STRAFE_RIGHT]: ['d'],
    [ActionType.TURN_LEFT]: ['ArrowLeft'],
    [ActionType.TURN_RIGHT]: ['ArrowRight'],
    [ActionType.SHOOT]: [' '],
    [ActionType.OPEN_DOOR]: ['e'],
    [ActionType.JUMP]: [],
    [ActionType.PAUSE]: ['Escape'],
    [ActionType.TOGGLE_STATS]: ['Tab'],
    [ActionType.TOGGLE_MAP]: ['m'],
    [ActionType.WEAPON_1]: ['1'],
    [ActionType.WEAPON_2]: ['2'],
    [ActionType.WEAPON_3]: ['3'],
    [ActionType.WEAPON_4]: ['4'],
    [ActionType.WEAPON_5]: ['5'],
    [ActionType.WEAPON_6]: ['6']
  }
};

const DEFAULT_CLASSIC_PROFILE: ControlProfile = {
  id: InputProfileType.CLASSIC,
  name: 'Classic (Wolf3D)',
  description: 'Retro controls using Arrow keys and modifiers.',
  isEditable: false,
  bindings: {
    [ActionType.MOVE_FORWARD]: ['ArrowUp'],
    [ActionType.MOVE_BACKWARD]: ['ArrowDown'],
    [ActionType.TURN_LEFT]: ['ArrowLeft'],
    [ActionType.TURN_RIGHT]: ['ArrowRight'],
    [ActionType.STRAFE_LEFT]: ['z', ','], // Common strafe keys in old games if no Alt
    [ActionType.STRAFE_RIGHT]: ['c', '.'],
    [ActionType.SHOOT]: ['Control', 'Meta'],
    [ActionType.OPEN_DOOR]: [' '],
    [ActionType.JUMP]: [],
    [ActionType.PAUSE]: ['Escape'],
    [ActionType.TOGGLE_STATS]: ['Tab'],
    [ActionType.TOGGLE_MAP]: ['m'],
    [ActionType.WEAPON_1]: ['1'],
    [ActionType.WEAPON_2]: ['2'],
    [ActionType.WEAPON_3]: ['3'],
    [ActionType.WEAPON_4]: ['4'],
    [ActionType.WEAPON_5]: ['5'],
    [ActionType.WEAPON_6]: ['6']
  }
};

const STORAGE_KEY = 'egor_settings';

export class InputSystem {
  private static instance: InputSystem;
  private activeKeys: Set<string> = new Set();
  private profiles: Record<InputProfileType, ControlProfile>;
  private settings: InputSettings;
  private initialized: boolean = false;

  private constructor() {
    // Detect Mac OS and pre-assign Jump to Option (Alt) key
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
    if (isMac) {
      const altKey = 'Alt';
      // Mute the defaults directly so it applies to initialization and resets
      if (!DEFAULT_MODERN_PROFILE.bindings[ActionType.JUMP].includes(altKey)) {
        DEFAULT_MODERN_PROFILE.bindings[ActionType.JUMP].push(altKey);
      }
      if (!DEFAULT_CLASSIC_PROFILE.bindings[ActionType.JUMP].includes(altKey)) {
        DEFAULT_CLASSIC_PROFILE.bindings[ActionType.JUMP].push(altKey);
      }
    }

    this.profiles = {
      [InputProfileType.MODERN]: DEFAULT_MODERN_PROFILE,
      [InputProfileType.CLASSIC]: DEFAULT_CLASSIC_PROFILE,
      [InputProfileType.CUSTOM]: {
        ...DEFAULT_MODERN_PROFILE,
        id: InputProfileType.CUSTOM,
        name: 'Benutzerdefiniert',
        description: 'Angepasste Tastenbelegung.',
        isEditable: true,
        bindings: { ...DEFAULT_MODERN_PROFILE.bindings } // Deep copy needed?
      }
    };

    // Initialize settings with defaults, will be overwritten by loadSettings
    this.settings = {
      activeProfileId: InputProfileType.MODERN,
      customBindings: {} as Record<ActionType, KeyBinding>
    };
  }

  public static getInstance(): InputSystem {
    if (!InputSystem.instance) {
      InputSystem.instance = new InputSystem();
    }
    return InputSystem.instance;
  }

  public initialize(): void {
    if (this.initialized) return;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.resetKeys); // Clear keys on tab switch

    this.loadSettings();
    this.initialized = true;
    console.log('InputSystem initialized');
  }

  public cleanup(): void {
    if (!this.initialized) return;

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.resetKeys);

    this.initialized = false;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Normalize single letters to lowercase to handle Shift/Caps Lock
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    this.activeKeys.add(key);
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    this.activeKeys.delete(key);
  };

  private resetKeys = (): void => {
    this.activeKeys.clear();
  };

  public isActionActive(action: ActionType): boolean {
    const activeProfile = this.profiles[this.settings.activeProfileId];
    const bindings = activeProfile.bindings[action];

    if (!bindings) return false;

    // Check if any bound key is currently pressed
    for (const key of bindings) {
      // Handle modifiers if needed, but keeping it simple for now
      // If we want to support "Alt+ArrowLeft", we need to parse it.
      // For now, assume single keys.
      if (this.activeKeys.has(key)) {
        return true;
      }
    }

    // Special handling for classic strafing with modifiers if desired, 
    // but sticking to simple keys for T009 as per spec (Action -> Key[]).

    return false;
  }

  public getBoundKeys(action: ActionType): string[] {
    const activeProfile = this.profiles[this.settings.activeProfileId];
    return activeProfile.bindings[action] || [];
  }

  public setProfile(profileId: InputProfileType): void {
    if (this.profiles[profileId]) {
      this.settings.activeProfileId = profileId;
      this.saveSettings();
    }
  }

  public getSettings(): InputSettings {
    return { ...this.settings };
  }

  public remapKey(action: ActionType, key: string): void {
    // Ensure we are editing the custom profile
    const customProfile = this.profiles[InputProfileType.CUSTOM];

    // 1. Remove key from any other action in Custom profile (Auto-overwrite)
    for (const act of Object.values(ActionType)) {
      const bindings = customProfile.bindings[act];
      if (bindings && bindings.includes(key)) {
        customProfile.bindings[act] = bindings.filter(k => k !== key);
      }
    }

    // 2. Add key to new action
    if (!customProfile.bindings[action]) {
      customProfile.bindings[action] = [];
    }
    // Replace existing bindings for this action? Or append?
    // Usually rebind replaces the primary. Let's assume replacement for simplicity or single-key binding.
    // If we want multiple keys, we might need a UI for primary/secondary.
    // For now, let's just add it if not there, maybe clearing others? 
    // Spec says "Remap" implies setting the binding.
    customProfile.bindings[action] = [key];

    this.settings.customBindings = customProfile.bindings;
    this.saveSettings();
  }

  public resetCustomToDefaults(): void {
    this.profiles[InputProfileType.CUSTOM].bindings = { ...DEFAULT_MODERN_PROFILE.bindings };
    this.settings.customBindings = { ...DEFAULT_MODERN_PROFILE.bindings };
    this.saveSettings();
  }

  public loadSettings(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InputSettings;
        // Merge saved settings
        this.settings.activeProfileId = parsed.activeProfileId || InputProfileType.MODERN;

        if (parsed.customBindings) {
          this.settings.customBindings = parsed.customBindings;
          this.profiles[InputProfileType.CUSTOM].bindings = {
            ...DEFAULT_MODERN_PROFILE.bindings, // Start with base
            ...parsed.customBindings // Apply overrides
          };
        }
      }
    } catch (e) {
      console.error('Failed to load input settings:', e);
    }
  }

  public saveSettings(): void {
    try {
      const toSave: InputSettings = {
        activeProfileId: this.settings.activeProfileId,
        customBindings: this.profiles[InputProfileType.CUSTOM].bindings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save input settings:', e);
    }
  }
}

export const inputSystem = InputSystem.getInstance();
