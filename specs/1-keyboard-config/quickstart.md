# Quickstart: Keyboard Configuration

## Overview
This feature introduces a centralized `InputSystem` that abstracts raw key presses into game actions (`ActionType`). This allows for remappable controls and different input profiles (Modern vs. Classic).

## Key Components
- `src/inputSystem.ts`: Singleton class handling event listeners and key state.
- `src/types.ts`: Contains `ActionType` enum and `InputProfileType`.
- `src/menus/ConfigMenu.tsx`: UI for changing settings.

## Usage in Game Loop
Instead of checking specific keys:
```typescript
// OLD
if (keys['w'] || keys['ArrowUp']) { ... }

// NEW
import { inputSystem } from './inputSystem';
import { ActionType } from './types';

if (inputSystem.isActionActive(ActionType.MOVE_FORWARD)) { ... }
```

## Adding a New Action
1. Add entry to `ActionType` enum in `src/types.ts`.
2. Add default bindings in `src/inputSystem.ts` (`DEFAULT_PROFILES`).
3. Use `inputSystem.isActionActive(ActionType.NEW_ACTION)` in code.

## Testing
1. **Manual**: Open `test-input-system.html` (created during implementation) or run the game and switch profiles.
2. **Verification**: Switch to "Classic", verify Spacebar opens doors and Ctrl shoots.

