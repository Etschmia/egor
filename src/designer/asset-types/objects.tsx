/**
 * Objects Asset Module (Placeholder)
 * Will be implemented in future tasks
 */

import type { AssetTypeModule } from './index';

// Placeholder components
const PlaceholderList = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>Objects</h3>
    <p>Coming soon...</p>
  </div>
);

const PlaceholderEditor = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <p>Select an object to edit</p>
  </div>
);

const PlaceholderDialog = () => null;

const objectsModule: AssetTypeModule = {
  AssetList: PlaceholderList,
  PropertyEditor: PlaceholderEditor,
  CreateDialog: PlaceholderDialog,
  
  metadata: {
    displayName: 'Objects',
    description: 'Manage game objects (vases, columns, etc.)',
    icon: '🏺',
  },
};

export default objectsModule;
