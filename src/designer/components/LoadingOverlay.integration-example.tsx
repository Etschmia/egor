/**
 * LoadingOverlay Integration Example
 * 
 * This file demonstrates how to integrate the LoadingOverlay component
 * into the Designer application.
 */

import { useState } from 'react';
import { LoadingOverlay } from './LoadingOverlay';

/**
 * Example: Integration with Designer component
 * 
 * Shows how to use LoadingOverlay with the Designer's loading state
 */
export function DesignerWithLoadingOverlay() {
  const [state, setState] = useState({
    isLoading: false,
    loadingMessage: 'Loading...',
  });

  // Simulate loading a theme
  const handleLoadTheme = async () => {
    setState({ isLoading: true, loadingMessage: 'Loading theme...' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setState({ isLoading: false, loadingMessage: '' });
  };

  // Simulate saving a theme
  const handleSaveTheme = async () => {
    setState({ isLoading: true, loadingMessage: 'Saving changes...' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setState({ isLoading: false, loadingMessage: '' });
  };

  // Simulate generating texture
  const handleGenerateTexture = async () => {
    setState({ isLoading: true, loadingMessage: 'Generating texture preview...' });
    
    // Simulate texture generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState({ isLoading: false, loadingMessage: '' });
  };

  return (
    <div className="designer-container">
      {/* Header */}
      <header className="designer-header">
        <h1>Designer Mode</h1>
        <div>
          <button onClick={handleLoadTheme}>Load Theme</button>
          <button onClick={handleSaveTheme}>Save Theme</button>
          <button onClick={handleGenerateTexture}>Generate Texture</button>
        </div>
      </header>

      {/* Main content */}
      <main className="designer-main">
        <p>Designer content goes here...</p>
      </main>

      {/* Loading Overlay - shows when isLoading is true */}
      <LoadingOverlay 
        visible={state.isLoading} 
        message={state.loadingMessage} 
      />
    </div>
  );
}

/**
 * Example: Using LoadingOverlay with useThemeManager hook
 */
export function DesignerWithThemeManager() {
  // In the actual Designer component, this would come from useThemeManager
  const themeManager = {
    isLoading: false,
    loadingMessage: 'Loading...',
  };

  return (
    <div className="designer-container">
      {/* Your designer content */}
      
      {/* Loading overlay controlled by theme manager state */}
      <LoadingOverlay 
        visible={themeManager.isLoading} 
        message={themeManager.loadingMessage} 
      />
    </div>
  );
}

/**
 * Example: Multiple loading states
 */
export function DesignerWithMultipleStates() {
  const [loadingState] = useState<{
    type: 'idle' | 'loading' | 'saving' | 'generating' | 'importing' | 'exporting';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });

  const loadingMessages = {
    loading: 'Loading theme...',
    saving: 'Saving changes...',
    generating: 'Generating texture preview...',
    importing: 'Importing theme...',
    exporting: 'Exporting theme...',
  };

  const isLoading = loadingState.type !== 'idle';
  const message = loadingState.type !== 'idle' 
    ? loadingMessages[loadingState.type as keyof typeof loadingMessages]
    : '';

  return (
    <div className="designer-container">
      {/* Your designer content */}
      
      <LoadingOverlay visible={isLoading} message={message} />
    </div>
  );
}

/**
 * Integration Notes:
 * 
 * 1. Place LoadingOverlay at the root level of Designer component
 * 2. Control visibility with state.isLoading
 * 3. Update message based on current operation
 * 4. The overlay will block all user interaction while visible
 * 5. Use for operations that take > 500ms to complete
 * 
 * Recommended loading messages:
 * - "Loading theme..." - When loading a theme from API
 * - "Saving changes..." - When saving theme modifications
 * - "Generating texture preview..." - When generating texture
 * - "Importing theme..." - When importing a theme file
 * - "Exporting theme..." - When exporting a theme
 * - "Creating new theme..." - When creating a new theme
 * - "Deleting theme..." - When deleting a theme
 */
