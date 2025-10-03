# EGOR - Wolfenstein 3D Klon

Ein Ego-Shooter im Stil von Wolfenstein 3D, entwickelt mit React und TypeScript.

## Features

### Spielmechanik
- **3D-Raycasting-Engine** für klassisches Retro-Gameplay
- **5 Level** mit steigendem Schwierigkeitsgrad
- **6 verschiedene Waffen**:
  - Messer
  - Pistole
  - Maschinenpistole
  - Kettensäge
  - Sturmgewehr
  - Schweres Maschinengewehr
- **Gegner**: Zombies und Monster mit KI
- **Items**: Gesundheitspakete, Munition, Schätze und Waffen

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
- **A**: Links bewegen (Strafe)
- **D**: Rechts bewegen (Strafe)
- **←** / **→**: Umschauen

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
├── App.tsx              # Haupt-Spielkomponente
├── types.ts             # TypeScript-Typdefinitionen
├── gameEngine.ts        # Spiel-Logik und Update-Loop
├── raycasting.ts        # 3D-Rendering-Engine
├── weapons.ts           # Waffen-Definitionen
├── levels.ts            # Level-Maps und Gegner
├── saveLoadSystem.ts    # Speichern/Laden-System
├── soundSystem.ts       # Audio-System
├── index.css            # Globale Styles
└── main.tsx            # App-Entry-Point
```

## Spielziel

Kämpfe dich durch 5 Level voller Zombies und Monster. Finde neue Waffen, sammle Items und besiege alle Gegner, um das Spiel zu gewinnen!

## Hinweise

- Das Spiel läuft komplett im Browser ohne Backend
- Spielstände werden lokal im Browser gespeichert
- Sound-Effekte werden prozedural mit der Web Audio API erzeugt
- Keine Nazi-Symbole (im Gegensatz zum Original Wolfenstein 3D)

## Entwickelt von

Erstellt mit Claude Sonnet als Wolfenstein 3D-Hommage für moderne Browser.
