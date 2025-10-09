# Error Boundary Component

## Overview

The `ErrorBoundary` component is a React error boundary that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of crashing the entire application.

## Features

- ✅ Catches and handles React component errors
- ✅ Provides default fallback UI with error details
- ✅ Supports custom fallback UI
- ✅ Logs errors to console with detailed information
- ✅ Shows error details in development mode
- ✅ Allows users to retry or reload the page
- ✅ Integrates with toast notifications
- ✅ Accessible and keyboard-friendly

## Usage

### Basic Usage

```tsx
import { ErrorBoundary } from './components';

function App() {
  return (
    <ErrorBoundary section="Main App">
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

```tsx
<ErrorBoundary 
  section="Custom Section"
  fallback={
    <div className="custom-error">
      <h2>Oops! Something went wrong</h2>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  }
>
  <YourComponent />
</ErrorBoundary>
```

### With Error Handler

```tsx
<ErrorBoundary 
  section="Important Section"
  onError={(error, errorInfo) => {
    // Send to error tracking service
    console.error('Error caught:', error, errorInfo);
    // Show toast notification
    toast.error('An error occurred. Please try again.');
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Nested Error Boundaries

```tsx
<ErrorBoundary section="App">
  <Header />
  
  <ErrorBoundary section="Sidebar">
    <Sidebar />
  </ErrorBoundary>
  
  <ErrorBoundary section="Main Content">
    <MainContent />
  </ErrorBoundary>
  
  <ErrorBoundary section="Footer">
    <Footer />
  </ErrorBoundary>
</ErrorBoundary>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The component tree to protect |
| `section` | `string` | No | Name of the section for error logging |
| `fallback` | `ReactNode` | No | Custom fallback UI to display on error |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | No | Callback function called when an error is caught |

## Default Fallback UI

The default fallback UI includes:

- ⚠️ Warning icon with pulse animation
- Error title: "Something went wrong"
- Descriptive error message
- Error details (development mode only)
  - Error message and stack trace
  - Component stack trace
- Action buttons:
  - "Try Again" - Resets the error boundary
  - "Reload Page" - Reloads the entire page

## Error Logging

When an error is caught, the following information is logged:

```javascript
{
  timestamp: "2025-01-09T12:34:56.789Z",
  section: "Section Name",
  error: {
    name: "Error",
    message: "Error message",
    stack: "Error stack trace"
  },
  componentStack: "Component stack trace",
  userAgent: "Browser user agent",
  url: "Current page URL"
}
```

## Integration with Designer Mode

In the Designer Mode, error boundaries are used to protect:

1. **Header** - Theme selector, save/undo/redo buttons
2. **Sidebar** - Asset list and selection
3. **Live Preview** - Canvas rendering and texture generation
4. **Property Panel** - Property editors and controls

Each section has its own error boundary, so if one section fails, the others continue to work.

## Best Practices

### 1. Granular Error Boundaries

Wrap individual sections rather than the entire app:

```tsx
// ✅ Good - Granular boundaries
<App>
  <ErrorBoundary section="Header">
    <Header />
  </ErrorBoundary>
  <ErrorBoundary section="Content">
    <Content />
  </ErrorBoundary>
</App>

// ❌ Bad - Single boundary for everything
<ErrorBoundary section="App">
  <App>
    <Header />
    <Content />
  </App>
</ErrorBoundary>
```

### 2. Meaningful Section Names

Use descriptive section names for better debugging:

```tsx
// ✅ Good
<ErrorBoundary section="Live Preview Canvas">

// ❌ Bad
<ErrorBoundary section="Section 1">
```

### 3. Error Notifications

Integrate with toast notifications for better UX:

```tsx
<ErrorBoundary 
  section="Property Panel"
  onError={() => {
    toast.error('An error occurred in the property panel.');
  }}
>
  <PropertyPanel />
</ErrorBoundary>
```

### 4. Custom Fallbacks for Critical Sections

Provide custom fallbacks for critical sections:

```tsx
<ErrorBoundary 
  section="Payment Form"
  fallback={
    <div className="error-fallback">
      <h2>Payment Error</h2>
      <p>We couldn't process your payment. Please contact support.</p>
      <a href="/support">Contact Support</a>
    </div>
  }
>
  <PaymentForm />
</ErrorBoundary>
```

## Limitations

Error boundaries do **NOT** catch errors in:

- Event handlers (use try-catch instead)
- Asynchronous code (setTimeout, promises)
- Server-side rendering
- Errors thrown in the error boundary itself

### Handling Event Handler Errors

```tsx
function MyComponent() {
  const handleClick = () => {
    try {
      // Code that might throw
      riskyOperation();
    } catch (error) {
      console.error('Error in event handler:', error);
      toast.error('An error occurred');
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Handling Async Errors

```tsx
function MyComponent() {
  const fetchData = async () => {
    try {
      const data = await api.getData();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

## Testing

To test error boundaries, you can use the provided test component:

```tsx
import ErrorBoundaryTest from './components/ErrorBoundary.test';

// In your test file or development environment
<ErrorBoundaryTest />
```

This provides several test scenarios:
- Conditional errors (triggered by user action)
- Immediate errors (on component mount)
- Custom fallback UI
- Nested error boundaries

## Styling

The error boundary uses the following CSS classes:

- `.error-boundary` - Main container
- `.error-boundary__content` - Content wrapper
- `.error-boundary__icon` - Warning icon
- `.error-boundary__title` - Error title
- `.error-boundary__message` - Error message
- `.error-boundary__details` - Error details (dev mode)
- `.error-boundary__stack` - Stack trace
- `.error-boundary__actions` - Action buttons

All styles follow the Designer Mode color scheme and are fully responsive.

## Accessibility

The error boundary is fully accessible:

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly

## Requirements Satisfied

This component satisfies the following requirements:

- **12.1** - Error handling with user-friendly messages
- **12.2** - Error feedback and recovery options
- **14.1-14.6** - Accessibility features

## Related Components

- `Toast` - For error notifications
- `LoadingOverlay` - For loading states
- `Designer` - Main component using error boundaries

## Future Enhancements

Possible improvements:

1. Integration with error tracking services (Sentry, LogRocket)
2. Error reporting to backend
3. Automatic error recovery strategies
4. Error analytics and monitoring
5. User feedback collection on errors
