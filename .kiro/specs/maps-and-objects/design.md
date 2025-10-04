# Design Document

## Overview

Dieses Design erweitert das Raycasting-Spiel um zwei Hauptkomponenten: ein System für dekorative Gegenstände und ein intelligentes Map-Rotationssystem. Die Architektur integriert sich nahtlos in die bestehende Codebase und nutzt die vorhandenen Rendering-, Kollisions- und Persistenz-Systeme.

## Architecture

### High-Level Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                     Game Engine                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Map Selection    │  │ Decorative       │                │
│  │ System           │  │ Objects System   │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│ Map History     │      │ Collision       │
│ (LocalStorage)  │      │ Detection       │
└─────────────────┘      └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│         Rendering System                │
│  (Raycasting + Sprite Rendering)        │
└─────────────────────────────────────────┘
```

### Datenfluss

1. **Level Start**: Map Selection System → Map History → Wählt Map-Variante
2. **Rendering**: Decorative Objects → Sprite Rendering → Bildschirm
3. **Movement**: Player/Enemy Position → Collision Detection → Position Update
4. **Persistence**: Map History → LocalStorage → Nächster Level-Start


## Components and Interfaces

### 1. Type Definitions (types.ts)

#### DecorativeObjectType Enum
```typescript
export enum DecorativeObjectType {
  CEILING_LIGHT = 'CEILING_LIGHT',
  VASE = 'VASE',
  CRATE = 'CRATE',
  BENCH = 'BENCH',
  TABLE = 'TABLE',
  CHAIR = 'CHAIR',
  WINE_BOTTLE = 'WINE_BOTTLE',
  SKELETON = 'SKELETON'
}
```

#### DecorativeObject Interface
```typescript
export interface DecorativeObject {
  id: string;
  type: DecorativeObjectType;
  x: number;              // Position in Map-Koordinaten
  y: number;
  colorVariant: number;   // 0.0 - 1.0 für Farbmodulation
  collisionRadius: number; // Radius für Kollisionserkennung
  renderHeight?: number;   // Optional: spezifische Render-Höhe
  parentId?: string;       // Optional: für Objekte auf anderen (z.B. Flasche auf Tisch)
}
```

#### GameMap Interface Extension
```typescript
export interface GameMap {
  // ... bestehende Felder
  decorativeObjects: DecorativeObject[];
}
```

#### MapHistoryEntry Interface
```typescript
export interface MapHistoryEntry {
  level: number;
  variant: number;
  timestamp: number;
}
```


### 2. Map Selection System (mapSelectionSystem.ts)

Neue Datei für die Verwaltung der Map-Auswahl und -Historie.

#### Hauptfunktionen

```typescript
// Lädt Map-Historie aus LocalStorage
function loadMapHistory(): MapHistoryEntry[]

// Speichert Map-Historie in LocalStorage
function saveMapHistory(history: MapHistoryEntry[]): void

// Wählt optimale Map-Variante für ein Level
function selectMapVariant(level: number, history: MapHistoryEntry[]): number

// Aktualisiert Historie nach Map-Auswahl
function recordMapPlay(level: number, variant: number, history: MapHistoryEntry[]): MapHistoryEntry[]

// Holt Map basierend auf Level und Variante
function getMap(level: number, variant: number): GameMap
```

#### Auswahllogik

1. Filtere Historie nach aktuellem Level
2. Identifiziere noch nicht gespielte Varianten (0-4)
3. Falls ungespielte existieren: Wähle zufällig eine davon
4. Falls alle gespielt: Wähle die mit ältestem Timestamp
5. Speichere neue Auswahl in Historie


### 3. Levels Structure (levels.ts)

#### Neue Datenstruktur

```typescript
// Alte Struktur (für Kompatibilität beibehalten)
export const LEVEL_1: GameMap = { ... }
export const LEVEL_2: GameMap = { ... }
// ... etc

// Neue Struktur mit Varianten
export const LEVEL_1_VARIANT_1: GameMap = { ... }
export const LEVEL_1_VARIANT_2: GameMap = { ... }
export const LEVEL_1_VARIANT_3: GameMap = { ... }
export const LEVEL_1_VARIANT_4: GameMap = { ... }
export const LEVEL_1_VARIANT_5: GameMap = { ... }

// Verschachteltes Array für einfachen Zugriff
export const LEVELS_WITH_VARIANTS: GameMap[][] = [
  [LEVEL_1_VARIANT_1, LEVEL_1_VARIANT_2, LEVEL_1_VARIANT_3, LEVEL_1_VARIANT_4, LEVEL_1_VARIANT_5],
  [LEVEL_2_VARIANT_1, LEVEL_2_VARIANT_2, LEVEL_2_VARIANT_3, LEVEL_2_VARIANT_4, LEVEL_2_VARIANT_5],
  // ... für alle 7 Level
];

// Kompatibilitätsschicht
export const LEVELS: GameMap[] = LEVELS_WITH_VARIANTS.map(variants => variants[0]);
```

#### Map-Größen

- Level 1-3: 20x20 (wie bisher)
- Level 4-5: 22x22 (etwas größer)
- Level 6-7: 24x24 (noch größer)


### 4. Decorative Objects Rendering (raycasting.ts)

#### Erweiterung der Sprite-Rendering-Funktion

```typescript
export interface SpriteRender {
  x: number;
  y: number;
  distance: number;
  type: 'enemy' | 'item' | 'decorative';  // Neuer Typ hinzugefügt
  object: Enemy | Item | DecorativeObject;
}

// Erweiterte Funktion
export function getSpritesToRender(
  posX: number,
  posY: number,
  dirX: number,
  dirY: number,
  planeX: number,
  planeY: number,
  enemies: Enemy[],
  items: Item[],
  decorativeObjects: DecorativeObject[]  // Neuer Parameter
): SpriteRender[]
```

#### Rendering-Reihenfolge

1. Wände (wie bisher)
2. Sprites nach Entfernung sortiert:
   - Dekorative Objekte (weiter hinten)
   - Gegner
   - Items
   - Dekorative Objekte (näher)

#### Spezielle Rendering-Logik

- **Ceiling Lights**: Y-Offset nach oben, kleinere Größe
- **Floor Objects** (Skeleton): Y-Offset nach unten
- **Table Items** (Wine Bottle): Position relativ zum Eltern-Tisch
- **Color Variants**: HSL-Modulation basierend auf colorVariant


### 5. Collision Detection (gameEngine.ts)

#### Neue Kollisionsfunktion

```typescript
export function checkDecorativeObjectCollision(
  x: number,
  y: number,
  decorativeObjects: DecorativeObject[]
): boolean {
  for (const obj of decorativeObjects) {
    const dx = x - obj.x;
    const dy = y - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < obj.collisionRadius) {
      return true; // Kollision erkannt
    }
  }
  return false;
}
```

#### Integration in movePlayer

```typescript
export function movePlayer(
  player: Player,
  moveX: number,
  moveY: number,
  tiles: number[][],
  decorativeObjects: DecorativeObject[]  // Neuer Parameter
): Player {
  const newX = player.x + moveX;
  const newY = player.y + moveY;

  // Bestehende Wand-Kollision
  if (!checkCollision(newX, player.y, tiles) && 
      !checkDecorativeObjectCollision(newX, player.y, decorativeObjects)) {
    player.x = newX;
  }

  if (!checkCollision(player.x, newY, tiles) && 
      !checkDecorativeObjectCollision(player.x, newY, decorativeObjects)) {
    player.y = newY;
  }

  return player;
}
```

#### Kollisionsradien

- CEILING_LIGHT: 0 (keine Kollision)
- VASE: 0.25
- CRATE: 0.35
- BENCH: 0.4
- TABLE: 0.45
- CHAIR: 0.3
- WINE_BOTTLE: 0.1
- SKELETON: 0.2


### 6. Texture System (textures.ts)

#### Erweiterung für dekorative Objekte

```typescript
// Neue Texturen
const DECORATIVE_TEXTURES: Record<DecorativeObjectType, HTMLImageSource> = {
  [DecorativeObjectType.CEILING_LIGHT]: createLightTexture(),
  [DecorativeObjectType.VASE]: createVaseTexture(),
  [DecorativeObjectType.CRATE]: createCrateTexture(),
  [DecorativeObjectType.BENCH]: createBenchTexture(),
  [DecorativeObjectType.TABLE]: createTableTexture(),
  [DecorativeObjectType.CHAIR]: createChairTexture(),
  [DecorativeObjectType.WINE_BOTTLE]: createWineBottleTexture(),
  [DecorativeObjectType.SKELETON]: createSkeletonTexture()
};

// Erweiterte getTexture-Funktion
export function getTexture(
  type: EnemyType | ItemType | DecorativeObjectType
): CanvasImageSource {
  // Prüfe zuerst auf DecorativeObjectType
  if (type in DECORATIVE_TEXTURES) {
    return DECORATIVE_TEXTURES[type as DecorativeObjectType];
  }
  // Bestehende Logik für Enemies und Items
  // ...
}

// Farbmodulation
export function applyColorVariant(
  texture: CanvasImageSource,
  colorVariant: number
): CanvasImageSource {
  // Erstelle temporäres Canvas
  // Zeichne Textur
  // Wende HSL-Filter an (Hue-Shift basierend auf colorVariant)
  // Gebe modifizierte Textur zurück
}
```


## Data Models

### Map History Storage

**LocalStorage Key**: `egor_map_history`

**Format**:
```json
[
  {
    "level": 0,
    "variant": 2,
    "timestamp": 1704067200000
  },
  {
    "level": 1,
    "variant": 0,
    "timestamp": 1704070800000
  }
]
```

### Decorative Object Placement Examples

#### Ceiling Light
```typescript
{
  id: 'light_1',
  type: DecorativeObjectType.CEILING_LIGHT,
  x: 5.5,
  y: 5.5,
  colorVariant: 0.5,
  collisionRadius: 0,
  renderHeight: 1.5  // Höher als normal
}
```

#### Wine Bottle on Table
```typescript
// Tisch
{
  id: 'table_1',
  type: DecorativeObjectType.TABLE,
  x: 10.5,
  y: 8.5,
  colorVariant: 0.3,
  collisionRadius: 0.45
}

// Flasche auf dem Tisch
{
  id: 'wine_1',
  type: DecorativeObjectType.WINE_BOTTLE,
  x: 10.5,
  y: 8.5,
  colorVariant: 0.7,
  collisionRadius: 0.1,
  renderHeight: 0.8,  // Auf Tischhöhe
  parentId: 'table_1'
}
```


## Error Handling

### Map Selection Errors

1. **LocalStorage nicht verfügbar**
   - Fallback: Verwende In-Memory-Array für Session
   - Wähle zufällige Variante

2. **Korrupte Map-Historie**
   - Lösche korrupte Daten
   - Initialisiere neue leere Historie
   - Logge Warnung in Console

3. **Ungültiger Level/Variant Index**
   - Fallback auf Variante 0
   - Logge Fehler

### Rendering Errors

1. **Textur nicht geladen**
   - Verwende Fallback-Farbe (Rechteck)
   - Logge Warnung

2. **Ungültige Objektposition**
   - Überspringe Rendering dieses Objekts
   - Logge Warnung

### Collision Errors

1. **NaN in Positionsberechnung**
   - Verhindere Bewegung
   - Logge Fehler
   - Setze Position auf letzten gültigen Wert


## Testing Strategy

### Unit Tests

1. **Map Selection Logic**
   - Test: Wählt ungespielte Variante
   - Test: Wählt älteste bei allen gespielt
   - Test: Handhabt leere Historie
   - Test: Handhabt korrupte Daten

2. **Collision Detection**
   - Test: Erkennt Kollision innerhalb Radius
   - Test: Keine Kollision außerhalb Radius
   - Test: Handhabt leeres decorativeObjects-Array
   - Test: Verschiedene Kollisionsradien

3. **Texture System**
   - Test: Lädt alle Texturen
   - Test: Farbmodulation funktioniert
   - Test: Fallback bei fehlender Textur

### Integration Tests

1. **Map Loading**
   - Test: Lädt Map mit dekorativen Objekten
   - Test: Wechselt zwischen Varianten
   - Test: Persistiert Historie korrekt

2. **Gameplay**
   - Test: Spieler kollidiert mit Objekten
   - Test: Gegner kollidieren mit Objekten
   - Test: Objekte werden korrekt gerendert

3. **Save/Load**
   - Test: Alte Savegames funktionieren
   - Test: Neue Savegames mit Objekten
   - Test: Map-Historie bleibt erhalten

### Manual Testing

1. **Visuelle Qualität**
   - Objekte sehen gut aus
   - Farbvariationen sind sichtbar
   - Perspektive ist korrekt

2. **Performance**
   - Keine Frame-Drops mit vielen Objekten
   - Smooth Bewegung

3. **Gameplay Feel**
   - Kollisionen fühlen sich fair an
   - Map-Varianten bieten Abwechslung


## Performance Considerations

### Rendering Optimization

1. **Sprite Culling**
   - Rendere nur Objekte im Sichtfeld (transformY > 0)
   - Sortiere nach Entfernung (weiter zuerst)
   - Überspringe Objekte hinter Wänden

2. **Texture Caching**
   - Lade Texturen einmal beim Start
   - Cache farbmodulierte Varianten
   - Verwende Canvas-Caching für komplexe Texturen

3. **Collision Detection**
   - Spatial Partitioning für große Maps
   - Prüfe nur Objekte in Bewegungsrichtung
   - Early Exit bei erster Kollision

### Memory Management

1. **Map Data**
   - 35 Maps × ~50KB = ~1.75MB (akzeptabel)
   - Lazy Loading nicht nötig
   - Alle Maps können im Memory bleiben

2. **Texture Memory**
   - 8 Objekt-Typen × ~100KB = ~800KB
   - Farbvarianten: On-the-fly generieren statt cachen
   - Gesamt: <3MB (akzeptabel für moderne Browser)

3. **LocalStorage**
   - Map-Historie: ~1KB pro 100 Einträge
   - Limit auf 1000 Einträge (FIFO)
   - Cleanup bei Überschreitung

### Estimated Performance Impact

- **Rendering**: +5-10ms pro Frame (bei 20 Objekten)
- **Collision**: +1-2ms pro Frame
- **Map Loading**: +10-20ms (einmalig pro Level)
- **Gesamt**: Sollte 60 FPS problemlos halten


## Migration and Compatibility

### Backward Compatibility

1. **Alte Savegames**
   - GameState enthält currentLevel (number)
   - Mappe auf erste Variante: `LEVELS_WITH_VARIANTS[currentLevel][0]`
   - Keine Änderung am SaveGame-Format nötig

2. **Bestehender Code**
   - `LEVELS` Array bleibt bestehen (erste Variante jedes Levels)
   - Alter Code funktioniert ohne Änderungen
   - Neue Features sind opt-in

3. **Map-Struktur**
   - Neue Maps haben `decorativeObjects: []` (leeres Array)
   - Alte Maps werden automatisch mit leerem Array erweitert
   - Keine Breaking Changes

### Migration Path

**Phase 1**: Type-Definitionen und Basis-Infrastruktur
- Neue Types hinzufügen
- Map Selection System implementieren
- Keine Auswirkung auf bestehendes Spiel

**Phase 2**: Erste Map-Varianten
- Erstelle Varianten für Level 1
- Teste Map-Rotation
- Andere Level verwenden weiterhin alte Maps

**Phase 3**: Dekorative Objekte
- Implementiere Rendering
- Implementiere Kollision
- Füge Objekte zu neuen Varianten hinzu

**Phase 4**: Vollständiger Rollout
- Erstelle alle 35 Map-Varianten
- Füge Objekte zu allen Maps hinzu
- Entferne alte LEVELS-Konstanten (optional)


## Implementation Notes

### Texture Creation Strategy

Für die 8 Objekt-Typen verwenden wir Canvas-basierte prozedurale Texturen:

1. **CEILING_LIGHT**: Gelber Kreis mit Glow-Effekt
2. **VASE**: Vertikales Rechteck mit Muster
3. **CRATE**: Braunes Quadrat mit Holzmaserung
4. **BENCH**: Horizontales Rechteck mit Beinen
5. **TABLE**: Kreis/Quadrat mit Tischplatte
6. **CHAIR**: Stuhlform mit Rückenlehne
7. **WINE_BOTTLE**: Flaschenform mit Glas daneben
8. **SKELETON**: Weiße Knochen-Silhouette

### Map Design Guidelines

**Leuchten-Platzierung**:
- Mindestens eine pro Raum
- In Fluren alle 4-6 Felder
- Mittig in Kacheln (x.5, y.5)

**Hindernis-Platzierung**:
- Nicht vor Türen
- Nicht auf Spawn-Punkten
- Nicht auf Item-Positionen
- Mindestens 1 Feld Abstand zu Wänden

**Möbel-Platzierung**:
- Nur in Räumen (nicht in Fluren)
- Tische mit 30% Chance für Weinflasche
- Stühle oft neben Tischen

**Gerippe-Platzierung**:
- 1-3 pro Map
- An "dramatischen" Stellen (Ecken, vor Türen)
- Nicht im Startbereich

### Code Organization

```
src/
├── types.ts                    (erweitert)
├── gameEngine.ts               (erweitert)
├── raycasting.ts               (erweitert)
├── textures.ts                 (erweitert)
├── levels.ts                   (massiv erweitert)
├── mapSelectionSystem.ts       (neu)
└── decorativeObjects.ts        (neu, optional für Hilfsfunktionen)
```

