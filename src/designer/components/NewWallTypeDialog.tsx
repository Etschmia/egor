import { useState, useEffect, useRef } from 'react';
import type { Theme } from '../types';

interface NewWallTypeDialogProps {
  isOpen: boolean;
  activeTheme: Theme | null;
  onClose: () => void;
  onCreate: (name: string, basedOn?: string) => void;
}

export default function NewWallTypeDialog({
  isOpen,
  activeTheme,
  onClose,
  onCreate,
}: NewWallTypeDialogProps) {
  const [name, setName] = useState('');
  const [basedOn, setBasedOn] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string }>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setBasedOn('');
      setErrors({});
      // Focus name input when dialog opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Validate name
  const validateName = (value: string): string | undefined => {
    if (!value || value.trim() === '') {
      return 'Name is required';
    }

    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }

    if (value.trim().length > 50) {
      return 'Name must be less than 50 characters';
    }

    // Check if name already exists (case-insensitive)
    if (activeTheme) {
      const existingNames = Object.values(activeTheme.wallTypes).map(wt => 
        wt.displayName.toLowerCase()
      );
      if (existingNames.includes(value.trim().toLowerCase())) {
        return 'A wall type with this name already exists';
      }
    }

    return undefined;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleBasedOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBasedOn(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const nameError = validateName(name);
    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    // Create wall type
    onCreate(name.trim(), basedOn || undefined);
    
    // Close dialog
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const wallTypeOptions = activeTheme 
    ? Object.entries(activeTheme.wallTypes).map(([id, wallType]) => ({
        id,
        name: wallType.displayName,
      }))
    : [];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="dialog-backdrop"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-wall-type-title"
      >
        <div className="dialog__content">
          {/* Header */}
          <div className="dialog__header">
            <h2 id="new-wall-type-title" className="dialog__title">
              Create New Wall Type
            </h2>
            <button
              type="button"
              className="dialog__close"
              onClick={handleCancel}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="dialog__body">
            {/* Name Input */}
            <div className="form-field">
              <label htmlFor="wall-type-name" className="form-field__label">
                Name <span className="form-field__required">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="wall-type-name"
                type="text"
                className={`form-field__input ${errors.name ? 'form-field__input--error' : ''}`}
                value={name}
                onChange={handleNameChange}
                placeholder="e.g., Metal, Glass, Marble"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <div id="name-error" className="form-field__error" role="alert">
                  {errors.name}
                </div>
              )}
              <div className="form-field__hint">
                Enter a unique name for the wall type
              </div>
            </div>

            {/* Based On Selector */}
            <div className="form-field">
              <label htmlFor="wall-type-based-on" className="form-field__label">
                Based On (Optional)
              </label>
              <select
                id="wall-type-based-on"
                className="form-field__select"
                value={basedOn}
                onChange={handleBasedOnChange}
              >
                <option value="">Start from scratch</option>
                {wallTypeOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <div className="form-field__hint">
                Copy properties from an existing wall type
              </div>
            </div>

            {/* Footer */}
            <div className="dialog__footer">
              <button
                type="button"
                className="designer-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="designer-button designer-button--primary"
                disabled={!name.trim()}
              >
                Create Wall Type
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
