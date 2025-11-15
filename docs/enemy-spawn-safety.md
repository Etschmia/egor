# Gegner-Spawn-Sicherheit

**Feature Branch**: `001-enemy-spawn-safety`  
**Erstellt**: 2025-01-27  
**Status**: In Entwicklung

## Übersicht

Dieses Feature stellt sicher, dass Spieler beim Betreten eines Levels nicht sofort von Gegnern angegriffen werden können. Es implementiert zwei Sicherheitsmechanismen:

1. **Mindestdistanz-Regel**: Jeder Gegner muss mindestens 3 Sekunden vom Spieler-Startpunkt entfernt sein (basierend auf tatsächlicher Pfadlänge und maximaler Geschwindigkeit).
2. **Bewegungsverzögerung**: Alle Gegner dürfen sich erst 2 Sekunden nach Spielbeginn bewegen.

## Sicherheitsziele

### Primäres Ziel

**Schutz vor sofortigen Angriffen**: Spieler sollen beim Betreten eines Levels mindestens 3 Sekunden Zeit haben, sich zu orientieren und zu bewegen, bevor ein Gegner sie erreichen kann.

### Sekundäres Ziel

**Konsistente Anwendung**: Die Sicherheitsregeln gelten für alle Varianten aller Level im Spiel (7 Level × 5 Varianten = 35 Level-Varianten).

## Technische Anforderungen

### FR-001: Mindestdistanz-Regel

- **Regel**: Jeder Gegner muss mindestens 3 Sekunden vom Spieler-Startpunkt entfernt sein
- **Berechnung**: Basierend auf tatsächlicher Pfadlänge (nicht Luftlinie), berücksichtigt Wände und Türen
- **Geschwindigkeit**: Verwendet maximale Geschwindigkeit jedes Gegners
- **Türöffnung**: Türöffnungszeit wird zur Distanz addiert, falls Gegner Türen öffnen kann

### FR-002: Bewegungsverzögerung

- **Regel**: Gegner dürfen sich erst 2 Sekunden nach Spielbeginn bewegen
- **Definition "Spielbeginn"**: Zeitpunkt, wenn das Level geladen wird und das Spiel startet (unabhängig von Spieler-Eingaben)
- **Gilt für**: Bewegung, nicht für Angriffe (Gegner können möglicherweise noch angreifen, wenn sie bereits in Reichweite sind)

### FR-003: Pfadfindung

- **Methode**: BFS (Breadth-First Search) auf Tile-Grid
- **Berücksichtigung**: Wände, Türen, dekorative Objekte
- **Türöffnungszeit**: 1 Sekunde pro geschlossene Tür (falls Gegner Türen öffnen kann)

### FR-010: Gegner ohne Türöffnungsfähigkeit

- **Regel**: Gegner ohne Türöffnungsfähigkeit (z.B. Hunde) müssen einen Pfad ohne geschlossene Türen haben
- **Fallback**: Wenn kein solcher Pfad existiert, wird die Distanz als "unendlich" betrachtet (3-Sekunden-Regel gilt als erfüllt)

### FR-009: Automatische Repositionierung

- **Fallback**: Wenn ein Level zu klein ist, werden Gegner automatisch so weit wie möglich entfernt platziert (Minimum 2 Sekunden)
- **Warnung**: Entwickler-Warnung wird ausgegeben, wenn die 3-Sekunden-Anforderung nicht erfüllt werden kann

## Erfolgskriterien

- **SC-001**: 100% aller Gegner in allen 35 Level-Varianten sind mindestens 3 Sekunden vom Spieler-Startpunkt entfernt
- **SC-002**: Alle Gegner bewegen sich erst nach genau 2 Sekunden nach Spielbeginn
- **SC-003**: Die Distanzberechnung berücksichtigt die tatsächliche Pfadlänge für mindestens 95% der Gegner-Positionen
- **SC-004**: Kein Spieler erleidet Schaden von einem Gegner innerhalb der ersten 3 Sekunden nach Spielbeginn in 100% der getesteten Level-Starts
- **SC-005**: Die Validierung identifiziert automatisch alle Level-Varianten, die die Anforderungen nicht erfüllen, mit einer Genauigkeit von 100%

## Implementierungsstatus

### Phase 1: Setup ✅
- [x] T001: Dokumentation erstellt
- [x] T002: `src/utils/` Verzeichnis eingerichtet

### Phase 2: Foundational (In Arbeit)
- [ ] T003: Typen erweitert (`PathDistanceResult`, `ValidationResult`, `ValidationViolation`, `GameState.levelStartTime`)
- [ ] T004: `getAllLevelVariants()` Helper implementiert
- [ ] T005: `ENEMY_SAFETY_RULES` definiert

### Phase 3: User Story 1 (Ausstehend)
- [ ] T006: `calculatePathDistance()` implementiert
- [ ] T007: `ensureEnemySpawnSafety()` implementiert
- [ ] T008: `levelStartTime` initialisiert und aktualisiert
- [ ] T009: `shouldEnemyMove()` implementiert
- [ ] T010: Aufrufer aktualisiert
- [ ] T011: Manuelle Tests durchgeführt

### Phase 4: User Story 2 (Ausstehend)
- [ ] T012: `validateLevelVariant()` und `validateAllLevels()` implementiert
- [ ] T013: npm-Script `validate-levels` hinzugefügt
- [ ] T014: Level-Definitionen angepasst
- [ ] T015: Dokumentation aktualisiert
- [ ] T016: Levelvarianten getestet

### Phase 5: Polish (Ausstehend)
- [ ] T017: Lint und Build verifiziert
- [ ] T018: Finale Dokumentation
- [ ] T019: Performance optimiert

## Referenzen

### Spezifikationen

- [Feature Specification](../specs/001-enemy-spawn-safety/spec.md) - Vollständige Feature-Spezifikation
- [Implementation Plan](../specs/001-enemy-spawn-safety/plan.md) - Technischer Implementierungsplan
- [Research](../specs/001-enemy-spawn-safety/research.md) - Technische Entscheidungen und Alternativen
- [Data Model](../specs/001-enemy-spawn-safety/data-model.md) - Datenstrukturen und Entitäten
- [Function Contracts](../specs/001-enemy-spawn-safety/contracts/functions.md) - API-Spezifikationen
- [Quick Start](../specs/001-enemy-spawn-safety/quickstart.md) - Entwickler-Anleitung

### Code-Referenzen

- `src/gameEngine.ts` - Kern-Game-Logik, Distanzberechnung, Bewegungsverzögerung
- `src/types.ts` - Type-Definitionen
- `src/levels.ts` - Level-Management
- `src/utils/levelValidator.ts` - Level-Validierungstool (wird in Phase 4 implementiert)

## Bekannte Einschränkungen

### Level-Größe

- **Problem**: Sehr kleine Level können möglicherweise nicht alle Gegner 3 Sekunden entfernt platzieren
- **Lösung**: Automatische Repositionierung mit Minimum 2 Sekunden als Fallback
- **Warnung**: Entwickler-Warnung wird ausgegeben

### Türöffnungszeit

- **Problem**: Geschätzte Türöffnungszeit (1 Sekunde) könnte von tatsächlicher Zeit abweichen
- **Lösung**: Konservative Schätzung, kann später kalibriert werden
- **Status**: Wird in späteren Phasen überprüft

### Performance

- **Risiko**: BFS für alle Gegner in allen 35 Leveln könnte langsam sein
- **Mitigation**: Optimierungen (Early Exit, Caching), Validierung nur bei Änderungen
- **Status**: Wird in Phase 5 überprüft

## Testing

### Manuelle Tests

Siehe [Quick Start](../specs/001-enemy-spawn-safety/quickstart.md) für detaillierte Test-Szenarien.

**Kern-Tests**:
1. Starte beliebige Level und messe Distanz zwischen Spieler-Startposition und allen Gegnern
2. Prüfe, dass Gegner sich erst nach 2 Sekunden bewegen
3. Teste Savegame-Ladevorgänge
4. Teste Level-Wechsel

### Validierungstool

```bash
npm run validate-levels
```

Validiert alle 35 Level-Varianten und gibt Report aus.

## Nächste Schritte

1. Phase 2 abschließen: Typen und Helper-Funktionen
2. Phase 3 implementieren: Laufzeit-Sicherheitsregeln
3. Phase 4 implementieren: Validierungstool und Level-Anpassungen
4. Phase 5 abschließen: Qualitätssicherung und Dokumentation

## Changelog

### 2025-01-27
- Feature-Spezifikation erstellt
- Phase 1 abgeschlossen (Dokumentation und Projektstruktur)

