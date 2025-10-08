import { useState, useEffect, useRef } from 'react';
import type { ColorProperty } from '../types';

interface ColorPickerProps {
  color: ColorProperty;
  onChange: (value: string) => void;
  onClose: () => void;
}

// Utility functions for color conversion
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0;
  let g = 0;
  let b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(hex: string): boolean {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

function normalizeHex(hex: string): string {
  hex = hex.replace('#', '').toUpperCase();
  return `#${hex}`;
}

// Default preset colors
const DEFAULT_PRESETS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00',
  '#9ACD32', '#00FF00', '#00FA9A', '#00CED1', '#1E90FF',
  '#0000FF', '#8A2BE2', '#9370DB', '#FF1493', '#FF69B4',
  '#FFFFFF', '#D3D3D3', '#A9A9A9', '#808080', '#696969',
  '#000000', '#8B4513', '#A0522D', '#CD853F', '#DEB887',
];

export default function ColorPicker({ color, onChange, onClose }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(color.value);
  const [hsl, setHsl] = useState(hexToHSL(color.value));
  const [hexError, setHexError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Use color presets from the color property or default presets
  const presets = color.presets || DEFAULT_PRESETS;
  
  // Update HSL when hex input changes
  useEffect(() => {
    if (isValidHex(hexInput)) {
      const normalized = normalizeHex(hexInput);
      setHsl(hexToHSL(normalized));
      setHexError('');
    }
  }, [hexInput]);
  
  // Handle hex input change
  const handleHexChange = (value: string) => {
    setHexInput(value);
    
    if (isValidHex(value)) {
      const normalized = normalizeHex(value);
      onChange(normalized);
      setHexError('');
    } else if (value.length > 0) {
      setHexError('Invalid hex color (e.g., #FF0000)');
    } else {
      setHexError('');
    }
  };
  
  // Handle HSL slider change
  const handleHSLChange = (component: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [component]: value };
    setHsl(newHsl);
    
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHexInput(newHex);
    onChange(newHex);
  };
  
  // Handle preset color selection
  const handlePresetClick = (presetColor: string) => {
    const normalized = normalizeHex(presetColor);
    setHexInput(normalized);
    onChange(normalized);
  };
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div className="dialog-backdrop">
      <div className="dialog color-picker-dialog" ref={dialogRef}>
        <div className="dialog__content">
          <div className="dialog__header">
            <h2 className="dialog__title">
              {color.displayName}
            </h2>
            <button
              className="dialog__close"
              onClick={onClose}
              aria-label="Close color picker"
              type="button"
            >
              ×
            </button>
          </div>
          
          <div className="dialog__body">
            {/* Color Preview */}
            <div className="color-picker__preview-section">
              <div
                className="color-picker__preview-large"
                style={{ backgroundColor: hexInput }}
                aria-label={`Current color: ${hexInput}`}
              />
            </div>
            
            {/* Hex Input */}
            <div className="form-field">
              <label className="form-field__label" htmlFor="hex-input">
                Hex Color
              </label>
              <input
                id="hex-input"
                type="text"
                className={`form-field__input ${hexError ? 'form-field__input--error' : ''}`}
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#FF0000"
                maxLength={7}
              />
              {hexError && (
                <div className="form-field__error">{hexError}</div>
              )}
              <div className="form-field__hint">
                Enter a 6-digit hex color code (e.g., #FF0000)
              </div>
            </div>
            
            {/* HSL Sliders */}
            <div className="color-picker__sliders">
              <div className="color-picker__slider-group">
                <label className="color-picker__slider-label">
                  <span>Hue</span>
                  <span className="color-picker__slider-value">{hsl.h}°</span>
                </label>
                <input
                  type="range"
                  className="color-picker__slider color-picker__slider--hue"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHSLChange('h', parseInt(e.target.value))}
                  aria-label="Hue"
                />
              </div>
              
              <div className="color-picker__slider-group">
                <label className="color-picker__slider-label">
                  <span>Saturation</span>
                  <span className="color-picker__slider-value">{hsl.s}%</span>
                </label>
                <input
                  type="range"
                  className="color-picker__slider color-picker__slider--saturation"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHSLChange('s', parseInt(e.target.value))}
                  aria-label="Saturation"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(${hsl.h}, 0%, ${hsl.l}%), 
                      hsl(${hsl.h}, 100%, ${hsl.l}%))`
                  }}
                />
              </div>
              
              <div className="color-picker__slider-group">
                <label className="color-picker__slider-label">
                  <span>Lightness</span>
                  <span className="color-picker__slider-value">{hsl.l}%</span>
                </label>
                <input
                  type="range"
                  className="color-picker__slider color-picker__slider--lightness"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHSLChange('l', parseInt(e.target.value))}
                  aria-label="Lightness"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(${hsl.h}, ${hsl.s}%, 0%), 
                      hsl(${hsl.h}, ${hsl.s}%, 50%), 
                      hsl(${hsl.h}, ${hsl.s}%, 100%))`
                  }}
                />
              </div>
            </div>
            
            {/* Preset Colors */}
            <div className="color-picker__presets">
              <div className="color-picker__presets-label">Preset Colors</div>
              <div className="color-picker__presets-grid">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    className={`color-picker__preset ${
                      normalizeHex(preset) === normalizeHex(hexInput)
                        ? 'color-picker__preset--active'
                        : ''
                    }`}
                    style={{ backgroundColor: preset }}
                    onClick={() => handlePresetClick(preset)}
                    title={preset}
                    aria-label={`Preset color ${preset}`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="dialog__footer">
            <button
              className="designer-button"
              onClick={onClose}
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
