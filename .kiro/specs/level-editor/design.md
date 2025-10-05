# Design Document

## Overview

Der Level-Editor ist eine separate Entwicklungsanwendung, die parallel zur Hauptanwendung läuft und es Entwicklern ermöglicht, Level-Dateien visuell zu erstellen und zu bearbeiten. Die Architektur besteht aus zwei Hauptkomponenten:

1. **Editor-Frontend**: Eine React-basierte Webanwendung mit Vite als Build-Tool
2. **File-API-Backend**: Ein Express.js-Server, der Dateisystem-Zugriff bereitstellt

Der Editor nutzt die bestehende MiniMap-Komponente als Designvorlage und erweitert diese um umfangreiche Interaktionsmöglichkeiten.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Entwicklungsumgebung                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │  Editor Frontend │              │  File-API Server │     │
│  │  (Vite + React)  │◄────HTTP────►│  (Express.js)    │     │
│  │  Port: 3000      │              │  Port: 3001      │     │
│  └──────────────────┘              └──────────────────┘     │
│                                              │               │
│                                              ▼               │
│                                     ┌──────────────────┐     │
│                                     │  src/levels/*.ts │     │
│                                     │  (Level-Dateien) │     │
│                                     └──────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action → Editor UI → API Request → File Server → File System
                ↑                                          │
                └──────────── Response ←───────────────────┘
```

## Components and Interfaces

### 1. File-API-Backend (`editor-server.mjs`)

Ein minimaler Express.js-Server, der als Brücke zwischen Browser und Dateisystem fungiert.

#### API Endpoints

**GET /api/levels**
- Listet alle Level-Dateien im `src/levels`-Verzeichnis auf
- Response: `{ levels: Array<{ filename: string, level: number, variant: number }> }`

**GET /api/levels/:filename**
- Lädt eine spezifische Level-Datei
- Parameter: `filename` (z.B. "level1-variant1.ts")
- Response: `{ success: boolean, data?: GameMap, error?: string }`

**POST /api/levels**
- Speichert oder erstellt eine Level-Datei
- Body: `{ filename: string, data: GameMap }`
- Response: `{ success: boolean, error?: string }`

#### TypeScript Code Generation

Der Server muss TypeScript-Code generieren, der dem folgenden Format entspricht:

```typescript
import { type GameMap, EnemyType, ItemType, WallPictureType, DecorativeObjectType } from '../types.ts';

export const LEVEL_X_VARIANT_Y: GameMap = {
  width: 20,
  height: 20,
  tiles: [[...]],
  enemies: [...],
  items: [...],
  wallPictures: [...],
  decorativeObjects: [...],
  playerStartX: 2,
  playerStartY: 2,
  playerStartDirection: 0
};
```

### 2. Editor-Frontend

#### Directory Structure

```
src/editor/
├── main.tsx                 # Entry point
├── Editor.tsx               # Main editor component
├── components/
│   ├── MapCanvas.tsx        # Interactive map visualization
│   ├── ContextMenu.tsx      # Right-click context menu
│   ├── EntityDialog.tsx     # Dialog for entity properties
│   ├── LevelSelector.tsx    # Level/variant dropdown selectors
│   ├── Toolbar.tsx          # Save, new level, dimensions controls
│   └── PropertyPanel.tsx    # Shows selected entity properties
├── hooks/
│   ├── useMapData.ts        # Map data management
│   ├── useSelection.ts      # Selection state management
│   └── useApiClient.ts      # API communication
├── utils/
│   ├── mapRenderer.ts       # Canvas rendering logic
│   └── codeGenerator.ts     # TypeScript code generation helpers
└── types.ts                 # Editor-specific types
```

#### Core Components

**Editor.tsx**
- Hauptkomponente, die alle Unterkomponenten orchestriert
- Verwaltet den globalen Editor-State
- Koordiniert Kommunikation zwischen Komponenten

**MapCanvas.tsx**
- Rendert die interaktive Kartenansicht auf einem Canvas
- Basiert auf der MiniMap-Komponente, aber mit größerer Darstellung
- Tile-Größe: 20-30px (statt 6px in der MiniMap)
- Handhabt Mausklicks und zeigt Hover-Effekte
- Rendert alle Entitäten (Wände, Türen, Gegner, Items, Objekte)

**ContextMenu.tsx**
- Zeigt kontextabhängige Optionen beim Rechtsklick
- Optionen variieren je nach geklicktem Element:
  - Leere Bodenfläche: "Gegner hinzufügen", "Item hinzufügen", "Objekt hinzufügen", "Als Spieler-Start setzen"
  - Wand: "Typ ändern", "Wandbild hinzufügen"
  - Entität: "Bearbeiten", "Entfernen"

**EntityDialog.tsx**
- Modaler Dialog zur Bearbeitung von Entitäts-Eigenschaften
- Dynamische Formularfelder basierend auf Entitätstyp
- Validierung der Eingaben

**LevelSelector.tsx**
- Zwei Dropdown-Menüs für Level und Variante
- Lädt automatisch die ausgewählte Level-Datei

**Toolbar.tsx**
- Buttons für "Speichern", "Neues Level", "Neue Variante"
- Eingabefelder für Level-Dimensionen (Breite/Höhe)
- Status-Anzeige (gespeichert/ungespeicherte Änderungen)

### 3. Data Models

#### EditorState

```typescript
interface EditorState {
  currentLevel: number | null;
  currentVariant: number | null;
  mapData: GameMap | null;
  selectedEntity: SelectedEntity | null;
  isDirty: boolean; // Ungespeicherte Änderungen
  contextMenu: ContextMenuState | null;
}
```

#### SelectedEntity

```typescript
type SelectedEntity = 
  | { type: 'tile', x: number, y: number }
  | { type: 'enemy', id: string }
  | { type: 'item', id: string }
  | { type: 'decorative', id: string }
  | { type: 'wallPicture', id: string }
  | { type: 'playerStart' };
```

#### ContextMenuState

```typescript
interface ContextMenuState {
  x: number; // Screen coordinates
  y: number;
  options: ContextMenuOption[];
}

interface ContextMenuOption {
  label: string;
  action: () => void;
  icon?: string;
}
```

## Error Handling

### Frontend Error Handling

1. **API Communication Errors**
   - Zeige Toast-Benachrichtigungen bei Netzwerkfehlern
   - Retry-Mechanismus für fehlgeschlagene Requests
   - Fallback auf lokalen State bei Verbindungsproblemen

2. **Validation Errors**
   - Inline-Validierung in Formularen
   - Verhindere ungültige Werte (z.B. negative Koordinaten)
   - Warnungen bei potenziell problematischen Konfigurationen

3. **File System Errors**
   - Klare Fehlermeldungen bei Lese-/Schreibfehlern
   - Vorschläge zur Fehlerbehebung

### Backend Error Handling

1. **File System Errors**
   - Prüfe Dateiberechtigungen beim Start
   - Erstelle `src/levels`-Verzeichnis falls nicht vorhanden
   - Detaillierte Fehler-Logs

2. **Parsing Errors**
   - Validiere Level-Daten vor dem Speichern
   - Prüfe auf erforderliche Felder
   - Verhindere Überschreiben bei ungültigen Daten

3. **CORS Errors**
   - Konfiguriere CORS für lokale Entwicklung
   - Erlaube nur Requests von localhost

## Testing Strategy

### Unit Tests

**Frontend**
- Rendering-Logik der MapCanvas-Komponente
- Validierungsfunktionen für Entitäts-Eigenschaften
- Code-Generierung für TypeScript-Dateien
- State-Management-Hooks

**Backend**
- API-Endpunkte (Request/Response)
- Datei-Lese-/Schreiboperationen
- TypeScript-Code-Generierung
- Fehlerbehandlung

### Integration Tests

- End-to-End-Flow: Level laden → bearbeiten → speichern
- API-Kommunikation zwischen Frontend und Backend
- Dateisystem-Operationen

### Manual Testing Checklist

- [ ] Level laden und anzeigen
- [ ] Tiles bearbeiten (Wand, Tür, Boden)
- [ ] Gegner hinzufügen, bearbeiten, entfernen
- [ ] Items hinzufügen, bearbeiten, entfernen
- [ ] Dekorative Objekte platzieren
- [ ] Wandbilder hinzufügen
- [ ] Spieler-Startposition setzen
- [ ] Level speichern
- [ ] Neues Level erstellen
- [ ] Level-Dimensionen ändern
- [ ] Mehrere Level/Varianten verwalten

## Visual Design

### Color Scheme

Basierend auf der MiniMap-Komponente:

- **Boden (0)**: `#000000` (Schwarz)
- **Wand (1)**: `#FFFFFF` (Weiß)
- **Tür (2)**: `#8B4513` (Braun)
- **Exit-Tür (3)**: `#00FF00` (Grün)
- **Spieler-Start**: `#0000FF` (Blau) mit Richtungspfeil
- **Gegner**: Farbcodiert nach Typ
  - Zombie: `#90EE90` (Hellgrün)
  - Monster: `#FF6347` (Rot)
  - Ghost: `#DDA0DD` (Lila)
  - Dog: `#FFD700` (Gold)
- **Items**: Farbcodiert nach Typ
  - Health: `#FF0000` (Rot)
  - Ammo: `#FFA500` (Orange)
  - Treasure: `#FFD700` (Gold)
  - Weapon: `#C0C0C0` (Silber)
- **Dekorative Objekte**: `#808080` (Grau)
- **Wandbilder**: `#8B4513` (Braun) mit Icon
- **Hover-Effekt**: Halbtransparentes Overlay
- **Auswahl**: Gelber Rahmen

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Level-Editor                                    [Save] [New]│
├─────────────────────────────────────────────────────────────┤
│  Level: [▼ 1] Variant: [▼ 1]  Width: [20] Height: [20] [✓] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│                    Map Canvas                                 │
│                  (Interactive Grid)                           │
│                                                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Property Panel                                               │
│  Selected: [Entity Type]                                      │
│  Properties: [...]                                            │
└─────────────────────────────────────────────────────────────┘
```

## Build Configuration

### Vite Configuration

**vite.config.ts** (Hauptanwendung - unverändert)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [['babel-plugin-react-compiler']],
    },
  })],
})
```

**vite.editor.config.ts** (Editor)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [['babel-plugin-react-compiler']],
    },
  })],
  build: {
    rollupOptions: {
      input: {
        editor: 'editor.html'
      }
    }
  },
  server: {
    port: 3000
  }
})
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "editor": "concurrently \"vite --config vite.editor.config.ts\" \"node editor-server.mjs\"",
    "editor:frontend": "vite --config vite.editor.config.ts",
    "editor:backend": "node editor-server.mjs"
  }
}
```

### Dependencies

**Neue Dev-Dependencies:**
- `express`: ^4.19.2 - Backend-Server
- `@types/express`: ^4.17.21 - TypeScript-Typen für Express
- `concurrently`: ^8.2.2 - Paralleles Ausführen von Scripts
- `cors`: ^2.8.5 - CORS-Middleware für Express
- `@types/cors`: ^2.8.17 - TypeScript-Typen für CORS

## Implementation Considerations

### Performance

1. **Canvas Rendering**
   - Verwende `requestAnimationFrame` nur bei Änderungen
   - Implementiere Dirty-Checking für Render-Optimierung
   - Cache berechnete Positionen

2. **API Calls**
   - Debounce Auto-Save-Funktionalität
   - Batch-Updates wo möglich
   - Optimistische UI-Updates

### Security

1. **File System Access**
   - Beschränke Zugriff auf `src/levels`-Verzeichnis
   - Validiere Dateinamen (keine Path-Traversal)
   - Prüfe Dateierweiterungen

2. **Input Validation**
   - Sanitize alle Benutzereingaben
   - Validiere Level-Daten vor dem Speichern
   - Verhindere Code-Injection in generierten Dateien

### Usability

1. **Keyboard Shortcuts**
   - `Ctrl+S`: Speichern
   - `Ctrl+Z`: Undo
   - `Ctrl+Y`: Redo
   - `Delete`: Entität löschen
   - `Escape`: Auswahl aufheben / Dialog schließen

2. **Visual Feedback**
   - Hover-Effekte auf interaktiven Elementen
   - Loading-Indikatoren bei API-Calls
   - Toast-Benachrichtigungen für Aktionen
   - Dirty-State-Indikator (ungespeicherte Änderungen)

3. **Undo/Redo**
   - Command-Pattern für alle Änderungen
   - History-Stack mit max. 50 Einträgen
   - Visualisierung des aktuellen History-States

## Future Enhancements

Mögliche Erweiterungen für zukünftige Versionen:

1. **Copy/Paste**: Entitäten kopieren und einfügen
2. **Multi-Select**: Mehrere Entitäten gleichzeitig auswählen und bearbeiten
3. **Templates**: Vordefinierte Raum-Layouts
4. **Preview Mode**: Level direkt im Editor spielen
5. **Collision Visualization**: Kollisionsbereiche visualisieren
6. **Grid Snapping**: Objekte am Raster ausrichten
7. **Zoom**: Rein-/Rauszoomen der Kartenansicht
8. **Minimap**: Kleine Übersichtskarte bei großen Levels
9. **Export/Import**: Level als JSON exportieren/importieren
10. **Validation**: Automatische Prüfung auf häufige Fehler (z.B. unerreichbare Bereiche)
