/**
 * Wall Types Asset Module
 * Handles wall type specific functionality
 */

import type { AssetTypeModule } from './index';
import WallTypeList from '../components/WallTypeList';
import PropertyPanel from '../components/PropertyPanel';
import NewWallTypeDialog from '../components/NewWallTypeDialog';

const wallTypesModule: AssetTypeModule = {
  AssetList: WallTypeList,
  PropertyEditor: PropertyPanel,
  CreateDialog: NewWallTypeDialog,
  
  metadata: {
    displayName: 'Wall Types',
    description: 'Manage wall textures and appearances',
    icon: '🧱',
  },
};

export default wallTypesModule;
