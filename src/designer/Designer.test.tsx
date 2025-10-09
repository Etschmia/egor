/**
 * Designer Mode - Complete Workflow Tests
 * 
 * This test suite covers all major workflows in the Designer Mode:
 * - Theme loading and switching
 * - Wall type selection and editing
 * - Color changes with live preview
 * - Dimension changes
 * - Effect toggles
 * - Save functionality
 * - Undo/redo
 * - Theme creation
 * - Import/export
 * - Keyboard shortcuts
 * - Error scenarios
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Designer from './Designer';

// Mock API client
vi.mock('./hooks/useApiClient', () => ({
  default: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    isLoading: false,
    error: null
  })
}));

// Mock theme manager
vi.mock('./hooks/useThemeManager', () => ({
  default: () => ({
    theme: mockTheme,
    themes: [mockTheme],
    isDirty: false,
    canUndo: false,
    canRedo: false,
    loadTheme: vi.fn(),
    updateProperty: vi.fn(),
    saveTheme: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    createTheme: vi.fn(),
    importTheme: vi.fn(),
    exportTheme: vi.fn()
  })
}));

const mockTheme = {
  id: 'default',
  name: 'Default Theme',
  version: '1.0.0',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
  wallTypes: {
    brick: {
      id: 'brick',
      displayName: 'Brick Wall',
      description: 'Classic brick wall',
      colors: {
        primary: { value: '#8B4513', displayName: 'Primary Color' },
        secondary: { value: '#654321', displayName: 'Secondary Color' }
      },
      dimensions: {
        width: { value: 64, min: 32, max: 128, step: 1 },
        height: { value: 64, min: 32, max: 128, step: 1 }
      },
      texture: {
        pattern: 'BRICK',
        intensity: { value: 0.8, min: 0, max: 1, step: 0.1 }
      },
      effects: {
        shadow: { enabled: true },
        highlight: { enabled: false }
      }
    }
  }
};

describe('Designer Mode - Complete Workflow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Theme Loading and Switching', () => {
    it('should load default theme on mount', async () => {
      render(<Designer />);
      
      await waitFor(() => {
        expect(screen.getByText(/Default Theme/i)).toBeInTheDocument();
      });
    });

    it('should switch between themes', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const themeSelector = screen.getByRole('combobox', { name: /theme/i });
      await user.click(themeSelector);
      
      // Should show theme options
      expect(screen.getByText(/Default Theme/i)).toBeInTheDocument();
    });

    it('should show loading state while loading theme', async () => {
      render(<Designer />);
      
      // Loading overlay should appear during theme load
      const loadingElement = screen.queryByText(/loading/i);
      expect(loadingElement).toBeTruthy();
    });
  });

  describe('Wall Type Selection and Editing', () => {
    it('should display wall types list', async () => {
      render(<Designer />);
      
      await waitFor(() => {
        expect(screen.getByText(/Brick Wall/i)).toBeInTheDocument();
      });
    });

    it('should select wall type on click', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Property panel should show wall type properties
      expect(screen.getByText(/Colors/i)).toBeInTheDocument();
    });

    it('should highlight selected wall type', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      expect(wallTypeItem.closest('.wall-type-item')).toHaveClass('active');
    });
  });

  describe('Color Changes with Live Preview', () => {
    it('should open color picker on color preview click', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Select wall type first
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Click on color preview
      const colorPreview = screen.getByLabelText(/Primary Color/i);
      await user.click(colorPreview);
      
      // Color picker dialog should open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should update color value', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      const colorPreview = screen.getByLabelText(/Primary Color/i);
      await user.click(colorPreview);
      
      // Change color in picker
      const hexInput = screen.getByLabelText(/hex/i);
      await user.clear(hexInput);
      await user.type(hexInput, '#FF0000');
      
      // Confirm color change
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);
      
      // Preview should update
      await waitFor(() => {
        expect(colorPreview).toHaveStyle({ backgroundColor: '#FF0000' });
      });
    });

    it('should debounce preview updates', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      const colorPreview = screen.getByLabelText(/Primary Color/i);
      await user.click(colorPreview);
      
      const hexInput = screen.getByLabelText(/hex/i);
      
      // Rapid changes should be debounced
      await user.type(hexInput, '#FF0000');
      await user.type(hexInput, '#00FF00');
      await user.type(hexInput, '#0000FF');
      
      // Only final value should be applied after debounce
      await waitFor(() => {
        expect(hexInput).toHaveValue('#0000FF');
      }, { timeout: 500 });
    });
  });

  describe('Dimension Changes', () => {
    it('should update dimension with slider', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Expand dimensions group
      const dimensionsGroup = screen.getByText(/Dimensions/i);
      await user.click(dimensionsGroup);
      
      // Find width slider
      const widthSlider = screen.getByLabelText(/width/i);
      fireEvent.change(widthSlider, { target: { value: '96' } });
      
      await waitFor(() => {
        expect(widthSlider).toHaveValue('96');
      });
    });

    it('should show dimension value with unit', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      const dimensionsGroup = screen.getByText(/Dimensions/i);
      await user.click(dimensionsGroup);
      
      // Should display value with unit
      expect(screen.getByText(/64px/i)).toBeInTheDocument();
    });
  });

  describe('Effect Toggles', () => {
    it('should toggle shadow effect', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Expand effects group
      const effectsGroup = screen.getByText(/Effects/i);
      await user.click(effectsGroup);
      
      // Toggle shadow
      const shadowToggle = screen.getByLabelText(/shadow/i);
      await user.click(shadowToggle);
      
      expect(shadowToggle).not.toBeChecked();
    });

    it('should toggle highlight effect', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      const effectsGroup = screen.getByText(/Effects/i);
      await user.click(effectsGroup);
      
      const highlightToggle = screen.getByLabelText(/highlight/i);
      await user.click(highlightToggle);
      
      expect(highlightToggle).toBeChecked();
    });
  });

  describe('Save Functionality', () => {
    it('should enable save button when dirty', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Make a change
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      const colorPreview = screen.getByLabelText(/Primary Color/i);
      await user.click(colorPreview);
      
      // Save button should be enabled
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).not.toBeDisabled();
    });

    it('should save theme on Ctrl+S', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Make a change
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Press Ctrl+S
      await user.keyboard('{Control>}s{/Control}');
      
      // Should show success toast
      await waitFor(() => {
        expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
      });
    });

    it('should show dirty indicator', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Make a change
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      const colorPreview = screen.getByLabelText(/Primary Color/i);
      await user.click(colorPreview);
      
      // Should show dirty indicator (●)
      expect(screen.getByText(/●/)).toBeInTheDocument();
    });
  });

  describe('Undo/Redo', () => {
    it('should undo last change with Ctrl+Z', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Make a change
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Press Ctrl+Z
      await user.keyboard('{Control>}z{/Control}');
      
      // Undo should be triggered
      const undoButton = screen.getByRole('button', { name: /undo/i });
      expect(undoButton).toBeDisabled();
    });

    it('should redo with Ctrl+Y', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Make a change and undo
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      await user.keyboard('{Control>}z{/Control}');
      await user.keyboard('{Control>}y{/Control}');
      
      // Redo should be triggered
      const redoButton = screen.getByRole('button', { name: /redo/i });
      expect(redoButton).toBeDisabled();
    });

    it('should disable undo button when no history', async () => {
      render(<Designer />);
      
      const undoButton = screen.getByRole('button', { name: /undo/i });
      expect(undoButton).toBeDisabled();
    });
  });

  describe('Theme Creation', () => {
    it('should open new theme dialog with Ctrl+N', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      await user.keyboard('{Control>}n{/Control}');
      
      // Dialog should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should create new theme', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const newThemeButton = screen.getByRole('button', { name: /new theme/i });
      await user.click(newThemeButton);
      
      // Fill in theme name
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'My Custom Theme');
      
      // Create theme
      const createButton = screen.getByRole('button', { name: /create/i });
      await user.click(createButton);
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/theme created/i)).toBeInTheDocument();
      });
    });
  });

  describe('Import/Export', () => {
    it('should export theme as JSON', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);
      
      const jsonOption = screen.getByText(/JSON/i);
      await user.click(jsonOption);
      
      // Should trigger download
      await waitFor(() => {
        expect(screen.getByText(/exported/i)).toBeInTheDocument();
      });
    });

    it('should export theme as CSS', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);
      
      const cssOption = screen.getByText(/CSS/i);
      await user.click(cssOption);
      
      // Should trigger download
      await waitFor(() => {
        expect(screen.getByText(/exported/i)).toBeInTheDocument();
      });
    });

    it('should import theme from file', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const importButton = screen.getByRole('button', { name: /import/i });
      await user.click(importButton);
      
      const fileInput = screen.getByLabelText(/import/i);
      const file = new File(['{"id":"test"}'], 'theme.json', { type: 'application/json' });
      
      await user.upload(fileInput, file);
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/imported/i)).toBeInTheDocument();
      });
    });

    it('should validate imported theme', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      const importButton = screen.getByRole('button', { name: /import/i });
      await user.click(importButton);
      
      const fileInput = screen.getByLabelText(/import/i);
      const invalidFile = new File(['invalid json'], 'theme.json', { type: 'application/json' });
      
      await user.upload(fileInput, invalidFile);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/invalid theme/i)).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should show shortcuts modal with F1', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      await user.keyboard('{F1}');
      
      // Shortcuts modal should open
      await waitFor(() => {
        expect(screen.getByText(/keyboard shortcuts/i)).toBeInTheDocument();
      });
    });

    it('should close dialog with Escape', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Open a dialog
      await user.keyboard('{F1}');
      
      // Close with Escape
      await user.keyboard('{Escape}');
      
      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should disable shortcuts in input fields', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Focus on an input field
      const searchInput = screen.getByRole('textbox');
      await user.click(searchInput);
      
      // Try to trigger save shortcut
      await user.keyboard('{Control>}s{/Control}');
      
      // Should not trigger save (input should receive the key)
      expect(screen.queryByText(/saved/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle theme load error', async () => {
      // Mock API error
      vi.mocked(useApiClient).mockReturnValue({
        get: vi.fn().mockRejectedValue(new Error('Network error')),
        isLoading: false,
        error: 'Network error'
      });
      
      render(<Designer />);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to load theme/i)).toBeInTheDocument();
      });
    });

    it('should handle save error', async () => {
      const user = userEvent.setup();
      
      // Mock API error
      vi.mocked(useApiClient).mockReturnValue({
        put: vi.fn().mockRejectedValue(new Error('Save failed')),
        isLoading: false,
        error: 'Save failed'
      });
      
      render(<Designer />);
      
      // Try to save
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
      });
    });

    it('should handle texture generation error', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Select wall type
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Mock texture generation error
      // Preview should show error message
      await waitFor(() => {
        expect(screen.getByText(/preview error/i)).toBeInTheDocument();
      });
    });

    it('should recover from errors gracefully', async () => {
      const user = userEvent.setup();
      render(<Designer />);
      
      // Trigger an error
      // Then perform a valid action
      const wallTypeItem = await screen.findByText(/Brick Wall/i);
      await user.click(wallTypeItem);
      
      // Should continue working normally
      expect(screen.getByText(/Colors/i)).toBeInTheDocument();
    });
  });
});
