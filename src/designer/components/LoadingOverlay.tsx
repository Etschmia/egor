import React from 'react';

export interface LoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

export function LoadingOverlay({ message = 'Loading...', visible = true }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-overlay__content">
        <div className="loading-overlay__spinner" aria-hidden="true">
          <div className="loading-overlay__spinner-ring"></div>
          <div className="loading-overlay__spinner-ring"></div>
          <div className="loading-overlay__spinner-ring"></div>
        </div>
        <div className="loading-overlay__message">{message}</div>
      </div>
    </div>
  );
}

export default LoadingOverlay;
