import React, { useState, useRef, useEffect } from 'react';
import type { ColorPickerProps, ColorInputMethod } from '../types';

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colorProperty,
  onChange,
  label,
  showPresets = true
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputMethod, setInputMethod] = useState<ColorInputMethod>('picker');
  const [tempColor, setTempColor] = useState(colorProperty.value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempColor(colorProperty.value);
  }, [colorProperty.value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (newColor: string) => {
    setTempColor(newColor);
    onChange(newColor);
  };

  const handleHexInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
      setTempColor(value);
      if (value.length === 7) {
        onChange(value);
      }
    }
  };

  const handleRGBInput = (r: number, g: number, b: number) => {
    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    handleColorChange(hex);
  };

  const handleHSLInput = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h / 360, s / 100, l / 100);
    handleRGBInput(rgb.r, rgb.g, rgb.b);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const currentRgb = hexToRgb(tempColor);
  const currentHsl = rgbToHsl(currentRgb.r, currentRgb.g, currentRgb.b);

  return (
    <div className="color-picker">
      {label && <label className="color-picker__label">{label}</label>}
      
      <div className="color-picker__main">
        {/* Color preview and trigger */}
        <div
          className="color-picker__preview"
          style={{ backgroundColor: tempColor }}
          onClick={() => setShowPicker(!showPicker)}
          title={`${colorProperty.displayName}: ${tempColor}`}
        >
          <span className="color-picker__preview-text">{tempColor}</span>
        </div>

        {/* Input method selector */}
        <select
          className="color-picker__method"
          value={inputMethod}
          onChange={(e) => setInputMethod(e.target.value as ColorInputMethod)}
        >
          <option value="picker">Color Picker</option>
          <option value="hex">Hex Code</option>
          <option value="rgb">RGB</option>
          <option value="hsl">HSL</option>
          <option value="named">Named Colors</option>
          {showPresets && colorProperty.presets && <option value="preset">Presets</option>}
        </select>
      </div>

      {/* Color picker panel */}
      {showPicker && (
        <div className="color-picker__panel" ref={pickerRef}>
          {inputMethod === 'picker' && (
            <div className="color-picker__visual">
              {/* HSL Color Wheel */}
              <div className="color-picker__wheel">
                <canvas
                  width={200}
                  height={200}
                  style={{ cursor: 'crosshair' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left - 100;
                    const y = e.clientY - rect.top - 100;
                    const distance = Math.sqrt(x * x + y * y);
                    
                    if (distance <= 100) {
                      const angle = Math.atan2(y, x);
                      const hue = ((angle * 180 / Math.PI + 360) % 360);
                      const saturation = Math.min(distance, 100);
                      handleHSLInput(hue, saturation, currentHsl.l);
                    }
                  }}
                />
              </div>

              {/* Lightness slider */}
              <div className="color-picker__lightness">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentHsl.l}
                  onChange={(e) => handleHSLInput(currentHsl.h, currentHsl.s, parseInt(e.target.value))}
                  className="color-picker__slider"
                />
                <label>Lightness: {currentHsl.l}%</label>
              </div>
            </div>
          )}

          {inputMethod === 'hex' && (
            <div className="color-picker__hex">
              <input
                type="text"
                value={tempColor}
                onChange={handleHexInput}
                placeholder="#000000"
                className="color-picker__hex-input"
                maxLength={7}
              />
            </div>
          )}

          {inputMethod === 'rgb' && (
            <div className="color-picker__rgb">
              <div className="color-picker__rgb-inputs">
                <label>
                  R:
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentRgb.r}
                    onChange={(e) => handleRGBInput(parseInt(e.target.value) || 0, currentRgb.g, currentRgb.b)}
                  />
                </label>
                <label>
                  G:
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentRgb.g}
                    onChange={(e) => handleRGBInput(currentRgb.r, parseInt(e.target.value) || 0, currentRgb.b)}
                  />
                </label>
                <label>
                  B:
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={currentRgb.b}
                    onChange={(e) => handleRGBInput(currentRgb.r, currentRgb.g, parseInt(e.target.value) || 0)}
                  />
                </label>
              </div>
            </div>
          )}

          {inputMethod === 'hsl' && (
            <div className="color-picker__hsl">
              <div className="color-picker__hsl-inputs">
                <label>
                  H:
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={currentHsl.h}
                    onChange={(e) => handleHSLInput(parseInt(e.target.value) || 0, currentHsl.s, currentHsl.l)}
                  />
                </label>
                <label>
                  S:
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentHsl.s}
                    onChange={(e) => handleHSLInput(currentHsl.h, parseInt(e.target.value) || 0, currentHsl.l)}
                  />
                </label>
                <label>
                  L:
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentHsl.l}
                    onChange={(e) => handleHSLInput(currentHsl.h, currentHsl.s, parseInt(e.target.value) || 0)}
                  />
                </label>
              </div>
            </div>
          )}

          {inputMethod === 'named' && (
            <div className="color-picker__named">
              <select
                value={tempColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="color-picker__named-select"
              >
                <option value="">Select a named color...</option>
                <optgroup label="Basic Colors">
                  <option value="#FF0000">Red</option>
                  <option value="#00FF00">Green</option>
                  <option value="#0000FF">Blue</option>
                  <option value="#FFFF00">Yellow</option>
                  <option value="#FF00FF">Magenta</option>
                  <option value="#00FFFF">Cyan</option>
                  <option value="#000000">Black</option>
                  <option value="#FFFFFF">White</option>
                </optgroup>
                <optgroup label="Brown Tones">
                  <option value="#8B4513">Saddle Brown</option>
                  <option value="#A0522D">Sienna</option>
                  <option value="#CD853F">Peru</option>
                  <option value="#DEB887">Burlywood</option>
                  <option value="#F5DEB3">Wheat</option>
                  <option value="#D2691E">Chocolate</option>
                  <option value="#BC8F8F">Rosy Brown</option>
                </optgroup>
                <optgroup label="Gray Tones">
                  <option value="#696969">Dim Gray</option>
                  <option value="#708090">Slate Gray</option>
                  <option value="#778899">Light Slate Gray</option>
                  <option value="#A9A9A9">Dark Gray</option>
                  <option value="#C0C0C0">Silver</option>
                  <option value="#D3D3D3">Light Gray</option>
                </optgroup>
              </select>
            </div>
          )}

          {inputMethod === 'preset' && colorProperty.presets && (
            <div className="color-picker__presets">
              <div className="color-picker__preset-grid">
                {colorProperty.presets.map((preset, index) => (
                  <div
                    key={index}
                    className={`color-picker__preset ${preset.value === tempColor ? 'color-picker__preset--active' : ''}`}
                    style={{ backgroundColor: preset.value }}
                    onClick={() => handleColorChange(preset.value)}
                    title={`${preset.name}${preset.description ? ': ' + preset.description : ''}`}
                  >
                    <span className="color-picker__preset-name">{preset.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="color-picker__actions">
            <button
              onClick={() => {
                onChange(tempColor);
                setShowPicker(false);
              }}
              className="color-picker__button color-picker__button--primary"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setTempColor(colorProperty.value);
                setShowPicker(false);
              }}
              className="color-picker__button color-picker__button--secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};