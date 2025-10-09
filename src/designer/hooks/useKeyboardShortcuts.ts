import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsConfig {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNewTheme?: () => void;
  onShowShortcuts?: () => void;
  onEscape?: () => void;
}

/**
 * Hook to manage keyboard shortcuts for the Designer Mode
 * Implements shortcuts while respecting input field focus
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const {
    onSave,
    onUndo,
    onRedo,
    onNewTheme,
    onShowShortcuts,
    onEscape,
  } = config;

  /**
   * Check if the current focused element is an input field
   * Shortcuts (except Escape) should be disabled in input fields
   */
  const isInputFocused = useCallback((): boolean => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    const isContentEditable = activeElement.getAttribute('contenteditable') === 'true';

    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      isContentEditable
    );
  }, []);

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event;
      const isModifierPressed = ctrlKey || metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)

      // Escape always works, even in input fields
      if (key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // F1 always works, even in input fields
      if (key === 'F1' && onShowShortcuts) {
        event.preventDefault();
        onShowShortcuts();
        return;
      }

      // Disable other shortcuts when in input fields
      if (isInputFocused()) {
        return;
      }

      // Ctrl+S / Cmd+S - Save
      if (isModifierPressed && key.toLowerCase() === 's' && onSave) {
        event.preventDefault();
        onSave();
        return;
      }

      // Ctrl+Z / Cmd+Z - Undo
      if (isModifierPressed && key.toLowerCase() === 'z' && onUndo) {
        event.preventDefault();
        onUndo();
        return;
      }

      // Ctrl+Y / Cmd+Y - Redo
      if (isModifierPressed && key.toLowerCase() === 'y' && onRedo) {
        event.preventDefault();
        onRedo();
        return;
      }

      // Ctrl+N / Cmd+N - New Theme
      if (isModifierPressed && key.toLowerCase() === 'n' && onNewTheme) {
        event.preventDefault();
        onNewTheme();
        return;
      }
    },
    [onSave, onUndo, onRedo, onNewTheme, onShowShortcuts, onEscape, isInputFocused]
  );

  /**
   * Register and cleanup keyboard event listener
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * List of available keyboard shortcuts for display in UI
 */
export const KEYBOARD_SHORTCUTS = [
  {
    key: 'Ctrl+S',
    mac: '⌘S',
    description: 'Save current theme',
    category: 'File Operations',
  },
  {
    key: 'Ctrl+N',
    mac: '⌘N',
    description: 'Create new theme',
    category: 'File Operations',
  },
  {
    key: 'Ctrl+Z',
    mac: '⌘Z',
    description: 'Undo last change',
    category: 'Editing',
  },
  {
    key: 'Ctrl+Y',
    mac: '⌘Y',
    description: 'Redo last undone change',
    category: 'Editing',
  },
  {
    key: 'F1',
    mac: 'F1',
    description: 'Show keyboard shortcuts',
    category: 'Help',
  },
  {
    key: 'Escape',
    mac: 'Esc',
    description: 'Close dialogs and modals',
    category: 'Navigation',
  },
] as const;
