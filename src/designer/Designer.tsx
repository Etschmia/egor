import { useState, useEffect } from 'react';
import type { DesignerState, AssetType } from './types';
import { Header, AssetTypeSelector, Sidebar, NewWallTypeDialog, PropertyPanel } from './components';
import { useThemeManager } from './hooks/useThemeManager';
import './styles.css';

export default function Designer() {
  const [state, setState] = useState<DesignerState>({
    selectedAssetType: 'wallTypes',
    selectedAssetId: null,
    activeTheme: null,
    availableThemes: [],
    isDirty: false,
    history: [],
    historyIndex: -1,
    sidebarCollapsed: false,
    showShortcuts: false,
    isLoading: false,
    error: null,
  });

  const [showNewWallTypeDialog, setShowNewWallTypeDialog] = useState(false);

  const themeManager = useThemeManager();

  // Load all themes on mount
  useEffect(() => {
    themeManager.loadAllThemes();
  }, []);

  // Sync theme manager state with local state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      activeTheme: themeManager.activeTheme,
      availableThemes: themeManager.availableThemes,
      isDirty: themeManager.isDirty,
      isLoading: themeManager.isLoading,
      error: themeManager.error,
    }));
  }, [
    themeManager.activeTheme,
    themeManager.availableThemes,
    themeManager.isDirty,
    themeManager.isLoading,
    themeManager.error,
  ]);

  const handleThemeChange = (themeId: string) => {
    themeManager.loadTheme(themeId);
  };

  const handleSave = () => {
    themeManager.saveTheme();
  };

  const handleUndo = () => {
    themeManager.undo();
  };

  const handleRedo = () => {
    themeManager.redo();
  };

  const handleNewTheme = () => {
    // TODO: Show new theme dialog (will be implemented in a future task)
    console.log('New theme dialog - to be implemented');
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const themeData = JSON.parse(text);
      
      // TODO: Validate and import theme via API (will be implemented in a future task)
      console.log('Import theme:', themeData);
    } catch (error) {
      console.error('Failed to import theme:', error);
    }
  };

  const handleExport = (format: 'json' | 'css') => {
    if (!state.activeTheme) return;

    if (format === 'json') {
      // Export as JSON
      const json = JSON.stringify(state.activeTheme, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.activeTheme.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'css') {
      // Export as CSS variables
      let css = ':root {\n';
      
      // Export wall type colors as CSS variables
      Object.entries(state.activeTheme.wallTypes).forEach(([id, wallType]) => {
        css += `  /* ${wallType.displayName} */\n`;
        Object.entries(wallType.colors).forEach(([colorKey, colorProp]) => {
          css += `  --${id}-${colorKey}: ${colorProp.value};\n`;
        });
        css += '\n';
      });
      
      css += '}';
      
      const blob = new Blob([css], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.activeTheme.id}.css`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShowShortcuts = () => {
    setState(prev => ({ ...prev, showShortcuts: true }));
  };

  const handleAssetTypeChange = (assetType: AssetType) => {
    setState(prev => ({ ...prev, selectedAssetType: assetType, selectedAssetId: null }));
  };

  const handleAssetSelect = (assetId: string) => {
    setState(prev => ({ ...prev, selectedAssetId: assetId }));
  };

  const handleAddNew = () => {
    if (state.selectedAssetType === 'wallTypes') {
      setShowNewWallTypeDialog(true);
    } else {
      // TODO: Handle other asset types in future tasks
      console.log('Add new asset dialog - to be implemented for', state.selectedAssetType);
    }
  };

  const handleCreateWallType = (name: string, basedOn?: string) => {
    themeManager.addWallType(name, basedOn);
    setShowNewWallTypeDialog(false);
  };

  const handlePropertyChange = (path: string, value: any) => {
    // TODO: Implement property change logic in future tasks
    console.log('Property change:', path, value);
  };

  const handleResetProperties = () => {
    // TODO: Implement reset logic in future tasks
    console.log('Reset properties for:', state.selectedAssetId);
  };

  // Get the selected wall type
  const selectedWallType = state.activeTheme && state.selectedAssetId
    ? state.activeTheme.wallTypes[state.selectedAssetId]
    : null;

  return (
    <div className="designer-container">
      {/* Header */}
      <Header
        activeTheme={state.activeTheme}
        themes={state.availableThemes}
        isDirty={state.isDirty}
        canUndo={themeManager.canUndo}
        canRedo={themeManager.canRedo}
        onThemeChange={handleThemeChange}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onNewTheme={handleNewTheme}
        onImport={handleImport}
        onExport={handleExport}
        onShowShortcuts={handleShowShortcuts}
      />

      {/* Asset Type Selector Bar */}
      <div className="designer-toolbar">
        <AssetTypeSelector
          selectedType={state.selectedAssetType}
          onTypeChange={handleAssetTypeChange}
        />
      </div>

      {/* Main Content */}
      <main className="designer-main">
        {/* Sidebar */}
        <Sidebar
          assetType={state.selectedAssetType}
          activeTheme={state.activeTheme}
          selectedAssetId={state.selectedAssetId}
          onAssetSelect={handleAssetSelect}
          onAddNew={handleAddNew}
        />

        {/* Preview Area */}
        <section className="designer-preview">
          <div className="placeholder">
            <div className="placeholder__title">Live Preview</div>
            <div className="placeholder__text">
              Real-time preview of selected asset will appear here
            </div>
          </div>
        </section>

        {/* Property Panel */}
        <PropertyPanel
          asset={selectedWallType}
          onPropertyChange={handlePropertyChange}
          onReset={handleResetProperties}
        />
      </main>

      {/* New Wall Type Dialog */}
      <NewWallTypeDialog
        isOpen={showNewWallTypeDialog}
        activeTheme={state.activeTheme}
        onClose={() => setShowNewWallTypeDialog(false)}
        onCreate={handleCreateWallType}
      />
    </div>
  );
}
