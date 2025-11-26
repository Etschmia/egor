# Hundefelsen

Ein Ego-Shooter im Stil von Wolfenstein 3D, entwickelt mit React und TypeScript.

## Features

### Spielmechanik
- **3D-Raycasting-Engine** für klassisches Retro-Gameplay
- **8 Level** mit steigendem Schwierigkeitsgrad und mehreren Varianten pro Level
- **Dynamische Level-Auswahl**: Jedes Level hat mehrere Varianten, die automatisch rotiert werden
- **Level-Belohnung**: Beim Erreichen eines neuen Levels erhältst du automatisch 25 HP (bis zum Maximum)
- **Türen** die mit der Taste 'E' geöffnet werden können:
  - Normale Türen (braune Wände)
  - Spezielle "Nächste Ebene" Tür (grüne Wand) - öffnet sich nur wenn alle Gegner besiegt sind
- **6 verschiedene Waffen**:
  - Messer (Start)
  - Pistole (Start)
  - Maschinenpistole (Level 2-3)
  - Kettensäge (Level 3)
  - Sturmgewehr (Level 4-6)
  - Schweres Maschinengewehr (Level 5-7)
- **Backup-Waffen**: Falls du eine Waffe in einem früheren Level verpasst hast, findest du sie als Backup in späteren Levels
- **Waffen-zu-Munition**: Wenn du eine Waffe aufsammelst, die du bereits besitzt, erhältst du stattdessen 30 Schuss Munition für alle Waffen
- **Gegner**: Vier verschiedene Gegner-Typen mit KI
  - **Zombies** (grün): Grundlegende Gegner mit mäßiger Geschwindigkeit
  - **Monster** (rot): Starke, gefährliche Gegner mit hoher Gesundheit
  - **Geister** (weiß): Schnelle, schwer zu treffende Gegner mit geringerer Gesundheit
  - **Hunde** (braun): Schnelle, aggressive Gegner die bellen können
- **Dekorative Objekte**: Vasen, Kisten, Bänke, Tische, Stühle, Weinflaschen, Skelette und Deckenleuchten
- **Sprung-Mechanik**: Springe mit **F** über Hindernisse wie Tische und Stühle, um an schwer erreichbare Items zu gelangen - mit visueller Kamera-Bewegung!
- **Wandbilder**: Portraits, Landschaften und abstrakte Kunst zur Dekoration
- **Items**: Gesundheitspakete, Munition, Schätze und Waffen mit Benachrichtigungen beim Sammeln
- **Statistiken**: Übersicht über gesammelte Items und besiegte Gegner (Taste **T**)
- **Verbesserte Texturen**: Hochwertige prozedurale Texturen für Wände, Böden und Objekte
- **Performance-Optimierungen**: View Frustum Culling und optimierte Kollisionserkennung

### Schwierigkeitsgrade
- **Leicht**: 150 HP
- **Normal**: 100 HP
- **Schwer**: 75 HP (Gegner machen mehr Schaden und bewegen sich schneller)

### Speichersystem
- Spielstände können jederzeit gespeichert werden (Taste **M**)
- Spielstände können geladen werden (Taste **L**)
- Alle Spielstände werden im Browser-LocalStorage gespeichert

## Steuerung

Das Spiel bietet anpassbare Steuerungs-Profile. Im Hauptmenü unter **Konfiguration** kannst du zwischen "Modern", "Klassisch" und einer benutzerdefinierten Belegung wählen.

### Standard-Belegung (Modern)

#### Bewegung
- **W** / **↑**: Vorwärts
- **S** / **↓**: Rückwärts
- **A**: Links bewegen (seitwärts)
- **D**: Rechts bewegen (seitwärts)
- **←** / **→**: Umschauen
- **F**: Springen (über Hindernisse wie Tische und Stühle)

#### Interaktion
- **E**: Tür öffnen (wenn man davor steht)
- **T**: Statistiken anzeigen/verbergen
- **G**: Debug-Info (zeigt lebende Gegner in Konsole)

#### Kampf
- **Leertaste**: Schießen / Angreifen
- **1-6**: Waffe wechseln
  - 1: Messer
  - 2: Pistole
  - 3: Maschinenpistole
  - 4: Kettensäge
  - 5: Sturmgewehr
  - 6: Schweres Maschinengewehr

#### Spiel-Menü
- **M**: Spielstand speichern
- **L**: Spielstand laden
- **H**: Hilfe anzeigen/verbergen
- **P**: Pause (öffnet Pausen-Menü)
- **ESC**: Zurück / Pause

### Klassische Steuerung (Wolfenstein 3D Stil)
- **Pfeiltasten**: Bewegung und Drehen
- **Z / C** (oder Komma/Punkt): Seitwärts laufen (Strafen)
- **Strg**: Schießen
- **Leertaste**: Tür öffnen


## Installation & Start

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

## Technische Details

### Architektur
- **React 19** mit TypeScript
- **Vite** als Build-Tool
- **Raycasting-Engine** für 3D-Rendering auf Canvas
- **Web Audio API** für Sound-Effekte

### Projektstruktur
```
src/
├── App.tsx                    # Haupt-Spielkomponente
├── types.ts                   # TypeScript-Typdefinitionen
├── gameEngine.ts              # Spiel-Logik und Update-Loop
├── raycasting.ts              # 3D-Rendering-Engine
├── weapons.ts                 # Waffen-Definitionen
├── levels.ts                  # Level-Maps und Varianten-System
├── levels/                    # Level-Varianten
│   ├── level2-variant3.ts
│   ├── level3-variant1.ts
│   ├── level3-variant2.ts
│   └── ...
├── mapSelectionSystem.ts      # Dynamische Level-Auswahl
├── saveLoadSystem.ts          # Speichern/Laden-System
├── soundSystem.ts             # Audio-System
├── textures.ts                # Prozedurale Textur-Generierung
├── MiniMap.tsx                # Minimap-Komponente
├── index.css                  # Globale Styles
└── main.tsx                   # App-Entry-Point
```

## Spielziel

Kämpfe dich durch 7 Level voller Zombies, Monster, Geister und Hunde. Besiege alle Gegner in einem Level und suche nach der speziellen "Nächste Ebene" Tür, um zum nächsten Level zu gelangen. Sammle alle Items bevor du das Level verlässt! Jedes Level hat mehrere Varianten für mehr Abwechslung.

## Hinweise

- Das Spiel läuft komplett im Browser ohne Backend
- Spielstände werden lokal im Browser gespeichert
- Sound-Effekte werden prozedural mit der Web Audio API erzeugt
- Alle Texturen werden prozedural generiert - keine Bilddateien erforderlich
- Keine Nazi-Symbole (im Gegensatz zum Original Wolfenstein 3D)
- Normale Türen (braune Wände) können mit der Taste 'E' geöffnet werden
- Die spezielle "Nächste Ebene" Tür (grüne Wand) öffnet sich nur wenn alle Gegner besiegt sind
- Ein pulsierender Indikator zeigt an, wenn die Exit-Tür verfügbar ist
- Items zeigen Benachrichtigungen beim Sammeln
- Doppelte Waffen werden automatisch in Munition umgewandelt (+30 Schuss)
- Jedes neue Level belohnt dich mit 25 HP
- Statistiken über Items und besiegte Gegner mit Taste 'T' abrufbar
- Dekorative Objekte wie Vasen, Kisten und Möbel können Kollisionen verursachen
- Deckenleuchten sind fest an der Decke montiert und haben keine Kollision
- Gegner können normale Türen öffnen (außer Hunde)
- Level-Varianten werden automatisch rotiert für mehr Abwechslung

## Performance

Das Spiel wurde für optimale Performance optimiert:
- **View Frustum Culling**: Nur sichtbare Sprites werden gerendert
- **Optimierte Kollisionserkennung**: Frühe Distanzprüfungen reduzieren unnötige Berechnungen
- **Effiziente Textur-Rendering**: Verwendung von Canvas-Operationen statt pixelweiser Manipulation
- Ziel: 60 FPS auf modernen Browsern

## Level Editor (Nur in der Entwicklung)

Das Projekt enthält einen visuellen Level-Editor zum Erstellen und Bearbeiten von Leveln ohne Code zu schreiben.

### Editor starten

```bash
npm run editor
```

Der Editor öffnet sich unter `http://localhost:3000` mit einem Backend-Server auf Port 3001.

### Features
- Visuelle 2D-Level-Bearbeitung mit interaktiver Canvas
- Level-Dateien aus `src/levels/` laden und speichern
- Gegner, Items, dekorative Objekte und Wandbilder platzieren und bearbeiten
- Kachel-Typen ändern (Wände, Türen, Böden)
- Spieler-Startposition und -richtung festlegen
- Neue Level und Varianten erstellen
- Level-Dimensionen ändern
- Tastenkürzel (Strg+S zum Speichern, Strg+Z/Y für Rückgängig/Wiederholen)

### Dokumentation
- **[Vollständiger Guide](docs/LEVEL-EDITOR-README.md)** - Ausführliche Nutzungsanweisungen, Workflows und API-Dokumentation
- **[Schnellreferenz](docs/LEVEL-EDITOR-QUICK-REFERENCE.md)** - Tastenkürzel und schnelle Aktionen
- **[Zusammenfassung](docs/LEVEL-EDITOR-SUMMARY.md)** - Implementierungs-Übersicht und Statistiken

**Hinweis**: Der Editor ist von Produktions-Builds ausgeschlossen und läuft nur in der Entwicklung.

## Designer Mode (Nur in der Entwicklung)

Der Designer Mode ist ein visueller Theme-Editor zur Erstellung und Anpassung von Wand-Texturen und visuellen Themes für das Spiel. Er bietet eine intuitive Benutzeroberfläche ohne Code-Kenntnisse zu benötigen.

### Schnellstart

```bash
# Beide Server gleichzeitig starten
npm run designer

# Oder separat starten
npm run designer:frontend  # Port 3002
npm run designer:backend   # Port 3003
```

Öffne dann: `http://localhost:3002/designer.html`

### Hauptfunktionen

- **Echtzeit-Vorschau**: Sofortige Visualisierung aller Änderungen
- **Theme-Verwaltung**: Erstellen, speichern und wechseln zwischen mehreren Themes
- **Visuelle Editoren**: Intuitive Steuerelemente für Farben, Dimensionen und Effekte
- **Undo/Redo**: Vollständige Historie mit bis zu 50 Schritten
- **Import/Export**: Themes als JSON oder CSS teilen
- **Tastenkürzel**: Effiziente Workflows mit Tastatur-Navigation
- **Responsive Design**: Funktioniert auf verschiedenen Bildschirmgrößen
- **Barrierefreiheit**: Vollständige Tastatur-Navigation und Screen-Reader-Unterstützung

### Wand-Typen

Der Designer Mode unterstützt die Bearbeitung von vier Wand-Typen:

1. **Ziegel-Wände**: Traditionelle Ziegelstein-Textur mit Mörtel
2. **Holz-Wände**: Vertikale Holzpaneele mit natürlicher Maserung
3. **Stein-Wände**: Steinblock-Textur mit natürlicher Variation
4. **Tür-Texturen**: Spezielle Texturen für interaktive Türen

Jeder Typ hat anpassbare Eigenschaften:
- **Farben**: Primär, Sekundär, Akzent, Schatten, Highlight
- **Dimensionen**: Breite, Höhe, Abstand, Rahmenbreite
- **Textur**: Muster, Intensität, Mischmodus
- **Effekte**: Schatten, Highlights, Verläufe

### Tastenkürzel

| Kürzel | Aktion |
|--------|--------|
| `Strg+S` | Theme speichern |
| `Strg+Z` | Rückgängig |
| `Strg+Y` | Wiederholen |
| `Strg+N` | Neues Theme |
| `F1` | Tastenkürzel anzeigen |
| `Escape` | Dialog schließen |

Siehe [vollständige Tastenkürzel-Referenz](docs/DESIGNER-MODE-KEYBOARD-SHORTCUTS.md) für alle Shortcuts.

### Dokumentation

- **[Vollständiger Guide](docs/DESIGNER-MODE-README.md)** - Umfassende Anleitung mit Workflows und Best Practices
- **[Tastenkürzel](docs/DESIGNER-MODE-KEYBOARD-SHORTCUTS.md)** - Komplette Referenz aller Tastenkombinationen
- **[Theme-Dateiformat](docs/DESIGNER-MODE-THEME-FORMAT.md)** - Spezifikation der Theme-Struktur
- **[Fehlerbehebung](docs/DESIGNER-MODE-TROUBLESHOOTING.md)** - Häufige Probleme und Lösungen

### Architektur

```
src/designer/
├── components/          # React-Komponenten für UI
│   ├── Header.tsx       # Theme-Auswahl und Aktionen
│   ├── Sidebar.tsx      # Asset-Liste
│   ├── PropertyPanel.tsx # Eigenschaften-Editor
│   ├── LivePreview.tsx  # Echtzeit-Vorschau
│   └── ...
├── hooks/               # React Hooks für State-Management
│   ├── useThemeManager.ts
│   ├── useApiClient.ts
│   └── ...
└── utils/               # Hilfsfunktionen
    ├── themeValidator.ts
    ├── exportUtils.ts
    └── ...

designer-server.mjs      # Backend-API (Port 3003)
themes/                  # Theme-Dateien
├── default.json         # Standard-Theme
└── custom-themes/       # Benutzerdefinierte Themes
```

### Anwendungsfälle

- **Spiel-Artists**: Erstellen neuer Wand-Texturen ohne Code-Kenntnisse
- **Level-Designer**: Anpassen der visuellen Atmosphäre verschiedener Level
- **Entwickler**: Schnelle Prototyp-Erstellung für neue Textur-Konzepte
- **Theme-Entwicklung**: Konsistente Gestaltungs-Systeme für das gesamte Spiel

**Hinweis**: Der Designer Mode ist nur in der Entwicklungsumgebung verfügbar und wird nicht in Produktions-Builds eingeschlossen.

## Entwickelt von

Tobias Brendler als Wolfenstein 3D-Hommage für moderne Browser.
