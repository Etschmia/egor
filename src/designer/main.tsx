import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Designer from './Designer';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Designer />
  </StrictMode>
);
