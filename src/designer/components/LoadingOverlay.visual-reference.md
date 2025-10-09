# LoadingOverlay Component - Visual Reference

## Overview
The LoadingOverlay component provides a full-screen loading indicator with a spinner and progress message. It follows the Level Editor dark theme design system.

## Visual Design

### Layout
```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                   [Full Screen Overlay]                  │
│                  Background: rgba(30,30,30,0.95)         │
│                                                           │
│                                                           │
│                      ╔═══════╗                           │
│                      ║   ◯   ║  ← Animated Spinner       │
│                      ║  ◯ ◯  ║     (3 rotating rings)    │
│                      ║   ◯   ║                           │
│                      ╚═══════╝                           │
│                                                           │
│                   Loading theme...                       │
│                   ← Progress Message                     │
│                                                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Component Structure

### HTML Structure
```html
<div class="loading-overlay" role="status" aria-live="polite" aria-busy="true">
  <div class="loading-overlay__content">
    <div class="loading-overlay__spinner" aria-hidden="true">
      <div class="loading-overlay__spinner-ring"></div>
      <div class="loading-overlay__spinner-ring"></div>
      <div class="loading-overlay__spinner-ring"></div>
    </div>
    <div class="loading-overlay__message">Loading...</div>
  </div>
</div>
```

## Styling Details

### Colors (Level Editor Theme)
- **Overlay Background**: `rgba(30, 30, 30, 0.95)` - Semi-transparent dark
- **Spinner Ring 1**: `#4CAF50` (--accent-primary)
- **Spinner Ring 2**: `#45a049` (--accent-hover)
- **Spinner Ring 3**: `#2196F3` (--accent-info)
- **Message Text**: `#ffffff` (--text-primary)

### Dimensions
- **Spinner Size**: 64px × 64px (desktop), 48px × 48px (mobile)
- **Ring Border Width**: 3px
- **Gap between spinner and message**: 24px (--spacing-lg)
- **Message Max Width**: 400px (desktop), 300px (mobile)

### Animations
- **Fade In**: 0.2s ease (overlay appearance)
- **Spinner Rotation**: 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
- **Ring Delays**: 
  - Ring 1: -0.45s
  - Ring 2: -0.3s
  - Ring 3: -0.15s

### Typography
- **Message Font Size**: 16px (desktop), 14px (mobile)
- **Message Font Weight**: 500 (medium)
- **Message Line Height**: 1.5
- **Message Alignment**: Center

## States

### Visible
- Overlay is displayed with fade-in animation
- Spinner is rotating continuously
- Message is displayed below spinner
- Blocks all interaction with content underneath

### Hidden (visible=false)
- Component returns null
- No DOM elements rendered
- No performance impact

## Accessibility Features

### ARIA Attributes
- `role="status"` - Indicates a status update region
- `aria-live="polite"` - Screen readers announce changes politely
- `aria-busy="true"` - Indicates the application is busy
- `aria-hidden="true"` on spinner - Decorative element, not announced

### Keyboard Navigation
- No keyboard interaction needed (informational only)
- Overlay prevents interaction with underlying content

### Screen Reader Support
- Message text is announced to screen readers
- Spinner is hidden from screen readers (decorative)
- Status role ensures proper announcement timing

## Responsive Behavior

### Desktop (> 768px)
- Spinner: 64px × 64px
- Message: 16px font size
- Content padding: 32px (--spacing-xl)

### Mobile (≤ 768px)
- Spinner: 48px × 48px
- Message: 14px font size
- Content padding: 24px (--spacing-lg)
- Message max-width: 300px

## Usage Scenarios

### 1. Theme Loading
```tsx
<LoadingOverlay visible={isLoadingTheme} message="Loading theme..." />
```

### 2. Saving Changes
```tsx
<LoadingOverlay visible={isSaving} message="Saving changes..." />
```

### 3. Generating Texture
```tsx
<LoadingOverlay visible={isGenerating} message="Generating texture preview..." />
```

### 4. Importing Theme
```tsx
<LoadingOverlay visible={isImporting} message="Importing theme..." />
```

### 5. Exporting Theme
```tsx
<LoadingOverlay visible={isExporting} message="Exporting theme..." />
```

## Design Consistency

### Matches Level Editor Theme
✓ Uses CSS variables from design system
✓ Dark background with high opacity
✓ Accent colors for visual interest
✓ Smooth animations (< 300ms guideline)
✓ Responsive design
✓ Accessibility compliant

### Follows Design Patterns
✓ Full-screen overlay pattern
✓ Centered content layout
✓ Clear visual hierarchy
✓ Consistent spacing
✓ Professional spinner animation

## Performance Considerations

### Optimizations
- CSS animations (GPU accelerated)
- No JavaScript animation loops
- Conditional rendering (returns null when hidden)
- Minimal DOM elements
- No re-renders during animation

### Z-Index Management
- Z-index: 2000 (above all other content)
- Higher than dialogs (1000-1001)
- Ensures visibility during critical operations

## Integration Example

```tsx
import { LoadingOverlay } from './components';

function Designer() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const handleLoadTheme = async (themeId: string) => {
    setIsLoading(true);
    setLoadingMessage('Loading theme...');
    
    try {
      await loadTheme(themeId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="designer-container">
      {/* Your content */}
      
      <LoadingOverlay visible={isLoading} message={loadingMessage} />
    </div>
  );
}
```

## Testing Checklist

- [ ] Overlay covers entire screen
- [ ] Spinner animates smoothly
- [ ] Message is readable and centered
- [ ] Fade-in animation works
- [ ] Responsive on mobile devices
- [ ] Screen reader announces message
- [ ] Blocks interaction with content underneath
- [ ] Returns null when visible=false
- [ ] No console errors or warnings
- [ ] Matches Level Editor theme colors
