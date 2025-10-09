/**
 * Enemies Asset Module (Placeholder)
 * Will be implemented in future tasks
 */

import type { AssetTypeModule } from './index';

// Placeholder components
const PlaceholderList = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h3>Enemies</h3>
    <p>Coming soon...</p>
  </div>
);

const PlaceholderEditor = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <p>Select an enemy to edit</p>
  </div>
);

const PlaceholderDialog = () => null;

const enemiesModule: AssetTypeModule = {
  AssetList: PlaceholderList,
  PropertyEditor: PlaceholderEditor,
  CreateDialog: PlaceholderDialog,
  
  metadata: {
    displayName: 'Enemies',
    description: 'Manage enemy sprites and behaviors',
    icon: '👾',
  },
};

export default enemiesModule;
