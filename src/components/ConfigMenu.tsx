import React, { useState, useEffect } from 'react';
import { inputSystem } from '../inputSystem.ts';
import { ActionType, InputProfileType } from '../types.ts';

interface ConfigMenuProps {
  onBack: () => void;
}

export const ConfigMenu: React.FC<ConfigMenuProps> = ({ onBack }) => {
  const [settings, setSettings] = useState(inputSystem.getSettings());
  const [remapAction, setRemapAction] = useState<ActionType | null>(null);

  useEffect(() => {
    setSettings(inputSystem.getSettings());
  }, []);

  useEffect(() => {
    if (!remapAction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.key === 'Escape') {
        setRemapAction(null);
        return;
      }

      const normalizedKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      inputSystem.remapKey(remapAction, normalizedKey);
      setSettings(inputSystem.getSettings());
      setRemapAction(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [remapAction]);

  const handleProfileChange = (profileId: InputProfileType) => {
    inputSystem.setProfile(profileId);
    setSettings(inputSystem.getSettings());
  };

  const handleReset = () => {
    if (confirm('Alle Tastenbelegungen zurücksetzen?')) {
      inputSystem.resetCustomToDefaults();
      setSettings(inputSystem.getSettings());
    }
  };

  const formatActionName = (action: ActionType) => {
    return action.replace(/_/g, ' ');
  };

  const formatKey = (keys: string[]) => {
    if (!keys || keys.length === 0) return '---';
    return keys.map(k => k === ' ' ? 'SPACE' : k.toUpperCase()).join(' / ');
  };

  const renderBindingList = () => {
    if (settings.activeProfileId !== InputProfileType.CUSTOM) return null;

    const actions = Object.values(ActionType);

    return (
      <div className="bindings-list" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '20px', borderTop: '1px solid #444', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
           <button className="menu-button" onClick={handleReset} style={{ fontSize: '14px', padding: '5px 15px', width: 'auto' }}>
             Standard wiederherstellen
           </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {actions.map(action => {
              const boundKeys = inputSystem.getBoundKeys(action);
              const isRemapping = remapAction === action;
              
              return (
                <tr key={action} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '8px', textAlign: 'left', fontSize: '14px' }}>{formatActionName(action)}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    <button 
                      className="menu-button"
                      style={{ 
                        minWidth: '120px', 
                        width: 'auto',
                        backgroundColor: isRemapping ? '#ff0000' : '#333',
                        border: isRemapping ? '2px solid white' : '1px solid #666',
                        fontSize: '14px',
                        padding: '5px 10px',
                        margin: 0
                      }}
                      onClick={() => setRemapAction(action)}
                    >
                      {isRemapping ? 'Taste drücken...' : formatKey(boundKeys)}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="menu-overlay">
      {remapAction && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10 }} />}
      
      <div className="menu-title">Konfiguration</div>
      <div className="menu-content" style={{ width: '700px', maxWidth: '95vw' }}>
        <div className="config-section" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '10px' }}>Steuerungsprofil</h3>
          <div className="profile-selector" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="menu-button"
              style={{ 
                backgroundColor: settings.activeProfileId === InputProfileType.MODERN ? '#8b0000' : '',
                width: 'auto',
                flex: 1
              }}
              onClick={() => handleProfileChange(InputProfileType.MODERN)}
            >
              Modern
            </button>
            <button 
              className="menu-button"
              style={{ 
                backgroundColor: settings.activeProfileId === InputProfileType.CLASSIC ? '#8b0000' : '',
                width: 'auto',
                flex: 1
              }}
              onClick={() => handleProfileChange(InputProfileType.CLASSIC)}
            >
              Klassisch
            </button>
            <button 
              className="menu-button"
              style={{ 
                backgroundColor: settings.activeProfileId === InputProfileType.CUSTOM ? '#8b0000' : '',
                width: 'auto',
                flex: 1
              }}
              onClick={() => handleProfileChange(InputProfileType.CUSTOM)}
            >
              Custom
            </button>
          </div>
          <div className="profile-description" style={{ marginTop: '15px', color: '#ccc', fontSize: '14px', minHeight: '20px', textAlign: 'center' }}>
            {settings.activeProfileId === InputProfileType.MODERN && "Standard WASD Steuerung mit Maus zum Zielen."}
            {settings.activeProfileId === InputProfileType.CLASSIC && "Retro Steuerung wie in Wolfenstein 3D (nur Tastatur)."}
            {settings.activeProfileId === InputProfileType.CUSTOM && "Benutzerdefinierte Tastenbelegung."}
          </div>
        </div>
        
        {renderBindingList()}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button className="menu-button" onClick={onBack}>
            Zurück
            </button>
        </div>
      </div>
    </div>
  );
};
