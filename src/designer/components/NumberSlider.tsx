import React, { useState, useEffect } from 'react';
import type { NumberSliderProps } from '../types';

export const NumberSlider: React.FC<NumberSliderProps> = ({
  numberProperty,
  onChange,
  label
}) => {
  console.log('🔢 NumberSlider: Rendering', { 
    label, 
    value: numberProperty.value, 
    min: numberProperty.min,
    max: numberProperty.max,
    onChange: typeof onChange,
    element: 'Look for a slider or number input'
  });
  const [tempValue, setTempValue] = useState(numberProperty.value);
  const [inputValue, setInputValue] = useState(numberProperty.value.toString());

  useEffect(() => {
    setTempValue(numberProperty.value);
    setInputValue(numberProperty.value.toString());
  }, [numberProperty.value]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    console.log('🔢 NumberSlider: Slider change', { label, value, previous: tempValue });
    setTempValue(value);
    setInputValue(value.toString());
    onChange(value);
    console.log('🔢 NumberSlider: onChange callback executed');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= numberProperty.min && numValue <= numberProperty.max) {
      setTempValue(numValue);
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < numberProperty.min || numValue > numberProperty.max) {
      // Reset to current valid value
      setInputValue(tempValue.toString());
    }
  };

  const handleQuickSet = (value: number) => {
    setTempValue(value);
    setInputValue(value.toString());
    onChange(value);
  };

  const step = numberProperty.step || 1;
  const percentage = ((tempValue - numberProperty.min) / (numberProperty.max - numberProperty.min)) * 100;

  return (
    <div className="number-slider">
      {label && (
        <label className="number-slider__label">
          {label}
          {numberProperty.unit && (
            <span className="number-slider__unit">({numberProperty.unit})</span>
          )}
        </label>
      )}

      <div className="number-slider__controls">
        {/* Range slider */}
        <div className="number-slider__slider-container">
          <input
            type="range"
            className="number-slider__slider"
            min={numberProperty.min}
            max={numberProperty.max}
            step={step}
            value={tempValue}
            onChange={handleSliderChange}
            style={{
              background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, var(--track-color) ${percentage}%, var(--track-color) 100%)`,
              border: '2px solid #00ff00',
              borderRadius: '4px',
              cursor: 'pointer',
              height: '20px'
            }}
            title="DRAG THIS SLIDER!"
          />
          
          {/* Slider track marks for major values */}
          <div className="number-slider__marks">
            {[numberProperty.min, numberProperty.max].map((mark, index) => (
              <div
                key={index}
                className="number-slider__mark"
                style={{
                  left: `${((mark - numberProperty.min) / (numberProperty.max - numberProperty.min)) * 100}%`
                }}
              >
                <span className="number-slider__mark-label">{mark}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Numeric input */}
        <div className="number-slider__input-container">
          <input
            type="number"
            className="number-slider__input"
            min={numberProperty.min}
            max={numberProperty.max}
            step={step}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
          {numberProperty.unit && (
            <span className="number-slider__input-unit">{numberProperty.unit}</span>
          )}
        </div>
      </div>

      {/* Quick preset buttons for common values */}
      <div className="number-slider__presets">
        {/* Min/Max buttons */}
        <button
          className={`number-slider__preset ${tempValue === numberProperty.min ? 'number-slider__preset--active' : ''}`}
          onClick={() => handleQuickSet(numberProperty.min)}
          title={`Minimum value: ${numberProperty.min}`}
        >
          Min
        </button>

        {/* Middle value if it makes sense */}
        {numberProperty.max - numberProperty.min > step * 4 && (
          <button
            className={`number-slider__preset ${Math.abs(tempValue - ((numberProperty.min + numberProperty.max) / 2)) < step ? 'number-slider__preset--active' : ''}`}
            onClick={() => handleQuickSet((numberProperty.min + numberProperty.max) / 2)}
            title={`Middle value: ${(numberProperty.min + numberProperty.max) / 2}`}
          >
            Mid
          </button>
        )}

        <button
          className={`number-slider__preset ${tempValue === numberProperty.max ? 'number-slider__preset--active' : ''}`}
          onClick={() => handleQuickSet(numberProperty.max)}
          title={`Maximum value: ${numberProperty.max}`}
        >
          Max
        </button>

        {/* Reset to default if different from current */}
        {numberProperty.value !== tempValue && (
          <button
            className="number-slider__preset number-slider__preset--reset"
            onClick={() => handleQuickSet(numberProperty.value)}
            title={`Reset to default: ${numberProperty.value}`}
          >
            Reset
          </button>
        )}
      </div>

      {/* Current value display */}
      <div className="number-slider__value-display">
        <span className="number-slider__current-value">
          {tempValue}{numberProperty.unit || ''}
        </span>
        <span className="number-slider__value-range">
          Range: {numberProperty.min} - {numberProperty.max}
        </span>
      </div>
    </div>
  );
};