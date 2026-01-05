import { useState, useEffect, lazy, Suspense } from 'react';
import type { DesignerState, AssetType } from './types';
import { Header, AssetTypeSelector, Sidebar, Toast, ErrorBoundary } from './components';
import { useThemeManager, useKeyboardShortcuts, useToast } from './hooks';
import { exportAndDownload, validateThemeForExport } from './utils/exportUtils';
import './styles.css';

// Lazy load heavy components for better initial load performance
const NewWallTypeDialog = lazy(() => import('./components/NewWallTypeDialog'));
const PropertyPanel = lazy(() => import('./components/PropertyPanel'));
const LivePreview = lazy(() => import('./components/LivePreview').then(module => ({ default: module.LivePreview })));
const KeyboardShortcuts = lazy(() => import('./components/KeyboardShortcuts'));

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

  const [propertyPanelVisible, setPropertyPanelVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showNewWallTypeDialog, setShowNewWallTypeDialog] = useState(false);

  const themeManager = useThemeManager();
  const toast = useToast();

  // Load all themes on mount
  useEffect(() => {
    themeManager.loadAllThemes();
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Collapse sidebar on mobile by default
      if (mobile && !wasMobile) {
        setState(prev => ({ ...prev, sidebarCollapsed: true }));
      }
      
      // Auto-show property panel on desktop when asset is selected
      if (!mobile && state.selectedAssetId) {
        setPropertyPanelVisible(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [state.selectedAssetId, isMobile]);

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

  const handleNewTheme = async () => {
    // Prompt for theme name
    const name = prompt('Enter a name for the new theme:');
    
    if (!name || name.trim() === '') {
      return;
    }
    
    // Ask if they want to base it on the current theme
    let basedOn: string | undefined;
    if (state.activeTheme) {
      const shouldBase = confirm(`Base the new theme on "${state.activeTheme.name}"?`);
      if (shouldBase) {
        basedOn = state.activeTheme.id;
      }
    }
    
    try {
      await themeManager.createTheme(name.trim(), basedOn);
      toast.success(`Theme "${name}" created successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create theme';
      toast.error(`Failed to create theme: ${errorMessage}`);
    }
  };

  const handleImport = async (file: File) => {
    try {
      // Validate file type
      if (!file.name.endsWith('.json')) {
        toast.error('Invalid file type. Please select a JSON file.');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 10MB.');
        return;
      }

      // Read and parse file
      const text = await file.text();
      let themeData;
      
      try {
        themeData = JSON.parse(text);
      } catch {
        toast.error('Invalid JSON file. Please check the file format.');
        return;
      }

      // Import theme via theme manager
      const success = await themeManager.importTheme(themeData);
      
      if (success) {
        toast.success(`Theme "${themeData.name || 'Unnamed'}" imported successfully!`);
      } else {
        // Error message will be shown by theme manager
        if (themeManager.error) {
          toast.error(themeManager.error);
        } else {
          toast.error('Failed to import theme. Please try again.');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(`Import failed: ${errorMessage}`);
      console.error('Failed to import theme:', error);
    }
  };

  const handleExport = (format: 'json' | 'css') => {
    if (!state.activeTheme) {
      toast.warning('No active theme to export');
      return;
    }

    try {
      // Validate theme before export
      const validation = validateThemeForExport(state.activeTheme);
      if (!validation.valid) {
        toast.error(`Cannot export theme: ${validation.errors.join(', ')}`);
        return;
      }

      // Export and download
      const result = exportAndDownload(state.activeTheme, {
        format,
        includeMetadata: true,
        minify: false,
        prettify: true,
      });

      if (result.success) {
        toast.success(`Theme exported as ${format.toUpperCase()} successfully!`);
      } else {
        toast.error(`Export failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export theme';
      toast.error(`Export failed: ${errorMessage}`);
      console.error('Export error:', error);
    }
  };

  const handleShowShortcuts = () => {
    setState(prev => ({ ...prev, showShortcuts: true }));
  };

  const handleEscape = () => {
    // Close any open dialogs
    if (showNewWallTypeDialog) {
      setShowNewWallTypeDialog(false);
    }
    if (state.showShortcuts) {
      setState(prev => ({ ...prev, showShortcuts: false }));
    }
  };

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onNewTheme: handleNewTheme,
    onShowShortcuts: handleShowShortcuts,
    onEscape: handleEscape,
  });

  const handleAssetTypeChange = (assetType: AssetType) => {
    setState(prev => ({ ...prev, selectedAssetType: assetType, selectedAssetId: null }));
  };

  const handleAssetSelect = (assetId: string) => {
    setState(prev => ({ ...prev, selectedAssetId: assetId }));
    
    // On mobile, show property panel when asset is selected
    if (isMobile) {
      setPropertyPanelVisible(true);
    }
  };

  const handleAddNew = () => {
    if (state.selectedAssetType === 'wallTypes') {
      setShowNewWallTypeDialog(true);
    } else {
      // TODO: Handle other asset types in future tasks
      toast.info('Coming soon: ' + state.selectedAssetType);
    }
  };

  const handleCreateWallType = (name: string, basedOn?: string) => {
    themeManager.addWallType(name, basedOn);
    setShowNewWallTypeDialog(false);
  };

  const handlePropertyChange = (path: string, value: any) => {
    if (!state.selectedAssetId) {
      console.warn('No asset selected for property change');
      return;
    }
    
    // Build the full path including the wall type ID
    const fullPath = `wallTypes.${state.selectedAssetId}.${path}`;
    
    // Update the property via theme manager (with debouncing)
    themeManager.updateProperty(fullPath, value);
  };

  const handleResetProperties = () => {
    if (!state.selectedAssetId || !state.activeTheme) {
      console.warn('No asset selected or no active theme for reset');
      return;
    }
    
    // Find the base theme to reset from
    const baseThemeId = state.activeTheme.basedOn || 'default';
    
    // Load the base theme to get default values
    const baseTheme = state.availableThemes.find(t => t.id === baseThemeId);
    
    if (!baseTheme || !baseTheme.wallTypes[state.selectedAssetId]) {
      toast.warning(`Cannot reset: No default values found for ${state.selectedAssetId}`);
      return;
    }
    
    // Reset the wall type to its base values
    const baseWallType = baseTheme.wallTypes[state.selectedAssetId];
    themeManager.updateWallType(state.selectedAssetId, baseWallType);
    
    toast.success(`Reset ${selectedWallType?.displayName || state.selectedAssetId} to default values`);
  };

  // Get the selected wall type
  const selectedWallType = state.activeTheme && state.selectedAssetId
    ? state.activeTheme.wallTypes[state.selectedAssetId]
    : null;

  return (
    <div className="designer-container">
      {/* Skip Links for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#sidebar-content" className="skip-link">
        Skip to asset list
      </a>
      <a href="#property-panel" className="skip-link">
        Skip to properties
      </a>

      {/* Header */}
      <ErrorBoundary 
        section="Header"
        onError={() => {
          toast.error('An error occurred in the header. Some features may not work correctly.');
        }}
      >
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
      </ErrorBoundary>

      {/* Asset Type Selector Bar */}
      <div className="designer-toolbar">
        <AssetTypeSelector
          selectedType={state.selectedAssetType}
          onTypeChange={handleAssetTypeChange}
        />
      </div>

      {/* Main Content */}
      <main className="designer-main">
        {/* Mobile Backdrop for Sidebar */}
        {isMobile && !state.sidebarCollapsed && (
          <div 
            className="mobile-overlay-backdrop"
            onClick={() => setState(prev => ({ ...prev, sidebarCollapsed: true }))}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div id="sidebar-content">
          <ErrorBoundary 
            section="Sidebar"
            onError={() => {
              toast.error('An error occurred in the sidebar. Try refreshing the page.');
            }}
          >
            <Sidebar
              assetType={state.selectedAssetType}
              activeTheme={state.activeTheme}
              selectedAssetId={state.selectedAssetId}
              onAssetSelect={handleAssetSelect}
              onAddNew={handleAddNew}
              collapsed={isMobile ? state.sidebarCollapsed : undefined}
              onToggleCollapse={isMobile ? () => setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed })) : undefined}
            />
          </ErrorBoundary>
        </div>

        {/* Preview Area */}
        <section id="main-content" className="designer-preview" aria-label="Live preview area">
          {/* Mobile Property Panel Toggle */}
          {isMobile && state.selectedAssetId && (
            <button
              className="preview__property-toggle"
              onClick={() => setPropertyPanelVisible(!propertyPanelVisible)}
              aria-label="Toggle property panel"
              title="Edit Properties"
            >
              ⚙️
            </button>
          )}

          <ErrorBoundary 
            section="Live Preview"
            onError={() => {
              toast.error('An error occurred while rendering the preview.');
            }}
          >
            {state.selectedAssetId && state.activeTheme ? (
              <Suspense fallback={
                <div className="placeholder">
                  <div className="placeholder__title">Loading Preview...</div>
                  <div className="placeholder__text">Please wait</div>
                </div>
              }>
                <LivePreview
                  wallTypeId={state.selectedAssetId}
                  themeId={state.activeTheme.id}
                  width={isMobile ? 300 : 512}
                  height={isMobile ? 300 : 512}
                  scale={isMobile ? 1 : 2}
                />
              </Suspense>
            ) : (
              <div className="placeholder">
                <div className="placeholder__title">Live Preview</div>
                <div className="placeholder__text">
                  {!state.activeTheme 
                    ? 'Select a theme to begin'
                    : 'Select a wall type to see the preview'}
                </div>
              </div>
            )}
          </ErrorBoundary>
        </section>

        {/* Mobile Backdrop for Property Panel */}
        {isMobile && propertyPanelVisible && (
          <div 
            className="mobile-overlay-backdrop"
            onClick={() => setPropertyPanelVisible(false)}
            aria-hidden="true"
          />
        )}

        {/* Property Panel */}
        <div id="property-panel" className={`designer-property-panel ${isMobile && propertyPanelVisible ? 'designer-property-panel--visible' : ''}`}>
          <ErrorBoundary 
            section="Property Panel"
            onError={() => {
              toast.error('An error occurred in the property panel.');
            }}
          >
            <Suspense fallback={
              <div className="placeholder" style={{ padding: '20px' }}>
                <div className="placeholder__text">Loading properties...</div>
              </div>
            }>
              <PropertyPanel
                asset={selectedWallType}
                onPropertyChange={handlePropertyChange}
                onReset={handleResetProperties}
              />
            </Suspense>
          </ErrorBoundary>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              className="property-panel__mobile-close"
              onClick={() => setPropertyPanelVisible(false)}
              aria-label="Close property panel"
            >
              ✕
            </button>
          )}
        </div>
      </main>

      {/* New Wall Type Dialog */}
      {showNewWallTypeDialog && (
        <Suspense fallback={null}>
          <NewWallTypeDialog
            isOpen={showNewWallTypeDialog}
            activeTheme={state.activeTheme}
            onClose={() => setShowNewWallTypeDialog(false)}
            onCreate={handleCreateWallType}
          />
        </Suspense>
      )}

      {/* Keyboard Shortcuts Modal */}
      {state.showShortcuts && (
        <Suspense fallback={null}>
          <KeyboardShortcuts
            isOpen={state.showShortcuts}
            onClose={() => setState(prev => ({ ...prev, showShortcuts: false }))}
          />
        </Suspense>
      )}

      {/* Toast Notifications */}
      {toast.toasts.map(toastItem => (
        <Toast
          key={toastItem.id}
          id={toastItem.id}
          type={toastItem.type}
          message={toastItem.message}
          duration={toastItem.duration}
          onClose={toast.removeToast}
        />
      ))}
    </div>
  );
}
