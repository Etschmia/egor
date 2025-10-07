import React from 'react';
import type { WallTypeSelectorProps } from '../types';

export const WallTypeSelector: React.FC<WallTypeSelectorProps> = ({
  availableWallTypes,
  selectedWallType,
  onWallTypeChange
}) => {
  return (
    <div className="wall-type-selector">
      <h3 className="wall-type-selector__title">Wall Type</h3>
      
      <div className="wall-type-selector__grid">
        {availableWallTypes.map((wallType) => (
          <div
            key={wallType.id}
            className={`wall-type-selector__item ${
              selectedWallType === wallType.id ? 'wall-type-selector__item--active' : ''
            }`}
            onClick={() => onWallTypeChange(wallType.id)}
          >
            {/* Preview thumbnail */}
            <div className="wall-type-selector__preview">
              <canvas
                width={64}
                height={64}
                className="wall-type-selector__canvas"
                ref={(canvas) => {
                  if (canvas) {
                    // Generate a small preview texture
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      // Simple preview based on wall type
                      generatePreviewTexture(ctx, wallType, 64, 64);
                    }
                  }
                }}
              />
            </div>

            {/* Wall type info */}
            <div className="wall-type-selector__info">
              <h4 className="wall-type-selector__name">{wallType.displayName}</h4>
              <p className="wall-type-selector__description">{wallType.description}</p>
              
              {/* Color indicators */}
              <div className="wall-type-selector__colors">
                <div
                  className="wall-type-selector__color-sample"
                  style={{ backgroundColor: wallType.colors.primary.value }}
                  title={`Primary: ${wallType.colors.primary.displayName}`}
                />
                <div
                  className="wall-type-selector__color-sample"
                  style={{ backgroundColor: wallType.colors.secondary.value }}
                  title={`Secondary: ${wallType.colors.secondary.displayName}`}
                />
                <div
                  className="wall-type-selector__color-sample"
                  style={{ backgroundColor: wallType.colors.accent.value }}
                  title={`Accent: ${wallType.colors.accent.displayName}`}
                />
              </div>
            </div>

            {/* Selection indicator */}
            {selectedWallType === wallType.id && (
              <div className="wall-type-selector__selected-indicator">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="wall-type-selector__check-icon"
                >
                  <path
                    d="M16.667 5L7.5 14.167L3.333 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new wall type button */}
      <button
        className="wall-type-selector__add-button"
        onClick={() => {
          // TODO: Implement create new wall type functionality
          console.log('Create new wall type');
        }}
        title="Create a new wall type"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="wall-type-selector__add-icon"
        >
          <path
            d="M10 4.167V15.833M4.167 10H15.833"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Add New Wall Type</span>
      </button>
    </div>
  );
};

// Helper function to generate a simple preview texture
function generatePreviewTexture(
  ctx: CanvasRenderingContext2D,
  wallType: any,
  width: number,
  height: number
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  const primary = wallType.colors.primary.value;
  const secondary = wallType.colors.secondary.value;
  const accent = wallType.colors.accent.value;

  switch (wallType.id) {
    case 'brick':
      // Simple brick pattern
      ctx.fillStyle = primary; // Mortar
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = secondary; // Bricks
      const brickHeight = 8;
      const brickWidth = 16;
      
      for (let y = 0; y < height; y += brickHeight) {
        const offset = (y / brickHeight) % 2 === 0 ? 0 : brickWidth / 2;
        for (let x = -brickWidth; x < width; x += brickWidth) {
          ctx.fillRect(x + offset, y, brickWidth - 1, brickHeight - 1);
        }
      }
      break;

    case 'wood':
      // Simple wood planks
      ctx.fillStyle = primary; // Base wood
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = secondary; // Planks
      const plankWidth = 8;
      for (let x = 0; x < width; x += plankWidth) {
        ctx.fillRect(x, 0, plankWidth - 1, height);
      }
      
      // Wood grain
      ctx.fillStyle = accent;
      for (let y = 4; y < height; y += 8) {
        ctx.fillRect(0, y, width, 1);
      }
      break;

    case 'stone':
      // Simple stone blocks
      ctx.fillStyle = primary; // Base stone
      ctx.fillRect(0, 0, width, height);
      
      const blockSize = 16;
      const stoneColors = [secondary, accent, primary];
      
      for (let i = 0; i < Math.ceil(width / blockSize); i++) {
        for (let j = 0; j < Math.ceil(height / blockSize); j++) {
          ctx.fillStyle = stoneColors[(i + j) % stoneColors.length];
          ctx.fillRect(i * blockSize, j * blockSize, blockSize - 1, blockSize - 1);
        }
      }
      break;

    case 'door':
      // Simple door pattern
      ctx.fillStyle = primary; // Door base
      ctx.fillRect(0, 0, width, height);
      
      // Door panels
      ctx.fillStyle = secondary;
      const panelWidth = 12;
      const panelHeight = height - 8;
      
      for (let x = 4; x < width - 8; x += 16) {
        ctx.fillRect(x, 4, panelWidth, panelHeight);
      }
      
      // Door handle
      ctx.fillStyle = accent;
      ctx.fillRect(width - 12, height / 2 - 2, 4, 4);
      break;

    default:
      // Default pattern
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = secondary;
      ctx.fillRect(2, 2, width - 4, height - 4);
      break;
  }
}