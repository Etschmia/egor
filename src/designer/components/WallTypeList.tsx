import type { WallTypeDefinition } from '../types';

interface WallTypeListProps {
  wallTypes: Record<string, WallTypeDefinition>;
  selectedWallTypeId: string | null;
  onWallTypeSelect: (wallTypeId: string) => void;
  onAddNew: () => void;
}

export default function WallTypeList({
  wallTypes,
  selectedWallTypeId,
  onWallTypeSelect,
  onAddNew,
}: WallTypeListProps) {
  const wallTypeEntries = Object.entries(wallTypes);

  return (
    <div className="wall-type-list">
      {/* Wall Type Items */}
      <div className="wall-type-list__items">
        {wallTypeEntries.length === 0 ? (
          <div className="wall-type-list__empty">
            <p>No wall types available</p>
            <p className="wall-type-list__empty-hint">
              Create a new wall type to get started
            </p>
          </div>
        ) : (
          wallTypeEntries.map(([id, wallType]) => (
            <button
              key={id}
              className={`wall-type-item ${
                selectedWallTypeId === id ? 'wall-type-item--active' : ''
              }`}
              onClick={() => onWallTypeSelect(id)}
              aria-label={`Select ${wallType.displayName}`}
              aria-pressed={selectedWallTypeId === id}
            >
              {/* Preview Thumbnail */}
              <div className="wall-type-item__preview">
                <div
                  className="wall-type-item__preview-color"
                  style={{
                    background: `linear-gradient(135deg, ${wallType.colors.primary.value} 0%, ${wallType.colors.secondary.value} 100%)`,
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Info */}
              <div className="wall-type-item__info">
                <div className="wall-type-item__name">{wallType.displayName}</div>
                {wallType.description && (
                  <div className="wall-type-item__description">
                    {wallType.description}
                  </div>
                )}
              </div>

              {/* Color Indicators */}
              <div className="wall-type-item__colors">
                <div
                  className="wall-type-item__color-dot"
                  style={{ backgroundColor: wallType.colors.primary.value }}
                  title={`Primary: ${wallType.colors.primary.value}`}
                  aria-label={`Primary color: ${wallType.colors.primary.value}`}
                />
                <div
                  className="wall-type-item__color-dot"
                  style={{ backgroundColor: wallType.colors.secondary.value }}
                  title={`Secondary: ${wallType.colors.secondary.value}`}
                  aria-label={`Secondary color: ${wallType.colors.secondary.value}`}
                />
                <div
                  className="wall-type-item__color-dot"
                  style={{ backgroundColor: wallType.colors.accent.value }}
                  title={`Accent: ${wallType.colors.accent.value}`}
                  aria-label={`Accent color: ${wallType.colors.accent.value}`}
                />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Add New Button */}
      <div className="wall-type-list__footer">
        <button
          className="wall-type-list__add-button"
          onClick={onAddNew}
          aria-label="Add new wall type"
        >
          <span className="wall-type-list__add-icon">+</span>
          <span className="wall-type-list__add-text">Add New Wall Type</span>
        </button>
      </div>
    </div>
  );
}
