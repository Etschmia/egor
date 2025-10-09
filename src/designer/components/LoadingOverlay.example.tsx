/**
 * LoadingOverlay Component - Usage Examples
 * 
 * A full-screen loading overlay with spinner and progress message.
 * Styled with Level Editor theme.
 */

import { LoadingOverlay } from './LoadingOverlay';

// Example 1: Basic usage with default message
export function Example1() {
  return <LoadingOverlay />;
}

// Example 2: Custom message
export function Example2() {
  return <LoadingOverlay message="Loading theme..." />;
}

// Example 3: Conditional rendering
export function Example3() {
  const isLoading = true; // This would come from state
  
  return (
    <div>
      <LoadingOverlay visible={isLoading} message="Saving changes..." />
      {/* Your app content */}
    </div>
  );
}

// Example 4: Integration with Designer component
export function Example4() {
  const state = {
    isLoading: false,
    loadingMessage: 'Loading...',
  };

  return (
    <div className="designer-container">
      {/* Your designer content */}
      
      {/* Loading overlay - shows when isLoading is true */}
      <LoadingOverlay 
        visible={state.isLoading} 
        message={state.loadingMessage} 
      />
    </div>
  );
}

// Example 5: Different loading states
export function Example5() {
  const loadingStates = {
    loadingTheme: 'Loading theme...',
    savingTheme: 'Saving theme...',
    generatingTexture: 'Generating texture preview...',
    importingTheme: 'Importing theme...',
    exportingTheme: 'Exporting theme...',
  };

  const currentState = 'loadingTheme';
  const isLoading = true;

  return (
    <LoadingOverlay 
      visible={isLoading} 
      message={loadingStates[currentState as keyof typeof loadingStates]} 
    />
  );
}

/**
 * Integration Notes:
 * 
 * 1. The LoadingOverlay should be placed at the root level of your component
 *    to ensure it covers the entire screen.
 * 
 * 2. Use the `visible` prop to control when the overlay is shown.
 * 
 * 3. The overlay has a z-index of 2000, ensuring it appears above all other content.
 * 
 * 4. The component includes proper ARIA attributes for accessibility:
 *    - role="status"
 *    - aria-live="polite"
 *    - aria-busy="true"
 * 
 * 5. The spinner animation is smooth and performant, using CSS animations.
 * 
 * 6. The overlay background is semi-transparent (95% opacity) to maintain
 *    context of what's underneath while clearly indicating a loading state.
 */
