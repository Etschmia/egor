/**
 * Toast Notification System - Usage Example
 * 
 * This file demonstrates how to use the toast notification system in the Designer Mode.
 */

import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';

export function ToastExample() {
  const { toasts, success, error, warning, info, removeToast } = useToast();

  return (
    <div>
      {/* Toast Container - Place this at the root of your app */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Example buttons to trigger different toast types */}
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => success('Operation completed successfully!')}>
          Show Success
        </button>
        
        <button onClick={() => error('An error occurred. Please try again.')}>
          Show Error
        </button>
        
        <button onClick={() => warning('This action cannot be undone.')}>
          Show Warning
        </button>
        
        <button onClick={() => info('New features are available.')}>
          Show Info
        </button>
        
        <button onClick={() => success('This will stay for 10 seconds', 10000)}>
          Show Long Toast (10s)
        </button>
      </div>
    </div>
  );
}

/**
 * Integration Example in Designer.tsx:
 * 
 * import { useToast } from './hooks/useToast';
 * import { ToastContainer } from './components/Toast';
 * 
 * function Designer() {
 *   const { toasts, success, error, warning, info, removeToast } = useToast();
 * 
 *   const handleSave = async () => {
 *     try {
 *       await saveTheme();
 *       success('Theme saved successfully!');
 *     } catch (err) {
 *       error('Failed to save theme. Please try again.');
 *     }
 *   };
 * 
 *   return (
 *     <div className="designer-container">
 *       <ToastContainer toasts={toasts} onClose={removeToast} />
 *       {/* Rest of your app *\/}
 *     </div>
 *   );
 * }
 */
