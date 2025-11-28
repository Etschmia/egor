# Research: Keyboard Configuration System

**Feature**: Keyboard Configuration
**Date**: 2025-11-26
**Status**: Complete

## Decisions & Rationale

### Decision 1: Centralized Input System (`InputSystem` class)
**Decision**: Refactor input handling from `App.tsx` into a dedicated `InputSystem` singleton/module.
**Rationale**:
- **Separation of Concerns**: `App.tsx` currently mixes rendering, game loop, and raw input event handling. Moving this out adheres to the architecture principle of separating systems.
- **Abstraction**: The game loop shouldn't know about specific keys (e.g., `keys['w']`). It should check for *intent* (e.g., `isActionActive(MOVE_FORWARD)`). This makes supporting multiple profiles (Modern vs. Classic) trivial.
- **Testability**: An isolated input system can be unit-tested for conflict resolution and profile switching without spinning up the entire React app.

### Decision 2: Action-Based Mapping
**Decision**: Map `ActionType` (enum) to `Key[]` (array of strings).
**Rationale**:
- **Flexibility**: Allows multiple keys per action (e.g., WASD *and* Arrows active simultaneously in Modern mode if desired, or primary/secondary bindings).
- **Clarity**: Code becomes readable (`if (input.is(Action.JUMP))` vs `if (keys[' '] || keys['space'])`).

### Decision 3: "Auto-Overwrite" Conflict Resolution
**Decision**: When a user assigns a key that is already bound, the old binding is silently removed (or moved to "unbound").
**Rationale**:
- **UX Simplicity**: Prevents users from getting stuck in "conflict hell" where they have to unbind X to bind Y.
- **Standard Practice**: Common in FPS games.

### Decision 4: LocalStorage for Persistence
**Decision**: Save settings under `egor_settings` key in LocalStorage.
**Rationale**:
- **Simplicity**: No backend required.
- **Persistence**: Survives page reloads, fulfilling the requirement.

## Alternatives Considered

### Alternative 1: Direct `App.tsx` Modification
**Idea**: Keep `keys` state in `App.tsx` and just add a mapping layer there.
**Pros**: Less refactoring initially.
**Cons**: Bloats `App.tsx` further; makes dynamic help text harder to centralized; violates "separation of concerns" principle in the long run. **Rejected.**

### Alternative 2: 'InputContext' (React Context)
**Idea**: Wrap the game in a React Context provider for input.
**Pros**: "React-way" of doing things.
**Cons**: The game loop runs in `requestAnimationFrame` and often needs high-performance synchronous access to input state without React render cycle overhead. A mutable singleton or ref-based system is better for game loops. **Rejected** (though the UI will read from it).

## Implementation Details (Refined)

- **Input State**: Use a `Set<string>` or `Record<string, boolean>` for currently held keys to ensure O(1) lookups in the hot loop.
- **Profiles**:
  - `MODERN`: WASD + Mouse, E interact, Space Jump/Shoot (depending on existing mechanics).
  - `CLASSIC`: Arrows, Ctrl/Alt/Space mapping as specified.


