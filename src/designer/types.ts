// Designer Mode Component Types
import type { Theme, WallTypeDefinition, ColorProperty, NumberProperty } from '../shared/design-tokens';

export interface DesignerState {
  activeTheme: Theme | null;
  selectedWallType: string | null;
  previewDimensions: {
    width: number;
    height: number;
  };
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PropertyEditorProps {
  wallType: WallTypeDefinition;
  onPropertyChange: (path: string, value: any) => void;
  onReset: () => void;
}

export interface ColorPickerProps {
  colorProperty: ColorProperty;
  onChange: (value: string) => void;
  label?: string;
  showPresets?: boolean;
}

export interface NumberSliderProps {
  numberProperty: NumberProperty;
  onChange: (value: number) => void;
  label?: string;
}

export interface WallTypeSelectorProps {
  availableWallTypes: WallTypeDefinition[];
  selectedWallType: string | null;
  onWallTypeChange: (wallTypeId: string) => void;
}

export interface LivePreviewProps {
  wallTypeId: string;
  themeId: string;
  width?: number;
  height?: number;
  scale?: number;
}

export interface ThemeActionsProps {
  theme: Theme;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  isDirty: boolean;
}

export interface ColorPreset {
  name: string;
  value: string;
  description?: string;
}

export interface ColorPickerState {
  currentColor: string;
  showPicker: boolean;
  showPresets: boolean;
  customColors: string[];
}

// Color picker input methods
export type ColorInputMethod = 'picker' | 'hex' | 'rgb' | 'hsl' | 'named' | 'preset';

export interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  method: ColorInputMethod;
  presets?: ColorPreset[];
}

// Theme validation and feedback
export interface ValidationFeedback {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ThemeValidationProps {
  theme: Theme;
  onValidationChange: (feedback: ValidationFeedback) => void;
}

// Designer layout and panels
export interface DesignerLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  previewContent: React.ReactNode;
  actionsContent: React.ReactNode;
}

export interface PanelProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

// Theme management
export interface ThemeManagerProps {
  onThemeSelect: (themeId: string) => void;
  onThemeCreate: () => void;
  onThemeDelete: (themeId: string) => void;
  activeThemeId: string | null;
}

// File operations
export interface FileOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

export type FileOperation = 'save' | 'load' | 'export' | 'import';

export interface FileOperationProps {
  operation: FileOperation;
  data?: any;
  onComplete: (result: FileOperationResult) => void;
}

// Responsive breakpoints for designer interface
export interface DesignerBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export const DEFAULT_BREAKPOINTS: DesignerBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920
};

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
}

// Undo/Redo system
export interface HistoryState {
  past: Theme[];
  present: Theme;
  future: Theme[];
}

export interface HistoryAction {
  type: 'UNDO' | 'REDO' | 'PUSH' | 'CLEAR';
  theme?: Theme;
}

export interface UndoRedoProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}