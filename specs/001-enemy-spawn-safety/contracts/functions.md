# Function Contracts: Gegner-Spawn-Sicherheit

**Date**: 2025-01-27  
**Feature**: Gegner-Spawn-Sicherheit  
**Plan**: [plan.md](./../plan.md)

## Core Functions

### calculatePathDistance

**Signatur**:
```typescript
function calculatePathDistance(
  enemy: Enemy,
  playerStartX: number,
  playerStartY: number,
  tiles: number[][],
  decorativeObjects: DecorativeObject[] = []
): PathDistanceResult
```

**Beschreibung**: Berechnet die tatsächliche Distanz zwischen einem Gegner und dem Spieler-Startpunkt in Sekunden, basierend auf der Pfadlänge und der maximalen Geschwindigkeit des Gegners.

**Parameter**:
- `enemy: Enemy` - Der Gegner, für den die Distanz berechnet wird
- `playerStartX: number` - X-Koordinate des Spieler-Startpunkts
- `playerStartY: number` - Y-Koordinate des Spieler-Startpunkts
- `tiles: number[][]` - Die Level-Karte (0 = frei, 1 = Wand, 2 = Tür, 3 = Exit-Tür)
- `decorativeObjects: DecorativeObject[]` - Dekorative Objekte für Kollisionsprüfung

**Rückgabewert**: `PathDistanceResult`
- `distance: number` - Distanz in Sekunden (kann `Infinity` sein)
- `pathLength: number` - Pfadlänge in Tiles
- `doorOpeningTime: number` - Gesamte Türöffnungszeit in Sekunden
- `hasPath: boolean` - Gibt es einen gültigen Pfad?
- `pathThroughDoors: boolean` - Muss der Gegner durch geschlossene Türen?

**Verhalten**:
- Verwendet BFS (Breadth-First Search) auf Tile-Grid für Pfadfindung
- Berücksichtigt Türöffnungszeit (1 Sekunde pro Tür) falls Gegner Türen öffnen kann
- Für Gegner ohne Türöffnungsfähigkeit: Pfadfindung nur über offene Bereiche
- Gibt `Infinity` zurück wenn kein gültiger Pfad existiert

**Preconditions**:
- `enemy.x >= 0 && enemy.x < tiles[0].length`
- `enemy.y >= 0 && enemy.y < tiles.length`
- `playerStartX >= 0 && playerStartX < tiles[0].length`
- `playerStartY >= 0 && playerStartY < tiles.length`
- `enemy.speed > 0`

**Postconditions**:
- `distance >= 0 || distance === Infinity`
- `pathLength >= 0`
- `doorOpeningTime >= 0`
- Wenn `distance === Infinity`, dann `hasPath === false`

**Performance**: O(n) wobei n = Anzahl Tiles im Level (typisch 400 für 20×20 Grid)

---

### canEnemyOpenDoors

**Signatur**:
```typescript
function canEnemyOpenDoors(enemy: Enemy): boolean
```

**Beschreibung**: Bestimmt ob ein Gegner Türen öffnen kann basierend auf seinem Typ.

**Parameter**:
- `enemy: Enemy` - Der Gegner

**Rückgabewert**: `boolean`
- `true` wenn Gegner Türen öffnen kann
- `false` wenn Gegner keine Türen öffnen kann (z.B. Hunde)

**Verhalten**:
- Gibt `false` zurück für `EnemyType.DOG`
- Gibt `true` zurück für alle anderen Gegner-Typen

**Preconditions**: Keine

**Postconditions**: Immer definiert (true oder false)

**Performance**: O(1)

---

### shouldEnemyMove

**Signatur**:
```typescript
function shouldEnemyMove(
  levelStartTime: number,
  currentTime: number = Date.now()
): boolean
```

**Beschreibung**: Prüft ob Gegner sich bewegen dürfen basierend auf der 2-Sekunden-Verzögerung.

**Parameter**:
- `levelStartTime: number` - Zeitstempel des Level-Starts (Date.now())
- `currentTime: number` - Aktueller Zeitstempel (optional, Standard: Date.now())

**Rückgabewert**: `boolean`
- `true` wenn Gegner sich bewegen dürfen (≥2 Sekunden vergangen)
- `false` wenn Bewegungsverzögerung noch aktiv (<2 Sekunden)

**Verhalten**:
- Berechnet Zeitdifferenz: `currentTime - levelStartTime`
- Gibt `true` zurück wenn `>= 2000` (2 Sekunden)
- Gibt `false` zurück wenn `< 2000`

**Preconditions**:
- `levelStartTime > 0`
- `currentTime >= levelStartTime`

**Postconditions**:
- Immer definiert (true oder false)

**Performance**: O(1)

---

### validateLevelVariant

**Signatur**:
```typescript
function validateLevelVariant(
  level: GameMap,
  levelNumber: number,
  variantNumber: number,
  autoReposition: boolean = false
): ValidationResult
```

**Beschreibung**: Validiert eine Level-Variante gegen alle Sicherheitsanforderungen (3-Sekunden-Distanz für alle Gegner).

**Parameter**:
- `level: GameMap` - Die Level-Definition
- `levelNumber: number` - Level-Nummer (1-7)
- `variantNumber: number` - Varianten-Nummer (1-5)
- `autoReposition: boolean` - Automatische Repositionierung aktivieren (Standard: false)

**Rückgabewert**: `ValidationResult`
- `isValid: boolean` - Sind alle Anforderungen erfüllt?
- `violations: ValidationViolation[]` - Liste aller Verstöße
- `adjustedEnemies?: Enemy[]` - Neue Positionen (nur wenn autoReposition=true)

**Verhalten**:
- Prüft jeden Gegner in der Level-Definition
- Ruft `calculatePathDistance()` für jeden Gegner auf
- Erstellt `ValidationViolation` wenn Distanz < 3 Sekunden
- Wenn `autoReposition=true`: Findet beste verfügbare Position (Minimum 2 Sekunden)
- Gibt Warnungen aus für Level, die nicht vollständig erfüllbar sind

**Preconditions**:
- `level` ist gültige GameMap-Definition
- `levelNumber >= 1 && levelNumber <= 7`
- `variantNumber >= 1 && variantNumber <= 5`
- `level.enemies.length > 0`

**Postconditions**:
- `isValid === true` wenn `violations.length === 0`
- `adjustedEnemies` nur gesetzt wenn `autoReposition === true` und Verstöße gefunden wurden

**Performance**: O(n × m) wobei n = Anzahl Gegner, m = Anzahl Tiles (typisch 5-10 Gegner × 400 Tiles)

---

### validateAllLevels

**Signatur**:
```typescript
function validateAllLevels(
  autoReposition: boolean = false
): ValidationResult[]
```

**Beschreibung**: Validiert alle 35 Level-Varianten (7 Level × 5 Varianten).

**Parameter**:
- `autoReposition: boolean` - Automatische Repositionierung aktivieren (Standard: false)

**Rückgabewert**: `ValidationResult[]`
- Array mit 35 ValidationResult-Objekten (eines pro Level-Variante)

**Verhalten**:
- Lädt alle Level-Varianten aus `LEVEL_VARIANTS`
- Ruft `validateLevelVariant()` für jede Variante auf
- Gibt konsolidierten Report zurück

**Preconditions**: Keine

**Postconditions**:
- Array-Länge === 35
- Jedes Element hat gültige `levelNumber` und `variantNumber`

**Performance**: O(35 × n × m) wobei n = durchschnittliche Anzahl Gegner, m = Anzahl Tiles

---

## Modified Functions

### createInitialGameState

**Erweiterung**:
```typescript
// Vorher:
export function createInitialGameState(difficulty: Difficulty): GameState

// Nachher:
export function createInitialGameState(difficulty: Difficulty): GameState
// GameState enthält jetzt: levelStartTime: Date.now()
```

**Änderung**: Setzt `levelStartTime: Date.now()` im zurückgegebenen GameState.

**Rückwärtskompatibilität**: `levelStartTime` ist optional, bestehender Code funktioniert weiterhin.

---

### updateEnemies

**Erweiterung**:
```typescript
// Vorher:
export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  tiles: number[][],
  deltaTime: number,
  difficulty: Difficulty,
  decorativeObjects: DecorativeObject[] = []
): { enemies: Enemy[]; player: Player; tilesUpdated?: number[][] }

// Nachher:
export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  tiles: number[][],
  deltaTime: number,
  difficulty: Difficulty,
  decorativeObjects: DecorativeObject[] = [],
  levelStartTime?: number  // NEU
): { enemies: Enemy[]; player: Player; tilesUpdated?: number[][] }
```

**Änderung**: 
- Neuer Parameter `levelStartTime?: number`
- Frühe Rückkehr wenn `levelStartTime` gesetzt ist und `Date.now() - levelStartTime < 2000`
- Nur Bewegung blockiert, Angriffe weiterhin möglich

**Rückwärtskompatibilität**: Parameter ist optional, bestehender Code funktioniert weiterhin.

---

## Type Definitions

### PathDistanceResult

```typescript
interface PathDistanceResult {
  distance: number; // Distanz in Sekunden (kann Infinity sein)
  pathLength: number; // Pfadlänge in Tiles
  doorOpeningTime: number; // Gesamte Türöffnungszeit in Sekunden
  hasPath: boolean; // Gibt es einen gültigen Pfad?
  pathThroughDoors: boolean; // Muss der Gegner durch geschlossene Türen?
}
```

### ValidationResult

```typescript
interface ValidationResult {
  levelNumber: number;
  variantNumber: number;
  isValid: boolean;
  violations: ValidationViolation[];
  adjustedEnemies?: Enemy[];
  warnings: string[];
}
```

### ValidationViolation

```typescript
interface ValidationViolation {
  enemyId: string;
  enemyType: EnemyType;
  currentDistance: number; // Aktuelle Distanz in Sekunden
  requiredDistance: number; // Erforderliche Distanz (3 Sekunden)
  reason: string;
  suggestedPosition?: { x: number; y: number };
}
```

