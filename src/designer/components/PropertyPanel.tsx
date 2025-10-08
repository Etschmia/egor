import type { WallTypeDefinition } from '../types';
import PropertyGroup from './PropertyGroup';

interface PropertyPanelProps {
  asset: WallTypeDefinition | null;
  onPropertyChange?: (path: string, value: any) => void;
  onReset: () => void;
}

export default function PropertyPanel({
  asset,
  onPropertyChange: _onPropertyChange,
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
              <div key={key} className="property-panel__property">
                <label className="property-panel__property-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div className="property-panel__number-display">
                  <span className="property-panel__number-value">
                    {numProp.value}
                    {numProp.unit && ` ${numProp.unit}`}
                  </span>
                  <span className="property-panel__number-range">
                    ({numProp.min} - {numProp.max})
                  </span>
                </div>
                <div className="property-panel__property-hint">
                  Slider control coming in next task
                </div>
              </div>
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
            <div className="property-panel__property">
              <label className="property-panel__property-label">Intensity</label>
              <div className="property-panel__number-display">
                <span className="property-panel__number-value">
                  {asset.texture.intensity.value}
                  {asset.texture.intensity.unit && ` ${asset.texture.intensity.unit}`}
                </span>
              </div>
            </div>
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
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Offset</label>
                    <span className="property-panel__number-value">
                      {asset.effects.shadow.offset.value}
                      {asset.effects.shadow.offset.unit}
                    </span>
                  </div>
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Blur</label>
                    <span className="property-panel__number-value">
                      {asset.effects.shadow.blur.value}
                      {asset.effects.shadow.blur.unit}
                    </span>
                  </div>
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
                  <div className="property-panel__property">
                    <label className="property-panel__property-label">Intensity</label>
                    <span className="property-panel__number-value">
                      {asset.effects.highlight.intensity.value}
                      {asset.effects.highlight.intensity.unit}
                    </span>
                  </div>
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
