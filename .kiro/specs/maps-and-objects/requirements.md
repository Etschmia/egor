# Requirements Document

## Einführung

Dieses Feature erweitert das Raycasting-Spiel um zwei wesentliche Komponenten: dekorative Gegenstände als Hindernisse und ein intelligentes Map-Rotationssystem. Die Gegenstände (Leuchten, Vasen, Kisten, Bänke, Tische, Stühle, Weinflaschen, Gerippe) dienen als atmosphärische Elemente und Hindernisse, die das Gameplay bereichern. Das Map-Rotationssystem sorgt für Abwechslung, indem pro Level 5 verschiedene Maps zur Verfügung stehen, die intelligent basierend auf der Spielhistorie ausgewählt werden.

## Requirements

### Requirement 1: Dekorative Gegenstände als Hindernisse

**User Story:** Als Spieler möchte ich atmosphärische Gegenstände in den Levels sehen, die als Hindernisse dienen, damit die Spielwelt lebendiger und taktisch interessanter wird.

#### Acceptance Criteria

1. WHEN der Spieler ein Level betritt THEN sollen Leuchten an Decken sichtbar sein, die die Lichtquelle im Spiel darstellen
2. WHEN der Spieler durch Flure navigiert THEN sollen gelegentlich Vasen, Kisten oder Bänke als Hindernisse platziert sein
3. WHEN der Spieler Räume betritt THEN sollen manchmal Tische und/oder Stühle vorhanden sein
4. WHEN ein Tisch in einem Raum steht THEN kann optional eine Weinflasche mit Glas darauf platziert sein
5. WHEN der Spieler durch das Level navigiert THEN können gelegentlich Gerippe auf dem Boden liegen
6. WHEN mehrere Gegenstände desselben Typs (Kisten, Vasen, Bänke) im Level sind THEN sollen diese leichte Farbvariationen aufweisen
7. WHEN der Spieler auf einen Gegenstand zuläuft THEN soll dieser als physisches Hindernis wirken und Kollision verhindern
8. WHEN der Spieler einen Gegenstand sieht THEN soll dieser nicht einsammelbar sein (im Gegensatz zu Items)

### Requirement 2: Neue Gegenstandstypen im Type-System

**User Story:** Als Entwickler möchte ich neue Typen für dekorative Gegenstände definieren, damit diese im Spiel korrekt verwaltet und gerendert werden können.

#### Acceptance Criteria

1. WHEN das Type-System erweitert wird THEN soll ein neuer Enum `DecorativeObjectType` erstellt werden
2. WHEN `DecorativeObjectType` definiert wird THEN soll dieser folgende Werte enthalten: CEILING_LIGHT, VASE, CRATE, BENCH, TABLE, CHAIR, WINE_BOTTLE, SKELETON
3. WHEN ein dekoratives Objekt erstellt wird THEN soll ein Interface `DecorativeObject` mit Eigenschaften id, type, x, y, colorVariant existieren
4. WHEN das GameMap-Interface erweitert wird THEN soll ein Array `decorativeObjects: DecorativeObject[]` hinzugefügt werden
5. IF ein Objekt Farbvariationen unterstützt THEN soll `colorVariant` einen Wert zwischen 0 und 1 haben

### Requirement 3: Mehrere Maps pro Level

**User Story:** Als Spieler möchte ich bei jedem Durchspielen eines Levels eine andere Map erleben, damit das Spiel abwechslungsreicher und weniger vorhersehbar wird.

#### Acceptance Criteria

1. WHEN ein Level definiert wird THEN sollen 5 verschiedene Map-Varianten für dieses Level existieren
2. WHEN Maps für ein Level erstellt werden THEN sollen diese mindestens so groß wie die aktuellen Maps sein (20x20)
3. WHEN Maps für ein Level erstellt werden THEN können diese auch größer als 20x20 sein (z.B. 22x22 oder 24x24)
4. WHEN der Spieler ein Level betritt THEN soll eine der 5 Map-Varianten ausgewählt werden
5. WHEN alle 7 Level implementiert sind THEN sollen insgesamt 35 Maps (7 Level × 5 Varianten) existieren

### Requirement 4: Intelligentes Map-Rotationssystem

**User Story:** Als Spieler möchte ich Maps sehen, die ich noch nicht gespielt habe oder lange nicht mehr gesehen habe, damit das Spielerlebnis frisch und interessant bleibt.

#### Acceptance Criteria

1. WHEN der Spieler ein Level betritt THEN soll das System im LocalStorage nachsehen, welche Maps bereits gespielt wurden
2. IF der Spieler noch nicht alle 5 Maps eines Levels gesehen hat THEN soll eine noch nicht gespielte Map ausgewählt werden
3. IF der Spieler bereits alle 5 Maps eines Levels gesehen hat THEN soll die Map ausgewählt werden, die am längsten nicht mehr gespielt wurde
4. WHEN eine Map ausgewählt wird THEN soll im LocalStorage gespeichert werden: Level-Nummer, Map-Variante, Zeitstempel
5. WHEN das Spiel gestartet wird THEN soll die Map-Historie aus dem LocalStorage geladen werden
6. IF keine Map-Historie im LocalStorage existiert THEN soll eine zufällige Map aus den 5 Varianten gewählt werden

### Requirement 5: Map-Datenstruktur und Organisation

**User Story:** Als Entwickler möchte ich Maps effizient organisieren und verwalten, damit die Auswahl und das Laden von Map-Varianten performant funktioniert.

#### Acceptance Criteria

1. WHEN Maps in der Codebase organisiert werden THEN soll die Struktur `LEVEL_X_VARIANT_Y` verwendet werden (z.B. LEVEL_1_VARIANT_1)
2. WHEN auf Maps zugegriffen wird THEN soll ein verschachteltes Array `LEVELS_WITH_VARIANTS` existieren: `GameMap[][]`
3. WHEN eine Map geladen wird THEN soll die Syntax `LEVELS_WITH_VARIANTS[levelIndex][variantIndex]` verwendet werden
4. WHEN Map-Historie gespeichert wird THEN soll das Format `{ level: number, variant: number, timestamp: number }[]` verwendet werden
5. WHEN ein neues Spiel gestartet wird THEN soll die Map-Historie nicht gelöscht werden (persistiert über Spielsessions)

### Requirement 6: Rendering von dekorativen Gegenständen

**User Story:** Als Spieler möchte ich dekorative Gegenstände visuell ansprechend dargestellt sehen, damit die Spielwelt immersiv wirkt.

#### Acceptance Criteria

1. WHEN Leuchten gerendert werden THEN sollen diese an der Decke positioniert erscheinen (oberer Bildschirmbereich)
2. WHEN Bodengegenstände (Vasen, Kisten, Bänke, Gerippe) gerendert werden THEN sollen diese auf Bodenhöhe erscheinen
3. WHEN Möbel (Tische, Stühle) gerendert werden THEN sollen diese in angemessener Höhe dargestellt werden
4. WHEN eine Weinflasche auf einem Tisch steht THEN soll diese relativ zur Tischposition gerendert werden
5. WHEN Gegenstände mit Farbvarianten gerendert werden THEN soll die Farbe basierend auf `colorVariant` moduliert werden
6. WHEN der Spieler sich bewegt THEN sollen Gegenstände korrekt perspektivisch skaliert werden (näher = größer)
7. WHEN mehrere Gegenstände sichtbar sind THEN sollen diese nach Entfernung sortiert gerendert werden (weiter entfernt zuerst)

### Requirement 7: Kollisionserkennung für dekorative Gegenstände

**User Story:** Als Spieler möchte ich nicht durch dekorative Gegenstände hindurchlaufen können, damit diese sich wie echte Hindernisse anfühlen.

#### Acceptance Criteria

1. WHEN der Spieler sich auf einen Gegenstand zubewegt THEN soll die Kollisionserkennung aktiviert werden
2. WHEN eine Kollision mit einem Gegenstand erkannt wird THEN soll die Bewegung des Spielers in diese Richtung verhindert werden
3. WHEN Gegner sich bewegen THEN sollen auch diese nicht durch dekorative Gegenstände hindurchgehen können
4. WHEN Kollision geprüft wird THEN soll ein Radius um die Objektposition verwendet werden (z.B. 0.3 Einheiten)
5. IF ein Objekt sehr klein ist (z.B. Weinflasche) THEN soll der Kollisionsradius entsprechend kleiner sein

### Requirement 8: Map-Generierung mit dekorativen Gegenständen

**User Story:** Als Level-Designer möchte ich dekorative Gegenstände sinnvoll in Maps platzieren, damit diese natürlich und spielerisch interessant wirken.

#### Acceptance Criteria

1. WHEN eine Map erstellt wird THEN sollen Leuchten gleichmäßig über das Level verteilt werden (ca. alle 4-6 Felder)
2. WHEN Flure in einer Map existieren THEN sollen dort gelegentlich Vasen, Kisten oder Bänke platziert werden
3. WHEN Räume in einer Map existieren THEN sollen dort manchmal Tische und Stühle platziert werden
4. WHEN ein Tisch platziert wird THEN soll mit 30% Wahrscheinlichkeit eine Weinflasche darauf stehen
5. WHEN Gerippe platziert werden THEN sollen diese selten sein (1-3 pro Map) und an dramatischen Stellen liegen
6. WHEN Gegenstände platziert werden THEN sollen diese nicht den Spielerstart, Exit-Türen oder wichtige Items blockieren
7. WHEN Kisten, Vasen oder Bänke platziert werden THEN soll jeder Gegenstand einen zufälligen `colorVariant`-Wert erhalten

### Requirement 9: Textur-System für dekorative Gegenstände

**User Story:** Als Entwickler möchte ich Texturen für dekorative Gegenstände effizient laden und verwalten, damit das Rendering performant bleibt.

#### Acceptance Criteria

1. WHEN das Spiel startet THEN sollen Texturen für alle dekorativen Gegenstände geladen werden
2. WHEN Texturen geladen werden THEN soll die bestehende `getTexture`-Funktion erweitert werden
3. WHEN eine Textur für einen Gegenstand angefordert wird THEN soll diese aus einem Cache zurückgegeben werden
4. WHEN Farbvarianten gerendert werden THEN soll die Basis-Textur mit einem Farbfilter moduliert werden
5. IF eine Textur nicht geladen werden kann THEN soll eine Fallback-Farbe verwendet werden

### Requirement 10: Abwärtskompatibilität und Migration

**User Story:** Als Spieler möchte ich meine bestehenden Savegames weiterhin nutzen können, auch nach dem Update mit neuen Maps.

#### Acceptance Criteria

1. WHEN ein altes Savegame geladen wird THEN soll das Spiel weiterhin funktionieren
2. IF ein Savegame eine alte Map-Referenz enthält THEN soll diese auf die erste Variante der neuen Map-Struktur gemappt werden
3. WHEN die Map-Historie nicht existiert THEN soll eine leere Historie initialisiert werden
4. WHEN bestehende Level-Konstanten verwendet werden THEN sollen diese auf die neuen Varianten verweisen
5. IF Code auf alte LEVELS-Array zugreift THEN soll eine Kompatibilitätsschicht die erste Variante jedes Levels zurückgeben
