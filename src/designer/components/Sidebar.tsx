import { useState } from 'react';
import type { AssetType, Theme } from '../types';
import WallTypeList from './WallTypeList';

interface SidebarProps {
  assetType: AssetType;
  activeTheme: Theme | null;
  selectedAssetId: string | null;
  onAssetSelect: (assetId: string) => void;
  onAddNew: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  assetType,
  activeTheme,
  selectedAssetId,
  onAssetSelect,
  onAddNew,
  collapsed: externalCollapsed,
  onToggleCollapse: externalToggle,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use external collapsed state if provided, otherwise use internal
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleToggleCollapse = () => {
    if (externalToggle) {
      externalToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  // Render content based on asset type
  const renderContent = () => {
    if (!activeTheme) {
      return (
        <div className="sidebar__empty">
          <div className="sidebar__empty-icon">📦</div>
          <div className="sidebar__empty-title">No Theme Loaded</div>
          <div className="sidebar__empty-text">
            Select or create a theme to get started
          </div>
        </div>
      );
    }

    switch (assetType) {
      case 'wallTypes':
        return (
          <WallTypeList
            wallTypes={activeTheme.wallTypes}
            selectedWallTypeId={selectedAssetId}
            onWallTypeSelect={onAssetSelect}
            onAddNew={onAddNew}
          />
        );

      case 'objects':
      case 'pictures':
      case 'lights':
      case 'enemies':
        return (
          <div className="sidebar__coming-soon">
            <div className="sidebar__coming-soon-icon">🚧</div>
            <div className="sidebar__coming-soon-title">Coming Soon</div>
            <div className="sidebar__coming-soon-text">
              {assetType.charAt(0).toUpperCase() + assetType.slice(1)} editing will be available in a future update
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <aside
      className={`designer-sidebar ${collapsed ? 'designer-sidebar--collapsed' : ''}`}
      aria-label="Asset list sidebar"
    >
      {/* Toggle Button */}
      <button
        className="sidebar__toggle"
        onClick={handleToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="sidebar__toggle-icon">
          {collapsed ? '▶' : '◀'}
        </span>
      </button>

      {/* Sidebar Content */}
      {!collapsed && (
        <div className="sidebar__content">
          {/* Header */}
          <div className="sidebar__header">
            <h2 className="sidebar__title">
              {assetType === 'wallTypes' && 'Wall Types'}
              {assetType === 'objects' && 'Objects'}
              {assetType === 'pictures' && 'Pictures'}
              {assetType === 'lights' && 'Lights'}
              {assetType === 'enemies' && 'Enemies'}
            </h2>
            {activeTheme && (
              <div className="sidebar__count">
                {assetType === 'wallTypes' && Object.keys(activeTheme.wallTypes).length}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="sidebar__body">
            {renderContent()}
          </div>
        </div>
      )}
    </aside>
  );
}
