import { useEffect, useRef } from 'react';
import type { ContextMenuState } from '../types';

interface ContextMenuProps {
  contextMenu: ContextMenuState | null;
  onClose: () => void;
}

export function ContextMenu({ contextMenu, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add listener with a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu, onClose]);

  // Handle escape key to close
  useEffect(() => {
    if (!contextMenu) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [contextMenu, onClose]);

  if (!contextMenu) return null;

  // Adjust position to keep menu within viewport
  const adjustedPosition = {
    x: contextMenu.x,
    y: contextMenu.y,
  };

  // Check if menu would go off-screen and adjust
  if (menuRef.current) {
    const menuWidth = 200; // Approximate width
    const menuHeight = contextMenu.options.length * 36 + 8; // Approximate height

    if (adjustedPosition.x + menuWidth > window.innerWidth) {
      adjustedPosition.x = window.innerWidth - menuWidth - 10;
    }
    if (adjustedPosition.y + menuHeight > window.innerHeight) {
      adjustedPosition.y = window.innerHeight - menuHeight - 10;
    }
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        backgroundColor: '#2d2d2d',
        border: '1px solid #444',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        padding: '4px',
        minWidth: '180px',
        zIndex: 1000,
        color: '#ffffff',
      }}
    >
      {contextMenu.options.map((option, index) => (
        <button
          key={index}
          onClick={() => {
            option.action();
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '2px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3d3d3d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {option.icon && (
            <span style={{ marginRight: '8px', fontSize: '16px' }}>
              {option.icon}
            </span>
          )}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
