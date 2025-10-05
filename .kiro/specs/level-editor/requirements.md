# Requirements Document

## Introduction

Dieses Dokument beschreibt die Anforderungen für einen In-Browser Level-Editor, der ausschließlich in der Entwicklungsumgebung läuft. Der Editor ermöglicht es Entwicklern, Level-Dateien im Verzeichnis `src/levels` visuell zu erstellen und zu bearbeiten, ohne manuell TypeScript-Code schreiben zu müssen. Der Editor wird als separate Anwendung neben der Hauptanwendung laufen und hat keinen Einfluss auf den Production-Build.

## Requirements

### Requirement 1: Separate Entwicklungsumgebung

**User Story:** Als Entwickler möchte ich den Level-Editor unabhängig von der Hauptanwendung starten und beenden können, damit ich flexibel zwischen Spielentwicklung und Level-Design wechseln kann.

#### Acceptance Criteria

1. WHEN der Entwickler `npm run editor` ausführt THEN SHALL das System den Level-Editor auf einem separaten Port (z.B. 3001) starten
2. WHEN der Entwickler `npm run dev` ausführt THEN SHALL das System die Hauptanwendung auf Port 5173 starten
3. WHEN beide Befehle gleichzeitig ausgeführt werden THEN SHALL beide Anwendungen unabhängig voneinander laufen
4. WHEN der Entwickler `npm run build` ausführt THEN SHALL das System nur die Hauptanwendung bauen und der Editor-Code SHALL NOT im `dist`-Verzeichnis enthalten sein

### Requirement 2: Dateisystem-Zugriff für Level-Verwaltung

**User Story:** Als Entwickler möchte ich bestehende Level-Dateien laden und bearbeitete Level speichern können, damit meine Änderungen persistent im Projekt gespeichert werden.

#### Acceptance Criteria

1. WHEN der Editor gestartet wird THEN SHALL ein Backend-Server auf einem lokalen Port (z.B. 3001) laufen
2. WHEN der Editor eine Liste aller Level anfordert THEN SHALL der Backend-Server alle `.ts`-Dateien aus `src/levels` auflisten
3. WHEN der Editor ein spezifisches Level lädt THEN SHALL der Backend-Server den Inhalt der entsprechenden `.ts`-Datei zurückgeben
4. WHEN der Editor ein Level speichert THEN SHALL der Backend-Server eine gültige TypeScript-Datei im Format der bestehenden Level-Dateien in `src/levels` schreiben
5. IF eine Level-Datei bereits existiert THEN SHALL der Backend-Server diese überschreiben können
6. WHEN ein Fehler beim Lesen oder Schreiben auftritt THEN SHALL der Backend-Server eine aussagekräftige Fehlermeldung zurückgeben

### Requirement 3: Visuelle Level-Darstellung

**User Story:** Als Entwickler möchte ich das Level in einer vergrößerten, an die MiniMap angelehnten Ansicht sehen, damit ich einen klaren Überblick über die Level-Struktur habe.

#### Acceptance Criteria

1. WHEN ein Level geladen wird THEN SHALL der Editor eine 2D-Draufsicht des Levels anzeigen
2. WHEN die Ansicht gerendert wird THEN SHALL das visuelle Design der bestehenden MiniMap-Komponente als Grundlage dienen
3. WHEN die Ansicht gerendert wird THEN SHALL diese den primären Inhaltsbereich der Seite einnehmen (nicht auf Mini-Größe beschränkt)
4. WHEN Wände dargestellt werden THEN SHALL diese in Weiß (#FFFFFF) gezeichnet werden
5. WHEN normale Türen dargestellt werden THEN SHALL diese in Braun (#8B4513) gezeichnet werden
6. WHEN Exit-Türen dargestellt werden THEN SHALL diese in Grün (#00FF00) gezeichnet werden
7. WHEN leere Bodenflächen dargestellt werden THEN SHALL diese in Schwarz (#000000) gezeichnet werden
8. WHEN Gegner im Level vorhanden sind THEN SHALL diese als farbige Marker an ihren Positionen angezeigt werden
9. WHEN Items im Level vorhanden sind THEN SHALL diese als farbige Marker an ihren Positionen angezeigt werden
10. WHEN dekorative Objekte im Level vorhanden sind THEN SHALL diese als Marker an ihren Positionen angezeigt werden

### Requirement 4: Level- und Varianten-Auswahl

**User Story:** Als Entwickler möchte ich über Dropdown-Menüs das zu bearbeitende Level und dessen Variante auswählen können, damit ich schnell zwischen verschiedenen Levels wechseln kann.

#### Acceptance Criteria

1. WHEN der Editor geöffnet wird THEN SHALL ein Dropdown-Menü zur Auswahl des Levels (level1, level2, etc.) angezeigt werden
2. WHEN ein Level ausgewählt wird THEN SHALL ein zweites Dropdown-Menü zur Auswahl der Variante (variant1, variant2, etc.) angezeigt werden
3. WHEN eine Level-Varianten-Kombination ausgewählt wird THEN SHALL der Editor die entsprechende Datei (z.B. `level1-variant1.ts`) vom Backend laden
4. WHEN die Datei geladen wurde THEN SHALL der Editor die Level-Daten in der visuellen Ansicht darstellen
5. IF keine Varianten für ein Level existieren THEN SHALL das Varianten-Dropdown leer oder deaktiviert sein

### Requirement 5: Interaktive Tile-Bearbeitung

**User Story:** Als Entwickler möchte ich durch Klicken auf Kacheln in der Kartenansicht deren Typ ändern können, damit ich schnell Wände, Türen und Bodenflächen platzieren kann.

#### Acceptance Criteria

1. WHEN der Entwickler auf eine Kachel in der Kartenansicht klickt THEN SHALL ein Kontextmenü erscheinen
2. WHEN das Kontextmenü angezeigt wird THEN SHALL es Optionen zur Änderung des Kachel-Typs enthalten (Boden=0, Wand=1, Tür=2, Exit-Tür=3)
3. WHEN der Entwickler einen neuen Kachel-Typ auswählt THEN SHALL die Kachel sofort in der Ansicht aktualisiert werden
4. WHEN der Entwickler einen neuen Kachel-Typ auswählt THEN SHALL die Änderung im internen Datenmodell gespeichert werden
5. WHEN das Kontextmenü geöffnet ist AND der Entwickler außerhalb klickt THEN SHALL das Menü geschlossen werden

### Requirement 6: Gegner-Verwaltung

**User Story:** Als Entwickler möchte ich Gegner im Level platzieren, bearbeiten und entfernen können, damit ich die Schwierigkeit und Herausforderung des Levels steuern kann.

#### Acceptance Criteria

1. WHEN der Entwickler auf eine leere Bodenfläche klickt THEN SHALL das Kontextmenü eine Option "Gegner hinzufügen" enthalten
2. WHEN "Gegner hinzufügen" ausgewählt wird THEN SHALL ein Dialog zur Auswahl des Gegner-Typs (ZOMBIE, MONSTER, GHOST, DOG) erscheinen
3. WHEN ein Gegner-Typ ausgewählt wird THEN SHALL ein neuer Gegner mit Standard-Eigenschaften an der geklickten Position erstellt werden
4. WHEN der Entwickler auf einen bestehenden Gegner klickt THEN SHALL das Kontextmenü Optionen "Bearbeiten" und "Entfernen" enthalten
5. WHEN "Bearbeiten" ausgewählt wird THEN SHALL ein Dialog zur Bearbeitung der Gegner-Eigenschaften (health, damage, speed) erscheinen
6. WHEN "Entfernen" ausgewählt wird THEN SHALL der Gegner aus dem Level entfernt werden
7. WHEN Änderungen vorgenommen werden THEN SHALL die visuelle Darstellung sofort aktualisiert werden

### Requirement 7: Item-Verwaltung

**User Story:** Als Entwickler möchte ich Items im Level platzieren, bearbeiten und entfernen können, damit ich Belohnungen und Ressourcen im Level verteilen kann.

#### Acceptance Criteria

1. WHEN der Entwickler auf eine leere Bodenfläche klickt THEN SHALL das Kontextmenü eine Option "Item hinzufügen" enthalten
2. WHEN "Item hinzufügen" ausgewählt wird THEN SHALL ein Dialog zur Auswahl des Item-Typs (HEALTH_SMALL, HEALTH_LARGE, TREASURE, AMMO, WEAPON) erscheinen
3. WHEN ein Item-Typ ausgewählt wird THEN SHALL ein neues Item mit Standard-Eigenschaften an der geklickten Position erstellt werden
4. IF der Item-Typ WEAPON ist THEN SHALL der Dialog zusätzlich eine Auswahl für den Waffen-Typ anbieten
5. WHEN der Entwickler auf ein bestehendes Item klickt THEN SHALL das Kontextmenü Optionen "Bearbeiten" und "Entfernen" enthalten
6. WHEN "Bearbeiten" ausgewählt wird THEN SHALL ein Dialog zur Bearbeitung der Item-Eigenschaften (value, weaponType) erscheinen
7. WHEN "Entfernen" ausgewählt wird THEN SHALL das Item aus dem Level entfernt werden

### Requirement 8: Dekorative Objekte und Wandbilder

**User Story:** Als Entwickler möchte ich dekorative Objekte und Wandbilder platzieren können, damit ich die Atmosphäre und visuelle Vielfalt des Levels verbessern kann.

#### Acceptance Criteria

1. WHEN der Entwickler auf eine leere Bodenfläche klickt THEN SHALL das Kontextmenü eine Option "Dekoratives Objekt hinzufügen" enthalten
2. WHEN "Dekoratives Objekt hinzufügen" ausgewählt wird THEN SHALL ein Dialog zur Auswahl des Objekt-Typs (CEILING_LIGHT, VASE, CRATE, BENCH, TABLE, CHAIR, WINE_BOTTLE, SKELETON) erscheinen
3. WHEN der Entwickler auf eine Wand klickt THEN SHALL das Kontextmenü eine Option "Wandbild hinzufügen" enthalten
4. WHEN "Wandbild hinzufügen" ausgewählt wird THEN SHALL ein Dialog zur Auswahl des Wandbild-Typs (PORTRAIT, LANDSCAPE, ABSTRACT) erscheinen
5. WHEN ein dekoratives Objekt oder Wandbild erstellt wird THEN SHALL es mit Standard-Eigenschaften initialisiert werden
6. WHEN der Entwickler auf ein bestehendes Objekt oder Wandbild klickt THEN SHALL das Kontextmenü Optionen "Bearbeiten" und "Entfernen" enthalten

### Requirement 9: Spieler-Startposition

**User Story:** Als Entwickler möchte ich die Startposition und Blickrichtung des Spielers festlegen können, damit ich kontrollieren kann, wo und wie der Spieler das Level beginnt.

#### Acceptance Criteria

1. WHEN ein Level geladen wird THEN SHALL die aktuelle Spieler-Startposition als spezieller Marker angezeigt werden
2. WHEN der Entwickler auf eine leere Bodenfläche klickt THEN SHALL das Kontextmenü eine Option "Als Spieler-Start setzen" enthalten
3. WHEN "Als Spieler-Start setzen" ausgewählt wird THEN SHALL ein Dialog zur Eingabe der Start-Blickrichtung (0-360 Grad) erscheinen
4. WHEN die Startposition gesetzt wird THEN SHALL der alte Startpositions-Marker entfernt und der neue angezeigt werden
5. WHEN die Startposition gesetzt wird THEN SHALL die Werte `playerStartX`, `playerStartY` und `playerStartDirection` im Datenmodell aktualisiert werden

### Requirement 10: Level-Speicherung

**User Story:** Als Entwickler möchte ich meine Änderungen am Level speichern können, damit diese als gültige TypeScript-Datei im Projekt verfügbar sind.

#### Acceptance Criteria

1. WHEN der Editor geöffnet ist THEN SHALL ein "Speichern"-Button sichtbar sein
2. WHEN der Entwickler auf "Speichern" klickt THEN SHALL der Editor die aktuellen Level-Daten an den Backend-Server senden
3. WHEN der Backend-Server die Daten empfängt THEN SHALL er eine gültige TypeScript-Datei im Format der bestehenden Level-Dateien generieren
4. WHEN die Datei generiert wird THEN SHALL sie die korrekte Struktur mit `export const LEVEL_X_VARIANT_Y: GameMap = {...}` haben
5. WHEN die Datei generiert wird THEN SHALL sie alle erforderlichen Imports enthalten
6. WHEN die Datei generiert wird THEN SHALL sie korrekt formatiert und lesbar sein
7. WHEN das Speichern erfolgreich war THEN SHALL der Editor eine Erfolgsbestätigung anzeigen
8. IF ein Fehler beim Speichern auftritt THEN SHALL der Editor eine Fehlermeldung anzeigen

### Requirement 11: Neue Level-Erstellung

**User Story:** Als Entwickler möchte ich neue Level und Varianten erstellen können, damit ich das Spiel um zusätzliche Inhalte erweitern kann.

#### Acceptance Criteria

1. WHEN der Editor geöffnet ist THEN SHALL ein "Neues Level erstellen"-Button sichtbar sein
2. WHEN der Entwickler auf "Neues Level erstellen" klickt THEN SHALL ein Dialog zur Eingabe von Level-Nummer und Varianten-Nummer erscheinen
3. WHEN der Entwickler auf "Neue Variante erstellen" klickt THEN SHALL ein Dialog zur Eingabe der Varianten-Nummer für das aktuelle Level erscheinen
4. WHEN die Eingaben bestätigt werden THEN SHALL der Editor ein leeres Level mit Standard-Dimensionen (z.B. 20x20) und Außenwänden erstellen
5. WHEN das neue Level erstellt wird THEN SHALL es im Editor zur Bearbeitung geladen werden
6. WHEN das neue Level gespeichert wird THEN SHALL eine neue Datei mit dem korrekten Namensschema (z.B. `level8-variant1.ts`) erstellt werden

### Requirement 12: Level-Dimensionen

**User Story:** Als Entwickler möchte ich die Dimensionen eines Levels ändern können, damit ich Levels unterschiedlicher Größe erstellen kann.

#### Acceptance Criteria

1. WHEN der Editor geöffnet ist THEN SHALL Eingabefelder für Breite und Höhe des Levels sichtbar sein
2. WHEN der Entwickler die Breite oder Höhe ändert THEN SHALL ein "Größe anwenden"-Button aktiviert werden
3. WHEN der Entwickler auf "Größe anwenden" klickt THEN SHALL das Level auf die neue Größe angepasst werden
4. IF das Level vergrößert wird THEN SHALL neue Kacheln mit Boden-Typ (0) gefüllt werden
5. IF das Level verkleinert wird THEN SHALL überschüssige Kacheln, Gegner, Items und Objekte entfernt werden
6. WHEN die Größe geändert wird THEN SHALL eine Warnung angezeigt werden, dass Daten verloren gehen können
