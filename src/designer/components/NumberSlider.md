# NumberSlider Component

## Overview
The NumberSlider component provides an interactive slider control for adjusting numeric properties with real-time visual feedback. It follows the Level Editor design theme and integrates seamlessly with the Designer Mode property panel.

## Features
✅ Slider with min/max/step from NumberProperty
✅ Display current value with unit
✅ Real-time value updates
✅ Styled with Level Editor theme
✅ Visual progress indicator
✅ Min/max range display
✅ Accessible with ARIA attributes
✅ Responsive design

## API

### Props

```typescript
interface NumberSliderProps {
  property: NumberProperty;  // The number property to control
  label: string;             // Display label for the slider
  onChange: (value: number) => void;  // Callback when value changes
}

interface NumberProperty {
  value: number;   // Current value
  min: number;     // Minimum value
  max: number;     // Maximum value
  step: number;    // Step increment
  unit?: string;   // Optional unit (e.g., "px", "%", "°")
}
```

### Usage Example

```tsx
import NumberSlider from './NumberSlider';

function MyComponent() {
  const widthProperty = {
    value: 100,
    min: 0,
    max: 200,
    step: 1,
    unit: 'px'
  };

  const handleChange = (newValue: number) => {
    console.log('Width changed to:', newValue);
  };

  return (
    <NumberSlider
      property={widthProperty}
      label="Width"
      onChange={handleChange}
    />
  );
}
```

## Visual Design

The component consists of:
1. **Label Row**: Shows the property name and current value with unit
2. **Slider Track**: Interactive range input with visual progress indicator
3. **Range Display**: Shows min and max values below the slider

### Styling Features
- Progress bar fills from left to right based on current value
- Thumb has accent color border for visibility
- Hover effects on thumb (scale up)
- Focus visible outline for accessibility
- Monospace font for numeric values
- Responsive layout for mobile devices

## Integration

The NumberSlider is integrated into:
- **PropertyPanel**: Used for dimension properties (width, height, spacing, borderWidth)
- **PropertyPanel**: Used for texture intensity
- **PropertyPanel**: Used for effect properties (shadow offset/blur, highlight intensity)
- **PropertyEditor**: Used for all numeric properties in the legacy editor

## Requirements Satisfied

✅ **Requirement 5.7**: Dimensionseigenschaften sollen als Slider mit Wertanzeige dargestellt werden
✅ **Requirement 5.8**: Der Benutzer soll einen Slider bewegen und der Wert soll in Echtzeit aktualisiert werden

## Accessibility

- ARIA labels for screen readers
- Keyboard navigation support (arrow keys, page up/down, home/end)
- Focus visible indicators
- Value text announced to screen readers
- Proper semantic HTML

## Browser Support

Works in all modern browsers that support:
- CSS custom properties
- Range input type
- Linear gradients
- CSS transforms

## Future Enhancements

Potential improvements:
- Double-click to enter exact value
- Keyboard shortcuts for fine-tuning (Shift+Arrow for smaller steps)
- Visual tick marks for common values
- Animation on value change
- Undo/redo integration
