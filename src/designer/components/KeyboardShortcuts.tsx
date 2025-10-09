import { useEffect, useRef } from 'react';
import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal dialog displaying all available keyboard shortcuts
 * Organized by category with platform-specific key labels
 */
export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Detect if user is on Mac
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap - focus first element when opened
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const closeButton = dialogRef.current.querySelector('button');
      closeButton?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Group shortcuts by category
  const groupedShortcuts = KEYBOARD_SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof KEYBOARD_SHORTCUTS>);

  return (
    <>
      {/* Backdrop */}
      <div className="dialog-backdrop" aria-hidden="true" />

      {/* Dialog */}
      <div
        className="dialog keyboard-shortcuts-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
        ref={dialogRef}
      >
        <div className="dialog__content">
          {/* Header */}
          <div className="dialog__header">
            <h2 id="keyboard-shortcuts-title" className="dialog__title">
              Keyboard Shortcuts
            </h2>
            <button
              type="button"
              className="dialog__close"
              onClick={onClose}
              aria-label="Close keyboard shortcuts"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="dialog__body">
            <div className="keyboard-shortcuts__intro">
              Use these keyboard shortcuts to work more efficiently in Designer Mode.
            </div>

            {/* Shortcuts Grid by Category */}
            <div className="keyboard-shortcuts__categories">
              {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                <div key={category} className="keyboard-shortcuts__category">
                  <h3 className="keyboard-shortcuts__category-title">{category}</h3>
                  <div className="keyboard-shortcuts__list">
                    {shortcuts.map((shortcut, index) => (
                      <div key={index} className="keyboard-shortcuts__item">
                        <div className="keyboard-shortcuts__description">
                          {shortcut.description}
                        </div>
                        <div className="keyboard-shortcuts__keys">
                          <kbd className="keyboard-shortcuts__key">
                            {isMac ? shortcut.mac : shortcut.key}
                          </kbd>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="keyboard-shortcuts__note">
              <strong>Note:</strong> Most shortcuts are disabled when typing in input fields,
              except for <kbd className="keyboard-shortcuts__key-inline">Escape</kbd> and{' '}
              <kbd className="keyboard-shortcuts__key-inline">F1</kbd>.
            </div>
          </div>

          {/* Footer */}
          <div className="dialog__footer">
            <button
              type="button"
              className="designer-button designer-button--primary"
              onClick={onClose}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
