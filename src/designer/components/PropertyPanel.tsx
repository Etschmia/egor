import type { WallTypeDefinition } from '../types';
import PropertyGroup from './PropertyGroup';
import NumberSlider from './NumberSlider';

interface PropertyPanelProps {
  asset: WallTypeDefinition | null;
  onPropertyChange?: (path: string, value: any) => void;
  onReset: () => void;
}

export default function PropertyPanel({
  asset,
  onPropertyChange,
  onReset,
}: PropertyPanelProps) {
  if (!asset) {
    return (
      <aside className="designer-property-panel" aria-label="Property panel">
        <div className="property-panel__empty">
          <div className="property-panel__empty-icon">⚙️</div>
          <div className="property-panel__empty-title">No Asset Selected</div>
          <div className="property-panel__empty-text">
            Select an asset from the sidebar to edit its properties
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="designer-property-panel" aria-label="Property panel">
      <div className="property-panel__header">
        <div className="property-panel__title-section">
          <h2 className="property-panel__title">{asset.displayName}</h2>
          <p className="property-panel__description">{asset.description}</p>
        </div>
        <button
          className="property-panel__reset"
          onClick={onReset}
          title="Reset to default values"
          aria-label="Reset properties to default"
        >
          <span className="property-panel__reset-icon">↺</span>
          <span className="property-panel__reset-text">Reset</span>
        </button>
      </div>

      <div className="property-panel__content">
        {/* Colors Group - Default Expanded */}
        <PropertyGroup title="Colors" defaultExpanded={true}>
          <div className="property-panel__group-content">
            {Object.entries(asset.colors).map(([key, colorProp]) => (
              <div key={key} className="property-panel__property">
                <label className="property-panel__property-label">
                  {colorProp.displayName}
                </label>
                <div className="property-panel__color-preview">
                  <div
                    className="property-panel__color-swatch"
                    style={{ backgroundColor: colorProp.value }}
                    title={`${colorProp.displayName}: ${colorProp.value}`}
                  />
                  <span className="property-panel__color-value">
                    {colorProp.value}
                  </span>
                </div>
                <div className="property-panel__property-hint">
                  Click to edit color (Color picker coming in next task)
                </div>
              </div>
            ))}
          </div>
        </PropertyGroup>

        {/* Dimensions Group */}
        <PropertyGroup title="Dimensions">
          <div className="property-panel__group-content">
            {Object.entries(asset.dimensions).map(([key, numProp]) => (
              <NumberSlider
                key={key}
                property={numProp}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                onChange={(value) => {
                  if (onPropertyChange) {
                    onPropertyChange(`dimensions.${key}`, value);
                  }
                }}
              />
            ))}
          </div>
        </PropertyGroup>

        {/* Texture Group */}
        <PropertyGroup title="Texture">
          <div className="property-panel__group-content">
            <div className="property-panel__property">
              <label className="property-panel__property-label">Pattern</label>
              <div className="property-panel__text-value">
                {asset.texture.pattern}
              </div>
            </div>
            <NumberSlider
              property={asset.texture.intensity}
              label="Intensity"
              onChange={(value) => {
                if (onPropertyChange) {
                  onPropertyChange('texture.intensity', value);
                }
              }}
            />
            <div className="property-panel__property">
              <label className="property-panel__property-label">Blend Mode</label>
              <div className="property-panel__text-value">
                {asset.texture.blendMode}
              </div>
            </div>
            <div className="property-panel__property">
              <label className="property-panel__property-label">Procedural</label>
              <div className="property-panel__text-value">
                {asset.texture.procedural ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </PropertyGroup>

        {/* Effects Group */}
        <PropertyGroup title="Effects">
          <div className="property-panel__group-content">
            {/* Shadow Effect */}
            <div className="property-panel__effect">
              <div className="property-panel__effect-header">
                <span className="property-panel__effect-name">Shadow</span>
                <span className="property-panel__effect-status">
                  {asset.effects.shadow.enabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
              {asset.effects.shadow.enabled && (
                <div className="property-panel__effect-details">
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Color</label>
                    <div className="property-panel__color-preview">
                      <div
                        className="property-panel__color-swatch"
                        style={{ backgroundColor: asset.effects.shadow.color.value }}
                      />
                      <span className="property-panel__color-value">
                        {asset.effects.shadow.color.value}
                      </span>
                    </div>
                  </div>
                  <NumberSlider
                    property={asset.effects.shadow.offset}
                    label="Offset"
                    onChange={(value) => {
                      if (onPropertyChange) {
                        onPropertyChange('effects.shadow.offset', value);
                      }
                    }}
                  />
                  <NumberSlider
                    property={asset.effects.shadow.blur}
                    label="Blur"
                    onChange={(value) => {
                      if (onPropertyChange) {
                        onPropertyChange('effects.shadow.blur', value);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Highlight Effect */}
            <div className="property-panel__effect">
              <div className="property-panel__effect-header">
                <span className="property-panel__effect-name">Highlight</span>
                <span className="property-panel__effect-status">
                  {asset.effects.highlight.enabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
              {asset.effects.highlight.enabled && (
                <div className="property-panel__effect-details">
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Color</label>
                    <div className="property-panel__color-preview">
                      <div
                        className="property-panel__color-swatch"
                        style={{ backgroundColor: asset.effects.highlight.color.value }}
                      />
                      <span className="property-panel__color-value">
                        {asset.effects.highlight.color.value}
                      </span>
                    </div>
                  </div>
                  <NumberSlider
                    property={asset.effects.highlight.intensity}
                    label="Intensity"
                    onChange={(value) => {
                      if (onPropertyChange) {
                        onPropertyChange('effects.highlight.intensity', value);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gradient Effect */}
            <div className="property-panel__effect">
              <div className="property-panel__effect-header">
                <span className="property-panel__effect-name">Gradient</span>
                <span className="property-panel__effect-status">
                  {asset.effects.gradient.enabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
              {asset.effects.gradient.enabled && (
                <div className="property-panel__effect-details">
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Type</label>
                    <div className="property-panel__text-value">
                      {asset.effects.gradient.type}
                    </div>
                  </div>
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Colors</label>
                    <div className="property-panel__gradient-colors">
                      {asset.effects.gradient.colors.map((colorProp, index) => (
                        <div
                          key={index}
                          className="property-panel__color-swatch"
                          style={{ backgroundColor: colorProp.value }}
                          title={colorProp.value}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PropertyGroup>
      </div>
    </aside>
  );
}
