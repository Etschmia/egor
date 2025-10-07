import React from 'react';
import type { PropertyEditorProps } from '../types';
import { ColorPicker } from './ColorPicker';
import { NumberSlider } from './NumberSlider';

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  wallType,
  onPropertyChange,
  onReset
}) => {
  console.log('🏗️ PropertyEditor: Rendering with wallType:', wallType.id, wallType);
  console.log('🏗️ PropertyEditor: onPropertyChange callback:', typeof onPropertyChange);
  const handleColorChange = (colorKey: string, value: string) => {
    console.log('🎨 PropertyEditor: Color change requested', { colorKey, value, wallType: wallType.id });
    onPropertyChange(`colors.${colorKey}.value`, value);
    console.log('🎨 PropertyEditor: Color change callback executed');
  };

  const handleDimensionChange = (dimensionKey: string, value: number) => {
    console.log('📏 PropertyEditor: Dimension change requested', { dimensionKey, value, wallType: wallType.id });
    onPropertyChange(`dimensions.${dimensionKey}.value`, value);
    console.log('📏 PropertyEditor: Dimension change callback executed');
  };

  const handleTextureChange = (property: string, value: any) => {
    onPropertyChange(`texture.${property}`, value);
  };

  const handleEffectChange = (effectPath: string, value: any) => {
    onPropertyChange(`effects.${effectPath}`, value);
  };

  return (
    <div className="property-editor">
      <div className="property-editor__header">
        <h2 className="property-editor__title">
          {wallType.displayName} Properties
        </h2>
        <button
          className="property-editor__reset-button"
          onClick={onReset}
          title="Reset all properties to default"
        >
          Reset All
        </button>
      </div>

      <p className="property-editor__description">
        {wallType.description}
      </p>

      {/* Color Properties Section */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Colors</h3>
        <div className="property-editor__section-content">
          
          <div className="property-editor__color-grid">
            <ColorPicker
              colorProperty={wallType.colors.primary}
              onChange={(value) => handleColorChange('primary', value)}
              label="Primary Color"
              showPresets={true}
            />

            <ColorPicker
              colorProperty={wallType.colors.secondary}
              onChange={(value) => handleColorChange('secondary', value)}
              label="Secondary Color"
              showPresets={true}
            />

            <ColorPicker
              colorProperty={wallType.colors.accent}
              onChange={(value) => handleColorChange('accent', value)}
              label="Accent Color"
              showPresets={true}
            />

            <ColorPicker
              colorProperty={wallType.colors.shadow}
              onChange={(value) => handleColorChange('shadow', value)}
              label="Shadow Color"
              showPresets={true}
            />

            <ColorPicker
              colorProperty={wallType.colors.highlight}
              onChange={(value) => handleColorChange('highlight', value)}
              label="Highlight Color"
              showPresets={true}
            />
          </div>

          {/* Color harmony tools */}
          <div className="property-editor__color-tools">
            <button
              className="property-editor__tool-button"
              onClick={() => {
                // Generate complementary colors based on primary
                const primary = wallType.colors.primary.value;
                // Simple complementary color generation (this could be more sophisticated)
                console.log('Generate complementary colors for:', primary);
              }}
              title="Generate complementary color scheme"
            >
              Complementary
            </button>
            
            <button
              className="property-editor__tool-button"
              onClick={() => {
                // Generate analogous colors
                console.log('Generate analogous colors');
              }}
              title="Generate analogous color scheme"
            >
              Analogous
            </button>

            <button
              className="property-editor__tool-button"
              onClick={() => {
                // Generate triadic colors
                console.log('Generate triadic colors');
              }}
              title="Generate triadic color scheme"
            >
              Triadic
            </button>
          </div>
        </div>
      </div>

      {/* Dimension Properties Section */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Dimensions</h3>
        <div className="property-editor__section-content">
          
          <NumberSlider
            numberProperty={wallType.dimensions.width}
            onChange={(value) => handleDimensionChange('width', value)}
            label="Width"
          />

          <NumberSlider
            numberProperty={wallType.dimensions.height}
            onChange={(value) => handleDimensionChange('height', value)}
            label="Height"
          />

          <NumberSlider
            numberProperty={wallType.dimensions.spacing}
            onChange={(value) => handleDimensionChange('spacing', value)}
            label="Spacing"
          />

          <NumberSlider
            numberProperty={wallType.dimensions.borderWidth}
            onChange={(value) => handleDimensionChange('borderWidth', value)}
            label="Border Width"
          />
        </div>
      </div>

      {/* Texture Properties Section */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Texture</h3>
        <div className="property-editor__section-content">
          
          {/* Pattern Type */}
          <div className="property-editor__pattern-selector">
            <label className="property-editor__label">Pattern Type</label>
            <select
              value={wallType.texture.pattern}
              onChange={(e) => handleTextureChange('pattern', e.target.value)}
              className="property-editor__select"
            >
              <option value="SOLID">Solid Color</option>
              <option value="GRADIENT">Gradient</option>
              <option value="BRICK">Brick Pattern</option>
              <option value="WOOD_GRAIN">Wood Grain</option>
              <option value="STONE_BLOCKS">Stone Blocks</option>
              <option value="METAL">Metal Texture</option>
            </select>
          </div>

          {/* Texture Intensity */}
          <NumberSlider
            numberProperty={wallType.texture.intensity}
            onChange={(value) => handleTextureChange('intensity.value', value)}
            label="Pattern Intensity"
          />

          {/* Blend Mode */}
          <div className="property-editor__blend-mode">
            <label className="property-editor__label">Blend Mode</label>
            <select
              value={wallType.texture.blendMode}
              onChange={(e) => handleTextureChange('blendMode', e.target.value)}
              className="property-editor__select"
            >
              <option value="NORMAL">Normal</option>
              <option value="MULTIPLY">Multiply</option>
              <option value="OVERLAY">Overlay</option>
              <option value="SOFT_LIGHT">Soft Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* Effects Section */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Effects</h3>
        <div className="property-editor__section-content">
          
          {/* Shadow Effects */}
          <div className="property-editor__effect-group">
            <div className="property-editor__effect-header">
              <label className="property-editor__effect-label">
                <input
                  type="checkbox"
                  checked={wallType.effects.shadow.enabled}
                  onChange={(e) => handleEffectChange('shadow.enabled', e.target.checked)}
                  className="property-editor__checkbox"
                />
                Shadow Effect
              </label>
            </div>

            {wallType.effects.shadow.enabled && (
              <div className="property-editor__effect-controls">
                <ColorPicker
                  colorProperty={wallType.effects.shadow.color}
                  onChange={(value) => handleEffectChange('shadow.color.value', value)}
                  label="Shadow Color"
                />

                <NumberSlider
                  numberProperty={wallType.effects.shadow.offset}
                  onChange={(value) => handleEffectChange('shadow.offset.value', value)}
                  label="Shadow Offset"
                />

                <NumberSlider
                  numberProperty={wallType.effects.shadow.blur}
                  onChange={(value) => handleEffectChange('shadow.blur.value', value)}
                  label="Shadow Blur"
                />
              </div>
            )}
          </div>

          {/* Highlight Effects */}
          <div className="property-editor__effect-group">
            <div className="property-editor__effect-header">
              <label className="property-editor__effect-label">
                <input
                  type="checkbox"
                  checked={wallType.effects.highlight.enabled}
                  onChange={(e) => handleEffectChange('highlight.enabled', e.target.checked)}
                  className="property-editor__checkbox"
                />
                Highlight Effect
              </label>
            </div>

            {wallType.effects.highlight.enabled && (
              <div className="property-editor__effect-controls">
                <ColorPicker
                  colorProperty={wallType.effects.highlight.color}
                  onChange={(value) => handleEffectChange('highlight.color.value', value)}
                  label="Highlight Color"
                />

                <NumberSlider
                  numberProperty={wallType.effects.highlight.intensity}
                  onChange={(value) => handleEffectChange('highlight.intensity.value', value)}
                  label="Highlight Intensity"
                />
              </div>
            )}
          </div>

          {/* Gradient Effects */}
          <div className="property-editor__effect-group">
            <div className="property-editor__effect-header">
              <label className="property-editor__effect-label">
                <input
                  type="checkbox"
                  checked={wallType.effects.gradient.enabled}
                  onChange={(e) => handleEffectChange('gradient.enabled', e.target.checked)}
                  className="property-editor__checkbox"
                />
                Gradient Effect
              </label>
            </div>

            {wallType.effects.gradient.enabled && (
              <div className="property-editor__effect-controls">
                <div className="property-editor__gradient-type">
                  <label className="property-editor__label">Gradient Type</label>
                  <select
                    value={wallType.effects.gradient.type}
                    onChange={(e) => handleEffectChange('gradient.type', e.target.value)}
                    className="property-editor__select"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                {/* Gradient colors would be handled here */}
                <div className="property-editor__gradient-colors">
                  <p className="property-editor__note">
                    Gradient color controls would be implemented here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Advanced</h3>
        <div className="property-editor__section-content">
          
          <div className="property-editor__advanced-options">
            <label className="property-editor__effect-label">
              <input
                type="checkbox"
                checked={wallType.texture.procedural}
                onChange={(e) => handleTextureChange('procedural', e.target.checked)}
                className="property-editor__checkbox"
              />
              Procedural Generation
            </label>

            <div className="property-editor__info-text">
              <p>
                Procedural generation creates textures algorithmically for infinite variation.
                Disable for static texture patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};