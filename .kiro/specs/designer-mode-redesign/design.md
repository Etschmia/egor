# Design Document

## Overview

Der Designer Mode ist eine separate Entwicklungsanwendung zur visuellen Gestaltung von Spielelementen (Wandtypen, Objekte, Bilder, Leuchten, Gegner). Die Anwendung folgt dem Design-Pattern des Level Editors mit einem dunklen, minimalistischen Interface und intuitiver Benutzerführung. Die Architektur besteht aus einem React-Frontend (Vite) und einem Express.js-Backend für Theme-Persistierung.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Entwicklungsumgebung                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │ Designer Frontend│              │ Designer Backend │     │
│  │  (Vite + React)  │◄────HTTP────►│  (Express.js)    │     │
│  │  Port: 3002      │              │  Port: 3003      │     │
│  └──────────────────┘              └──────────────────┘     │
│           │                                  │               │
│           │                                  ▼               │
│           │                         ┌──────────────────┐     │
│           │                         │  themes/*.json   │     │
│           │                         │  (Theme-Dateien) │     │
│           │                         └──────────────────┘     │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────┐                                        │
│  │ Shared Utilities │                                        │
│  │ - ThemeManager   │                                        │
│  │ - TextureGen     │                                        │
│  └──────────────────┘                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Input → UI Component → Theme Manager → Texture Generator → Live Preview
                ↓                                                      ↑
           State Update                                               │
                ↓                                                      │
           Backend API ──────────────────────────────────────────────┘
                ↓
           File System (themes/*.json)
```

### Parallel Execution Model

```
Terminal 1: npm run dev      → Port 5173 (Main Game)
Terminal 2: npm run editor   → Port 3000 (Level Editor)
Terminal 3: npm run designer → Port 3002 (Designer Mode)

Alle drei können parallel laufen ohne Konflikte.
```

## Components and Interfaces

### 1. Designer Backend (`designer-server.mjs`)

Ein Express.js-Server für Theme-Persistierung und Dateisystem-Zugriff.

#### API Endpoints

**GET /api/themes**
- Listet alle verfügbaren Themes auf
- Response: `{ themes: Array<{ id: string, name: string, version: string }> }`

**GET /api/themes/:id**
- Lädt ein spezifisches Theme
- Parameter: `id` (z.B. "default", "custom-123")
- Response: `{ success: boolean, theme?: Theme, error?: string }`

**POST /api/themes**
- Erstellt ein neues Theme
- Body: `{ name: string, basedOn?: string, theme: Theme }`
- Response: `{ success: boolean, theme?: Theme, error?: string }`

**PUT /api/themes/:id**
- Aktualisiert ein bestehendes Theme
- Body: `{ theme: Theme }`
- Response: `{ success: boolean, error?: string }`

**DELETE /api/themes/:id**
- Löscht ein Theme (außer "default")
- Response: `{ success: boolean, error?: string }`

**POST /api/themes/:id/export**
- Exportiert ein Theme als JSON oder CSS
- Body: `{ format: 'json' | 'css' }`
- Response: File download

**POST /api/themes/import**
- Importiert ein Theme aus einer Datei
- Body: FormData mit Theme-Datei
- Response: `{ success: boolean, theme?: Theme, error?: string }`

#### Server Configuration

```javascript
// designer-server.mjs
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3003;
const THEMES_DIR = path.join(process.cwd(), 'themes');

app.use(cors());
app.use(express.json());

// Ensure themes directory exists
await fs.mkdir(THEMES_DIR, { recursive: true });
await fs.mkdir(path.join(THEMES_DIR, 'custom-themes'), { recursive: true });

// API routes...

app.listen(PORT, () => {
  console.log(`Designer Backend running on http://localhost:${PORT}`);
});
```

### 2. Designer Frontend

#### Directory Structure

```
src/designer/
├── main.tsx                    # Entry point
├── Designer.tsx                # Main designer component
├── styles.css                  # Global designer styles
├── types.ts                    # Designer-specific types
├── components/
│   ├── Header.tsx              # Top header with theme selector
│   ├── AssetTypeSelector.tsx  # Dropdown for asset type selection
│   ├── Sidebar.tsx             # Left sidebar with asset list
│   ├── PropertyPanel.tsx       # Right panel with properties
│   ├── LivePreview.tsx         # Center preview area
│   ├── WallTypeList.tsx        # List of wall types
│   ├── PropertyGroup.tsx       # Collapsible property group
│   ├── ColorPicker.tsx         # Color picker dialog
│   ├── NumberSlider.tsx        # Number slider control
│   ├── Toast.tsx               # Toast notifications
│   ├── KeyboardShortcuts.tsx  # Shortcuts modal
│   └── LoadingOverlay.tsx     # Loading indicator
├── hooks/
│   ├── useThemeManager.ts     # Theme management hook
│   ├── useApiClient.ts        # API communication hook
│   ├── useToast.ts            # Toast notifications hook
│   └── useKeyboardShortcuts.ts # Keyboard shortcuts hook
└── utils/
    ├── themeValidator.ts      # Theme validation
    ├── colorUtils.ts          # Color manipulation utilities
    └── exportUtils.ts         # Export format generators
```

#### Core Components

**Designer.tsx**
- Hauptkomponente, orchestriert alle Unterkomponenten
- Verwaltet globalen State (selectedAssetType, selectedWallType, activeTheme)
- Koordiniert Kommunikation zwischen Komponenten

**Header.tsx**
```typescript
interface HeaderProps {
  activeTheme: Theme;
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
```

**AssetTypeSelector.tsx**
```typescript
interface AssetTypeSelectorProps {
  selectedType: AssetType;
  onTypeChange: (type: AssetType) => void;
}

type AssetType = 'wallTypes' | 'objects' | 'pictures' | 'lights' | 'enemies';
```

**Sidebar.tsx**
```typescript
interface SidebarProps {
  assetType: AssetType;
  selectedAsset: string | null;
  onAssetSelect: (assetId: string) => void;
  onAddNew: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}
```

**PropertyPanel.tsx**
```typescript
interface PropertyPanelProps {
  asset: WallTypeDefinition | null;
  onPropertyChange: (path: string, value: any) => void;
  onReset: () => void;
}
```

**LivePreview.tsx**
```typescript
interface LivePreviewProps {
  assetType: AssetType;
  assetId: string;
  themeId: string;
  width?: number;
  height?: number;
  scale?: number;
}
```

**PropertyGroup.tsx**
```typescript
interface PropertyGroupProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}
```

### 3. Data Models

#### Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  basedOn?: string;
  wallTypes: Record<string, WallTypeDefinition>;
  // Future: objects, pictures, lights, enemies
}

interface WallTypeDefinition {
  id: string;
  displayName: string;
  description: string;
  colors: ColorScheme;
  dimensions: DimensionSettings;
  texture: TextureProperties;
  effects: VisualEffects;
  legacyMapping: Record<string, any>;
}

interface ColorScheme {
  primary: ColorProperty;
  secondary: ColorProperty;
  accent: ColorProperty;
  shadow: ColorProperty;
  highlight: ColorProperty;
}

interface ColorProperty {
  value: string;           // Hex color
  displayName: string;
  presets?: string[];      // Preset color options
}

interface DimensionSettings {
  width: NumberProperty;
  height: NumberProperty;
  spacing: NumberProperty;
  borderWidth: NumberProperty;
}

interface NumberProperty {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

interface TextureProperties {
  pattern: PatternType;
  intensity: NumberProperty;
  blendMode: BlendMode;
  procedural: boolean;
}

type PatternType = 'SOLID' | 'GRADIENT' | 'BRICK' | 'WOOD_GRAIN' | 'STONE_BLOCKS' | 'METAL';
type BlendMode = 'NORMAL' | 'MULTIPLY' | 'OVERLAY' | 'SOFT_LIGHT';

interface VisualEffects {
  shadow: ShadowEffect;
  highlight: HighlightEffect;
  gradient: GradientEffect;
}

interface ShadowEffect {
  enabled: boolean;
  color: ColorProperty;
  offset: NumberProperty;
  blur: NumberProperty;
}

interface HighlightEffect {
  enabled: boolean;
  color: ColorProperty;
  intensity: NumberProperty;
}

interface GradientEffect {
  enabled: boolean;
  type: 'linear' | 'radial';
  colors: ColorProperty[];
}
```

#### Designer State

```typescript
interface DesignerState {
  // Asset selection
  selectedAssetType: AssetType;
  selectedAssetId: string | null;
  
  // Theme management
  activeTheme: Theme | null;
  availableThemes: Theme[];
  
  // Edit state
  isDirty: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  
  // UI state
  sidebarCollapsed: boolean;
  showShortcuts: boolean;
  
  // Loading/Error state
  isLoading: boolean;
  error: string | null;
}

interface HistoryEntry {
  action: string;
  timestamp: number;
  previousState: any;
  newState: any;
}
```

## Error Handling

### Frontend Error Handling

1. **API Communication Errors**
   - Toast-Benachrichtigungen bei Netzwerkfehlern
   - Retry-Mechanismus mit exponential backoff
   - Offline-Modus mit lokalem State

2. **Validation Errors**
   - Inline-Validierung in Formularen
   - Verhindere ungültige Werte (z.B. Farben außerhalb des Bereichs)
   - Warnungen bei potenziell problematischen Konfigurationen

3. **Theme Loading Errors**
   - Fallback auf Default-Theme bei Ladefehlern
   - Detaillierte Fehlermeldungen mit Lösungsvorschlägen
   - Automatische Theme-Validierung beim Import

### Backend Error Handling

1. **File System Errors**
   - Prüfe Schreibrechte beim Start
   - Erstelle Verzeichnisse automatisch
   - Backup vor Überschreiben

2. **Theme Validation Errors**
   - Validiere Theme-Struktur vor dem Speichern
   - Prüfe auf erforderliche Felder
   - Verhindere Überschreiben des Default-Themes

3. **CORS Errors**
   - Konfiguriere CORS für localhost
   - Erlaube nur Requests von bekannten Ports

## Testing Strategy

### Unit Tests

**Frontend**
- Theme Manager State-Management
- Property Change Handlers
- Color Utility Functions
- Export Format Generators
- Validation Logic

**Backend**
- API Endpoint Responses
- Theme File Operations
- Import/Export Logic
- Error Handling

### Integration Tests

- Theme Load → Edit → Save Flow
- Import Theme → Validate → Apply
- Export Theme → Verify Format
- Undo/Redo Functionality

### Manual Testing Checklist

- [ ] Theme laden und anzeigen
- [ ] Wandtyp auswählen
- [ ] Farben ändern und Vorschau aktualisieren
- [ ] Dimensionen ändern
- [ ] Effekte aktivieren/deaktivieren
- [ ] Theme speichern
- [ ] Neues Theme erstellen
- [ ] Theme exportieren (JSON/CSS)
- [ ] Theme importieren
- [ ] Undo/Redo verwenden
- [ ] Keyboard Shortcuts testen
- [ ] Responsive Layout testen

## Visual Design

### Color Scheme (Level Editor Style)

```css
:root {
  /* Background Colors */
  --bg-primary: #1e1e1e;
  --bg-secondary: #252525;
  --bg-tertiary: #2a2a2a;
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;
  
  /* Accent Colors */
  --accent-primary: #4CAF50;
  --accent-hover: #45a049;
  --accent-danger: #f44336;
  --accent-warning: #ff9800;
  --accent-info: #2196F3;
  
  /* Border Colors */
  --border-color: #333333;
  --border-hover: #444444;
  --border-focus: #4CAF50;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Layout */
  --header-height: 60px;
  --sidebar-width: 280px;
  --property-panel-width: 320px;
}
```

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (60px)                                               │
│  [Logo] [Asset Type ▼] [Theme ▼]  [Undo][Redo][Save][...]  │
├──────────┬──────────────────────────────────┬───────────────┤
│          │                                  │               │
│ Sidebar  │      Live Preview Area           │  Property     │
│ (280px)  │                                  │  Panel        │
│          │                                  │  (320px)      │
│ [List]   │      [Canvas Preview]            │               │
│ [Items]  │                                  │  [Groups]     │
│ [...]    │                                  │  [Controls]   │
│          │                                  │               │
│ [+ Add]  │      [Performance Stats]         │  [Reset]      │
│          │                                  │               │
└──────────┴──────────────────────────────────┴───────────────┘
```

### Component Styling

**Header**
```css
.designer-header {
  height: var(--header-height);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-md);
}
```

**Sidebar**
```css
.designer-sidebar {
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.designer-sidebar__item {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background 0.2s ease;
}

.designer-sidebar__item:hover {
  background: var(--bg-tertiary);
}

.designer-sidebar__item--active {
  background: var(--bg-tertiary);
  border-left: 3px solid var(--accent-primary);
}
```

**Property Panel**
```css
.property-panel {
  width: var(--property-panel-width);
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.property-group {
  border-bottom: 1px solid var(--border-color);
}

.property-group__header {
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.property-group__content {
  padding: var(--spacing-md);
  display: none;
}

.property-group--expanded .property-group__content {
  display: block;
}
```

**Buttons**
```css
.designer-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.designer-button:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--border-hover);
}

.designer-button--primary {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.designer-button--primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.designer-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Color Picker**
```css
.color-picker {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.color-picker__preview {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.color-picker__preview:hover {
  border-color: var(--border-focus);
}

.color-picker__label {
  flex: 1;
  color: var(--text-secondary);
}

.color-picker__value {
  font-family: monospace;
  color: var(--text-muted);
}
```

**Number Slider**
```css
.number-slider {
  margin-bottom: var(--spacing-md);
}

.number-slider__label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  color: var(--text-secondary);
}

.number-slider__input {
  width: 100%;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.number-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
}
```

## Build Configuration

### Vite Configuration

**vite.designer.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    })
  ],
  build: {
    rollupOptions: {
      input: {
        designer: 'designer.html'
      }
    }
  },
  server: {
    port: 3002,
    strictPort: true
  }
});
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "editor": "concurrently \"vite --config vite.editor.config.ts\" \"node editor-server.mjs\"",
    "designer": "concurrently \"vite --config vite.designer.config.ts\" \"node designer-server.mjs\"",
    "designer:frontend": "vite --config vite.designer.config.ts",
    "designer:backend": "node designer-server.mjs"
  }
}
```

### Dependencies

**Keine neuen Dependencies erforderlich** - alle benötigten Pakete sind bereits installiert:
- `express` - Backend-Server
- `cors` - CORS-Middleware
- `concurrently` - Parallele Script-Ausführung
- `react` - UI Framework
- `vite` - Build Tool

## Implementation Considerations

### Performance

1. **Debounced Updates**
   - Property-Änderungen werden mit 300ms Verzögerung verarbeitet
   - Verhindert excessive Re-Rendering
   - Optimistische UI-Updates für sofortiges Feedback

2. **Texture Caching**
   - LRU-Cache für generierte Texturen
   - Cache-Größe: max. 50 Texturen
   - Automatische Invalidierung bei Theme-Änderungen

3. **Lazy Loading**
   - Komponenten werden nur bei Bedarf geladen
   - Code-Splitting für Asset-Typ-spezifische Komponenten
   - Progressive Enhancement

### Security

1. **File System Access**
   - Beschränke Zugriff auf `themes/` Verzeichnis
   - Validiere Dateinamen (keine Path-Traversal)
   - Prüfe Dateierweiterungen

2. **Input Validation**
   - Sanitize alle Benutzereingaben
   - Validiere Theme-Daten vor dem Speichern
   - Verhindere Code-Injection

3. **CORS Configuration**
   - Erlaube nur localhost-Requests
   - Spezifische Port-Whitelist
   - Keine Credentials

### Usability

1. **Keyboard Shortcuts**
   - `Ctrl+S`: Speichern
   - `Ctrl+Z`: Undo
   - `Ctrl+Y`: Redo
   - `Ctrl+N`: Neues Theme
   - `F1`: Shortcuts anzeigen
   - `Escape`: Dialoge schließen

2. **Visual Feedback**
   - Hover-Effekte auf allen interaktiven Elementen
   - Loading-Indikatoren bei API-Calls
   - Toast-Benachrichtigungen für Aktionen
   - Dirty-State-Indikator (●)

3. **Undo/Redo**
   - Command-Pattern für alle Änderungen
   - History-Stack mit max. 50 Einträgen
   - Visualisierung des History-States

### Accessibility

1. **Keyboard Navigation**
   - Alle Funktionen über Tastatur erreichbar
   - Logische Tab-Reihenfolge
   - Focus-Indikatoren

2. **Screen Reader Support**
   - ARIA-Labels für alle interaktiven Elemente
   - Semantisches HTML
   - Alt-Texte für Bilder

3. **Color Contrast**
   - WCAG AA Konformität
   - Mindestkontrast 4.5:1 für Text
   - Farbunabhängige Informationsvermittlung

## Future Enhancements

Mögliche Erweiterungen für zukünftige Versionen:

1. **Additional Asset Types**
   - Objects (Vasen, Säulen, etc.)
   - Pictures (Wandbilder)
   - Lights (Beleuchtung)
   - Enemies (Gegner-Sprites)

2. **Advanced Features**
   - Theme Marketplace
   - Collaborative Editing
   - Version Control Integration
   - AI-Assisted Color Schemes

3. **Export Options**
   - Sprite Sheets
   - Texture Atlases
   - Unity/Unreal Engine Formats

4. **Preview Modes**
   - 3D Preview
   - In-Game Preview
   - Animation Preview

5. **Batch Operations**
   - Bulk Color Adjustments
   - Theme Merging
   - Automated Variations
