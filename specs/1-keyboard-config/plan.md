# Implementation Plan - [1-keyboard-config]

## Technical Context

### Frontend Components
- **`App.tsx`**: Central component handling the menu state and rendering. Needs updates to render the new "Konfiguration" menu and handle state transitions.
- **`gameEngine.ts`**: Handles core game logic. Input handling logic is currently in `App.tsx` but might need to consult a central configuration.
- **`types.ts`**: Need to define types for `ControlProfile`, `KeyBinding`, and `InputSettings`.
- **`inputSystem.ts` (New)**: A new module to centralize input handling, replacing the direct event listeners in `App.tsx`. This will manage the active profile and provide an abstraction layer for "Action -> Key" mapping.

### Data Model
- **`ControlProfile` Interface**:
  - `id`: string (e.g., 'modern', 'classic', 'custom')
  - `name`: string
  - `bindings`: Record<ActionType, string[]> (Map actions to arrays of key codes)
- **`Settings` Interface**:
  - `activeProfileId`: string
  - `customBindings`: Record<ActionType, string[]> (User's custom definition)

### Storage
- **`localStorage`**: Used to persist the user's choice (`settings`). Key: `egor_settings`.

### Unknowns & Risks
- **Input Handling Refactor**: The current input handling is tightly coupled in `App.tsx`. Extracting this to a dedicated system (`inputSystem.ts`) is a "refactor-first" approach to ensure clean implementation of remapping.
- **Risk**: Regression in movement/combat if the new input system doesn't exactly match the old behavior (e.g., key repeat rates, simultaneous key presses).
- **Mitigation**: Implement `inputSystem.ts` to mimic the `keys` object behavior used in `App.tsx` (tracking key down/up states) so the game loop logic requires minimal changes.

## Constitution Check

### Compliance Integration
- [x] **Documented**: Plan includes updating `README.md` and creating `docs/` for input system.
- [x] **Standards**: Uses strict TypeScript, avoids `any`, follows file naming conventions.
- [x] **Testing**: Plan includes testing the new input system independently and via manual regression tests.
- [x] **Architecture**: Separation of concerns by introducing `inputSystem.ts` instead of cluttering `App.tsx` further.
- [x] **Deprecation**: No new dependencies, just standard DOM events.

## Phase 1: Design & Contracts

### Step 1.1: Data Model Design (`data-model.md`)
- Define `ActionType` enum (MOVE_FORWARD, SHOOT, INTERACT, etc.).
- Define `KeyBinding` structure.
- Define defaults for "Modern" and "Classic".

### Step 1.2: Module Interface Design (`contracts/inputSystem.ts`)
- **`InputSystem` Class/Module**:
  - `initialize()`: Set up listeners.
  - `cleanup()`: Remove listeners.
  - `isActionActive(action: ActionType): boolean`: The core check for the game loop.
  - `rebind(action, key)`: For custom config.
  - `setProfile(profileId)`: Switch presets.
  - `getSaveData()` / `loadSaveData()`: Persistence.

### Step 1.3: Component Architecture
- **`ConfigMenu.tsx`**: New component for the UI.
  - Tabs/Dropdown for Profile (Modern/Classic/Custom).
  - Key mapping list (for Custom).
  - Conflict resolution logic (visual feedback).

## Phase 2: Implementation Breakdown

### Step 2.1: Core Input System Refactor
1. Create `src/inputSystem.ts`.
2. Implement `ActionType` enum and default profiles in `src/types.ts` or `src/inputSystem.ts`.
3. Port existing key tracking logic from `App.tsx` to `InputSystem`.
4. Replace `keys['w']` checks in `App.tsx` with `inputSystem.isActionActive(ActionType.MOVE_FORWARD)`.

### Step 2.2: Configuration UI
1. Create `src/menus/ConfigMenu.tsx` (or inside `App.tsx` if small, but better separate).
2. Implement the layout: Profile selector, list of actions, key binding buttons.
3. Implement "Press any key" modal for rebinding.
4. Implement "Reset to Defaults" button.

### Step 2.3: Persistence & Integration
1. Update `saveLoadSystem.ts` or add `settingsSystem.ts` to load/save input config on startup.
2. Ensure `InputSystem` initializes with saved settings.
3. Update Help/HUD to show dynamic keys (e.g., "Press [E] to Open" becomes "Press [Space] to Open").

### Step 2.4: Documentation
1. Update `README.md`.
2. Create `docs/INPUT_SYSTEM.md`.

## Phase 3: Verification

### Test Plan
- **Automated**: Unit tests for `InputSystem` (mapping logic, conflict resolution).
- **Manual**:
  - Verify "Modern" behaves exactly as before.
  - Verify "Classic" moves with arrows, shoots with Ctrl/Mouse.
  - Verify Custom bindings work and persist after reload.
  - Verify in-game Pause -> Config menu flow.
