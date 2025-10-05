import { useState, useEffect } from 'react';

export type NewLevelDialogType = 
  | { type: 'newLevel' }
  | { type: 'newVariant', currentLevel: number };

interface NewLevelDialogProps {
  dialogType: NewLevelDialogType | null;
  onSave: (level: number, variant: number) => void;
  onCancel: () => void;
}

export function NewLevelDialog({ dialogType, onSave, onCancel }: NewLevelDialogProps) {
  const [level, setLevel] = useState(1);
  const [variant, setVariant] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when dialog opens
  useEffect(() => {
    if (!dialogType) return;

    if (dialogType.type === 'newLevel') {
      setLevel(1);
      setVariant(1);
    } else if (dialogType.type === 'newVariant') {
      setLevel(dialogType.currentLevel);
      setVariant(1);
    }
    setErrors({});
  }, [dialogType]);

  if (!dialogType) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (level < 1 || level > 999) {
      newErrors.level = 'Level must be between 1 and 999';
    }
    if (variant < 1 || variant > 999) {
      newErrors.variant = 'Variant must be between 1 and 999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(level, variant);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getDialogTitle = () => {
    if (dialogType.type === 'newLevel') {
      return 'Create New Level';
    } else {
      return `Create New Variant for Level ${dialogType.currentLevel}`;
    }
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{getDialogTitle()}</h2>
          <button
            onClick={onCancel}
            style={closeButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldsContainerStyle}>
            {dialogType.type === 'newLevel' && (
              <FormField label="Level Number" error={errors.level}>
                <input
                  type="number"
                  value={level}
                  onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
                  min="1"
                  max="999"
                  style={inputStyle}
                  autoFocus
                />
              </FormField>
            )}
            <FormField label="Variant Number" error={errors.variant}>
              <input
                type="number"
                value={variant}
                onChange={(e) => setVariant(parseInt(e.target.value) || 1)}
                min="1"
                max="999"
                style={inputStyle}
                autoFocus={dialogType.type === 'newVariant'}
              />
            </FormField>
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#1e1e1e', borderRadius: '4px', fontSize: '0.9rem', color: '#aaa' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#ccc' }}>ℹ️ Info:</p>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                A new empty map will be created with:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Default dimensions: 20x20</li>
                <li>Outer walls on all edges</li>
                <li>Floor tiles in the interior</li>
                <li>Player start at position (2, 2)</li>
              </ul>
            </div>
          </div>
          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={onCancel}
              style={cancelButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#444';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1976D2';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2196F3';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper component for form fields
function FormField({ label, error, children }: { label: string, error?: string, children: React.ReactNode }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}

// Styles
const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.2s ease-out',
};

const dialogStyle: React.CSSProperties = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideUp 0.3s ease-out',
};

const headerStyle: React.CSSProperties = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #444',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
};

const fieldsContainerStyle: React.CSSProperties = {
  padding: '1.5rem',
  overflowY: 'auto',
  flex: 1,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  color: '#ccc',
  fontSize: '0.9rem',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  backgroundColor: '#1e1e1e',
  border: '1px solid #444',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
};

const errorStyle: React.CSSProperties = {
  marginTop: '0.25rem',
  color: '#ff6b6b',
  fontSize: '0.85rem',
};

const buttonContainerStyle: React.CSSProperties = {
  padding: '1rem 1.5rem',
  borderTop: '1px solid #444',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#333',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  transform: 'scale(1)',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#2196F3',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontWeight: 500,
  transform: 'scale(1)',
};
