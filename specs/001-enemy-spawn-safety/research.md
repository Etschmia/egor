# Research: Gegner-Spawn-Sicherheit

**Date**: 2025-01-27  
**Feature**: Gegner-Spawn-Sicherheit  
**Plan**: [plan.md](./plan.md)

## Research Tasks & Findings

### 1. Pfadfindungs-Algorithmus für Distanzberechnung

**Task**: Bestehende Pfadfindungs-Logik analysieren und erweitern für präzise Distanzberechnung

**Findings**:

- **Bestehende Implementierung**: `findPathToPlayer()` in `gameEngine.ts` verwendet eine vereinfachte Pfadfindung:
  - Direkte Bewegung in Richtung Spieler (normalisierte Richtung)
  - Kollisionsprüfung mit Wänden und dekorativen Objekten
  - Türöffnung durch Gegner (außer Hunde)
  - Ausweichmanöver bei Blockaden

- **Entscheidung**: Erweiterte Pfadfindung für Distanzberechnung
  - **Rationale**: Die bestehende Logik ist für Echtzeit-Bewegung optimiert, aber nicht für präzise Distanzberechnung
  - **Ansatz**: 
    - A*-Algorithmus wäre zu komplex und langsam für 35 Level × ~100-200 Gegner
    - Vereinfachte BFS (Breadth-First Search) auf Tile-Grid für Distanzberechnung
    - Berücksichtigung von Türöffnungszeit (geschätzt 0.5-1 Sekunde) falls Gegner Türen öffnen kann
    - Für Gegner ohne Türöffnungsfähigkeit: Pfadfindung nur über offene Bereiche

- **Alternativen erwogen**:
  - Luftlinie: Zu ungenau, ignoriert Wände und Türen
  - Vollständiger A*: Zu rechenintensiv für Validierung aller Level
  - **Gewählt**: BFS auf Tile-Grid mit Türöffnungszeit-Berücksichtigung

**Implementation Notes**:
- Neue Funktion: `calculatePathDistance()` in `gameEngine.ts`
- Verwendet Tile-Grid (20×20) für effiziente Pfadfindung
- Berücksichtigt `enemy.type` für Türöffnungsfähigkeit
- Gibt Distanz in Sekunden zurück (Pfadlänge / Geschwindigkeit + Türöffnungszeit)

---

### 2. Bewegungsverzögerung im Game Loop

**Task**: Integration der 2-Sekunden-Bewegungsverzögerung in bestehende `updateEnemies()` Funktion

**Findings**:

- **Bestehende Implementierung**: `updateEnemies()` wird im Game Loop aufgerufen (60 FPS)
  - Verwendet `deltaTime` für Frame-unabhängige Bewegung
  - Prüft bereits `enemy.state` für verschiedene Zustände

- **Entscheidung**: Zeitstempel-basierte Verzögerung
  - **Rationale**: Einfach, performant, Frame-unabhängig
  - **Ansatz**:
    - `GameState` erweitern um `levelStartTime: number` (wird in `createInitialGameState()` gesetzt)
    - In `updateEnemies()`: Prüfung `if (Date.now() - levelStartTime < 2000) return;` vor Bewegungslogik
    - Nur für `enemy.state === 'alive'` Gegner
    - Angriffe sind weiterhin möglich (nur Bewegung blockiert)

- **Alternativen erwogen**:
  - Frame-basierte Verzögerung: Abhängig von FPS, nicht robust
  - Separate Timer pro Gegner: Unnötig komplex
  - **Gewählt**: Zentraler Zeitstempel im GameState

**Implementation Notes**:
- `GameState` Interface erweitern: `levelStartTime?: number`
- `createInitialGameState()`: `levelStartTime: Date.now()` setzen
- `updateEnemies()`: Frühe Rückkehr wenn `Date.now() - gameState.levelStartTime < 2000`
- Performance-Impact: Minimal (eine Zeitprüfung pro Frame)

---

### 3. Level-Validierung zur Entwicklungszeit

**Task**: Tool-Design für Batch-Validierung aller 35 Level-Varianten

**Findings**:

- **Bestehende Struktur**: Level-Definitionen in `src/levels/*.ts` als TypeScript-Exporte
  - Jedes Level hat 5 Varianten
  - Level werden über `LEVEL_VARIANTS` in `levels.ts` verwaltet

- **Entscheidung**: Separates Validierungstool als TypeScript-Skript
  - **Rationale**: 
    - Entwicklungszeit-Validierung (nicht Laufzeit)
    - Kann in Build-Prozess integriert werden
    - Kann als separates npm-Script ausgeführt werden
  - **Ansatz**:
    - Neues Tool: `src/utils/levelValidator.ts`
    - Funktion: `validateAllLevels(): ValidationResult[]`
    - Verwendet `calculatePathDistance()` für jede Gegner-Position
    - Gibt Warnungen aus für Level, die Anforderungen nicht erfüllen
    - Automatische Repositionierung: Findet beste verfügbare Position (Minimum 2 Sekunden)

- **Alternativen erwogen**:
  - Laufzeit-Validierung: Zu spät, Spieler könnte bereits betroffen sein
  - Manuelle Validierung: Zu fehleranfällig
  - **Gewählt**: Entwicklungszeit-Tool mit automatischer Repositionierung

**Implementation Notes**:
- Neues File: `src/utils/levelValidator.ts`
- Export: `validateAllLevels()`, `validateLevelVariant(level, levelNum, variantNum)`
- Kann als npm-Script ausgeführt werden: `npm run validate-levels`
- Gibt JSON-Report aus mit allen Verstößen und Anpassungen

---

### 4. Gegner-Typen und Türöffnungsfähigkeit

**Task**: Behandlung von Gegnern ohne Türöffnungsfähigkeit (z.B. Hunde)

**Findings**:

- **Bestehende Implementierung**: `tryOpenDoorForEnemy()` in `gameEngine.ts`
  - Prüft `enemy.type === EnemyType.DOG` und verhindert Türöffnung
  - Andere Gegner-Typen können Türen öffnen

- **Entscheidung**: Implizite Türöffnungsfähigkeit basierend auf Gegner-Typ
  - **Rationale**: Keine Änderung am bestehenden Enemy-Interface nötig
  - **Ansatz**:
    - Helper-Funktion: `canEnemyOpenDoors(enemy: Enemy): boolean`
    - Gibt `false` für `EnemyType.DOG`, `true` für alle anderen
    - In Distanzberechnung: Wenn `!canEnemyOpenDoors(enemy)`, dann Pfadfindung nur über offene Bereiche
    - Wenn kein Pfad ohne geschlossene Türen existiert: Distanz = `Infinity` (3-Sekunden-Regel erfüllt)

- **Alternativen erwogen**:
  - Explizites Feld `canOpenDoors` im Enemy-Interface: Unnötig, da ableitbar
  - Separate Pfadfindung für jeden Gegner-Typ: Zu komplex
  - **Gewählt**: Helper-Funktion basierend auf `enemy.type`

**Implementation Notes**:
- Neue Funktion: `canEnemyOpenDoors(enemy: Enemy): boolean` in `gameEngine.ts`
- Verwendet in `calculatePathDistance()` für Pfadfindungs-Strategie
- Wenn `Infinity` zurückgegeben wird, gilt 3-Sekunden-Regel als erfüllt

---

## Zusammenfassung der technischen Entscheidungen

| Entscheidung | Gewählte Lösung | Alternative | Grund für Ablehnung |
|-------------|-----------------|-------------|---------------------|
| Distanzberechnung | BFS auf Tile-Grid mit Türöffnungszeit | A*, Luftlinie | A* zu langsam, Luftlinie zu ungenau |
| Bewegungsverzögerung | Zeitstempel im GameState | Frame-basierte Verzögerung | Frame-basierte Lösung FPS-abhängig |
| Level-Validierung | Entwicklungszeit-Tool | Laufzeit-Validierung | Zu spät, Spieler könnte betroffen sein |
| Türöffnungsfähigkeit | Helper-Funktion basierend auf Type | Explizites Feld | Unnötig, da ableitbar |

## Offene Fragen / Risiken

1. **Performance der Validierung**: 
   - Risiko: BFS für alle Gegner in allen 35 Leveln könnte langsam sein
   - Mitigation: Optimierungen (Early Exit, Caching), Validierung nur bei Änderungen

2. **Automatische Repositionierung**:
   - Risiko: Könnte Level-Design beeinträchtigen
   - Mitigation: Warnung an Entwickler, manuelle Überprüfung empfohlen

3. **Türöffnungszeit-Schätzung**:
   - Risiko: Geschätzte Zeit könnte von tatsächlicher Zeit abweichen
   - Mitigation: Konservative Schätzung (1 Sekunde), kann später kalibriert werden

## Nächste Schritte

1. ✅ Research abgeschlossen
2. → Phase 1: Data Model und Contracts definieren
3. → Phase 2: Task-Liste erstellen

