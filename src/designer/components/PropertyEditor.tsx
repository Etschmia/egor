import React from 'react';
import type { PropertyEditorProps } from '../types';
// import ColorPicker from './ColorPicker';
import { NumberSlider } from './NumberSlider';

/**
 * NOTE: This component was created in an earlier task and expects a different
 * ColorPicker API than the one implemented in Task 11.
 * 
 * This component needs to be updated to use the new ColorPicker component
 * which has the following API:
 * 
 * <ColorPicker
 *   color={ColorProperty}
 *   onChange={(value: string) => void}
 *   onClose={() => void}
 * />
 * 
 * The current implementation expects:
 * <ColorPicker
 *   colorProperty={ColorProperty}
 *   onChange={(value: string) => void}
 *   label={string}
 *   showPresets={boolean}
 * />
 * 
 * TODO: Update this component to use the new ColorPicker API or create a wrapper component
 */

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  wallType,
  onPropertyChange,
  onReset
}) => {
  console.log('🏗️ PropertyEditor: Rendering with wallType:', wallType.id, wallType);
  console.log('🏗️ PropertyEditor: onPropertyChange callback:', typeof onPropertyChange);
  
  // Disabled until ColorPicker API is updated
  // const handleColorChange = (colorKey: string, value: string) => {
  //   console.log('🎨 PropertyEditor: Color change requested', { colorKey, value, wallType: wallType.id });
  //   onPropertyChange(`colors.${colorKey}.value`, value);
  // };

  const handleDimensionChange = (dimensionKey: string, value: number) => {
    console.log('📏 PropertyEditor: Dimension change requested', { dimensionKey, value, wallType: wallType.id });
    onPropertyChange(`dimensions.${dimensionKey}.value`, value);
  };

  const handleTextureChange = (path: string, value: any) => {
    console.log('🎨 PropertyEditor: Texture change requested', { path, value, wallType: wallType.id });
    onPropertyChange(`texture.${path}`, value);
  };

  // Disabled until ColorPicker API is updated
  // const handleEffectChange = (path: string, value: any) => {
  //   console.log('✨ PropertyEditor: Effect change requested', { path, value, wallType: wallType.id });
  //   onPropertyChange(`effects.${path}`, value);
  // };

  return (
    <div className="property-editor">
      <div className="property-editor__header">
        <h2 className="property-editor__title">{wallType.displayName}</h2>
        <button onClick={onReset} className="property-editor__reset-button">
          Reset to Default
        </button>
      </div>

      {/* Colors Section - DISABLED: Needs ColorPicker API update */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Colors</h3>
        <div className="property-editor__section-content">
          <p style={{ color: '#888', fontStyle: 'italic', padding: '16px' }}>
            Color editing temporarily disabled. This component needs to be updated to use the new ColorPicker API from Task 11.
          </p>
          {/* Color pickers will be re-enabled after API update */}
        </div>
      </div>

      {/* Dimensions Section */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Dimensions</h3>
        <div className="property-editor__section-content">
          <NumberSlider
            numberProperty={wallType.dimensions.width}
            onChange={(value: number) => handleDimensionChange('width', value)}
            label="Width"
          />

          <NumberSlider
            numberProperty={wallType.dimensions.height}
            onChange={(value: number) => handleDimensionChange('height', value)}
            label="Height"
          />

          <NumberSlider
            numberProperty={wallType.dimensions.spacing}
            onChange={(value: number) => handleDimensionChange('spacing', value)}
            label="Spacing"
          />

          <NumberSlider
            numberProperty={wallType.dimensions.borderWidth}
            onChange={(value: number) => handleDimensionChange('borderWidth', value)}
            label="Border Width"
          />
        </div>
      </div>

      {/* Texture Section */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Texture</h3>
        <div className="property-editor__section-content">
          <div className="property-editor__field">
            <label className="property-editor__label">Pattern</label>
            <select
              value={wallType.texture.pattern}
              onChange={(e) => handleTextureChange('pattern', e.target.value)}
              className="property-editor__select"
            >
              <option value="SOLID">Solid</option>
              <option value="GRADIENT">Gradient</option>
              <option value="BRICK">Brick</option>
              <option value="WOOD_GRAIN">Wood Grain</option>
              <option value="STONE_BLOCKS">Stone Blocks</option>
              <option value="METAL">Metal</option>
            </select>
          </div>

          <NumberSlider
            numberProperty={wallType.texture.intensity}
            onChange={(value: number) => handleTextureChange('intensity.value', value)}
            label="Pattern Intensity"
          />

          <div className="property-editor__field">
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

          <div className="property-editor__field">
            <label className="property-editor__checkbox-label">
              <input
                type="checkbox"
                checked={wallType.texture.procedural}
                onChange={(e) => handleTextureChange('procedural', e.target.checked)}
                className="property-editor__checkbox"
              />
              Procedural Generation
            </label>
          </div>
        </div>
      </div>

      {/* Effects Section - DISABLED: Needs ColorPicker API update */}
      <div className="property-editor__section">
        <h3 className="property-editor__section-title">Effects</h3>
        <div className="property-editor__section-content">
          <p style={{ color: '#888', fontStyle: 'italic', padding: '16px' }}>
            Effect color editing temporarily disabled. This component needs to be updated to use the new ColorPicker API from Task 11.
          </p>
          {/* Effect controls will be re-enabled after API update */}
        </div>
      </div>
    </div>
  );
};

export default PropertyEditor;
