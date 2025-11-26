# Feature Specification: Keyboard Configuration

**Feature Branch**: `1-keyboard-config`
**Created**: 2025-11-26
**Status**: Draft
**Input**: User description: "Das Hauptmenü das zum Start des Piels erscheint soll ein neues Auswahlfeld bekommen: "Konfiguration". Dahinter kommen später mehrere EInstellmöglichkeiten, fürs Erste planen wir eine Einstellmöglichkeit für die Tastaturbelegung. Sie hat drei Optionen: Modern, Klassich, Benutzerdefiniert. "Modern" ist die jetzige Tastaturbelegung und vorausgewählt wenn noch nie eine Auswahl getroffen wurde. "Klassisch" bedeutet: Die Leertaste verhält sich wie die E- Taste zum Tür öffnen, Geschossen wird mit ctrl (Windows) oder command (Mac) sowie linker Maustaste. Ausserdem kann mit Cursortaste links und rechts sich in diese Richtung bewegt werden. "Benutzerdefiniert": der Nutzer kann für jede Aktion selbst die entsprechende Taste definieren. Es gibt einen Button zum Speichern und einem zum Abbrechen / Rückkehr ins Hauptmenü. Die Auswahl wird im LocalStorage persistent gespeichert. Natürlich soll das Hilfemenü dann ebenso dynamisch immer die aktuelle Tastaturbelegung anzeigen. Wenn fertig, aktualisiere entsprechend das README.md um diese Information."

## Clarifications

### Session 2025-11-26
- Q: How should key conflicts be handled in Custom mode? -> A: Auto-overwrite: New assignment clears any conflict; old action becomes unbound.
- Q: Should there be a "Reset to Defaults" option in Custom mode? -> A: Add Reset Button: Button to restore default bindings within Custom mode.
- Q: Should actions support multiple key bindings? -> A: Multi-Key: Allow 2+ keys per action (primary/secondary).
- Q: Should configuration be accessible during gameplay? -> A: In-Game Access: Allow accessing Config from the pause menu during gameplay.
- Q: Should mouse buttons be remappable in Custom mode? -> A: Block Mouse Binding: Restrict bindings to keyboard keys only (safest).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Key Binding Preset (Priority: P1)

As a player, I want to choose between "Modern" and "Classic" control schemes so that I can play with a layout that feels comfortable or nostalgic.

**Why this priority**: Core requirement to support different playstyles and the requested "Classic" mode.

**Independent Test**: Can be tested by changing the setting in the menu and verifying controls in-game without needing the custom binding UI.

**Acceptance Scenarios**:

1. **Given** I am in the Main Menu, **When** I click "Konfiguration", **Then** I see the "Tastaturbelegung" options.
2. **Given** I have never changed settings, **When** I view the options, **Then** "Modern" is selected by default.
3. **Given** I select "Klassisch", **When** I save and start the game, **Then** Spacebar opens doors, Ctrl/Cmd shoots, and Arrow keys move the player.
4. **Given** I select "Modern", **When** I save and start the game, **Then** the original default controls (WASD, etc.) apply.

---

### User Story 2 - Custom Key Bindings (Priority: P2)

As a player, I want to define custom keys for each action so that I can optimize the controls for my specific hardware or preference.

**Why this priority**: Provides accessibility and maximum flexibility for users who don't like the presets.

**Independent Test**: Can be tested by assigning random keys to actions and verifying they work in-game.

**Acceptance Scenarios**:

1. **Given** I select "Benutzerdefiniert", **When** I click on an action (e.g., "Move Forward"), **Then** the system waits for my key press.
2. **Given** I press a key (e.g., 'P'), **When** the system registers it, **Then** 'P' is assigned to that action.
3. **Given** I have assigned custom keys, **When** I save, **Then** these bindings are active in the game.
4. **Given** I have messed up my bindings, **When** I click "Reset to Default", **Then** the bindings revert to the "Modern" preset values.

---

### User Story 3 - Persistence & Help Integration (Priority: P3)

As a player, I want my settings to be saved and reflected in the help menu so that I don't have to reconfigure every time and can always check my current controls.

**Why this priority**: Polish and usability requirement.

**Independent Test**: Can be tested by reloading the page and checking LocalStorage/Menu, and by opening the Help screen.

**Acceptance Scenarios**:

1. **Given** I have saved a configuration, **When** I reload the page, **Then** my configuration is still selected.
2. **Given** I have changed my controls (e.g., to Classic), **When** I open the in-game Help/Instructions, **Then** the displayed keys match my selected configuration.
3. **Given** I make changes but click "Abbrechen" (Cancel), **When** I return to the menu, **Then** the previous settings are restored.
4. **Given** I am playing the game and press 'P' (Pause), **When** I select "Konfiguration", **Then** I can change settings without losing my game progress.

### Edge Cases

- **Conflict Handling**: When a user assigns a key already in use to a new action, the system **MUST automatically unbind the previous action** to resolve the conflict (Auto-overwrite).
- **Missing Keys**: What if a user leaves an action unbound?
- **Menu Navigation**: Ensure Esc or menu keys are not unbound to the point where the user is stuck.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Main Menu MUST include a "Konfiguration" button.
- **FR-002**: The Configuration screen MUST allow selecting a "Tastaturbelegung" mode: "Modern", "Klassisch", or "Benutzerdefiniert".
- **FR-003**: "Modern" mode MUST use the existing default bindings (WASD movement, E to interact, Mouse to shoot/look).
- **FR-004**: "Klassisch" mode MUST map:
    - Spacebar -> Open Door / Interact
    - Ctrl (Windows) OR Command (Mac) -> Shoot
    - Left Mouse Button -> Shoot (Hardcoded/Default, not remappable in custom)
    - Arrow Left/Right -> Rotate/Move Left/Right (Strafe or Turn depending on classic interpretation, usually Turn in Wolf3D, but likely Strafe/Move in this engine context. Spec says "move in this direction").
    - Arrow Up/Down -> Move Forward/Backward (Implied by "Arrow keys").
- **FR-005**: "Benutzerdefiniert" mode MUST allow remapping all game actions (Move Forward/Back/Left/Right, Shoot, Interact, etc.).
- **FR-006**: The system MUST persist the selected configuration to `localStorage`.
- **FR-007**: The Help/Instructions screen MUST dynamically display the currently active key bindings.
- **FR-008**: There MUST be a "Speichern" (Save) button to apply changes and return to the main menu.
- **FR-009**: There MUST be an "Abbrechen" (Cancel) button to discard changes and return to the main menu.
- **FR-010**: README.md MUST be updated with the new control options.
- **FR-011**: In "Benutzerdefiniert" mode, assigning a key already mapped to another action MUST automatically remove the binding from the previous action (no duplicates allowed).
- **FR-012**: The "Benutzerdefiniert" screen MUST include a "Reset to Default" button that restores bindings to the "Modern" preset defaults.
- **FR-013**: The key binding system MUST support multiple keys per action (primary and secondary bindings) to allow flexibility (e.g., arrow keys AND WASD).
- **FR-014**: The Configuration menu MUST be accessible from the in-game pause menu, allowing changes during gameplay.
- **FR-015**: Mouse button bindings (Left/Right Click) MUST be treated as fixed/separate from keyboard bindings in the Custom UI to prevent UI lockouts (users cannot rebind mouse clicks to keyboard keys or vice versa in this iteration).

### Key Entities

- **ControlProfile**: Object defining the mapping of Action -> Key(s).
- **Settings**: Global state object holding the current profile preference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully switch to "Classic" mode and open a door using the Spacebar.
- **SC-002**: Users can successfully map a custom key (e.g., 'P' for Shoot) and use it in-game.
- **SC-003**: Reloading the browser retains the selected control scheme (verified via LocalStorage inspection or UI state).
- **SC-004**: The Help screen accurately reflects the current bindings (100% match with active settings).
