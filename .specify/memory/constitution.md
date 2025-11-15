<!--
Sync Impact Report
Version: 1.0.0 (initial)
Ratifiziert: 2025-11-15
Letzte Änderung: 2025-11-15

Prinzipien:
- Dokumentationspflicht
- Eindeutige Nummerierung
- Automatische Versionskontrolle
- Dependency-Management
- Code-Qualität und TypeScript-Standards

Abhängige Dateien:
- AGENTS.md (muss aktualisiert werden bei Änderungen)
- README.md (muss aktualisiert werden bei Änderungen)
- docs/ (Spezifikations-spezifische Dokumentation)
-->

# Projektverfassung

**Version:** 1.0.0  
**Ratifiziert:** 2025-11-15  
**Letzte Änderung:** 2025-11-15

## Präambel

Diese Verfassung definiert die grundlegenden Prinzipien, Regeln und Best Practices für die Entwicklung des "Hundefelsen"-Projekts (egor), eines 2.5D Raycasting-Spiels im Stil von Wolfenstein 3D. Sie basiert auf den Richtlinien in `AGENTS.md` und stellt sicher, dass alle Entwicklungsaktivitäten konsistent, dokumentiert und nachvollziehbar durchgeführt werden.

## Grundsätze

### 1. Dokumentationspflicht

**Prinzip:** Alle Implementierungen müssen vollständig dokumentiert werden.

**Regeln:**

1. Nach Abschluss der Implementierung einer neuen Spezifikation MUSS stets geprüft werden, ob `AGENTS.md` und `README.md` Aktualisierungen benötigen. Diese Aktualisierungen MÜSSEN vorgenommen werden, bevor ein Feature-Branch gemerged wird.

2. Spezifikations-spezifische Dokumentation, die nur die aktuell in Arbeit befindliche Spezifikation betrifft, SOLLTE im Verzeichnis `docs/` nachgehalten werden. Diese Dokumentation MUSS in der jeweiligen Spezifikation referenziert werden.

3. Bei Änderungen an Kernsystemen (siehe `AGENTS.md` Abschnitt "When Modifying Core Systems") MUSS die Dokumentation entsprechend aktualisiert werden.

4. Die Struktur der Dokumentation SOLLTE der Projektstruktur folgen:
   - Allgemeine Projekt-Dokumentation: `README.md`, `AGENTS.md`
   - Spezifikations-spezifisch: `docs/[SPEC_NAME]-[DESCRIPTION].md`
   - Editor/Designer-Dokumentation: `docs/[EDITOR|DESIGNER]-*.md`

**Begründung:** Aktuelle und vollständige Dokumentation ist essentiell für die Wartbarkeit, das Onboarding neuer Entwickler und die Nachvollziehbarkeit von Entscheidungen.

### 2. Eindeutige Nummerierung

**Prinzip:** Branches, Specs und verwandte Artefakte müssen eindeutig und fortlaufend nummeriert sein.

**Regeln:**

1. Bei der Benennung neuer Branches und Specs MUSS eine vorangestellte laufende Nummer verwendet werden, die eindeutig und fortlaufend ist.

2. Vor jeder Erstellung eines neuen Branches oder Specs MUSS der Befehl `git branch -a` ausgeführt werden, um alle existierenden Branches zu identifizieren (einschließlich remote und ungemergter Branches).

3. Die Nummerierung MUSS der höchsten existierenden Nummer folgen, unabhängig davon, ob der Branch bereits gemerged wurde oder nicht.

4. Die Nummerierung SOLLTE dreistellig sein (z.B. `001-feature-name`, `002-spec-description`), um eine ausreichende Skalierbarkeit zu gewährleisten.

5. Ungemergte oder inaktive Branches DÜRFEN NICHT für die Nummerierung ignoriert werden.

**Begründung:** Eindeutige Nummerierung verhindert Konflikte, ermöglicht einfache Nachverfolgbarkeit und stellt sicher, dass keine Nummern mehrfach verwendet werden.

**Beispiel:**
```
Existierende Branches: 001-feature-a, 002-feature-b (nicht gemerged), 003-spec-c
Neue Nummer: 004-feature-d (nicht 002-feature-d!)
```

### 3. Branch-Strategie und Pull-Requests

**Prinzip:** Branches und Pull-Requests müssen den Zusammenhang zu Spezifikation und Dokumentation explizit aufzeigen.

**Regeln:**

1. Branch-Namen MÜSSEN folgendes Format verwenden: `[NUMMER]-[TYP]-[KURZBESCHREIBUNG]`
   - Typ: `feature`, `spec`, `fix`, `docs`
   - Beispiel: `004-spec-level-editor`, `005-feature-new-enemy`

2. Pull-Request-Beschreibungen MÜSSEN enthalten:
   - Verweis auf die zugehörige Spezifikation (falls vorhanden)
   - Liste der geänderten Dokumentations-Dateien
   - Zusammenfassung der Änderungen an `AGENTS.md` und/oder `README.md`
   - Verweis auf relevante Dokumentation in `docs/`

3. Pull-Requests DÜRFEN NICHT gemerged werden, wenn:
   - Die Dokumentationsprüfung nicht durchgeführt wurde
   - `AGENTS.md` oder `README.md` Aktualisierungen benötigen, aber nicht aktualisiert wurden
   - Die Dokumentation in `docs/` nicht vorhanden ist (falls erforderlich)

4. Commit-Messages SOLLTEN dem Format folgen: `[Typ]: [Kurzbeschreibung]`
   - Typ: `feat`, `fix`, `docs`, `spec`, `refactor`
   - Beispiel: `feat: implement new enemy type zombie`, `docs: update AGENTS.md for new enemy system`

**Begründung:** Klare Verbindungen zwischen Code, Spezifikation und Dokumentation verbessern die Nachvollziehbarkeit und ermöglichen effizientes Code-Review.

### 4. Automatische Versionskontrolle

**Prinzip:** Erfolgreich implementierte Tasks müssen automatisch versioniert werden.

**Regeln:**

1. Nach jedem erfolgreich implementierten Task aus der Taskliste, für den Tests erfolgreich waren, MUSS im jeweiligen aktuellen Feature-Branch automatisch folgendes ausgeführt werden:
   ```bash
   git add .
   git commit -m "[aussagekräftige Darstellung der Änderungen]"
   ```

2. Die Commit-Message MUSS eine aussagekräftige Beschreibung der Änderungen enthalten, die es ermöglicht, die Änderung ohne Code-Review zu verstehen.

3. Commit-Messages SOLLTEN auf Deutsch sein, wenn dies der Projektkonvention entspricht, oder in der Sprache der Codebase (Englisch).

4. Commits DÜRFEN NICHT erstellt werden, wenn:
   - Tests fehlgeschlagen sind
   - Der Build fehlschlägt (`npm run build`)
   - Linting-Fehler vorhanden sind (`npm run lint`)

5. Mehrere kleine, zusammengehörige Änderungen DÜRFEN in einem Commit zusammengefasst werden, wenn sie logisch zusammengehören.

**Begründung:** Häufige, atomare Commits erleichtern Code-Review, ermöglichen einfache Rollbacks und verbessern die Nachverfolgbarkeit der Entwicklung.

### 5. Dependency-Management

**Prinzip:** Nur aktive, nicht-deprecated Dependencies dürfen verwendet werden.

**Regeln:**

1. Vor dem Hinzufügen eines neuen Moduls zu `package.json` MUSS geprüft werden, ob das Modul oder seine Dependencies als deprecated markiert wurden.

2. Deprecated Module DÜRFEN NICHT als direkte Dependencies hinzugefügt werden.

3. Deprecated Module DÜRFEN NICHT als transitive Dependencies (Abhängigkeiten von Abhängigkeiten) akzeptiert werden, wenn vermeidbar.

4. Wenn ein deprecated Modul als transitive Dependency akzeptiert werden muss, MUSS dies in der Commit-Message dokumentiert werden, zusammen mit einer Begründung und einem Plan zur Migration.

5. Vor jeder Dependency-Änderung SOLLTE `npm outdated` ausgeführt werden, um veraltete Dependencies zu identifizieren.

6. Bei Dependency-Updates MUSS geprüft werden, ob Breaking Changes vorhanden sind (z.B. durch Changelog-Review).

**Begründung:** Die Verwendung von deprecated Dependencies führt zu technischer Schuld, Sicherheitsproblemen und Erschwerung zukünftiger Wartung.

### 6. TypeScript-Standards

**Prinzip:** Strikte TypeScript-Standards müssen eingehalten werden.

**Regeln:**

1. Alle Code-Dateien MÜSSEN TypeScript mit strikten Einstellungen verwenden (`tsconfig.app.json`).

2. Imports MÜSSEN explizite `.ts` Extensions enthalten: `import { x } from './file.ts'` (nicht `'./file'`).

3. Unbenutzte Variablen und Parameter SIND Fehler und MÜSSEN entfernt werden oder mit `_` prefixiert werden.

4. Der Typ `any` DARF NICHT verwendet werden, außer in extremen Ausnahmefällen mit expliziter Begründung.

5. Type-only Imports MÜSSEN mit dem `type` Keyword erfolgen: `import type { X } from './types.ts'`.

6. Alle Funktionen MÜSSEN explizite Typannotationen für Parameter und Rückgabewerte haben, außer wenn der Typ eindeutig ableitbar ist.

**Begründung:** Strikte TypeScript-Standards verbessern Code-Qualität, reduzieren Bugs und erleichtern die Wartung.

### 7. Code-Qualität

**Prinzip:** Code muss hohen Qualitätsstandards entsprechen.

**Regeln:**

1. Alle Code-Dateien MÜSSEN `npm run lint` ohne Fehler bestehen.

2. Alle Code-Dateien MÜSSEN `npm run build` erfolgreich kompilieren.

3. Unbenutzte Imports MÜSSEN entfernt werden.

4. Code-Organisation MUSS den Richtlinien in `AGENTS.md` folgen:
   - Game Logic: `src/gameEngine.ts`, `src/raycasting.ts`
   - Rendering: `src/App.tsx`, `src/raycasting.ts`
   - Types: `src/types.ts`
   - Systems: `src/textures.ts`, `src/soundSystem.ts`

5. React Best Practices MÜSSEN befolgt werden:
   - Funktionale Komponenten mit Hooks
   - `useRef` für game state im Game Loop
   - `useState` nur für UI-Updates
   - React Compiler aktiv - keine unnötige manuelle Memoization

6. Performance-Kriterien MÜSSEN berücksichtigt werden:
   - 60 FPS Ziel auf modernen Browsern
   - Keine neuen Objekte/Arrays im Render-Loop
   - View Frustum Culling für Sprites
   - Optimierte Kollisionserkennung

**Begründung:** Hohe Code-Qualität reduziert Bugs, verbessert Performance und erleichtert Wartung und Erweiterbarkeit.

### 8. Testing-Disziplin

**Prinzip:** Änderungen müssen getestet werden, bevor sie committed werden.

**Regeln:**

1. Vor jedem Commit MÜSSEN die relevanten Tests ausgeführt werden.

2. Bei neuen Features MÜSSEN entsprechende Tests erstellt werden (falls ein Test-Framework vorhanden ist).

3. Manuelle Tests MÜSSEN durchgeführt werden für:
   - Build-Test: `npm run build`
   - Lint-Check: `npm run lint`
   - Runtime-Test: `npm run dev` und Test im Browser
   - Spezifische Funktionalität (z.B. Save/Load, Performance)

4. Performance-Tests MÜSSEN bei Änderungen an kritischen Systemen durchgeführt werden (Game Loop, Rendering, AI).

5. Backward-Compatibility MUSS berücksichtigt werden, besonders bei Änderungen am Save/Load-System.

**Begründung:** Testing verhindert Regressionen, stellt sicher, dass Features wie erwartet funktionieren und verbessert die Code-Qualität.

### 9. Architektur-Prinzipien

**Prinzip:** Trennung von Concerns und klare Architektur müssen eingehalten werden.

**Regeln:**

1. Game Logic MUSS von React-Komponenten getrennt sein (z.B. `gameEngine.ts`).

2. Rendering-Logik gehör in Komponenten (`App.tsx`, `raycasting.ts`), Update-Logik in Engine-Funktionen.

3. TypeScript-Interfaces MÜSSEN für alle Datenstrukturen verwendet werden.

4. Verwandte Funktionalität SOLLTE in Modulen gruppiert werden.

5. Nur öffentliche APIs SOLLTEN aus Modulen exportiert werden.

6. Bestehende Systeme SOLLTEN verwendet werden statt neue zu erstellen:
   - Texture-Generation: `src/textures.ts`
   - Sound-System: `src/soundSystem.ts`
   - Save/Load: `src/saveLoadSystem.ts`

**Begründung:** Klare Architektur verbessert Wartbarkeit, Testbarkeit und ermöglicht parallele Entwicklung.

## Governance

### Versionsverwaltung

Die Verfassung verwendet Semantische Versionierung (SemVer):
- **MAJOR** (X.0.0): Rückwärts-inkompatible Änderungen an Prinzipien oder Governance
- **MINOR** (0.X.0): Neue Prinzipien oder erweiterte Richtlinien
- **PATCH** (0.0.X): Klarstellungen, Korrekturen, nicht-semantische Verbesserungen

### Änderungsverfahren

1. Änderungsvorschläge MÜSSEN dokumentiert werden.

2. Vor Änderungen an der Verfassung MÜSSEN alle abhängigen Dokumente identifiziert werden (`AGENTS.md`, `README.md`, Templates).

3. Nach Änderungen MÜSSEN alle abhängigen Dokumente aktualisiert werden.

4. Die Sync Impact Report am Anfang der Verfassung MUSS aktualisiert werden.

5. Änderungen MÜSSEN in einem separaten Branch mit entsprechender Nummerierung erfolgen.

### Compliance-Review

1. Vor jedem Merge MUSS ein Compliance-Check durchgeführt werden:
   - Sind alle Dokumentations-Updates durchgeführt?
   - Sind alle Tests erfolgreich?
   - Entspricht der Code den TypeScript-Standards?
   - Sind keine deprecated Dependencies hinzugefügt worden?
   - Sind alle Commits aussagekräftig?

2. Code-Reviews SOLLTEN die Einhaltung der Verfassung prüfen.

3. Verstöße gegen die Verfassung MÜSSEN vor dem Merge behoben werden.

### Ratifizierung und Gültigkeit

Diese Verfassung wurde am 2025-11-15 ratifiziert und tritt sofort in Kraft. Alle zukünftigen Entwicklungsaktivitäten MÜSSEN dieser Verfassung entsprechen.

## Referenzen

- `AGENTS.md`: Ausführliche Entwicklungsrichtlinien und Projekt-Übersicht
- `README.md`: Projekt-Dokumentation und Feature-Beschreibung
- `docs/`: Spezifikations-spezifische Dokumentation
- `package.json`: Projekt-Abhängigkeiten und Scripts
- TypeScript-Konfiguration: `tsconfig.json`, `tsconfig.app.json`

---

**Letzte Aktualisierung:** 2025-11-15  
**Nächste geplante Review:** Bei Bedarf oder bei Änderungen der Projekt-Struktur
