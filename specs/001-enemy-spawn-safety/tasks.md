# Tasks: Gegner-Spawn-Sicherheit

**Input**: `plan.md`, `spec.md`, `data-model.md`, `research.md`, `quickstart.md`, `contracts/functions.md`  
**Prerequisites**: Repository root `package.json` scripts, `src/` game logic, `specs/001-enemy-spawn-safety/` design artifacts

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dokumentation und Projektstruktur für das Feature vorbereiten.

- [x] T001 Dokumentiere Sicherheitsziele und Referenzen aus den Spezifikationen in `docs/enemy-spawn-safety.md`.
- [x] T002 Richte `src/utils/` mit `README.md` und `index.ts` ein, um das kommende Validierungstool zu beherbergen.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Gemeinsame Typen und Konstanten bereitstellen, bevor User Stories starten.  
**⚠️ CRITICAL**: Diese Aufgaben müssen abgeschlossen sein, bevor US1 oder US2 umgesetzt wird.

- [x] T003 Erweitere `src/types.ts` um `PathDistanceResult`, `ValidationResult`, `ValidationViolation` sowie das optionale Feld `GameState.levelStartTime`.
- [x] T004 Ergänze `src/levels.ts` um einen `getAllLevelVariants()`-Helper, der alle Level-Varianten inklusive Metadaten für Validatoren liefert.
- [x] T005 Definiere `ENEMY_SAFETY_RULES` (3 Sekunden Mindestdistanz, 2 Sekunden Bewegungsverzögerung, Türöffnungszeit) zentral in `src/gameEngine.ts` und exportiere sie für Laufzeit- und Tool-Code.

---

## Phase 3: User Story 1 – Sicherer Spielstart ohne sofortige Bedrohung (Priority: P1) 🎯 MVP

**Goal**: Laufzeit garantiert, dass jeder Levelstart dem Spieler mindestens 3 Sekunden Abstand und eine 2-Sekunden-Bewegungsverzögerung verschafft.  
**Independent Test**: Starte beliebige Level (inkl. Savegame-Ladevorgänge) und miss sowohl Pfaddistanzen als auch die blockierte Bewegung gemäß `specs/001-enemy-spawn-safety/quickstart.md`.

### Implementation for User Story 1

- [x] T006 [P] [US1] Implementiere `calculatePathDistance()` in `src/gameEngine.ts` als BFS über das Tile-Grid inklusive Türöffnungszeiten und Türfähigkeitsprüfung.
- [x] T007 [US1] Füge in `src/gameEngine.ts` eine `ensureEnemySpawnSafety()`-Routine hinzu, die beim Levelstart alle Gegnerpositionen mit `calculatePathDistance()` prüft und bei Bedarf Repositionierungen/Warnungen erstellt.
- [x] T008 [US1] Initialisiere und aktualisiere `levelStartTime` in `createInitialGameState()`, `loadNextLevel()` und den relevanten Pfaden von `src/saveLoadSystem.ts`, sodass `ensureEnemySpawnSafety()` bei jedem Level-Ladevorgang ausgeführt wird.
- [x] T009 [P] [US1] Implementiere `shouldEnemyMove()` in `src/gameEngine.ts` und blockiere gegnerische Bewegung in `updateEnemies()` solange `Date.now() - levelStartTime < 2000`.
- [x] T010 [P] [US1] Aktualisiere alle Aufrufer (z.B. `src/App.tsx`, eventuelle Editor-/Designer-Hooks), damit `updateEnemies()` den neuen `levelStartTime`-Parameter erhält.
- [x] T011 [US1] Führe die manuellen Szenarien aus `specs/001-enemy-spawn-safety/quickstart.md` durch, um 3-Sekunden-Distanz und 2-Sekunden-Verzögerung nachzuweisen, und protokolliere Ergebnisse in `docs/enemy-spawn-safety.md`.

---

## Phase 4: User Story 2 – Konsistente Anwendung über alle Level-Varianten (Priority: P2)

**Goal**: Alle 35 Level-Varianten erfüllen dauerhaft die Sicherheitsregeln, inklusive Fallback-Repositionierung und Entwickler-Warnungen.  
**Independent Test**: Führe das Validierungstool gegen jede Variante aus (`npm run validate-levels`) und prüfe stichprobenartig verschiedene Varianten im Spiel laut `specs/001-enemy-spawn-safety/quickstart.md`.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Implementiere `validateLevelVariant()` und `validateAllLevels()` in `src/utils/levelValidator.ts` basierend auf `calculatePathDistance()` und `getAllLevelVariants()`.
- [ ] T013 [US2] Ergänze `package.json` um das Skript `validate-levels` (z.B. via `tsx src/utils/levelValidator.ts`) und dokumentiere Ausführung/Optionen in `specs/001-enemy-spawn-safety/quickstart.md`.
- [ ] T014 [US2] Führe das Validierungsskript aus und passe alle betroffenen Leveldefinitionen in `src/levels/*.ts` an (inkl. 2-Sekunden-Fallback + Warnhinweise in Konsolen-Output).
- [ ] T015 [P] [US2] Aktualisiere `docs/enemy-spawn-safety.md` mit Validierungsberichten, bekannten Einschränkungen und Anweisungen zum Umgang mit 2-Sekunden-Fallbacks.
- [ ] T016 [US2] Teste mehrere Levelvarianten hintereinander gemäß `specs/001-enemy-spawn-safety/quickstart.md` und bestätige konsistente Verzögerung sowie Distanz in der Dokumentation.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Qualitätssicherung, Performance und Dokumentation nach Abschluss aller Stories.

- [ ] T017 Führe `npm run lint` und `npm run build` laut `package.json` aus, um Typ- und Lint-Konformität zu verifizieren.
- [ ] T018 [P] Ergänze finale Ergebnisse, Benchmarks und bekannte Einschränkungen in `docs/enemy-spawn-safety.md` sowie Verweise in `AGENTS.md`.
- [ ] T019 [P] Überwache die Frame-Zeit mit `src/performanceMonitor.ts` (oder bestehenden Dev-Tools) und optimiere bei Bedarf die neuen Sicherheitsprüfungen.

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5** (strikte Reihenfolge).  
- User Story 1 (P1) ist Voraussetzung für User Story 2 (P2), da der Validator auf den Laufzeitfunktionen und gemeinsamen Typen aufbaut.  
- Innerhalb von US1 müssen `T006`/`T007` abgeschlossen sein, bevor `T008`–`T010` sinnvoll getestet werden können.  
- US2-Taks `T012` und `T013` müssen fertig sein, bevor `T014`–`T016` starten.

## Parallel Execution Examples

```text
US1: T006 (calculatePathDistance) und T009/T010 (Bewegungsverzögerung) können parallel laufen, sobald T003–T005 erledigt sind.
US2: T012 (Validator-Logik) und T015 (Dokumentation der Berichte) können parallel laufen, nachdem T013 eingerichtet ist, während T014 (Level-Anpassungen) sequenziell erfolgt.
```

## Implementation Strategy

- **MVP zuerst**: Liefere Phase 1–3 vollständig aus, sodass sichere Levelstarts (US1) demonstrierbar sind, bevor globale Validierung startet.  
- **Inkrementelle Erweiterung**: Ergänze anschließend US2, um alle Varianten zu prüfen und anzupassen; jede Story bleibt unabhängig testbar.  
- **Parallelisierung**: Nachdem das Fundament steht, kann ein Entwickler US1 (T006–T010) behandeln, während ein anderer schon Dokumentation (T011, T015) oder Validator-Aufgaben (T012–T013) vorbereitet.  
- **Abschließende Qualität**: Nach Story-Freigabe Phase 5 ausführen (Lint/Build, Performance) und Ergebnisse dokumentieren.

