# Design Document: Enhanced Textures

## Übersicht

Dieses Design beschreibt die Verbesserung der prozedural generierten Texturen im Raycasting-Spiel. Der Fokus liegt auf der Erhöhung der visuellen Detailstufe für Gegner, Items und Türen, während die Performance und die prozedurale Natur der Textur-Generierung erhalten bleiben.

Die Verbesserungen werden ausschließlich in der Datei `src/textures.ts` implementiert, da alle Textur-Generierungsfunktionen dort zentralisiert sind.

## Architektur

### Bestehende Struktur

Die aktuelle Architektur verwendet:
- Canvas API für prozedurale Textur-Generierung
- Separate Funktionen für jeden Texturtyp
- Zentrale Speicherung in Maps (`textures`, `corpseTextures`, `wallTextures`, `itemTextures`)
- Lazy Loading beim Spielstart über `loadTextures()`

### Design-Prinzipien

1. **Prozedurale Generierung beibehalten**: Alle Texturen bleiben prozedural generiert (keine Bilddateien)
2. **Canvas-basiert**: Verwendung der Canvas 2D API für alle Zeichenoperationen
3. **Modulare Funktionen**: Jede Textur hat ihre eigene Generierungsfunktion
4. **Performance-Optimierung**: Texturen werden einmal beim Start generiert und wiederverwendet
5. **Konsistente Auflösung**: 64x64 Pixel für Gegner/Items, 32x32 für Wände/Türen

## Komponenten und Interfaces

### Textur-Generierungsfunktionen

Alle Funktionen folgen diesem Pattern:

```typescript
function create[EntityName]Texture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64; // oder 32 für Wände
  canvas.height = 64; // oder 32 für Wände
  const ctx = canvas.getContext('2d')!;
  
  // Zeichenoperationen...
  
  return canvas;
}
```

### Zu verbessernde Funktionen

#### Gegner-Texturen
- `createZombieTexture()` - Lebender Zombie
- `createZombieCorpseTexture()` - Toter Zombie
- `createMonsterTexture()` - Lebendes Monster
- `createMonsterCorpseTexture()` - Totes Monster
- `createGhostTexture()` - Lebender Geist
- `createGhostCorpseTexture()` - Toter Geist
- `createDogTexture()` - Lebender Hund
- `createDogCorpseTexture()` - Toter Hund

#### Item-Texturen
- `createHealthSmallTexture()` - Kleines Medi-Pack
- `createHealthLargeTexture()` - Großes Medi-Pack
- `createTreasureTexture()` - Schatz
- `createAmmoTexture()` - Munition
- `createWeaponTexture()` - Waffe

#### Tür-Texturen
- `createDoorTexture()` - Normale Tür
- `createExitDoorTexture()` - Exit-Tür

## Detaillierte Design-Spezifikationen

### 1. Zombie-Textur (64x64)


**Verbesserungen:**
- **Kopf**: Detailliertes Gesicht mit Augen (gelb-leuchtend), Nase, Mund mit sichtbaren Zähnen
- **Haut**: Mehrere Grüntöne (#2E8B57, #3CB371, #90EE90) mit Farbverläufen
- **Wunden**: Dunkle Flecken (#5A0000, #8B0000) für Verletzungen
- **Kleidung**: Zerrissenes Hemd mit Fetzen, verschiedene Rottöne
- **Hände**: Erkennbare Finger mit 5 Rechtecken pro Hand
- **Details**: Blutflecken, Hautstruktur durch Schattierungen

**Techniken:**
- `createLinearGradient()` für Haut und Kleidung
- `createRadialGradient()` für leuchtende Augen
- Mehrschichtige Rechtecke für Tiefe
- Transparenz für Blutflecken

### 2. Monster-Textur (64x64)

**Verbesserungen:**
- **Körper**: Muskulöse Struktur mit Schattierungen, mehrere Rottöne (#8B0000, #FF4500, #DC143C)
- **Kopf**: Größer und detaillierter mit Gesichtszügen
- **Hörner**: 3D-Effekt mit Glanzlichtern (Gradienten von #C0C0C0 zu #696969)
- **Augen**: Leuchtend rot-gelb mit mehreren Schichten
- **Maul**: Geöffnet mit sichtbaren Reißzähnen (6-8 Zähne)
- **Klauen**: Detaillierte Hände und Füße mit einzelnen Krallen
- **Muskeln**: Sichtbare Muskelstruktur durch Schattierungen

**Techniken:**
- `createRadialGradient()` für Körper und Augen
- `beginPath()` und `bezierCurveTo()` für organische Formen
- Mehrere Ebenen für Tiefenwirkung
- Highlights für metallische Hörner

### 3. Geist-Textur (64x64)

**Verbesserungen:**
- **Körper**: Fließende, ätherische Form mit mehreren Transparenzebenen
- **Gesicht**: Hohle Augen mit Leuchteffekt, gequälter Ausdruck
- **Ränder**: Wispy, nebelige Effekte mit Farbverläufen
- **Farben**: Weiß zu Blau (#FFFFFF, #E0FFFF, #B0E0E6, #87CEEB)
- **Transparenz**: 70-85% mit `globalAlpha`
- **Inneres Leuchten**: Radiale Gradienten für übernatürlichen Effekt

**Techniken:**
- `globalAlpha` für Transparenz
- Mehrere `createRadialGradient()` für Leuchteffekte
- `bezierCurveTo()` für fließende Formen
- Layering für Tiefe

### 4. Hund-Textur (64x64)


**Verbesserungen:**
- **Körper**: Hundeform mit vier deutlichen Beinen
- **Fell**: Textur durch mehrere Brauntöne (#3A1A0A, #5A3A1A, #6B4A2A)
- **Kopf**: Detaillierte Schnauze mit gebleckten Zähnen
- **Ohren**: Angelegte, aggressive Haltung
- **Augen**: Leuchtend rot (#FF0000) mit Glüheffekt
- **Pfoten**: Erkennbare Pfoten mit Krallen
- **Haltung**: Aggressive Angriffsposition

**Techniken:**
- `createLinearGradient()` für Fellstruktur
- Detaillierte Beinpositionierung
- Kleine Rechtecke für Krallen und Zähne
- Radiale Gradienten für Augen

### 5. Item-Texturen

#### Schatz (32x32)
**Verbesserungen:**
- **Form**: Kelch, Krone oder Truhe mit erkennbarer Silhouette
- **Material**: Goldener Farbverlauf (#FFD700, #FFA500, #B8860B)
- **Edelsteine**: Rote oder blaue Akzente (#FF0000, #0000FF)
- **Glanzlichter**: Helle Bereiche (#FFFFE0) für metallischen Effekt
- **3D-Effekt**: Schattierungen für Tiefe

#### Medi-Packs (32x32)
**Verbesserungen:**
- **Box**: 3D-Effekt mit Schattierungen
- **Kreuz**: Deutliches weißes Kreuz auf rotem Hintergrund
- **Größenunterschied**: Kleine vs. große Packs visuell unterscheidbar
- **Glanz**: Weiße Highlights für Plastik-Effekt
- **Rand**: Dunkler Rand für Definition

#### Munition (32x32)
**Verbesserungen:**
- **Kiste**: Militärische Munitionskiste mit Olivgrün (#556B2F, #6B8E23)
- **Patronen**: Sichtbare Patronenspitzen in Gold (#FFD700)
- **Beschriftung**: "AMMO" Text oder Symbol
- **Riemen**: Schwarze Riemen für Realismus
- **3D-Effekt**: Schattierungen für Tiefe

#### Waffe (32x32)
**Verbesserungen:**
- **Form**: Erkennbare Gewehrform mit Lauf, Griff, Magazin
- **Material**: Metallische Grautöne (#2A2A2A, #4A4A4A, #696969)
- **Komponenten**: Visier, Schulterstütze, Abzug
- **Details**: Schrauben, Rillen für Realismus
- **Glanz**: Highlights für Metall-Effekt

### 6. Tür-Texturen (32x32)

#### Normale Tür
**Verbesserungen:**
- **Holz**: Detaillierte Maserung mit mehreren Brauntönen
- **Paneele**: Sichtbare Türfüllungen mit Schattierungen
- **Griff**: Goldener Türgriff (#FFD700) mit 3D-Effekt
- **Scharniere**: Dunkle Metallscharniere
- **Tiefe**: Schattierungen für 3D-Wirkung

#### Exit-Tür
**Verbesserungen:**
- **Farbe**: Deutlich grün (#228B22, #32CD32) zur Unterscheidung
- **Symbol**: Großes, gut sichtbares Exit-Symbol oder Pfeil
- **Leuchteffekt**: Heller Rand oder Glühen für Aufmerksamkeit
- **Details**: Ähnliche Detailstufe wie normale Tür
- **Kontrast**: Hoher Kontrast für bessere Sichtbarkeit

## Rendering-Techniken

### Farbverläufe


```typescript
// Linearer Gradient für Haut, Kleidung
const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
gradient.addColorStop(0, '#color1');
gradient.addColorStop(0.5, '#color2');
gradient.addColorStop(1, '#color3');
ctx.fillStyle = gradient;

// Radialer Gradient für Augen, Leuchteffekte
const radialGradient = ctx.createRadialGradient(cx, cy, r1, cx, cy, r2);
radialGradient.addColorStop(0, '#centerColor');
radialGradient.addColorStop(1, '#outerColor');
ctx.fillStyle = radialGradient;
```

### Transparenz

```typescript
// Für Geister und Leuchteffekte
ctx.globalAlpha = 0.8;
// Zeichenoperationen...
ctx.globalAlpha = 1.0; // Zurücksetzen
```

### Organische Formen

```typescript
// Für fließende Geisterformen
ctx.beginPath();
ctx.moveTo(x, y);
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
ctx.quadraticCurveTo(cpx, cpy, x, y);
ctx.closePath();
ctx.fill();
```

### Schattierungen

```typescript
// Dunkle Bereiche für Tiefe
ctx.fillStyle = '#darkerColor';
ctx.fillRect(x, y, width, 1); // Schatten oben
ctx.fillRect(x, y, 1, height); // Schatten links

// Helle Bereiche für Highlights
ctx.fillStyle = '#lighterColor';
ctx.fillRect(x + width - 1, y, 1, height); // Highlight rechts
ctx.fillRect(x, y + height - 1, width, 1); // Highlight unten
```

## Fehlerbehandlung

### Canvas-Kontext
- Prüfung auf `null` bei `getContext('2d')`
- Fallback auf einfache Textur bei Fehler

### Performance
- Texturen werden nur einmal beim Start generiert
- Keine Animation oder dynamische Generierung während des Spiels
- Wiederverwendung der Canvas-Elemente

## Testing-Strategie

### Visuelle Tests
1. **Manuelle Inspektion**: Jede Textur im Spiel visuell prüfen
2. **Vergleich**: Vorher/Nachher-Vergleich der Texturen
3. **Konsistenz**: Alle Texturen auf ähnliche Detailstufe prüfen

### Performance-Tests
1. **Ladezeit**: Messung der Textur-Generierungszeit
2. **Framerate**: FPS-Messung während des Spiels
3. **Memory**: Speicherverbrauch der Canvas-Elemente

### Funktionale Tests
1. **Rendering**: Alle Texturen werden korrekt gerendert
2. **Sichtbarkeit**: Texturen sind im Spiel gut erkennbar
3. **Unterscheidbarkeit**: Verschiedene Gegner/Items sind unterscheidbar

## Implementierungsreihenfolge

1. **Phase 1**: Gegner-Texturen (höchste Priorität)
   - Zombie (lebendig + Leichnam)
   - Monster (lebendig + Leichnam)
   - Geist (lebendig + Leichnam)
   - Hund (lebendig + Leichnam)

2. **Phase 2**: Item-Texturen
   - Schatz
   - Medi-Packs (klein + groß)
   - Munition
   - Waffe

3. **Phase 3**: Tür-Texturen
   - Normale Tür
   - Exit-Tür

## Performance-Überlegungen

### Optimierungen
- Canvas-Größe auf Minimum beschränken (64x64 bzw. 32x32)
- Keine komplexen Berechnungen während der Generierung
- Wiederverwendung von Gradienten wo möglich
- Minimale Anzahl von Zeichenoperationen

### Speicher
- Geschätzte Größe pro Textur: ~16 KB (64x64 RGBA)
- Gesamte Texturen: ~20 Texturen × 16 KB = ~320 KB
- Vernachlässigbar im Vergleich zum Gesamt-Speicherverbrauch

## Zukünftige Erweiterungen

- **Animierte Texturen**: Mehrere Frames für Bewegung
- **Variationen**: Zufällige Variationen für mehr Vielfalt
- **Beleuchtung**: Dynamische Schattierungen basierend auf Lichtquellen
- **Höhere Auflösung**: 128x128 für noch mehr Details
