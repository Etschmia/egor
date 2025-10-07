import { createRoot } from 'react-dom/client';
import { Designer } from './Designer';

const container = document.getElementById('designer-root');
if (!container) {
  throw new Error('Designer root element not found');
}

const root = createRoot(container);
root.render(<Designer />);