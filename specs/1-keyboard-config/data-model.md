# Data Model: Keyboard Configuration

**Feature**: Keyboard Configuration
**Date**: 2025-11-26

## Enums

### ActionType
Defines the abstract actions a player can perform.

```typescript
export enum ActionType {
  MOVE_FORWARD = 'MOVE_FORWARD',
  MOVE_BACKWARD = 'MOVE_BACKWARD',
  STRAFE_LEFT = 'STRAFE_LEFT',
  STRAFE_RIGHT = 'STRAFE_RIGHT',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  SHOOT = 'SHOOT',
  OPEN_DOOR = 'OPEN_DOOR',
  JUMP = 'JUMP', // If applicable
  PAUSE = 'PAUSE',
  TOGGLE_STATS = 'TOGGLE_STATS',
  TOGGLE_MAP = 'TOGGLE_MAP', // If applicable
  // Weapon slots
  WEAPON_1 = 'WEAPON_1',
  WEAPON_2 = 'WEAPON_2',
  WEAPON_3 = 'WEAPON_3',
  WEAPON_4 = 'WEAPON_4',
  WEAPON_5 = 'WEAPON_5',
  WEAPON_6 = 'WEAPON_6'
}
```

### InputProfileType
Defines the preset types.

```typescript
export enum InputProfileType {
  MODERN = 'modern',
  CLASSIC = 'classic',
  CUSTOM = 'custom'
}
```

## Interfaces

### KeyBinding
Maps an action to one or more physical keys.

```typescript
export type KeyBinding = string[]; // Array of KeyboardEvent.key values (e.g. ["w", "ArrowUp"])
```

### ControlProfile
Defines a complete set of bindings.

```typescript
export interface ControlProfile {
  id: InputProfileType;
  name: string;
  description: string;
  bindings: Record<ActionType, KeyBinding>;
  isEditable: boolean; // False for Modern/Classic, True for Custom
}
```

### InputSettings
The persisted state structure.

```typescript
export interface InputSettings {
  activeProfileId: InputProfileType;
  customBindings: Record<ActionType, KeyBinding>; // Only stores the user's custom overrides
  mouseSensitivity?: number; // Future proofing (optional now)
  invertY?: boolean; // Future proofing (optional now)
}
```

## Default Data

### Modern Profile Defaults
```typescript
{
  MOVE_FORWARD: ['w', 'ArrowUp'],
  MOVE_BACKWARD: ['s', 'ArrowDown'],
  STRAFE_LEFT: ['a'],
  STRAFE_RIGHT: ['d'],
  TURN_LEFT: ['ArrowLeft'], // Optional secondary
  TURN_RIGHT: ['ArrowRight'], // Optional secondary
  SHOOT: [' '], // Space often used for shoot in simple engines, or Mouse
  OPEN_DOOR: ['e'],
  // ...
}
```

### Classic Profile Defaults
```typescript
{
  MOVE_FORWARD: ['ArrowUp'],
  MOVE_BACKWARD: ['ArrowDown'],
  TURN_LEFT: ['ArrowLeft'],
  TURN_RIGHT: ['ArrowRight'],
  STRAFE_LEFT: ['Alt+ArrowLeft'], // Wolf3D style often used modifier for strafe
  STRAFE_RIGHT: ['Alt+ArrowRight'],
  SHOOT: ['Control', 'Meta'], // Ctrl (Win) or Command (Mac)
  OPEN_DOOR: [' '], // Spacebar
  // ...
}
```


