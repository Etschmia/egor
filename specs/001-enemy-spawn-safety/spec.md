# Feature Specification: Gegner-Spawn-Sicherheit

**Feature Branch**: `001-enemy-spawn-safety`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Bei vielen Varianten verschiedener Level kommt es vor, dass der Nutzer unmittelbar mit Betreten heftigen Attacken von Feinden ausgesetzt ist, manachmal ist effektive Gegenwhr gar nicht möglich weil man sich bereits wie im Gegner drin vorkommt und es kein Entweichen gibt. Deine Aufgabe: Stelle sicher, dass in allen Varianten aller Level die Gegner so weit vom Einstigspunkt des Nutzers entfernt sind dass sie mindestens 3 Sekunden brauchen um ihn zu erreichen. Ausserdem sollen sie sich erst 2 Sekunden nach Beginn des SPeiles bewegen dürfen."

## Clarifications

### Session 2025-01-27

- Q: Was passiert, wenn ein Level zu klein ist, um alle Gegner 3 Sekunden entfernt zu platzieren? → A: Gegner werden automatisch so weit wie möglich entfernt platziert (Minimum 2 Sekunden), Entwickler-Warnung wird ausgegeben
- Q: Wie wird die Distanz berechnet, wenn ein Gegner durch geschlossene Türen muss? → A: Distanz basiert auf Pfadlänge inklusive geschlossener Türen, Türöffnungszeit wird addiert falls Gegner Türen öffnen kann
- Q: Wie werden Gegner behandelt, die keine Türen öffnen können (z.B. Hunde)? → A: Gegner ohne Türöffnungsfähigkeit müssen einen Pfad ohne geschlossene Türen haben, oder die Distanz wird als "unendlich" betrachtet (3-Sekunden-Regel erfüllt)
- Q: Wann soll die Level-Validierung stattfinden? → A: Validierung zur Entwicklungszeit (beim Erstellen/Bearbeiten von Leveln, z.B. als Build-Step oder Entwicklertool)
- Q: Was genau bedeutet "Spielbeginn" für die 2-Sekunden-Verzögerung? → A: Zeitpunkt, wenn das Level geladen wird und das Spiel startet (unabhängig von Spieler-Eingaben)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sicherer Spielstart ohne sofortige Bedrohung (Priority: P1)

Ein Spieler startet ein neues Level oder lädt ein gespeichertes Spiel. Beim Betreten des Levels hat der Spieler mindestens 3 Sekunden Zeit, sich zu orientieren und zu bewegen, bevor ein Gegner ihn erreichen kann. Zusätzlich bewegen sich Gegner erst 2 Sekunden nach Spielbeginn, was dem Spieler eine kurze Anpassungsphase gibt.

**Why this priority**: Dies ist die Kernfunktionalität der Feature. Ohne diese Garantie bleibt das Problem bestehen, dass Spieler sofort angegriffen werden können.

**Independent Test**: Kann vollständig getestet werden, indem ein Level gestartet wird und die Distanz zwischen Spieler-Startposition und allen Gegnern gemessen wird. Die Zeit bis zur ersten Bewegung der Gegner kann ebenfalls gemessen werden.

**Acceptance Scenarios**:

1. **Given** ein Spieler startet ein neues Level, **When** das Level geladen wird, **Then** ist jeder Gegner mindestens so weit vom Spieler-Startpunkt entfernt, dass er bei seiner maximalen Geschwindigkeit mindestens 3 Sekunden benötigt, um den Spieler zu erreichen
2. **Given** ein Spieler startet ein neues Level, **When** das Level beginnt, **Then** bewegen sich alle Gegner erst nach 2 Sekunden
3. **Given** ein Spieler lädt ein gespeichertes Spiel, **When** das Spiel geladen wird, **Then** gelten die gleichen Distanz- und Bewegungsverzögerungsregeln wie beim Neustart
4. **Given** ein Spieler wechselt zu einem neuen Level, **When** das neue Level geladen wird, **Then** sind alle Gegner im neuen Level entsprechend positioniert und verzögert

---

### User Story 2 - Konsistente Anwendung über alle Level-Varianten (Priority: P2)

Die Sicherheitsregeln gelten für alle Varianten aller Level im Spiel. Unabhängig davon, welche Variante eines Levels ausgewählt wird, ist der Spieler vor sofortigen Angriffen geschützt.

**Why this priority**: Dies stellt sicher, dass die Lösung vollständig ist und nicht nur für einige Level gilt. Es verhindert, dass Spieler in bestimmten Varianten immer noch benachteiligt sind.

**Independent Test**: Kann getestet werden, indem alle Varianten aller Level durchlaufen werden und für jede Variante die Distanz- und Bewegungsverzögerungsregeln überprüft werden.

**Acceptance Scenarios**:

1. **Given** es gibt 7 Level mit jeweils 5 Varianten, **When** jede Variante geladen wird, **Then** erfüllen alle Gegner in allen Varianten die Mindestdistanz-Anforderung
2. **Given** ein Level hat mehrere Varianten, **When** verschiedene Varianten nacheinander gespielt werden, **Then** gelten in allen Varianten die gleichen Sicherheitsregeln

---

### Edge Cases

- Was passiert, wenn ein Level so klein ist, dass es nicht möglich ist, alle Gegner 3 Sekunden vom Startpunkt entfernt zu platzieren? (Gegner werden automatisch so weit wie möglich entfernt platziert mit Minimum 2 Sekunden, Entwickler-Warnung wird ausgegeben)
- Wie wird die Distanz berechnet, wenn Gegner unterschiedliche Geschwindigkeiten haben? (System sollte die maximale Geschwindigkeit jedes Gegners berücksichtigen)
- Was passiert, wenn ein Gegner durch eine Tür gehen muss, um den Spieler zu erreichen? (Die Berechnung berücksichtigt die tatsächliche Pfadlänge inklusive geschlossener Türen, Türöffnungszeit wird addiert falls der Gegner Türen öffnen kann)
- Wie werden Gegner behandelt, die keine Türen öffnen können? (Gegner ohne Türöffnungsfähigkeit müssen einen Pfad ohne geschlossene Türen haben, oder die Distanz wird als "unendlich" betrachtet, wodurch die 3-Sekunden-Regel als erfüllt gilt)
- Wie verhält sich das System, wenn ein Level neu generiert wird oder dynamisch erstellt wird? (Die Regeln müssen auch bei dynamischer Generierung gelten)
- Was passiert, wenn ein Spieler das Spiel pausiert und wieder aufnimmt? (Die 2-Sekunden-Verzögerung sollte nur beim ersten Start gelten, nicht bei jeder Pause)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST sicherstellen, dass jeder Gegner in jeder Level-Variante mindestens so weit vom Spieler-Startpunkt entfernt ist, dass er bei seiner maximalen Geschwindigkeit mindestens 3 Sekunden benötigt, um den Spieler zu erreichen
- **FR-002**: System MUST verhindern, dass sich Gegner in den ersten 2 Sekunden nach Spielbeginn bewegen. "Spielbeginn" ist definiert als der Zeitpunkt, wenn das Level geladen wird und das Spiel startet (unabhängig von Spieler-Eingaben)
- **FR-003**: System MUST die Distanzberechnung basierend auf der tatsächlichen Pfadlänge durchführen (berücksichtigt Wände und Türen), nicht nur Luftlinie. Geschlossene Türen werden inkludiert, und falls der Gegner Türen öffnen kann, wird die Türöffnungszeit zur Pfadlänge addiert
- **FR-004**: System MUST die maximale Geschwindigkeit jedes Gegners bei der Distanzberechnung berücksichtigen
- **FR-010**: System MUST für Gegner ohne Türöffnungsfähigkeit (z.B. Hunde) prüfen, ob ein Pfad ohne geschlossene Türen existiert. Wenn kein solcher Pfad existiert, wird die Distanz als "unendlich" betrachtet und die 3-Sekunden-Regel gilt als erfüllt
- **FR-005**: System MUST diese Regeln für alle Varianten aller Level anwenden (7 Level × 5 Varianten = 35 Level-Varianten)
- **FR-006**: System MUST die Bewegungsverzögerung auch beim Laden eines gespeicherten Spiels anwenden, wenn das Spiel neu startet
- **FR-007**: System MUST die Bewegungsverzögerung nur beim ersten Start eines Levels anwenden, nicht bei jeder Pause/Wiederaufnahme
- **FR-008**: System MUST eine Validierung zur Entwicklungszeit durchführen (beim Erstellen/Bearbeiten von Leveln), die sicherstellt, dass alle Level-Varianten die Anforderungen erfüllen
- **FR-009**: System MUST automatisch Gegner in zu kleinen Leveln so weit wie möglich entfernt platzieren (Minimum 2 Sekunden Distanz) und eine Entwickler-Warnung ausgeben, wenn die 3-Sekunden-Anforderung nicht erfüllt werden kann

### Key Entities

- **Gegner (Enemy)**: Repräsentiert einen feindlichen Charakter im Spiel. Hat eine Position (x, y), eine Geschwindigkeit (speed), und einen Typ (ZOMBIE, MONSTER, GHOST, DOG). Die Geschwindigkeit variiert je nach Typ.
- **Level-Variante (Level Variant)**: Eine spezifische Konfiguration eines Levels mit eigener Kartenlayout, Gegner-Positionen, Items und Spieler-Startposition. Jedes Level hat 5 Varianten.
- **Spieler-Startposition (Player Start Position)**: Die initiale Position (playerStartX, playerStartY) des Spielers beim Betreten eines Levels.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% aller Gegner in allen 35 Level-Varianten sind mindestens so weit vom Spieler-Startpunkt entfernt, dass sie bei ihrer maximalen Geschwindigkeit mindestens 3 Sekunden benötigen, um den Spieler zu erreichen
- **SC-002**: Alle Gegner bewegen sich erst nach genau 2 Sekunden nach Spielbeginn (gemessen vom Zeitpunkt, wenn das Level geladen wird und das Spiel startet)
- **SC-003**: Die Distanzberechnung berücksichtigt die tatsächliche Pfadlänge (inklusive Umwege um Wände) für mindestens 95% der Gegner-Positionen
- **SC-004**: Kein Spieler erleidet Schaden von einem Gegner innerhalb der ersten 3 Sekunden nach Spielbeginn in 100% der getesteten Level-Starts
- **SC-005**: Die Validierung identifiziert automatisch alle Level-Varianten, die die Anforderungen nicht erfüllen, mit einer Genauigkeit von 100%

## Assumptions

- Die Geschwindigkeit der Gegner ist konstant und ändert sich nicht während des Spiels (außer durch Schwierigkeitsgrad-Multiplikatoren)
- Die Spielgeschwindigkeit läuft mit 60 FPS, daher entspricht 1 Sekunde 60 Frames
- Die Distanzberechnung kann eine vereinfachte Pfadfindung verwenden, muss aber realistisch genug sein, um echte Spielzeit zu repräsentieren
- Wenn ein Level zu klein ist, um alle Gegner 3 Sekunden entfernt zu platzieren, werden die Gegner automatisch so weit wie möglich entfernt platziert, mit einer Mindestdistanz von 2 Sekunden als Fallback, und eine Entwickler-Warnung wird ausgegeben
- Die 2-Sekunden-Bewegungsverzögerung gilt nur für die initiale Bewegung, nicht für Angriffe (Gegner können möglicherweise noch angreifen, wenn sie bereits in Reichweite sind, aber sie bewegen sich nicht)

## Dependencies

- Bestehende Level-Definitionen müssen möglicherweise angepasst werden, um die Mindestdistanz-Anforderungen zu erfüllen
- Die Gegner-Bewegungslogik muss erweitert werden, um die Bewegungsverzögerung zu implementieren
- Die Level-Validierung erfordert ein System, das alle Level-Varianten automatisch überprüft
- Die Distanzberechnung erfordert eine Pfadfindungs-Funktion, die die tatsächliche Wegstrecke berücksichtigt

