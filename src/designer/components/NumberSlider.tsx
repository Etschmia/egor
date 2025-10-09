import { useState, useEffect } from 'react';
import type { NumberProperty } from '../types';

interface NumberSliderProps {
  property: NumberProperty;
  label: string;
  onChange: (value: number) => void;
}

export default function NumberSlider({ property, label, onChange }: NumberSliderProps) {
  const [localValue, setLocalValue] = useState(property.value);

  // Update local value when property changes externally
  useEffect(() => {
    setLocalValue(property.value);
  }, [property.value]);

  // Handle slider change with real-time updates
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Calculate percentage for visual feedback
  const percentage = ((localValue - property.min) / (property.max - property.min)) * 100;

  return (
    <div className="number-slider">
      <label className="number-slider__label">
        <span className="number-slider__label-text">{label}</span>
        <span className="number-slider__value">
          {localValue}
          {property.unit && ` ${property.unit}`}
        </span>
      </label>
      
      <div className="number-slider__track-container">
        <input
          type="range"
          className="number-slider__input"
          min={property.min}
          max={property.max}
          step={property.step}
          value={localValue}
          onChange={handleChange}
          aria-label={label}
          aria-valuemin={property.min}
          aria-valuemax={property.max}
          aria-valuenow={localValue}
          aria-valuetext={`${localValue}${property.unit ? ` ${property.unit}` : ''}`}
          style={{
            background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${percentage}%, var(--bg-tertiary) ${percentage}%, var(--bg-tertiary) 100%)`
          }}
        />
      </div>
      
      <div className="number-slider__range">
        <span className="number-slider__range-min">
          {property.min}
          {property.unit && ` ${property.unit}`}
        </span>
        <span className="number-slider__range-max">
          {property.max}
          {property.unit && ` ${property.unit}`}
        </span>
      </div>
    </div>
  );
}
