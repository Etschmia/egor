# Data Model: Gegner-Spawn-Sicherheit

**Date**: 2025-01-27  
**Feature**: Gegner-Spawn-Sicherheit  
**Plan**: [plan.md](./plan.md)

## Erweiterte Entitäten

### GameState (erweitert)

**Bestehende Felder**: (siehe `src/types.ts`)

**Neue Felder**:

```typescript
interface GameState {
  // ... bestehende Felder ...
  levelStartTime?: number; // Zeitstempel des Level-Starts (Date.now())
}
```

**Beschreibung**: 
- Wird in `createInitialGameState()` gesetzt: `levelStartTime: Date.now()`
- Wird verwendet in `updateEnemies()` für 2-Sekunden-Bewegungsverzögerung
- Optional, um Rückwärtskompatibilität zu gewährleisten

**Validierung**:
- Muss gesetzt sein, wenn `currentLevel` definiert ist
- Muss `> 0` sein (gültiger Zeitstempel)

---

### Enemy (unverändert, aber erweiterte Nutzung)

**Bestehende Felder**: (siehe `src/types.ts`)
- `id: string`
- `type: EnemyType`
- `x: number`
- `y: number`
- `speed: number`
- `state: 'alive' | 'dying' | 'dead'`
- etc.

**Neue Helper-Funktion** (nicht Teil des Interfaces):

```typescript
function canEnemyOpenDoors(enemy: Enemy): boolean {
  return enemy.type !== EnemyType.DOG;
}
```

**Beschreibung**:
- Bestimmt implizit die Türöffnungsfähigkeit basierend auf Gegner-Typ
- Hunde können keine Türen öffnen, alle anderen können es

---

## Neue Entitäten

### ValidationResult

```typescript
interface ValidationResult {
  levelNumber: number;
  variantNumber: number;
  isValid: boolean;
  violations: ValidationViolation[];
  adjustedEnemies?: Enemy[]; // Nur wenn Repositionierung nötig
  warnings: string[];
}

interface ValidationViolation {
  enemyId: string;
  enemyType: EnemyType;
  currentDistance: number; // Aktuelle Distanz in Sekunden
  requiredDistance: number; // Erforderliche Distanz (3 Sekunden)
  reason: string; // z.B. "Zu nah am Spieler-Startpunkt"
  suggestedPosition?: { x: number; y: number }; // Vorschlag für neue Position
}
```

**Beschreibung**:
- Ergebnis der Validierung einer Level-Variante
- Enthält alle Verstöße gegen die 3-Sekunden-Regel
- Kann Anpassungen enthalten (automatische Repositionierung)

**Validierung**:
- `isValid === true` wenn `violations.length === 0`
- `adjustedEnemies` nur gesetzt wenn Repositionierung durchgeführt wurde

---

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

**Beschreibung**:
- Ergebnis der Distanzberechnung zwischen Gegner und Spieler-Startpunkt
- Wird von `calculatePathDistance()` zurückgegeben
- `distance === Infinity` bedeutet: Kein gültiger Pfad (z.B. Gegner ohne Türöffnungsfähigkeit, aber nur geschlossene Türen im Weg)

---

## Beziehungen

```
GameState
  ├── levelStartTime: number (neu)
  ├── player: Player
  │   └── playerStartX, playerStartY (aus Level-Definition)
  └── enemies: Enemy[]
      ├── x, y (Position)
      ├── speed (Geschwindigkeit)
      └── type (bestimmt Türöffnungsfähigkeit)

Level (GameMap)
  ├── playerStartX, playerStartY
  ├── tiles: number[][] (Karte mit Wänden/Türen)
  └── enemies: Enemy[] (initial positions)

ValidationResult
  ├── violations: ValidationViolation[]
  │   └── enemyId → Enemy
  └── adjustedEnemies?: Enemy[] (neue Positionen)
```

---

## State Transitions

### Enemy Movement State

```
[Enemy erstellt]
    ↓
[Level startet] → levelStartTime gesetzt
    ↓
[0-2 Sekunden] → Bewegung blockiert (updateEnemies() kehrt früh zurück)
    ↓
[>2 Sekunden] → Bewegung erlaubt (normale updateEnemies() Logik)
    ↓
[Gegner erreicht Spieler] → Angriff möglich
```

### Level Validation Flow

```
[Level-Definition geladen]
    ↓
[validateLevelVariant() aufgerufen]
    ↓
[Für jeden Gegner: calculatePathDistance()]
    ↓
[Distanz < 3 Sekunden?]
    ├── Ja → ValidationViolation erstellt
    │         → Automatische Repositionierung versucht
    │         → adjustedEnemies gesetzt
    └── Nein → Keine Aktion
    ↓
[ValidationResult zurückgegeben]
```

---

## Constraints & Validierungsregeln

### Distanz-Constraint

- **Regel**: Jeder Gegner muss mindestens 3 Sekunden vom Spieler-Startpunkt entfernt sein
- **Berechnung**: `distance = (pathLength / speed) + doorOpeningTime`
- **Sonderfall**: Wenn `distance === Infinity`, gilt Constraint als erfüllt

### Bewegungsverzögerung-Constraint

- **Regel**: Gegner dürfen sich erst nach 2 Sekunden bewegen
- **Prüfung**: `Date.now() - levelStartTime >= 2000`
- **Gilt nur für**: Bewegung, nicht für Angriffe

### Türöffnungsfähigkeit-Constraint

- **Regel**: Gegner ohne Türöffnungsfähigkeit müssen Pfad ohne geschlossene Türen haben
- **Prüfung**: `canEnemyOpenDoors(enemy) === false` → Pfadfindung nur über offene Bereiche
- **Fallback**: Wenn kein Pfad existiert → `distance = Infinity`

---

## Migration & Backward Compatibility

### GameState Migration

- `levelStartTime` ist optional (`levelStartTime?: number`)
- Bestehende GameStates ohne `levelStartTime` funktionieren weiterhin
- `createInitialGameState()` setzt `levelStartTime` für neue Spiele
- Beim Laden gespeicherter Spiele: `levelStartTime` wird gesetzt wenn nicht vorhanden

### Level-Definitionen Migration

- Bestehende Level-Definitionen bleiben unverändert
- Validierungstool kann bestehende Level prüfen und Anpassungen vorschlagen
- Entwickler können Level manuell anpassen oder automatische Repositionierung akzeptieren

---

## Performance Considerations

### Distanzberechnung

- **Komplexität**: O(n) für BFS auf Tile-Grid (n = Anzahl Tiles)
- **Optimierungen**:
  - Early Exit wenn Distanz > 3 Sekunden erreicht
  - Caching von Pfadfindungs-Ergebnissen für statische Level
  - Batch-Validierung kann parallelisiert werden

### Bewegungsverzögerung

- **Overhead**: Eine Zeitprüfung pro Frame pro Gegner
- **Optimierung**: Frühe Rückkehr in `updateEnemies()` wenn `Date.now() - levelStartTime < 2000`
- **Impact**: Minimal (< 0.1ms pro Frame)

---

## Referenzen

- `src/types.ts`: Bestehende Type-Definitionen
- `src/gameEngine.ts`: GameState und Enemy-Verwendung
- `src/levels.ts`: Level-Definitionen

