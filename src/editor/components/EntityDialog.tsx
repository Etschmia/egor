import { useState, useEffect } from 'react';
import type { Enemy, Item, DecorativeObject, WallPicture, EnemyType, ItemType, DecorativeObjectType, WallPictureType, WeaponType } from '../../types';

// Dialog types
export type EntityDialogType = 
  | { type: 'enemy', entity?: Enemy, position?: { x: number, y: number } }
  | { type: 'item', entity?: Item, position?: { x: number, y: number } }
  | { type: 'decorative', entity?: DecorativeObject, position?: { x: number, y: number } }
  | { type: 'wallPicture', entity?: WallPicture, position?: { x: number, y: number } }
  | { type: 'playerStart', direction?: number, position?: { x: number, y: number } };

interface EntityDialogProps {
  dialogType: EntityDialogType | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function EntityDialog({ dialogType, onSave, onCancel }: EntityDialogProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when dialog opens
  useEffect(() => {
    if (!dialogType) return;

    switch (dialogType.type) {
      case 'enemy':
        setFormData({
          type: dialogType.entity?.type || 'ZOMBIE',
          x: dialogType.entity?.x ?? dialogType.position?.x ?? 0,
          y: dialogType.entity?.y ?? dialogType.position?.y ?? 0,
          health: dialogType.entity?.health || 100,
          maxHealth: dialogType.entity?.maxHealth || 100,
          damage: dialogType.entity?.damage || 10,
          speed: dialogType.entity?.speed || 1,
        });
        break;
      case 'item':
        setFormData({
          type: dialogType.entity?.type || 'HEALTH_SMALL',
          x: dialogType.entity?.x ?? dialogType.position?.x ?? 0,
          y: dialogType.entity?.y ?? dialogType.position?.y ?? 0,
          value: dialogType.entity?.value || 25,
          weaponType: dialogType.entity?.weaponType || 'PISTOL',
        });
        break;
      case 'decorative':
        setFormData({
          type: dialogType.entity?.type || 'VASE',
          x: dialogType.entity?.x ?? dialogType.position?.x ?? 0,
          y: dialogType.entity?.y ?? dialogType.position?.y ?? 0,
          colorVariant: dialogType.entity?.colorVariant || 0,
          collisionRadius: dialogType.entity?.collisionRadius || 0.3,
          renderHeight: dialogType.entity?.renderHeight || 0.5,
        });
        break;
      case 'wallPicture':
        setFormData({
          type: dialogType.entity?.type || 'PORTRAIT',
          x: dialogType.entity?.x ?? dialogType.position?.x ?? 0,
          y: dialogType.entity?.y ?? dialogType.position?.y ?? 0,
          side: dialogType.entity?.side || 0,
          offset: dialogType.entity?.offset || 0.5,
        });
        break;
      case 'playerStart':
        setFormData({
          direction: dialogType.direction ?? 0,
          x: dialogType.position?.x ?? 0,
          y: dialogType.position?.y ?? 0,
        });
        break;
    }
    setErrors({});
  }, [dialogType]);

  if (!dialogType) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!dialogType) return false;

    switch (dialogType.type) {
      case 'enemy':
        if (formData.health <= 0) newErrors.health = 'Health must be greater than 0';
        if (formData.maxHealth <= 0) newErrors.maxHealth = 'Max health must be greater than 0';
        if (formData.health > formData.maxHealth) newErrors.health = 'Health cannot exceed max health';
        if (formData.damage < 0) newErrors.damage = 'Damage cannot be negative';
        if (formData.speed <= 0) newErrors.speed = 'Speed must be greater than 0';
        if (formData.x < 0) newErrors.x = 'X coordinate cannot be negative';
        if (formData.y < 0) newErrors.y = 'Y coordinate cannot be negative';
        break;
      case 'item':
        if (formData.x < 0) newErrors.x = 'X coordinate cannot be negative';
        if (formData.y < 0) newErrors.y = 'Y coordinate cannot be negative';
        if (formData.value !== undefined && formData.value < 0) {
          newErrors.value = 'Value cannot be negative';
        }
        break;
      case 'decorative':
        if (formData.x < 0) newErrors.x = 'X coordinate cannot be negative';
        if (formData.y < 0) newErrors.y = 'Y coordinate cannot be negative';
        if (formData.collisionRadius < 0) newErrors.collisionRadius = 'Collision radius cannot be negative';
        if (formData.renderHeight !== undefined && formData.renderHeight < 0) {
          newErrors.renderHeight = 'Render height cannot be negative';
        }
        break;
      case 'wallPicture':
        if (formData.x < 0) newErrors.x = 'X coordinate cannot be negative';
        if (formData.y < 0) newErrors.y = 'Y coordinate cannot be negative';
        if (formData.offset < 0 || formData.offset > 1) {
          newErrors.offset = 'Offset must be between 0 and 1';
        }
        break;
      case 'playerStart':
        if (formData.direction < 0 || formData.direction >= 360) {
          newErrors.direction = 'Direction must be between 0 and 359 degrees';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const renderFormFields = () => {
    if (!dialogType) return null;

    switch (dialogType.type) {
      case 'enemy':
        return (
          <>
            <FormField label="Enemy Type" error={errors.type}>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as EnemyType)}
                style={selectStyle}
              >
                <option value="ZOMBIE">Zombie</option>
                <option value="MONSTER">Monster</option>
                <option value="GHOST">Ghost</option>
                <option value="DOG">Dog</option>
              </select>
            </FormField>
            <FormField label="X Position" error={errors.x}>
              <input
                type="number"
                value={formData.x}
                onChange={(e) => handleChange('x', parseFloat(e.target.value))}
                step="0.5"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Y Position" error={errors.y}>
              <input
                type="number"
                value={formData.y}
                onChange={(e) => handleChange('y', parseFloat(e.target.value))}
                step="0.5"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Health" error={errors.health}>
              <input
                type="number"
                value={formData.health}
                onChange={(e) => handleChange('health', parseInt(e.target.value))}
                min="1"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Max Health" error={errors.maxHealth}>
              <input
                type="number"
                value={formData.maxHealth}
                onChange={(e) => handleChange('maxHealth', parseInt(e.target.value))}
                min="1"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Damage" error={errors.damage}>
              <input
                type="number"
                value={formData.damage}
                onChange={(e) => handleChange('damage', parseInt(e.target.value))}
                min="0"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Speed" error={errors.speed}>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
                step="0.1"
                min="0.1"
                style={inputStyle}
              />
            </FormField>
          </>
        );

      case 'item':
        return (
          <>
            <FormField label="Item Type" error={errors.type}>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as ItemType)}
                style={selectStyle}
              >
                <option value="HEALTH_SMALL">Health (Small)</option>
                <option value="HEALTH_LARGE">Health (Large)</option>
                <option value="TREASURE">Treasure</option>
                <option value="AMMO">Ammo</option>
                <option value="WEAPON">Weapon</option>
              </select>
            </FormField>
            <FormField label="X Position" error={errors.x}>
              <input
                type="number"
                value={formData.x}
                onChange={(e) => handleChange('x', parseFloat(e.target.value))}
                step="0.5"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Y Position" error={errors.y}>
              <input
                type="number"
                value={formData.y}
                onChange={(e) => handleChange('y', parseFloat(e.target.value))}
                step="0.5"
                style={inputStyle}
              />
            </FormField>
            {formData.type === 'WEAPON' && (
              <FormField label="Weapon Type" error={errors.weaponType}>
                <select
                  value={formData.weaponType}
                  onChange={(e) => handleChange('weaponType', e.target.value as WeaponType)}
                  style={selectStyle}
                >
                  <option value="KNIFE">Knife</option>
                  <option value="PISTOL">Pistol</option>
                  <option value="MACHINE_PISTOL">Machine Pistol</option>
                  <option value="CHAINSAW">Chainsaw</option>
                  <option value="ASSAULT_RIFLE">Assault Rifle</option>
                  <option value="HEAVY_MG">Heavy MG</option>
                </select>
              </FormField>
            )}
            {(formData.type === 'HEALTH_SMALL' || formData.type === 'HEALTH_LARGE' || 
              formData.type === 'TREASURE' || formData.type === 'AMMO') && (
              <FormField label="Value" error={errors.value}>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleChange('value', parseInt(e.target.value))}
                  min="0"
                  style={inputStyle}
                />
              </FormField>
            )}
          </>
        );

      case 'decorative':
        return (
          <>
            <FormField label="Object Type" error={errors.type}>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as DecorativeObjectType)}
                style={selectStyle}
              >
                <option value="CEILING_LIGHT">Ceiling Light</option>
                <option value="VASE">Vase</option>
                <option value="CRATE">Crate</option>
                <option value="BENCH">Bench</option>
                <option value="TABLE">Table</option>
                <option value="CHAIR">Chair</option>
                <option value="WINE_BOTTLE">Wine Bottle</option>
                <option value="SKELETON">Skeleton</option>
              </select>
            </FormField>
            <FormField label="X Position" error={errors.x}>
              <input
                type="number"
                value={formData.x}
                onChange={(e) => handleChange('x', parseFloat(e.target.value))}
                step="0.5"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Y Position" error={errors.y}>
              <input
                type="number"
                value={formData.y}
                onChange={(e) => handleChange('y', parseFloat(e.target.value))}
                step="0.5"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Color Variant" error={errors.colorVariant}>
              <input
                type="number"
                value={formData.colorVariant}
                onChange={(e) => handleChange('colorVariant', parseInt(e.target.value))}
                min="0"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Collision Radius" error={errors.collisionRadius}>
              <input
                type="number"
                value={formData.collisionRadius}
                onChange={(e) => handleChange('collisionRadius', parseFloat(e.target.value))}
                step="0.1"
                min="0"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Render Height" error={errors.renderHeight}>
              <input
                type="number"
                value={formData.renderHeight}
                onChange={(e) => handleChange('renderHeight', parseFloat(e.target.value))}
                step="0.1"
                min="0"
                style={inputStyle}
              />
            </FormField>
          </>
        );

      case 'wallPicture':
        return (
          <>
            <FormField label="Picture Type" error={errors.type}>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as WallPictureType)}
                style={selectStyle}
              >
                <option value="PORTRAIT">Portrait</option>
                <option value="LANDSCAPE">Landscape</option>
                <option value="ABSTRACT">Abstract</option>
              </select>
            </FormField>
            <FormField label="X Position" error={errors.x}>
              <input
                type="number"
                value={formData.x}
                onChange={(e) => handleChange('x', parseInt(e.target.value))}
                min="0"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Y Position" error={errors.y}>
              <input
                type="number"
                value={formData.y}
                onChange={(e) => handleChange('y', parseInt(e.target.value))}
                min="0"
                style={inputStyle}
              />
            </FormField>
            <FormField label="Wall Side" error={errors.side}>
              <select
                value={formData.side}
                onChange={(e) => handleChange('side', parseInt(e.target.value) as 0 | 1)}
                style={selectStyle}
              >
                <option value="0">North/South Wall</option>
                <option value="1">East/West Wall</option>
              </select>
            </FormField>
            <FormField label="Offset (0-1)" error={errors.offset}>
              <input
                type="number"
                value={formData.offset}
                onChange={(e) => handleChange('offset', parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="1"
                style={inputStyle}
              />
            </FormField>
          </>
        );

      case 'playerStart':
        return (
          <>
            <FormField label="Direction (degrees)" error={errors.direction}>
              <input
                type="number"
                value={formData.direction}
                onChange={(e) => handleChange('direction', parseInt(e.target.value))}
                min="0"
                max="359"
                style={inputStyle}
              />
            </FormField>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
              0° = East, 90° = South, 180° = West, 270° = North
            </div>
          </>
        );
    }
  };

  const getDialogTitle = () => {
    if (!dialogType) return '';
    
    const isEdit = dialogType.type !== 'playerStart' && 'entity' in dialogType && dialogType.entity;
    const action = isEdit ? 'Edit' : 'Add';
    
    switch (dialogType.type) {
      case 'enemy': return `${action} Enemy`;
      case 'item': return `${action} Item`;
      case 'decorative': return `${action} Decorative Object`;
      case 'wallPicture': return `${action} Wall Picture`;
      case 'playerStart': return 'Set Player Start Position';
    }
  };

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
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
            {renderFormFields()}
          </div>
          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={onCancel}
              style={cancelButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={saveButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              Save
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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
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
  transition: 'background-color 0.2s',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#4CAF50',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  fontWeight: 500,
};
