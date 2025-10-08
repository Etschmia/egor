/**
 * ColorPicker Integration Example
 * 
 * This file demonstrates how to integrate the ColorPicker component
 * into the PropertyPanel for editing color properties.
 * 
 * This example will be used in Task 13 (Live Preview) to complete
 * the full integration with property editing.
 */

import { useState } from 'react';
import ColorPicker from './ColorPicker';
import type { ColorProperty } from '../types';

interface ColorPropertyEditorProps {
  colorKey: string;
  colorProp: ColorProperty;
  onPropertyChange: (path: string, value: string) => void;
}

/**
 * Example component showing how to use ColorPicker in PropertyPanel
 */
export function ColorPropertyEditor({
  colorKey,
  colorProp,
  onPropertyChange,
}: ColorPropertyEditorProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    // Update the color property through the parent's change handler
    onPropertyChange(`colors.${colorKey}.value`, newColor);
  };

  return (
    <div className="property-panel__property">
      <label className="property-panel__property-label">
        {colorProp.displayName}
      </label>
      
      {/* Clickable color preview */}
      <div className="property-panel__color-preview">
        <div
          className="property-panel__color-swatch"
          style={{ backgroundColor: colorProp.value }}
          onClick={() => setIsPickerOpen(true)}
          title={`${colorProp.displayName}: ${colorProp.value}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsPickerOpen(true);
            }
          }}
          aria-label={`Edit ${colorProp.displayName}`}
        />
        <span className="property-panel__color-value">
          {colorProp.value}
        </span>
      </div>

      {/* Color picker dialog */}
      {isPickerOpen && (
        <ColorPicker
          color={colorProp}
          onChange={handleColorChange}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * Usage in PropertyPanel.tsx:
 * 
 * Replace the current color display code with:
 * 
 * ```tsx
 * import { ColorPropertyEditor } from './ColorPicker.integration-example';
 * 
 * // In the Colors PropertyGroup:
 * {Object.entries(asset.colors).map(([key, colorProp]) => (
 *   <ColorPropertyEditor
 *     key={key}
 *     colorKey={key}
 *     colorProp={colorProp}
 *     onPropertyChange={onPropertyChange}
 *   />
 * ))}
 * ```
 * 
 * This will enable full color editing functionality with the ColorPicker.
 */

export default ColorPropertyEditor;
