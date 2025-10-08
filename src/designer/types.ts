// Designer-specific TypeScript interfaces

export type AssetType = 'wallTypes' | 'objects' | 'pictures' | 'lights' | 'enemies';

export interface Theme {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  basedOn?: string;
  wallTypes: Record<string, WallTypeDefinition>;
}

export interface WallTypeDefinition {
  id: string;
  displayName: string;
  description: string;
  colors: ColorScheme;
  dimensions: DimensionSettings;
  texture: TextureProperties;
  effects: VisualEffects;
  legacyMapping: Record<string, any>;
}

export interface ColorScheme {
  primary: ColorProperty;
  secondary: ColorProperty;
  accent: ColorProperty;
  shadow: ColorProperty;
  highlight: ColorProperty;
}

export interface ColorProperty {
  value: string;
  displayName: string;
  presets?: string[];
}

export interface DimensionSettings {
  width: NumberProperty;
  height: NumberProperty;
  spacing: NumberProperty;
  borderWidth: NumberProperty;
}

export interface NumberProperty {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface TextureProperties {
  pattern: PatternType;
  intensity: NumberProperty;
  blendMode: BlendMode;
  procedural: boolean;
}

export type PatternType = 'SOLID' | 'GRADIENT' | 'BRICK' | 'WOOD_GRAIN' | 'STONE_BLOCKS' | 'METAL';
export type BlendMode = 'NORMAL' | 'MULTIPLY' | 'OVERLAY' | 'SOFT_LIGHT';

export interface VisualEffects {
  shadow: ShadowEffect;
  highlight: HighlightEffect;
  gradient: GradientEffect;
}

export interface ShadowEffect {
  enabled: boolean;
  color: ColorProperty;
  offset: NumberProperty;
  blur: NumberProperty;
}

export interface HighlightEffect {
  enabled: boolean;
  color: ColorProperty;
  intensity: NumberProperty;
}

export interface GradientEffect {
  enabled: boolean;
  type: 'linear' | 'radial';
  colors: ColorProperty[];
}

export interface DesignerState {
  selectedAssetType: AssetType;
  selectedAssetId: string | null;
  activeTheme: Theme | null;
  availableThemes: Theme[];
  isDirty: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  sidebarCollapsed: boolean;
  showShortcuts: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface HistoryEntry {
  action: string;
  timestamp: number;
  previousState: any;
  newState: any;
}

// Component Props Interfaces
export interface LivePreviewProps {
  wallTypeId: string;
  themeId: string;
  width?: number;
  height?: number;
  scale?: number;
}

export interface NumberSliderProps {
  numberProperty: NumberProperty;
  label: string;
  onChange: (value: number) => void;
}

export interface PropertyEditorProps {
  wallType: WallTypeDefinition;
  onPropertyChange: (path: string, value: any) => void;
  onReset: () => void;
}

export interface WallTypeSelectorProps {
  availableWallTypes: any[];
  selectedWallType: string | null;
  onWallTypeChange: (wallTypeId: string) => void;
  onCreateNewWallType: (wallType: any) => void;
}
