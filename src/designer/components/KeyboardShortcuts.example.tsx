/**
 * Example usage of the KeyboardShortcuts component
 * 
 * This file demonstrates how to integrate the KeyboardShortcuts modal
 * into your application.
 */

import { useState } from 'react';
import KeyboardShortcuts from './KeyboardShortcuts';

export default function KeyboardShortcutsExample() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Keyboard Shortcuts Modal Example</h1>
      
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setShowShortcuts(true)}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show Keyboard Shortcuts
        </button>
        
        <p style={{ marginTop: '10px', color: '#888' }}>
          Or press <kbd>F1</kbd> to open the shortcuts modal
        </p>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}

/**
 * Integration Example in Designer.tsx:
 * 
 * 1. Import the component:
 *    import { KeyboardShortcuts } from './components';
 * 
 * 2. Add state for showing/hiding:
 *    const [showShortcuts, setShowShortcuts] = useState(false);
 * 
 * 3. Add handler for opening:
 *    const handleShowShortcuts = () => setShowShortcuts(true);
 * 
 * 4. Connect to keyboard shortcuts hook:
 *    useKeyboardShortcuts({
 *      onShowShortcuts: handleShowShortcuts,
 *      // ... other handlers
 *    });
 * 
 * 5. Render the component:
 *    <KeyboardShortcuts
 *      isOpen={showShortcuts}
 *      onClose={() => setShowShortcuts(false)}
 *    />
 */
