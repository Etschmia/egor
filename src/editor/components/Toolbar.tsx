import { useState } from 'react';

interface ToolbarProps {
  isDirty: boolean;
  currentLevel: number | null;
  mapWidth: number;
  mapHeight: number;
  onSave: () => void;
  onNewLevel: () => void;
  onNewVariant: () => void;
  onApplySize: (width: number, height: number) => void;
  isSaving?: boolean;
}

export function Toolbar({
  isDirty,
  currentLevel,
  mapWidth,
  mapHeight,
  onSave,
  onNewLevel,
  onNewVariant,
  onApplySize,
  isSaving = false,
}: ToolbarProps) {
  const [width, setWidth] = useState(mapWidth);
  const [height, setHeight] = useState(mapHeight);

  // Update local state when map dimensions change
  if (width !== mapWidth) setWidth(mapWidth);
  if (height !== mapHeight) setHeight(mapHeight);

  const handleApplySize = () => {
    if (width > 0 && height > 0 && (width !== mapWidth || height !== mapHeight)) {
      onApplySize(width, height);
    }
  };

  const sizeChanged = width !== mapWidth || height !== mapHeight;

  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #333',
      backgroundColor: '#2a2a2a',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={!isDirty || isSaving || currentLevel === null}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: isDirty && !isSaving ? '#4CAF50' : '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isDirty && !isSaving && currentLevel !== null ? 'pointer' : 'not-allowed',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          opacity: isDirty && !isSaving && currentLevel !== null ? 1 : 0.5,
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (isDirty && !isSaving && currentLevel !== null) {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (isDirty && !isSaving) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
          }
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isSaving ? '💾 Saving...' : '💾 Save'}
      </button>

      {/* Dirty State Indicator */}
      {isDirty && (
        <span style={{
          color: '#ffa500',
          fontSize: '0.9rem',
          fontWeight: 'bold',
        }}>
          ● Unsaved changes
        </span>
      )}

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '2rem',
        backgroundColor: '#444',
      }} />

      {/* New Level Button */}
      <button
        onClick={onNewLevel}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#2196F3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1976D2';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ➕ New Level
      </button>

      {/* New Variant Button */}
      <button
        onClick={onNewVariant}
        disabled={currentLevel === null}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: currentLevel !== null ? '#9C27B0' : '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: currentLevel !== null ? 'pointer' : 'not-allowed',
          fontSize: '0.9rem',
          opacity: currentLevel !== null ? 1 : 0.5,
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (currentLevel !== null) {
            e.currentTarget.style.backgroundColor = '#7B1FA2';
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentLevel !== null) {
            e.currentTarget.style.backgroundColor = '#9C27B0';
          }
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ➕ New Variant
      </button>

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '2rem',
        backgroundColor: '#444',
      }} />

      {/* Map Dimensions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <label style={{
          fontSize: '0.9rem',
          color: '#ccc',
        }}>
          Width:
        </label>
        <input
          type="number"
          min="5"
          max="100"
          value={width}
          onChange={(e) => setWidth(Math.max(5, parseInt(e.target.value) || 5))}
          disabled={currentLevel === null}
          style={{
            width: '60px',
            padding: '0.4rem',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        />

        <label style={{
          fontSize: '0.9rem',
          color: '#ccc',
        }}>
          Height:
        </label>
        <input
          type="number"
          min="5"
          max="100"
          value={height}
          onChange={(e) => setHeight(Math.max(5, parseInt(e.target.value) || 5))}
          disabled={currentLevel === null}
          style={{
            width: '60px',
            padding: '0.4rem',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        />

        <button
          onClick={handleApplySize}
          disabled={!sizeChanged || currentLevel === null}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: sizeChanged && currentLevel !== null ? '#FF9800' : '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: sizeChanged && currentLevel !== null ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem',
            opacity: sizeChanged && currentLevel !== null ? 1 : 0.5,
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (sizeChanged && currentLevel !== null) {
              e.currentTarget.style.backgroundColor = '#F57C00';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (sizeChanged && currentLevel !== null) {
              e.currentTarget.style.backgroundColor = '#FF9800';
            }
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✓ Apply Size
        </button>
      </div>
    </div>
  );
}
