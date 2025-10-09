/**
 * Lights Asset Module (Placeholder)
 * Will be implemented in future tasks
 */

import type { AssetTypeModule } from './index';

// Placeholder components
const PlaceholderList = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>Lights</h3>
    <p>Coming soon...</p>
  </div>
);

const PlaceholderEditor = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <p>Select a light to edit</p>
  </div>
);

const PlaceholderDialog = () => null;

const lightsModule: AssetTypeModule = {
  AssetList: PlaceholderList,
  PropertyEditor: PlaceholderEditor,
  CreateDialog: PlaceholderDialog,
  
  metadata: {
    displayName: 'Lights',
    description: 'Manage lighting effects',
    icon: '💡',
  },
};

export default lightsModule;
