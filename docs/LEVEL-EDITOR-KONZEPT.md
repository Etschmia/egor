# Konzept: Level-Editor für Entwickler

Dieses Dokument beschreibt den Plan zur Erstellung eines In-Browser Level-Editors, der ausschließlich für die Entwicklungsumgebung gedacht ist und nicht in den finalen Build der Anwendung einfließt.

## 1. Ziel

- Ein webbasierter Editor zum Erstellen und Bearbeiten von Level-Dateien (`.ts`) im Verzeichnis `src/levels`.
- Der Editor soll über einen eigenen Befehl gestartet werden, z.B. `npm run editor`.
- Der Editor-Code darf nicht im produktiven Build (`npm run build`) enthalten sein.
- Der Editor benötigt Lese- und Schreibzugriff auf das Dateisystem (`src/levels`), um Level zu laden und zu speichern.

## 2. Technische Umsetzung

Die Umsetzung basiert auf einer Zwei-Komponenten-Architektur:

1.  **Frontend (Editor-UI)**: Eine separate React-Anwendung, die von Vite im Entwicklungsmodus bereitgestellt wird.
2.  **Backend (File-API-Server)**: Ein minimaler Node.js-Server, der parallel zum Vite-Dev-Server läuft und als Brücke zum Dateisystem dient.

### a. Architektur im Detail

#### Frontend (Editor-UI)

- Wir erstellen einen neuen HTML-Einstiegspunkt, z.B. `editor.html` im Projekt-Root.
- Dieser lädt ein separates TypeScript-Haupt-Skript, z.B. `src/editor/main.tsx`.
- In diesem Verzeichnis (`src/editor/`) befindet sich der gesamte React-Code für die Editor-Oberfläche.
- Die Editor-UI kommuniziert über `fetch`-Anfragen mit dem lokalen Backend, um Level-Daten zu laden und zu speichern.

#### Backend (File-API-Server)

- Ein einfaches Node.js-Skript, das einen Express-Server startet.
- Dieser Server läuft nur lokal auf einem bestimmten Port (z.B. 3001).
- Er stellt simple API-Endpunkte zur Verfügung:
    - `GET /api/levels`: Listet alle vorhandenen Level-Dateien in `src/levels` auf.
    - `GET /api/levels/:filename`: Lädt den Inhalt einer spezifischen Level-Datei.
    - `POST /api/levels`: Empfängt Level-Daten (z.B. als JSON) und speichert sie als neue oder überschriebene `.ts`-Datei in `src/levels`.

Browser-Sicherheitsrichtlinien verhindern, dass eine Webseite direkt auf das lokale Dateisystem zugreift. Dieser kleine Backend-Server umgeht diese Einschränkung sicher, da er nur lokal und nur auf expliziten Befehl des Entwicklers läuft.

### b. Integration in das Projekt

#### Verzeichnisstruktur (Vorschlag)

```
/
├── src/
│   ├── levels/
│   │   └── ... (deine existierenden Level)
│   └── editor/
│       ├── main.tsx       # Einstiegspunkt für die Editor-React-App
│       ├── Editor.tsx     # Hauptkomponente des Editors
│       └── ...            # Weitere Editor-Komponenten
├── editor.html            # HTML-Datei für den Editor
├── editor-server.mjs      # Node.js/Express-Server für den Dateizugriff
└── vite.config.ts         # Angepasste Vite-Konfiguration
```

#### NPM-Skripte

Wir passen die `package.json` an, um den neuen `editor`-Befehl hinzuzufügen. Wir nutzen ein Tool wie `concurrently`, um beide Server (Vite-Dev-Server für das Frontend und den File-API-Server für das Backend) gleichzeitig zu starten.

```json
// package.json (Ausschnitt)
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "editor": "concurrently \"vite --config vite.editor.config.ts\" \"node editor-server.mjs\""
},
"devDependencies": {
  "concurrently": "^8.2.2", // Beispiel-Version
  "express": "^4.19.2"      // Beispiel-Version
  // ...
}
```

#### Build-Prozess

Der Standard-Build-Befehl (`npm run build`) verwendet die `vite.config.ts`, die nur `index.html` als Einstiegspunkt kennt. Dadurch wird der Editor-Code (`editor.html`, `src/editor/`) komplett ignoriert und landet nicht im `dist`-Verzeichnis. Für den Editor-Modus erstellen wir eine separate `vite.editor.config.ts`, die `editor.html` als Einstiegspunkt verwendet.

## 3. Nächste Schritte (Implementierungsplan)

1.  **Abhängigkeiten installieren**: `npm install --save-dev express concurrently @types/express`.
2.  **Backend-Server erstellen**: Die Datei `editor-server.mjs` mit den oben beschriebenen API-Endpunkten implementieren.
3.  **Editor-Frontend erstellen**:
    - `editor.html` im Root-Verzeichnis anlegen.
    - Das Verzeichnis `src/editor` mit den React-Komponenten für den Editor erstellen.
4.  **Vite-Konfiguration anpassen**: Eine `vite.editor.config.ts` erstellen, die von der Hauptkonfiguration erbt, aber `editor.html` als Einstiegspunkt definiert.
5.  **NPM-Skript hinzufügen**: Den `editor`-Befehl in `package.json` wie oben gezeigt einfügen.
6.  **Editor-UI entwickeln**: Die Oberfläche zum Laden, Visualisieren, Bearbeiten und Speichern der Level implementieren.

## 4. Anforderungen an die Benutzeroberfläche (UI)

1.  **Visuelles Design**:
    *   Das grundlegende Design des Editors soll sich stark an der bestehenden Mini-Map orientieren, die im Spiel rechts oben angezeigt wird.
    *   Die Darstellung soll jedoch den primären Inhaltsbereich der Seite einnehmen und nicht auf eine "Mini"-Größe beschränkt sein.

2.  **Level-Auswahl**:
    *   Es muss zwei Dropdown-Menüs zur Auswahl der zu bearbeitenden Karte geben:
        *   **Dropdown 1**: Wählt das Level aus (z.B. `level1`, `level2`, etc.).
        *   **Dropdown 2**: Wählt die spezifische Variante (im Code `variant` genannt) innerhalb des ausgewählten Levels aus (z.B. `level1-variant1`, `level1-variant2`, etc.).

3.  **Interaktivität**:
    *   Die Kartenansicht muss vollständig interaktiv sein.
    *   Jedes dargestellte Element innerhalb der Karte (z.B. ein Wand-Block, ein Boden-Tile, ein Objekt) muss per Mausklick direkt auswählbar sein.
    *   Nach dem Klick auf ein Element soll ein Kontextmenü erscheinen.
    *   Dieses Menü muss Optionen zur Änderung des Element-Typs anbieten. Beispiel: Ein ausgewähltes 'Wand'-Element kann über das Menü in ein 'Tür'-Element umgewandelt werden.
