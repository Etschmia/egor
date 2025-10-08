# Requirements Document

## Introduction

Der Designer Mode ist ein visuelles Gestaltungswerkzeug zur Anpassung von Wandtypen, Objekten, Bildern, Leuchten und Gegnern im Spiel. Das Tool soll sich nahtlos in die bestehende Entwicklungsumgebung integrieren und die gleichen hohen UX-Standards wie der Level Editor erfüllen. Der Fokus liegt auf einer intuitiven, aufgeräumten Benutzeroberfläche, die sich am Design des Level Editors orientiert.

## Requirements

### Requirement 1: Separate Entwicklungsanwendung

**User Story:** Als Entwickler möchte ich den Designer Mode unabhängig von anderen Tools starten können, damit ich flexibel an der visuellen Gestaltung arbeiten kann.

#### Acceptance Criteria

1. WHEN der Entwickler `npm run designer` ausführt THEN soll der Designer Mode auf Port 3002 starten
2. WHEN `npm run dev` läuft THEN soll `npm run designer` parallel ohne Konflikte starten können
3. WHEN `npm run editor` läuft THEN soll `npm run designer` parallel ohne Konflikte starten können
4. WHEN der Designer Mode läuft THEN soll er über `http://localhost:3002/designer.html` erreichbar sein
5. WHEN `npm run build` ausgeführt wird THEN soll der Designer Mode Code nicht im Production Build enthalten sein

### Requirement 2: Konsistentes visuelles Design

**User Story:** Als Entwickler möchte ich eine vertraute Benutzeroberfläche, die dem Level Editor ähnelt, damit ich mich schnell zurechtfinde.

#### Acceptance Criteria

1. WHEN der Designer Mode geladen wird THEN soll er das gleiche dunkle Farbschema wie der Level Editor verwenden (#1e1e1e Hintergrund, #ffffff Text)
2. WHEN UI-Elemente angezeigt werden THEN sollen sie die gleichen Stile wie im Level Editor verwenden (Buttons, Inputs, Dropdowns)
3. WHEN der Benutzer mit Elementen interagiert THEN sollen die gleichen Hover- und Focus-Effekte wie im Level Editor erscheinen
4. WHEN Dialoge oder Modals angezeigt werden THEN sollen sie dem Design-Pattern des Level Editors folgen
5. WHEN Animationen verwendet werden THEN sollen sie subtil und performant sein (< 300ms)

### Requirement 3: Asset-Typ-Auswahl

**User Story:** Als Designer möchte ich zwischen verschiedenen Asset-Typen wechseln können, damit ich unterschiedliche Spielelemente gestalten kann.

#### Acceptance Criteria

1. WHEN der Designer Mode startet THEN soll eine Dropdown-Auswahl für Asset-Typen sichtbar sein
2. WHEN die Dropdown-Auswahl geöffnet wird THEN sollen folgende Optionen verfügbar sein: "Wall Types", "Objects", "Pictures", "Lights", "Enemies"
3. WHEN ein Asset-Typ ausgewählt wird THEN soll die Benutzeroberfläche entsprechend angepasst werden
4. WHEN "Wall Types" ausgewählt ist THEN sollen alle verfügbaren Wandtypen (Brick, Wood, Stone, Door) angezeigt werden
5. WHEN ein anderer Asset-Typ ausgewählt wird THEN soll eine Meldung erscheinen "Coming soon: [Asset-Typ]"

### Requirement 4: Wandtyp-Auswahl und -Verwaltung

**User Story:** Als Designer möchte ich einen bestimmten Wandtyp auswählen und bearbeiten können, damit ich dessen visuelle Eigenschaften anpassen kann.

#### Acceptance Criteria

1. WHEN "Wall Types" als Asset-Typ ausgewählt ist THEN soll eine Liste aller Wandtypen angezeigt werden
2. WHEN ein Wandtyp in der Liste angezeigt wird THEN soll er Name, kleine Vorschau und Farbindikatoren zeigen
3. WHEN der Benutzer auf einen Wandtyp klickt THEN soll dieser ausgewählt werden und visuell hervorgehoben sein
4. WHEN ein Wandtyp ausgewählt ist THEN sollen seine Eigenschaften im Property Panel angezeigt werden
5. WHEN der Benutzer einen neuen Wandtyp erstellen möchte THEN soll ein "Add New" Button verfügbar sein
6. WHEN der "Add New" Button geklickt wird THEN soll ein Dialog zur Erstellung eines neuen Wandtyps erscheinen
7. WHEN ein neuer Wandtyp erstellt wird THEN soll er auf einem bestehenden Wandtyp basieren können

### Requirement 5: Property Editor mit minimalistischem Design

**User Story:** Als Designer möchte ich Eigenschaften eines Wandtyps übersichtlich bearbeiten können, ohne von zu vielen Optionen überwältigt zu werden.

#### Acceptance Criteria

1. WHEN ein Wandtyp ausgewählt ist THEN soll ein Property Panel mit seinen Eigenschaften angezeigt werden
2. WHEN das Property Panel angezeigt wird THEN sollen Eigenschaften in logische Gruppen organisiert sein (Colors, Dimensions, Texture, Effects)
3. WHEN eine Eigenschaftsgruppe angezeigt wird THEN soll sie standardmäßig eingeklappt sein (außer Colors)
4. WHEN der Benutzer auf eine Gruppenüberschrift klickt THEN soll die Gruppe ein-/ausgeklappt werden
5. WHEN Farbeigenschaften angezeigt werden THEN sollen sie als Farbvorschau mit Label dargestellt werden
6. WHEN der Benutzer auf eine Farbvorschau klickt THEN soll ein Farbwähler-Dialog erscheinen
7. WHEN Dimensionseigenschaften angezeigt werden THEN sollen sie als Slider mit Wertanzeige dargestellt werden
8. WHEN der Benutzer einen Slider bewegt THEN soll der Wert in Echtzeit aktualisiert werden

### Requirement 6: Live Preview mit Echtzeit-Updates

**User Story:** Als Designer möchte ich Änderungen sofort in einer Vorschau sehen, damit ich schnell iterieren kann.

#### Acceptance Criteria

1. WHEN ein Wandtyp ausgewählt ist THEN soll eine Live-Vorschau des Wandtyps angezeigt werden
2. WHEN eine Eigenschaft geändert wird THEN soll die Vorschau innerhalb von 100ms aktualisiert werden
3. WHEN die Vorschau angezeigt wird THEN soll sie eine gekachelte Darstellung des Wandtyps zeigen
4. WHEN die Vorschau geladen wird THEN soll ein Loading-Indikator angezeigt werden
5. WHEN ein Fehler bei der Vorschau-Generierung auftritt THEN soll eine aussagekräftige Fehlermeldung angezeigt werden
6. WHEN die Vorschau erfolgreich generiert wurde THEN sollen Performance-Statistiken angezeigt werden (Generierungszeit, Renderzeit)

### Requirement 7: Theme-Verwaltung

**User Story:** Als Designer möchte ich verschiedene Themes erstellen und verwalten können, damit ich unterschiedliche visuelle Stile für das Spiel entwickeln kann.

#### Acceptance Criteria

1. WHEN der Designer Mode startet THEN soll das aktive Theme im Header angezeigt werden
2. WHEN der Benutzer auf den Theme-Namen klickt THEN soll eine Dropdown-Liste aller verfügbaren Themes erscheinen
3. WHEN ein Theme aus der Liste ausgewählt wird THEN soll es als aktives Theme geladen werden
4. WHEN der Benutzer ein neues Theme erstellen möchte THEN soll ein "New Theme" Button verfügbar sein
5. WHEN der "New Theme" Button geklickt wird THEN soll ein Dialog zur Theme-Erstellung erscheinen
6. WHEN ein neues Theme erstellt wird THEN soll es optional auf einem bestehenden Theme basieren können
7. WHEN Änderungen am Theme vorgenommen werden THEN soll ein "unsaved changes" Indikator (●) angezeigt werden

### Requirement 8: Speichern und Undo/Redo

**User Story:** Als Designer möchte ich meine Änderungen speichern und rückgängig machen können, damit ich sicher experimentieren kann.

#### Acceptance Criteria

1. WHEN Änderungen am Theme vorgenommen werden THEN soll der "Save" Button aktiviert werden
2. WHEN der Benutzer Ctrl+S drückt THEN sollen die Änderungen gespeichert werden
3. WHEN der "Save" Button geklickt wird THEN sollen die Änderungen gespeichert werden
4. WHEN Änderungen gespeichert werden THEN soll eine Erfolgsbenachrichtigung angezeigt werden
5. WHEN der Benutzer Ctrl+Z drückt THEN soll die letzte Änderung rückgängig gemacht werden
6. WHEN der Benutzer Ctrl+Y drückt THEN soll die rückgängig gemachte Änderung wiederhergestellt werden
7. WHEN Undo/Redo-Aktionen verfügbar sind THEN sollen entsprechende Buttons im Header aktiviert sein
8. WHEN keine Undo/Redo-Aktionen verfügbar sind THEN sollen die Buttons deaktiviert sein

### Requirement 9: Theme Import/Export

**User Story:** Als Designer möchte ich Themes importieren und exportieren können, damit ich sie mit anderen teilen oder sichern kann.

#### Acceptance Criteria

1. WHEN der Benutzer ein Theme exportieren möchte THEN soll ein "Export" Button verfügbar sein
2. WHEN der "Export" Button geklickt wird THEN soll ein Dropdown mit Exportoptionen erscheinen (JSON, CSS)
3. WHEN "Export as JSON" ausgewählt wird THEN soll eine JSON-Datei heruntergeladen werden
4. WHEN "Export as CSS" ausgewählt wird THEN soll eine CSS-Datei mit CSS-Variablen heruntergeladen werden
5. WHEN der Benutzer ein Theme importieren möchte THEN soll ein "Import" Button verfügbar sein
6. WHEN der "Import" Button geklickt wird THEN soll ein Datei-Auswahl-Dialog erscheinen
7. WHEN eine gültige Theme-Datei ausgewählt wird THEN soll das Theme importiert und aktiviert werden
8. WHEN eine ungültige Datei ausgewählt wird THEN soll eine Fehlermeldung angezeigt werden

### Requirement 10: Keyboard Shortcuts

**User Story:** Als Designer möchte ich Tastaturkürzel verwenden können, damit ich effizienter arbeiten kann.

#### Acceptance Criteria

1. WHEN der Benutzer F1 drückt THEN soll ein Dialog mit allen verfügbaren Tastaturkürzeln angezeigt werden
2. WHEN der Benutzer Escape drückt THEN sollen offene Dialoge geschlossen werden
3. WHEN der Benutzer Ctrl+N drückt THEN soll der "New Theme" Dialog geöffnet werden
4. WHEN der Benutzer in einem Eingabefeld tippt THEN sollen Tastaturkürzel (außer Escape) deaktiviert sein
5. WHEN Tastaturkürzel verwendet werden THEN soll visuelles Feedback gegeben werden

### Requirement 11: Responsive Layout

**User Story:** Als Designer möchte ich den Designer Mode auf verschiedenen Bildschirmgrößen verwenden können, damit ich flexibel arbeiten kann.

#### Acceptance Criteria

1. WHEN der Designer Mode auf einem Bildschirm < 1200px Breite angezeigt wird THEN soll die Sidebar schmaler werden
2. WHEN der Designer Mode auf einem Bildschirm < 768px Breite angezeigt wird THEN soll die Sidebar einklappbar sein
3. WHEN die Sidebar eingeklappt ist THEN soll ein Toggle-Button zum Ausklappen sichtbar sein
4. WHEN die Sidebar ausgeklappt ist THEN soll sie über dem Hauptinhalt als Overlay angezeigt werden (auf kleinen Bildschirmen)
5. WHEN die Vorschau auf kleinen Bildschirmen angezeigt wird THEN soll sie sich an die verfügbare Breite anpassen

### Requirement 12: Error Handling und Feedback

**User Story:** Als Designer möchte ich klare Fehlermeldungen und Feedback erhalten, damit ich Probleme schnell beheben kann.

#### Acceptance Criteria

1. WHEN ein Fehler beim Laden eines Themes auftritt THEN soll eine aussagekräftige Fehlermeldung angezeigt werden
2. WHEN ein Fehler beim Speichern auftritt THEN soll eine Fehlermeldung mit Lösungsvorschlägen angezeigt werden
3. WHEN eine Aktion erfolgreich abgeschlossen wird THEN soll eine Erfolgsbenachrichtigung (Toast) angezeigt werden
4. WHEN eine Warnung ausgegeben werden muss THEN soll sie als gelbe Toast-Benachrichtigung erscheinen
5. WHEN Fehlermeldungen angezeigt werden THEN sollen sie nach 5 Sekunden automatisch verschwinden (oder manuell schließbar sein)
6. WHEN eine lange Operation läuft THEN soll ein Loading-Overlay mit Fortschrittsanzeige erscheinen

### Requirement 13: Performance und Optimierung

**User Story:** Als Designer möchte ich flüssig arbeiten können, ohne dass die Anwendung langsam wird oder einfriert.

#### Acceptance Criteria

1. WHEN Eigenschaften geändert werden THEN sollen Updates debounced werden (300ms Verzögerung)
2. WHEN die Vorschau aktualisiert wird THEN soll sie innerhalb von 100ms reagieren
3. WHEN Texturen generiert werden THEN sollen sie gecacht werden, um wiederholte Generierungen zu vermeiden
4. WHEN der Cache zu groß wird THEN sollen alte Einträge automatisch entfernt werden (LRU-Strategie)
5. WHEN die Anwendung startet THEN soll sie innerhalb von 2 Sekunden einsatzbereit sein
6. WHEN viele Änderungen schnell hintereinander vorgenommen werden THEN soll die UI nicht einfrieren

### Requirement 14: Accessibility

**User Story:** Als Designer mit eingeschränkter Sehfähigkeit möchte ich den Designer Mode mit Tastatur und Screenreader bedienen können.

#### Acceptance Criteria

1. WHEN der Benutzer die Tab-Taste drückt THEN soll der Focus sichtbar durch die UI wandern
2. WHEN ein Element fokussiert ist THEN soll es einen deutlichen Focus-Ring haben
3. WHEN Buttons fokussiert sind THEN sollen sie mit Enter oder Space aktivierbar sein
4. WHEN Dialoge geöffnet werden THEN soll der Focus automatisch auf das erste Eingabefeld gesetzt werden
5. WHEN Farbwähler verwendet werden THEN sollen sie auch über Tastatur bedienbar sein
6. WHEN Bilder oder Icons verwendet werden THEN sollen sie aussagekräftige Alt-Texte haben

### Requirement 15: Zukünftige Erweiterbarkeit

**User Story:** Als Entwickler möchte ich das System leicht um neue Asset-Typen erweitern können, damit zukünftige Features einfach integriert werden können.

#### Acceptance Criteria

1. WHEN ein neuer Asset-Typ hinzugefügt werden soll THEN soll die Architektur dies ohne größere Umbauten ermöglichen
2. WHEN Asset-Typ-spezifische Komponenten erstellt werden THEN sollen sie eine gemeinsame Basis-Schnittstelle implementieren
3. WHEN neue Property-Typen hinzugefügt werden THEN sollen sie als wiederverwendbare Komponenten implementiert werden
4. WHEN die Theme-Struktur erweitert wird THEN soll Backward-Kompatibilität gewährleistet sein
5. WHEN neue Exportformate hinzugefügt werden THEN soll das Export-System erweiterbar sein
