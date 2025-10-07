import React, { useState, useEffect } from 'react';
import {
  WallTypeSelector,
  PropertyEditor,
  LivePreview
} from './components';
import { useThemeManager } from './hooks';
import './styles.css';

export const Designer: React.FC = () => {
  console.log('🎨🎨🎨 DESIGNER MODE LOADED! 🎨🎨🎨');
  console.log('If you see this message, you are in Designer Mode!');
  console.log('URL should be: http://localhost:3001/designer.html');
  console.log('🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨🎨');
  const [selectedWallType, setSelectedWallType] = useState<string>('brick');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [showThemeManager, setShowThemeManager] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const {
    themes,
    activeTheme,
    isDirty,
    isLoading,
    error,
    lastSaved,
    canUndo,
    canRedo,
    setActiveTheme,
    updateThemeProperty,
    saveTheme,
    createNewTheme,
    resetTheme,
    undo,
    redo,
    importTheme,
    exportTheme,
    clearError,
    addWallTypeToTheme
  } = useThemeManager();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveTheme();
      }
      
      // Ctrl/Cmd + Z: Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z') ||
          ((event.ctrlKey || event.metaKey) && event.key === 'y')) {
        event.preventDefault();
        redo();
      }
      
      // Ctrl/Cmd + N: New theme
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        handleCreateNewTheme();
      }
      
      // F1: Show shortcuts
      if (event.key === 'F1') {
        event.preventDefault();
        setShowShortcuts(true);
      }
      
      // Escape: Close dialogs
      if (event.key === 'Escape') {
        // setShowThemeManager(false);
        setShowShortcuts(false);
        clearError();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveTheme, undo, redo, clearError]);

  const handlePropertyChange = (path: string, value: any) => {
    console.log('🎯 Designer: Property change requested', { path, value, selectedWallType });
    if (selectedWallType) {
      const fullPath = `${selectedWallType}.${path}`;
      console.log('🎯 Designer: Calling updateThemeProperty with fullPath:', fullPath);
      updateThemeProperty(fullPath, value);
      console.log('🎯 Designer: updateThemeProperty callback executed');
    } else {
      console.warn('⚠️ Designer: No selectedWallType - cannot update property');
    }
  };

  const handleResetWallType = () => {
    if (selectedWallType && activeTheme) {
      // Reset only the selected wall type to default
      resetTheme();
    }
  };

  const handleCreateNewWallType = (wallType: any) => {
    console.log('🏗️ Designer: Creating new wall type:', wallType.displayName);
    addWallTypeToTheme(wallType);
    // Switch to the newly created wall type
    setSelectedWallType(wallType.id);
  };

  const handleCreateNewTheme = async () => {
    const newTheme = await createNewTheme(activeTheme?.id);
    if (newTheme) {
      setActiveTheme(newTheme.id);
    }
  };

  const handleImportTheme = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await importTheme(file);
      if (result) {
        setActiveTheme(result.id);
      }
      // Reset the input
      event.target.value = '';
    }
  };

  const handleExportTheme = async (format: 'json' | 'css' = 'json') => {
    if (activeTheme) {
      await exportTheme(activeTheme.id, format);
    }
  };

  if (isLoading && !activeTheme) {
    return (
      <div className="designer designer--loading">
        <div className="designer__loading">
          <div className="designer__spinner" />
          <h2>Loading Designer Mode...</h2>
          <p>Initializing theme system and loading textures...</p>
        </div>
      </div>
    );
  }

  if (!activeTheme) {
    return (
      <div className="designer designer--error">
        <div className="designer__error">
          <h2>Failed to Load Designer Mode</h2>
          <p>{error || 'Unknown error occurred'}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  const currentWallType = activeTheme.wallTypes[selectedWallType];

  console.log('🏗️ Designer: Current state:', {
    selectedWallType,
    activeTheme: activeTheme?.id,
    currentWallType: currentWallType?.id,
    isDirty,
    isLoading,
    wallTypeColors: currentWallType?.colors,
    wallTypeDimensions: currentWallType?.dimensions
  });

  return (
    <div className={`designer ${sidebarCollapsed ? 'designer--sidebar-collapsed' : ''}`}>
      {/* Header */}
      <header className="designer__header">
        <div className="designer__header-left">
          <h1 className="designer__title">EGOR Designer Mode</h1>
          <div className="designer__theme-info">
            <span className="designer__theme-name">{activeTheme.name}</span>
            {isDirty && <span className="designer__dirty-indicator">●</span>}
            {lastSaved && (
              <span className="designer__last-saved">
                Saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="designer__header-center">
          <select
            value={activeTheme.id}
            onChange={(e) => setActiveTheme(e.target.value)}
            className="designer__theme-selector"
          >
            {themes.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.name} {theme.id === 'default' ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="designer__header-right">
          {/* Undo/Redo */}
          <div className="designer__history-controls">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="designer__button designer__button--icon"
              title="Undo (Ctrl+Z)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 3.5 14.5V16L1 13.5 3.5 11v1.5z"/>
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="designer__button designer__button--icon"
              title="Redo (Ctrl+Y)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.5 8a5.5 5.5 0 0 0-8.25-4.764.5.5 0 0 1-.5-.866A6.5 6.5 0 1 1 12.5 14.5V16L15 13.5 12.5 11v1.5z"/>
              </svg>
            </button>
          </div>

          {/* Save */}
          <button
            onClick={saveTheme}
            disabled={!isDirty || isLoading}
            className="designer__button designer__button--primary"
            title="Save Theme (Ctrl+S)"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>

          {/* Theme Actions */}
          <div className="designer__theme-actions">
            <button
              onClick={handleCreateNewTheme}
              className="designer__button"
              title="Create New Theme (Ctrl+N)"
            >
              New
            </button>
            
            <div className="designer__button-group">
              <label className="designer__button designer__button--file">
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTheme}
                  style={{ display: 'none' }}
                />
              </label>
              
              <div className="designer__dropdown">
                <button className="designer__button">Export ▼</button>
                <div className="designer__dropdown-content">
                  <button onClick={() => handleExportTheme('json')}>
                    Export as JSON
                  </button>
                  <button onClick={() => handleExportTheme('css')}>
                    Export as CSS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="designer__button designer__button--icon"
            title="Keyboard Shortcuts (F1)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Error Bar */}
      {error && (
        <div className="designer__error-bar">
          <span className="designer__error-message">{error}</span>
          <button onClick={clearError} className="designer__error-close">×</button>
        </div>
      )}

      {/* Main Content */}
      <div className="designer__main">
        {/* Sidebar */}
        <aside className={`designer__sidebar ${sidebarCollapsed ? 'designer__sidebar--collapsed' : ''}`}>
          <div className="designer__sidebar-header">
            <h2>Wall Types</h2>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="designer__sidebar-toggle"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {!sidebarCollapsed && (
            <>
              <WallTypeSelector
                availableWallTypes={Object.values(activeTheme.wallTypes)}
                selectedWallType={selectedWallType}
                onWallTypeChange={setSelectedWallType}
                onCreateNewWallType={handleCreateNewWallType}
              />

              {currentWallType && (
                <div className="designer__property-section">
                  <PropertyEditor
                    wallType={currentWallType}
                    onPropertyChange={handlePropertyChange}
                    onReset={handleResetWallType}
                  />
                </div>
              )}
            </>
          )}
        </aside>

        {/* Preview Area */}
        <main className="designer__preview-area">
          <div className="designer__preview-header">
            <h2>Live Preview</h2>
            <div className="designer__preview-info">
              <span>Wall Type: {currentWallType?.displayName}</span>
              <span>Theme: {activeTheme.name}</span>
            </div>
          </div>

          <LivePreview
            wallTypeId={selectedWallType}
            themeId={activeTheme.id}
            width={512}
            height={512}
            scale={8}
          />
        </main>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="designer__modal-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="designer__modal" onClick={e => e.stopPropagation()}>
            <div className="designer__modal-header">
              <h3>Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)}>×</button>
            </div>
            <div className="designer__modal-content">
              <div className="designer__shortcuts-grid">
                <div className="designer__shortcut">
                  <kbd>Ctrl+S</kbd>
                  <span>Save Theme</span>
                </div>
                <div className="designer__shortcut">
                  <kbd>Ctrl+Z</kbd>
                  <span>Undo</span>
                </div>
                <div className="designer__shortcut">
                  <kbd>Ctrl+Y</kbd>
                  <span>Redo</span>
                </div>
                <div className="designer__shortcut">
                  <kbd>Ctrl+N</kbd>
                  <span>New Theme</span>
                </div>
                <div className="designer__shortcut">
                  <kbd>F1</kbd>
                  <span>Show Shortcuts</span>
                </div>
                <div className="designer__shortcut">
                  <kbd>Esc</kbd>
                  <span>Close Dialogs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="designer__loading-overlay">
          <div className="designer__loading-spinner" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};