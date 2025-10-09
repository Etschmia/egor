/**
 * Error Boundary Test Component
 * 
 * This file demonstrates how to test the ErrorBoundary component
 * and provides examples of intentional errors for testing purposes.
 */

import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * Component that throws an error when clicked
 */
function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is an intentional error for testing!');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>Buggy Component</h3>
      <p>This component will throw an error when you click the button.</p>
      <button onClick={() => setShouldThrow(true)}>
        Trigger Error
      </button>
    </div>
  );
}

/**
 * Component that throws an error during render
 */
function AlwaysBuggyComponent() {
  throw new Error('This component always throws an error!');
}

/**
 * Test component to demonstrate ErrorBoundary usage
 */
export function ErrorBoundaryTest() {
  const [showBuggy, setShowBuggy] = useState(false);
  const [showAlwaysBuggy, setShowAlwaysBuggy] = useState(false);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Error Boundary Test</h1>
      <p>This page demonstrates the ErrorBoundary component in action.</p>

      <div style={{ marginTop: '40px' }}>
        <h2>Test 1: Conditional Error</h2>
        <p>This component throws an error when you click the button.</p>
        <button 
          onClick={() => setShowBuggy(!showBuggy)}
          style={{ marginBottom: '20px' }}
        >
          {showBuggy ? 'Hide' : 'Show'} Buggy Component
        </button>

        {showBuggy && (
          <ErrorBoundary section="Test Section 1">
            <BuggyComponent />
          </ErrorBoundary>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Test 2: Immediate Error</h2>
        <p>This component throws an error immediately on render.</p>
        <button 
          onClick={() => setShowAlwaysBuggy(!showAlwaysBuggy)}
          style={{ marginBottom: '20px' }}
        >
          {showAlwaysBuggy ? 'Hide' : 'Show'} Always Buggy Component
        </button>

        {showAlwaysBuggy && (
          <ErrorBoundary section="Test Section 2">
            <AlwaysBuggyComponent />
          </ErrorBoundary>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Test 3: Custom Fallback</h2>
        <p>This error boundary uses a custom fallback UI.</p>
        <button 
          onClick={() => setShowAlwaysBuggy(!showAlwaysBuggy)}
          style={{ marginBottom: '20px' }}
        >
          Toggle
        </button>

        {showAlwaysBuggy && (
          <ErrorBoundary 
            section="Test Section 3"
            fallback={
              <div style={{ 
                padding: '20px', 
                background: '#ff6b6b', 
                color: 'white',
                borderRadius: '8px'
              }}>
                <h3>Custom Error UI</h3>
                <p>This is a custom fallback component!</p>
              </div>
            }
          >
            <AlwaysBuggyComponent />
          </ErrorBoundary>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Test 4: Nested Error Boundaries</h2>
        <p>Multiple error boundaries can be nested to isolate errors.</p>
        
        <ErrorBoundary section="Outer Boundary">
          <div style={{ padding: '20px', border: '2px solid blue' }}>
            <h3>Outer Boundary</h3>
            <p>This content is protected by the outer boundary.</p>
            
            <ErrorBoundary section="Inner Boundary">
              <div style={{ padding: '20px', border: '2px solid green', marginTop: '10px' }}>
                <h4>Inner Boundary</h4>
                <p>This content is protected by the inner boundary.</p>
                {showBuggy && <BuggyComponent />}
              </div>
            </ErrorBoundary>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default ErrorBoundaryTest;
