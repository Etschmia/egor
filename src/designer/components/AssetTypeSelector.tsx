import { useState, useRef, useEffect } from 'react';
import type { AssetType } from '../types';

interface AssetTypeSelectorProps {
  selectedType: AssetType;
  onTypeChange: (type: AssetType) => void;
}

interface AssetTypeOption {
  value: AssetType;
  label: string;
  icon: string;
  implemented: boolean;
}

const ASSET_TYPE_OPTIONS: AssetTypeOption[] = [
  { value: 'wallTypes', label: 'Wall Types', icon: '🧱', implemented: true },
  { value: 'objects', label: 'Objects', icon: '🏺', implemented: false },
  { value: 'pictures', label: 'Pictures', icon: '🖼️', implemented: false },
  { value: 'lights', label: 'Lights', icon: '💡', implemented: false },
  { value: 'enemies', label: 'Enemies', icon: '👾', implemented: false },
];

export function AssetTypeSelector({ selectedType, onTypeChange }: AssetTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = ASSET_TYPE_OPTIONS.find(opt => opt.value === selectedType);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: AssetTypeOption) => {
    if (option.implemented) {
      onTypeChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <div className="asset-type-selector" ref={dropdownRef}>
      <button
        className="asset-type-selector__trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select asset type"
      >
        <span className="asset-type-selector__icon">{selectedOption?.icon}</span>
        <span className="asset-type-selector__label">{selectedOption?.label}</span>
        <span className="asset-type-selector__arrow">▼</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="asset-type-selector__backdrop" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="asset-type-selector__menu" role="listbox">
            {ASSET_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`asset-type-selector__item ${
                  option.value === selectedType ? 'asset-type-selector__item--active' : ''
                } ${
                  !option.implemented ? 'asset-type-selector__item--disabled' : ''
                }`}
                onClick={() => handleSelect(option)}
                disabled={!option.implemented}
                role="option"
                aria-selected={option.value === selectedType}
              >
                <span className="asset-type-selector__item-icon">{option.icon}</span>
                <span className="asset-type-selector__item-label">{option.label}</span>
                {!option.implemented && (
                  <span className="asset-type-selector__badge">Coming Soon</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
