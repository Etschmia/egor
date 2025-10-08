import { useState, useRef } from 'react';
import type { Theme } from '../types';

export interface HeaderProps {
  activeTheme: Theme | null;
  themes: Theme[];
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onThemeChange: (themeId: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onNewTheme: () => void;
  onImport: (file: File) => void;
  onExport: (format: 'json' | 'css') => void;
  onShowShortcuts: () => void;
}

export default function Header({
  activeTheme,
  themes,
  isDirty,
  canUndo,
  canRedo,
  onThemeChange,
  onSave,
  onUndo,
  onRedo,
  onNewTheme,
  onImport,
  onExport,
  onShowShortcuts,
}: HeaderProps) {
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId);
    setShowThemeDropdown(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input so same file can be selected again
      event.target.value = '';
    }
  };

  const handleExportSelect = (format: 'json' | 'css') => {
    onExport(format);
    setShowExportDropdown(false);
  };

  return (
    <header className="designer-header">
      {/* Left Section */}
      <div className="designer-header__left">
        <h1 className="designer-header__title">Designer Mode</h1>
        
        {/* Theme Selector */}
        <div className="header-dropdown">
          <button
            className="header-dropdown__trigger"
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            aria-label="Select theme"
            aria-expanded={showThemeDropdown}
          >
            <span className="header-dropdown__label">Theme:</span>
            <span className="header-dropdown__value">
              {activeTheme?.name || 'No theme loaded'}
              {isDirty && <span className="header-dropdown__dirty">●</span>}
            </span>
            <span className="header-dropdown__arrow">▼</span>
          </button>
          
          {showThemeDropdown && (
            <>
              <div 
                className="header-dropdown__backdrop"
                onClick={() => setShowThemeDropdown(false)}
              />
              <div className="header-dropdown__menu">
                {themes.length > 0 ? (
                  themes.map(theme => (
                    <button
                      key={theme.id}
                      className={`header-dropdown__item ${
                        activeTheme?.id === theme.id ? 'header-dropdown__item--active' : ''
                      }`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      {theme.name}
                      {theme.id === 'default' && (
                        <span className="header-dropdown__badge">Default</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="header-dropdown__empty">No themes available</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center Section */}
      <div className="designer-header__center">
        {/* Undo/Redo Buttons */}
        <div className="header-button-group">
          <button
            className="designer-button header-button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <span className="header-button__icon">↶</span>
            <span className="header-button__text">Undo</span>
          </button>
          <button
            className="designer-button header-button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <span className="header-button__icon">↷</span>
            <span className="header-button__text">Redo</span>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="designer-header__right">
        {/* Save Button */}
        <button
          className="designer-button designer-button--primary header-button"
          onClick={onSave}
          disabled={!isDirty || !activeTheme}
          title="Save (Ctrl+S)"
          aria-label="Save theme"
        >
          <span className="header-button__icon">💾</span>
          <span className="header-button__text">Save</span>
        </button>

        {/* New Theme Button */}
        <button
          className="designer-button header-button"
          onClick={onNewTheme}
          title="New Theme (Ctrl+N)"
          aria-label="Create new theme"
        >
          <span className="header-button__icon">+</span>
          <span className="header-button__text">New</span>
        </button>

        {/* Import Button */}
        <button
          className="designer-button header-button"
          onClick={handleImportClick}
          title="Import theme"
          aria-label="Import theme"
        >
          <span className="header-button__icon">📥</span>
          <span className="header-button__text">Import</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {/* Export Dropdown */}
        <div className="header-dropdown">
          <button
            className="designer-button header-button"
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            disabled={!activeTheme}
            title="Export theme"
            aria-label="Export theme"
            aria-expanded={showExportDropdown}
          >
            <span className="header-button__icon">📤</span>
            <span className="header-button__text">Export</span>
            <span className="header-dropdown__arrow">▼</span>
          </button>
          
          {showExportDropdown && activeTheme && (
            <>
              <div 
                className="header-dropdown__backdrop"
                onClick={() => setShowExportDropdown(false)}
              />
              <div className="header-dropdown__menu header-dropdown__menu--right">
                <button
                  className="header-dropdown__item"
                  onClick={() => handleExportSelect('json')}
                >
                  <span className="header-dropdown__item-icon">📄</span>
                  Export as JSON
                </button>
                <button
                  className="header-dropdown__item"
                  onClick={() => handleExportSelect('css')}
                >
                  <span className="header-dropdown__item-icon">🎨</span>
                  Export as CSS
                </button>
              </div>
            </>
          )}
        </div>

        {/* Keyboard Shortcuts Button */}
        <button
          className="designer-button header-button"
          onClick={onShowShortcuts}
          title="Keyboard Shortcuts (F1)"
          aria-label="Show keyboard shortcuts"
        >
          <span className="header-button__icon">⌨️</span>
          <span className="header-button__text">Shortcuts</span>
        </button>
      </div>
    </header>
  );
}
