# Implementation Plan

- [x] 1. Erweitere Type-Definitionen für dekorative Objekte
  - Erstelle `DecorativeObjectType` Enum in types.ts mit allen 8 Objekt-Typen
  - Erstelle `DecorativeObject` Interface mit id, type, x, y, colorVariant, collisionRadius, renderHeight, parentId
  - Erweitere `GameMap` Interface um `decorativeObjects: DecorativeObject[]`
  - Erstelle `MapHistoryEntry` Interface mit level, variant, timestamp
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Implementiere Map Selection System
  - [x] 2.1 Erstelle mapSelectionSystem.ts mit Basis-Funktionen
    - Implementiere `loadMapHistory()` zum Laden aus LocalStorage
    - Implementiere `saveMapHistory()` zum Speichern in LocalStorage
    - Implementiere `selectMapVariant()` mit Auswahllogik (ungespielte bevorzugen, sonst älteste)
    - Implementiere `recordMapPlay()` zum Aktualisieren der Historie
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.4_
  
  - [x] 2.2 Implementiere Fehlerbehandlung für Map-Historie
    - Füge Try-Catch für LocalStorage-Zugriff hinzu
    - Implementiere Fallback auf In-Memory-Array bei LocalStorage-Fehler
    - Implementiere Validierung und Cleanup bei korrupten Daten
    - _Requirements: 4.1, 4.5, 4.6_

- [x] 3. Erstelle Map-Varianten-Struktur in levels.ts
  - [x] 3.1 Erstelle erste Map-Varianten für Level 1
    - Erstelle LEVEL_1_VARIANT_1 (basierend auf aktuellem LEVEL_1)
    - Erstelle LEVEL_1_VARIANT_2 mit anderem Layout (20x20)
    - Erstelle LEVEL_1_VARIANT_3 mit anderem Layout (20x20)
    - Erstelle LEVEL_1_VARIANT_4 mit anderem Layout (20x20)
    - Erstelle LEVEL_1_VARIANT_5 mit anderem Layout (20x20)
    - Füge leeres `decorativeObjects: []` Array zu allen Varianten hinzu
    - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2_
  
  - [x] 3.2 Erstelle LEVELS_WITH_VARIANTS Array
    - Erstelle verschachteltes Array `GameMap[][]`
    - Füge Level 1 Varianten als erstes Element hinzu
    - Erstelle Kompatibilitäts-Export `LEVELS` mit ersten Varianten
    - _Requirements: 5.2, 5.3, 10.2, 10.5_

- [x] 4. Integriere Map Selection in Game Engine
  - Erweitere `createInitialGameState()` um Map-Selection-Aufruf
  - Erweitere `loadNextLevel()` um Map-Selection-Aufruf
  - Stelle sicher, dass Map-Historie bei Level-Wechsel aktualisiert wird
  - _Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5. Implementiere Textur-System für dekorative Objekte
  - [x] 5.1 Erstelle prozedurale Texturen
    - Implementiere `createLightTexture()` (gelber Kreis mit Glow)
    - Implementiere `createVaseTexture()` (vertikales Rechteck mit Muster)
    - Implementiere `createCrateTexture()` (braunes Quadrat mit Holzmaserung)
    - Implementiere `createBenchTexture()` (horizontales Rechteck mit Beinen)
    - Implementiere `createTableTexture()` (Tischplatte)
    - Implementiere `createChairTexture()` (Stuhlform)
    - Implementiere `createWineBottleTexture()` (Flasche mit Glas)
    - Implementiere `createSkeletonTexture()` (Knochen-Silhouette)
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [x] 5.2 Erweitere getTexture-Funktion
    - Füge DECORATIVE_TEXTURES Record hinzu
    - Erweitere `getTexture()` um DecorativeObjectType-Handling
    - Implementiere `applyColorVariant()` für Farbmodulation
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 6. Implementiere Rendering für dekorative Objekte
  - [x] 6.1 Erweitere Sprite-Rendering-System
    - Erweitere `SpriteRender` Interface um type 'decorative'
    - Erweitere `getSpritesToRender()` um decorativeObjects Parameter
    - Füge Transform-Logik für dekorative Objekte hinzu
    - Sortiere alle Sprites nach Entfernung
    - _Requirements: 6.1, 6.6, 6.7_
  
  - [x] 6.2 Implementiere spezielle Rendering-Logik
    - Implementiere Y-Offset für CEILING_LIGHT (nach oben)
    - Implementiere Y-Offset für SKELETON (nach unten)
    - Implementiere relative Positionierung für parentId-Objekte
    - Implementiere Farbmodulation beim Rendering
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Implementiere Kollisionserkennung für dekorative Objekte
  - [x] 7.1 Erstelle Kollisions-Hilfsfunktionen
    - Implementiere `checkDecorativeObjectCollision()` in gameEngine.ts
    - Definiere Kollisionsradien für alle Objekt-Typen
    - _Requirements: 7.1, 7.4_
  
  - [x] 7.2 Integriere in Bewegungssystem
    - Erweitere `movePlayer()` um decorativeObjects Parameter
    - Füge Kollisionsprüfung für dekorative Objekte hinzu
    - Erweitere `updateEnemies()` um Kollisionsprüfung für Gegner
    - _Requirements: 7.2, 7.3, 7.5_

- [x] 8. Erstelle Map-Varianten für Level 2-3
  - Erstelle 5 Varianten für Level 2 (20x20)
  - Erstelle 5 Varianten für Level 3 (20x20)
  - Füge zu LEVELS_WITH_VARIANTS hinzu
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 9. Erstelle Map-Varianten für Level 4-5
  - Erstelle 5 Varianten für Level 4 (22x22)
  - Erstelle 5 Varianten für Level 5 (22x22)
  - Füge zu LEVELS_WITH_VARIANTS hinzu
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 10. Erstelle Map-Varianten für Level 6-7
  - Erstelle 5 Varianten für Level 6 (24x24)
  - Erstelle 5 Varianten für Level 7 (24x24)
  - Füge zu LEVELS_WITH_VARIANTS hinzu
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [ ] 11. Platziere dekorative Objekte in Level 1 Varianten
  - Füge Leuchten zu allen 5 Varianten hinzu (alle 4-6 Felder)
  - Füge Vasen, Kisten, Bänke in Fluren hinzu
  - Füge Tische und Stühle in Räumen hinzu
  - Füge Weinflaschen auf 30% der Tische hinzu
  - Füge 1-3 Gerippe pro Variante hinzu
  - Setze zufällige colorVariant-Werte für Kisten, Vasen, Bänke
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 12. Platziere dekorative Objekte in Level 2-3 Varianten
  - Füge dekorative Objekte zu allen Level 2 Varianten hinzu
  - Füge dekorative Objekte zu allen Level 3 Varianten hinzu
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 13. Platziere dekorative Objekte in Level 4-5 Varianten
  - Füge dekorative Objekte zu allen Level 4 Varianten hinzu
  - Füge dekorative Objekte zu allen Level 5 Varianten hinzu
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 14. Platziere dekorative Objekte in Level 6-7 Varianten
  - Füge dekorative Objekte zu allen Level 6 Varianten hinzu
  - Füge dekorative Objekte zu allen Level 7 Varianten hinzu
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 15. Teste und validiere Abwärtskompatibilität
  - Teste Laden von alten Savegames
  - Validiere dass LEVELS-Array weiterhin funktioniert
  - Teste Map-Historie-Persistenz über Sessions
  - Teste Fehlerbehandlung bei korrupten Daten
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 16. Optimiere Performance
  - Implementiere Sprite-Culling für Objekte außerhalb Sichtfeld
  - Implementiere Texture-Caching
  - Teste Performance mit vielen Objekten (20+ pro Map)
  - Optimiere Kollisionserkennung falls nötig
  - _Requirements: 1.7, 7.1, 7.2, 7.3_
