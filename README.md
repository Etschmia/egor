# Hundefelsen

Ein Ego-Shooter im Stil von Wolfenstein 3D, entwickelt mit React und TypeScript.

## Features

### Spielmechanik
- **3D-Raycasting-Engine** für klassisches Retro-Gameplay
- **8 Level** mit steigendem Schwierigkeitsgrad und mehreren Varianten pro Level
- **Dynamische Level-Auswahl**: Jedes Level hat mehrere Varianten, die automatisch rotiert werden
- **Türen** die mit der Taste 'E' geöffnet werden können:
  - Normale Türen (braune Wände)
  - Spezielle "Nächste Ebene" Tür (grüne Wand) - öffnet sich nur wenn alle Gegner besiegt sind
- **6 verschiedene Waffen**:
  - Messer
  - Pistole
  - Maschinenpistole
  - Kettensäge
  - Sturmgewehr
  - Schweres Maschinengewehr
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

### Bewegung
- **W** / **↑**: Vorwärts
- **S** / **↓**: Rückwärts
- **A**: Links bewegen (seitwärts)
- **D**: Rechts bewegen (seitwärts)
- **←** / **→**: Umschauen
- **F**: Springen (über Hindernisse wie Tische und Stühle)

### Interaktion
- **E**: Tür öffnen (wenn man davor steht)
- **T**: Statistiken anzeigen/verbergen
- **G**: Debug-Info (zeigt lebende Gegner in Konsole)

### Kampf
- **Leertaste**: Schießen / Angreifen
- **1-6**: Waffe wechseln
  - 1: Messer
  - 2: Pistole
  - 3: Maschinenpistole
  - 4: Kettensäge
  - 5: Sturmgewehr
  - 6: Schweres Maschinengewehr

### Spiel-Menü
- **M**: Spielstand speichern
- **L**: Spielstand laden
- **H**: Hilfe anzeigen/verbergen
- **P**: Pause
- **ESC**: Dialog schließen

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

## Entwickelt von

Tobias Brendler als Wolfenstein 3D-Hommage für moderne Browser.
