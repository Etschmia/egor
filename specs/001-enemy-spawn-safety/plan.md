# Implementation Plan: Gegner-Spawn-Sicherheit

**Branch**: `001-enemy-spawn-safety` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-enemy-spawn-safety/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Diese Feature implementiert Sicherheitsregeln für Gegner-Positionierung und Bewegungsverzögerung in allen Level-Varianten. Jeder Gegner muss mindestens 3 Sekunden vom Spieler-Startpunkt entfernt sein (basierend auf tatsächlicher Pfadlänge und maximaler Geschwindigkeit), und alle Gegner dürfen sich erst 2 Sekunden nach Spielbeginn bewegen. Die Implementierung erweitert die bestehende Pfadfindungs-Logik, fügt eine Distanzvalidierung zur Entwicklungszeit hinzu und implementiert eine Bewegungsverzögerung im Game Loop.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode, ES2022 target)  
**Primary Dependencies**: React 19.1.1, Vite 7.1.7, Canvas API, Web Audio API  
**Storage**: N/A (Level-Definitionen sind statische TypeScript-Dateien)  
**Testing**: Manuelle Tests (npm run build, npm run lint, npm run dev), keine automatisierten Tests vorhanden  
**Target Platform**: Web Browser (moderne Browser mit Canvas und Web Audio API Support)  
**Project Type**: Single web application (React + TypeScript)  
**Performance Goals**: 60 FPS Game Loop, Distanzberechnung muss für alle 35 Level-Varianten in <1 Sekunde validierbar sein  
**Constraints**: 
- Keine neuen externen Dependencies
- Muss mit bestehender Pfadfindungs-Logik kompatibel sein
- Level-Validierung muss zur Entwicklungszeit ausführbar sein
- Bewegungsverzögerung darf Game Loop Performance nicht beeinträchtigen  
**Scale/Scope**: 
- 7 Level × 5 Varianten = 35 Level-Varianten
- ~100-200 Gegner insgesamt über alle Level
- Validierung muss alle Level-Varianten prüfen können

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Prüfung vor Phase 0:

- ✅ **Dokumentationspflicht**: Plan wird dokumentiert, AGENTS.md wird nach Implementierung aktualisiert
- ✅ **Eindeutige Nummerierung**: Branch `001-enemy-spawn-safety` folgt korrekter Nummerierung
- ✅ **Branch-Strategie**: Branch-Name folgt Format `[NUMMER]-[TYP]-[KURZBESCHREIBUNG]`
- ✅ **TypeScript-Standards**: Alle Code-Änderungen folgen strikten TypeScript-Standards
- ✅ **Code-Qualität**: Code muss `npm run lint` und `npm run build` bestehen
- ✅ **Testing-Disziplin**: Manuelle Tests werden durchgeführt
- ✅ **Architektur-Prinzipien**: Game Logic bleibt in `gameEngine.ts`, keine neuen Systeme erstellt
- ✅ **Dependency-Management**: Keine neuen Dependencies erforderlich

**Status**: ✅ Alle Gates bestanden

### Prüfung nach Phase 1:

- ✅ **Dokumentationspflicht**: Alle Design-Dokumente erstellt (research.md, data-model.md, contracts/, quickstart.md)
- ✅ **TypeScript-Standards**: Alle neuen Funktionen folgen strikten TypeScript-Standards
- ✅ **Code-Qualität**: Design berücksichtigt Lint- und Build-Anforderungen
- ✅ **Architektur-Prinzipien**: Erweitert bestehende Systeme, keine neuen Systeme erstellt
- ✅ **Dependency-Management**: Keine neuen Dependencies erforderlich

**Status**: ✅ Alle Gates bestanden nach Phase 1

## Project Structure

### Documentation (this feature)

```text
specs/001-enemy-spawn-safety/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── gameEngine.ts        # Erweitert: updateEnemies() mit Bewegungsverzögerung, neue Distanzberechnungs-Funktionen
├── levels.ts            # Unverändert (Level-Definitionen)
├── levels/              # Möglicherweise angepasst: Gegner-Positionen in Level-Varianten
│   ├── level1-variant1.ts
│   ├── level1-variant2.ts
│   └── ... (35 Level-Varianten)
├── types.ts             # Erweitert: Möglicherweise neue Types für Validierung
└── utils/               # NEU: Level-Validierungstool
    └── levelValidator.ts # Entwicklertool zur Validierung aller Level-Varianten

docs/
└── enemy-spawn-safety.md # Feature-spezifische Dokumentation
```

**Structure Decision**: Single project structure. Die Implementierung erweitert bestehende Dateien (`gameEngine.ts`) und fügt ein neues Validierungstool hinzu (`src/utils/levelValidator.ts`). Level-Definitionen werden möglicherweise angepasst, aber die Struktur bleibt gleich.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*Keine Verfassungsverstöße - alle Gates bestanden*

---

## Phase 0: Outline & Research

### Research Tasks

1. **Pfadfindungs-Algorithmus für Distanzberechnung**
   - Bestehende `findPathToPlayer()` Funktion analysieren
   - A*-Algorithmus vs. vereinfachte Pfadfindung für Distanzberechnung
   - Berücksichtigung von geschlossenen Türen und Türöffnungszeit

2. **Bewegungsverzögerung im Game Loop**
   - Integration in bestehende `updateEnemies()` Funktion
   - Zeitstempel-Verwaltung für "Spielbeginn"
   - Performance-Impact der zusätzlichen Zeitprüfung

3. **Level-Validierung zur Entwicklungszeit**
   - Tool-Design für Batch-Validierung aller 35 Level-Varianten
   - Integration in Build-Prozess oder als separates Skript
   - Automatische Repositionierung von Gegnern in zu kleinen Leveln

4. **Gegner-Typen und Türöffnungsfähigkeit**
   - Bestehende Logik für Türöffnung durch Gegner (`tryOpenDoorForEnemy`)
   - Behandlung von Gegnern ohne Türöffnungsfähigkeit (Hunde)
   - Pfadfindung ohne geschlossene Türen für bestimmte Gegner-Typen

### Research Findings

*Siehe [research.md](./research.md) für detaillierte Ergebnisse*

---

## Phase 1: Design & Contracts

### Data Model

*Siehe [data-model.md](./data-model.md) für vollständiges Datenmodell*

**Kern-Entitäten:**

1. **Enemy** (erweitert)
   - Bestehende Felder: `id`, `type`, `x`, `y`, `speed`, `state`, etc.
   - Neues Feld (optional): `canOpenDoors: boolean` (implizit aus `type` ableitbar)

2. **GameState** (erweitert)
   - Bestehende Felder: `player`, `enemies`, `currentLevel`, etc.
   - Neues Feld: `levelStartTime: number` (Zeitstempel des Level-Starts)

3. **Level Validation Result** (neu)
   - `levelNumber: number`
   - `variantNumber: number`
   - `isValid: boolean`
   - `violations: ValidationViolation[]`
   - `adjustedEnemies: Enemy[]` (falls Repositionierung nötig)

### API Contracts

*Siehe [contracts/](./contracts/) für vollständige API-Spezifikationen*

**Kern-Funktionen:**

1. `calculateEnemyDistance(enemy: Enemy, playerStart: Position, tiles: number[][], doors: Door[]): number`
   - Berechnet tatsächliche Pfadlänge in Sekunden
   - Berücksichtigt Türöffnungszeit falls Gegner Türen öffnen kann
   - Gibt `Infinity` zurück für Gegner ohne Pfad

2. `validateLevelVariant(level: GameMap, levelNumber: number, variantNumber: number): ValidationResult`
   - Validiert eine Level-Variante gegen alle Anforderungen
   - Gibt Anpassungen zurück falls nötig

3. `shouldEnemyMove(enemy: Enemy, levelStartTime: number, currentTime: number): boolean`
   - Prüft ob Gegner sich bewegen darf (2-Sekunden-Verzögerung)
   - Einfache Zeitprüfung

### Quick Start

*Siehe [quickstart.md](./quickstart.md) für Entwickler-Anleitung*

---

## Phase 2: Implementation Tasks

*Wird von `/speckit.tasks` erstellt*

---

## Next Steps

1. **Phase 0 abschließen**: Research-Dokument erstellen mit allen technischen Entscheidungen
2. **Phase 1 abschließen**: Data Model, Contracts und Quick Start dokumentieren
3. **Agent Context aktualisieren**: `.specify/scripts/powershell/update-agent-context.ps1` ausführen
4. **Phase 2 starten**: `/speckit.tasks` ausführen um Task-Liste zu erstellen
