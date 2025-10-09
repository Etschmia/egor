# LivePreview Component - Visual Reference

## Component Layout

```
┌─────────────────────────────────────────────────────────────┐
│                      Live Preview Area                       │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │                  Canvas Preview                         │  │
│  │              (512x512 with tiled texture)               │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [Loading Overlay - when generating]             │  │  │
│  │  │                                                   │  │  │
│  │  │              ⟳ Spinner                           │  │  │
│  │  │         Generating texture...                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ [Error Overlay - when error occurs]             │  │  │
│  │  │                                                   │  │  │
│  │  │              ⚠ Warning Icon                      │  │  │
│  │  │           Generation Error                       │  │  │
│  │  │      [Specific error message]                    │  │  │
│  │  │           [Retry Button]                         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Performance                                            │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│  │ │Generation│ │  Render  │ │  Cache   │ │Cache Size│ │  │
│  │ │ 2.45ms   │ │ 3.12ms   │ │  ✓ Hit   │ │    15    │ │  │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Wall Type:    brick                                    │  │
│  │ Theme:        default                                  │  │
│  │ Resolution:   512×512                                  │  │
│  │ Scale:        2×                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## States

### 1. Normal State (Texture Displayed)
- Canvas shows tiled texture pattern
- Performance statistics visible below
- Info panel shows metadata
- No overlays

### 2. Loading State
- Semi-transparent overlay covers canvas
- Animated spinner in center
- "Generating texture..." message
- Performance stats hidden
- Appears immediately when update triggered

### 3. Error State
- Semi-transparent overlay covers canvas
- Warning icon (⚠) displayed
- "Generation Error" title
- Specific error message
- Retry button for recovery
- Performance stats hidden

### 4. No Selection State (Placeholder)
- Shows placeholder message
- "Select a theme to begin" or "Select a wall type to see the preview"
- No canvas rendered

## Color Scheme

### Canvas
- Background: `#1a1a1a` (dark gray)
- Border: `2px solid #333333`
- Border radius: `8px`
- Box shadow: `0 4px 12px rgba(0, 0, 0, 0.3)`

### Loading Overlay
- Background: `rgba(30, 30, 30, 0.9)`
- Spinner border: `4px solid #2a2a2a`
- Spinner top: `#4CAF50` (accent green)
- Text: `#cccccc` (light gray)

### Error Overlay
- Background: `rgba(30, 30, 30, 0.95)`
- Icon color: `#f44336` (red)
- Title: `#ffffff` (white)
- Message: `#cccccc` (light gray)

### Performance Stats
- Background: `#252525` (secondary bg)
- Border: `1px solid #333333`
- Stat boxes: `#2a2a2a` (tertiary bg)
- Labels: `#888888` (muted)
- Values: `#ffffff` (white, monospace)

### Info Panel
- Background: `#252525` (secondary bg)
- Border: `1px solid #333333`
- Labels: `#888888` (muted)
- Values: `#ffffff` (white, monospace)

## Animations

### Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
/* Duration: 0.8s linear infinite */
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* Duration: 0.2s ease */
```

### Stat Hover
- Transform: `translateY(-2px)`
- Box shadow: `0 2px 8px rgba(0, 0, 0, 0.2)`
- Border color: `#444444`
- Duration: `0.2s ease`

## Responsive Behavior

### Desktop (> 768px)
- Full layout as shown above
- 4-column grid for performance stats
- All info items in single row

### Tablet (≤ 768px)
- Reduced padding
- 2-column grid for performance stats
- Smaller error icon (48px)

### Mobile (≤ 480px)
- Minimal padding
- Single column for performance stats
- Info items stack vertically
- Smaller fonts

## Performance Metrics

### Generation Time
- Time to generate texture via TextureGenerator
- Typically 1-5ms for cached textures
- 10-50ms for new textures
- Format: `X.XXms` or `XXXμs` for sub-millisecond

### Render Time
- Total time from start to canvas draw complete
- Includes generation + tiling + drawing
- Typically 2-10ms
- Format: `X.XXms`

### Cache Status
- `✓ Hit`: Texture was in cache
- `✗ Miss`: Texture was generated fresh
- Helps identify performance bottlenecks

### Cache Size
- Number of textures currently cached
- Max: 100 (configurable in TextureGenerator)
- LRU eviction when full

## User Interactions

### Automatic Updates
- Debounced 100ms after prop changes
- Loading state appears immediately
- Smooth transition to new texture

### Error Recovery
- Click "Retry" button to regenerate
- Clears error state
- Attempts fresh generation

### Hover Effects
- Performance stat boxes lift on hover
- Info items highlight on hover
- Smooth transitions (0.2s)

## Integration Points

### Props
```typescript
interface LivePreviewProps {
  wallTypeId: string;    // From Designer state
  themeId: string;       // From active theme
  width?: number;        // Canvas width (default: 512)
  height?: number;       // Canvas height (default: 512)
  scale?: number;        // Texture scale (default: 2)
}
```

### Dependencies
- `TextureGenerator` from `src/shared/texture-generation/`
- Theme data from `useThemeManager` hook
- Wall type definitions from active theme

### State Flow
```
User selects wall type
    ↓
Designer updates selectedAssetId
    ↓
LivePreview receives new wallTypeId prop
    ↓
Debounce timer starts (100ms)
    ↓
Loading state shown
    ↓
TextureGenerator.generateTexture()
    ↓
Canvas rendering with tiling
    ↓
Performance stats calculated
    ↓
Final display with stats
```

## Accessibility

### Keyboard Navigation
- Canvas is not interactive (display only)
- Retry button is keyboard accessible
- Focus indicators on interactive elements

### Screen Readers
- Canvas has descriptive aria-label
- Loading state announced
- Error messages announced
- Performance stats readable

### Color Contrast
- All text meets WCAG AA standards
- Error messages highly visible
- Loading indicator clearly visible

## Browser Compatibility

### Canvas Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback for no canvas support (error message)

### CSS Features
- Flexbox for layout
- Grid for stats layout
- CSS animations
- Border radius and box shadows

### Performance
- Hardware accelerated canvas rendering
- Efficient tiling algorithm
- Minimal reflows and repaints
- Debounced updates prevent jank
