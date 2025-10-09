/**
 * Pictures Asset Module (Placeholder)
 * Will be implemented in future tasks
 */

import type { AssetTypeModule } from './index';

// Placeholder components
const PlaceholderList = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>Pictures</h3>
    <p>Coming soon...</p>
  </div>
);

const PlaceholderEditor = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <p>Select a picture to edit</p>
  </div>
);

const PlaceholderDialog = () => null;

const picturesModule: AssetTypeModule = {
  AssetList: PlaceholderList,
  PropertyEditor: PlaceholderEditor,
  CreateDialog: PlaceholderDialog,
  
  metadata: {
    displayName: 'Pictures',
    description: 'Manage wall pictures and decorations',
    icon: '🖼️',
  },
};

export default picturesModule;
