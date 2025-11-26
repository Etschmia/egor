# Tasks: Keyboard Configuration

**Feature Branch**: `1-keyboard-config`
**Spec**: [specs/1-keyboard-config/spec.md](./spec.md)

## Phase 1: Setup
**Goal**: Initialize project structure for input system and types.

- [x] T001 Create `src/inputSystem.ts` with empty class skeleton
- [x] T002 Define `ActionType` enum in `src/types.ts` (move forward, backward, strafe, shoot, etc.)
- [x] T003 Define `InputProfileType` enum and `KeyBinding` type in `src/types.ts`
- [x] T004 Define `ControlProfile` and `InputSettings` interfaces in `src/types.ts`

## Phase 2: Foundational (Input System)
**Goal**: Implement the core input logic replacing direct key listeners.
**Prerequisites**: Phase 1

- [x] T005 [P] Implement `InputSystem` class structure with singleton pattern in `src/inputSystem.ts`
- [x] T006 Implement `initialize()` and `cleanup()` methods with event listeners in `src/inputSystem.ts`
- [x] T007 Implement key state tracking (keydown/keyup) logic in `src/inputSystem.ts`
- [x] T008 Implement default profiles (Modern, Classic) data in `src/inputSystem.ts`
- [x] T009 Implement `isActionActive()` to check key state against active profile in `src/inputSystem.ts`
- [x] T010 Implement `loadSettings()` and `saveSettings()` using localStorage in `src/inputSystem.ts`
- [x] T011 Create unit test file `src/inputSystem.test.ts` to verify profile switching and key resolution

## Phase 3: User Story 1 - Select Key Binding Preset
**Goal**: Allow users to switch between Modern and Classic presets.
**Story**: [US1] Select Key Binding Preset

- [x] T012 [US1] Create `src/components/ConfigMenu.tsx` component structure
- [x] T013 [US1] Implement profile selector dropdown/tabs in `src/components/ConfigMenu.tsx`
- [x] T014 [US1] Connect `ConfigMenu` to `inputSystem.setProfile()`
- [x] T015 [US1] Update `App.tsx` to render `ConfigMenu` when "Konfiguration" is selected
- [x] T016 [US1] Refactor `App.tsx` game loop to use `inputSystem.isActionActive()` instead of `keys` object
- [x] T017 [US1] Verify "Classic" mode controls (Space to open, Ctrl to shoot) in-game

## Phase 4: User Story 2 - Custom Key Bindings
**Goal**: Allow users to rebind keys individually.
**Story**: [US2] Custom Key Bindings

- [x] T018 [US2] Add "Benutzerdefiniert" (Custom) mode logic to `src/inputSystem.ts`
- [x] T019 [US2] Implement `remapKey()` in `src/inputSystem.ts` with auto-overwrite conflict resolution
- [x] T020 [US2] Implement `resetCustomToDefaults()` in `src/inputSystem.ts`
- [x] T021 [US2] Update `ConfigMenu.tsx` to display list of actions and current bindings
- [x] T022 [US2] Implement "Press any key" modal in `ConfigMenu.tsx` for rebinding
- [x] T023 [US2] Add "Reset to Default" button in `ConfigMenu.tsx`
- [x] T024 [US2] [P] Verify custom bindings persist after reload

## Phase 5: User Story 3 - Persistence & Polish
**Goal**: Ensure settings stick and UI is polished.
**Story**: [US3] Persistence & Help Integration

- [x] T025 [US3] Update `saveLoadSystem.ts` to integrate with `inputSystem` persistence if needed (or confirm isolated storage)
- [x] T026 [US3] Refactor Help/Instructions screen in `App.tsx` (or separate component) to use `inputSystem.getBoundKeys()`
- [x] T027 [US3] Add "Konfiguration" button to Main Menu in `App.tsx`
- [x] T028 [US3] Implement "Pause -> Config" flow in `App.tsx`
- [x] T029 [US3] Update `README.md` with new controls documentation

## Implementation Strategy
1. **Refactor First**: Phase 1 & 2 separate input logic from `App.tsx` without changing behavior (using Modern profile as default).
2. **UI Second**: Build the menu to switch profiles.
3. **Customization Last**: Add the complex remapping logic once the system is stable.

## Dependencies
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 depends on Phase 3
- Phase 5 depends on Phase 3 & 4

## Parallel Execution Opportunities
- T012 (UI creation) can run parallel to T005-T010 (Logic implementation)
- T026 (Help screen update) can run parallel to T018-T023 (Custom binding logic)
