# Reverse Prompt: Erstellung eines Wolfenstein 3D-artigen Ego-Shooters mit Level-Editor

## 1. Projekt-Gesamtziel

Erstelle einen voll funktionsfähigen, retro-inspirierten Ego-Shooter im Stil von Wolfenstein 3D. Das Projekt soll vollständig in **React und TypeScript** unter Verwendung von **Vite** als Build-Tool umgesetzt werden. Eine wesentliche Anforderung ist, dass die Sound-Effekte prozedural generiert werden, während die visuellen Assets eine Mischung aus prozeduraler Generierung und Bilddateien sein können, um einen hochwertigen Retro-Stil zu erzielen. Das Spiel verwendet eine **HTML5-Canvas-basierte Raycasting-Engine**.

Zusätzlich zum Spiel selbst soll ein **umfassender, visueller Level-Editor** als separates Entwicklungswerkzeug implementiert werden, der es ermöglicht, Level-Dateien (`.ts`) direkt im Projektverzeichnis zu erstellen und zu bearbeiten.

---

## 2. Feature-Anforderungen: Das Kernspiel

### 2.1. Raycasting-Engine und Steuerung
- Implementiere eine 3D-Raycasting-Engine, die auf einem HTML5-Canvas rendert.
- Die Spielersteuerung soll klassische FPS-Mechaniken umfassen:
    - **Bewegung**: Vorwärts (W), Rückwärts (S), Links/Rechts seitwärts (A/D).
    - **Umschauen**: Links/Rechts drehen (Pfeiltasten).
    - **Interaktion**: Tür öffnen (E).
    - **Springen (F)**: Eine Mechanik, um über niedrige Hindernisse (z.B. Tische) zu springen, begleitet von einer visuellen Kamera-Bewegung.
- Implementiere eine Mini-Map zur Orientierung.

### 2.2. Gegner und KI
- Erstelle vier Gegnertypen mit unterschiedlichen Eigenschaften:
    1.  **Zombie**: Standardgegner, mittlere Geschwindigkeit und Gesundheit.
    2.  **Monster**: Starker Gegner, hohe Gesundheit, hoher Schaden.
    3.  **Geist**: Schneller Gegner, schwer zu treffen, geringe Gesundheit.
    4.  **Hund**: Sehr schneller, aggressiver Nahkampfgegner.
- Die Gegner-KI soll in der Lage sein, den Spieler zu verfolgen und Türen zu öffnen (außer Hunde).

### 2.3. Waffen und Items
- Implementiere ein System mit sechs verschiedenen Waffen, zwischen denen der Spieler wechseln kann (Tasten 1-6):
    - Messer, Pistole, Maschinenpistole, Kettensäge, Sturmgewehr, Schweres Maschinengewehr.
- Erstelle sammelbare Items: Gesundheitspakete (klein/groß), Munition und Schätze.
- Beim Aufsammeln von Items sollen Benachrichtigungen angezeigt werden.

### 2.4. Level-Struktur und Spielfortschritt
- Das Spiel soll 7 Level umfassen.
- Der Level-Fortschritt wird durch das Besiegen aller Gegner gesteuert, was eine spezielle "Exit-Tür" (grüne Textur) öffnet.
- Normale Türen (braune Textur) können jederzeit geöffnet werden.

### 2.5. Spielzustand und UI
- **Speichern/Laden**: Implementiere ein System zum Speichern (M) und Laden (L) des Spielstands im Browser-LocalStorage.
- **Schwierigkeitsgrade**: Biete drei Stufen an (Leicht: 150 HP, Normal: 100 HP, Schwer: 75 HP mit stärkeren Gegnern).
- **UI-Elemente**:
    - Statistiken zu besiegten Gegnern und gesammelten Items (Taste T).
    - Hilfe-Bildschirm (H).
    - Pause-Funktion (P).

---

## 3. Feature-Anforderungen: Erweiterte Systeme

### 3.1. Intelligentes Map-Rotationssystem
- Jedes der 7 Level muss in **5 verschiedenen Varianten** existieren (insgesamt 35 Maps).
- Implementiere ein System, das die Spielhistorie des Spielers im LocalStorage verfolgt (`{ level, variant, timestamp }`).
- Die Level-Auswahl-Logik muss intelligent sein:
    1.  Bevorzuge ungespielte Varianten eines Levels.
    2.  Wenn alle Varianten gespielt wurden, wähle die am längsten nicht mehr gespielte Variante aus.
    3.  Bei neuen Spielern (leere Historie) wähle eine zufällige Variante.
- Das System muss **abwärtskompatibel** sein und alte Spielstände (ohne Varianten-Info) laden können, indem es standardmäßig die erste Variante lädt.
- Das System muss robust gegenüber korrupten oder fehlenden LocalStorage-Daten sein.

### 3.2. Dekorative Objekte und erweiterte Level-Umgebung
- Füge **8 Typen von dekorativen Objekten** hinzu (Deckenleuchten, Vasen, Kisten, Bänke, Tische, Stühle, Weinflaschen, Gerippe).
- Diese Objekte sollen als **physische Hindernisse** mit eigener Kollisionserkennung (basierend auf einem Radius) dienen.
- Implementiere auch rein dekorative Wandbilder.
- Die Objekte sollen leichte Farbvariationen aufweisen können.

### 3.3. Prozedurale Assets (Grafik & Sound)
- **Grafik-Stil**: Das Spiel soll einen visuell ansprechenden Retro-Look haben. Texturen können entweder prozedural mit der Canvas-API generiert oder als Bilddateien eingebettet werden, um eine hohe visuelle Qualität zu erreichen.
- Die Texturen sollen einen detaillierten Retro-Look haben und Techniken wie **Farbverläufe, Schattierungen und Highlights** nutzen, um Tiefe zu erzeugen.
- Halte dich an spezifische Auflösungen: 64x64 für Gegner, 32x32 für Wände, Türen und Items.
- **Keine externen Audiodateien**: Alle Soundeffekte (Schüsse, Bellen, Türöffnen etc.) müssen prozedural mit der **Web Audio API** erzeugt werden.

### 3.4. Performance-Optimierungen
- Implementiere **View Frustum Culling**, um nur sichtbare Objekte und Gegner zu rendern.
- Nutze **Texture Caching** für prozedural generierte Texturen, um die CPU-Last zu reduzieren.
- Optimiere die Kollisionserkennung, z.B. durch frühe Distanzprüfungen.

---

## 4. Feature-Anforderungen: Der Level-Editor (Nur für Entwicklung)

Implementiere einen umfassenden, visuellen In-Browser Level-Editor als separates Entwicklungswerkzeug.

### 4.1. Architektur und Setup
- Der Editor soll eine **eigene React-Anwendung** im Verzeichnis `src/editor/` sein.
- Erstelle einen Start-Befehl `npm run editor`.
- Der Editor benötigt einen minimalen **Express.js-Backend-Server**, der Lese- und Schreibzugriff auf das Verzeichnis `src/levels/` ermöglicht.
- Der Editor-Code darf **nicht im finalen Production-Build** (`npm run build`) enthalten sein.

### 4.2. Funktionalität
- **Visuelle Bearbeitung**: Eine interaktive 2D-Canvas-Ansicht, die auf dem Design der In-Game-Mini-Map basiert.
- **Level-Verwaltung**:
    - Laden bestehender Level-Dateien (`levelX-variantY.ts`) über Dropdown-Menüs.
    - Speichern von Änderungen als korrekt formatierte TypeScript-Dateien.
    - Erstellen neuer Level und Varianten.
    - Ändern der Level-Dimensionen.
- **Interaktive Bearbeitung**:
    - Platzieren, Bearbeiten (Eigenschaften wie Gesundheit, Typ etc.) und Entfernen aller Entitäten (Gegner, Items, dekorative Objekte, Wandbilder) über Kontextmenüs und Dialoge.
    - Ändern von Kachel-Typen (Wand, Boden, Tür, Exit-Tür).
    - Festlegen der Spieler-Startposition und -Blickrichtung.
- **Benutzerfreundlichkeit**:
    - Implementiere **Undo/Redo**-Funktionalität.
    - Füge **Tastaturkürzel** hinzu (z.B. `Ctrl+S` zum Speichern).
    - Gib dem Nutzer visuelles Feedback durch **Toast-Benachrichtigungen**, Ladeindikatoren und Hover-Effekte.

---

## 5. Abschließende Anforderungen

- Das gesamte Projekt muss gut strukturiert sein.
- Erstelle eine umfassende `README.md`, die alle Features, die Steuerung und die Startbefehle (für Spiel und Editor) dokumentiert.
- Implementiere Test-Skripte zur Validierung der Abwärtskompatibilität und Performance.
- Das Endprodukt soll ein stabiles, performantes Spiel und ein voll funktionsfähiger, gut dokumentierter Level-Editor sein.