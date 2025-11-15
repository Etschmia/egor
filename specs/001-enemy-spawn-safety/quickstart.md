# Quick Start: Gegner-Spawn-Sicherheit

**Date**: 2025-01-27  
**Feature**: Gegner-Spawn-Sicherheit  
**Plan**: [plan.md](./plan.md)

## Übersicht

Diese Feature implementiert Sicherheitsregeln für Gegner-Positionierung und Bewegungsverzögerung. Entwickler können Level validieren und automatisch anpassen lassen.

## Für Entwickler

### Level validieren

**Alle Level prüfen**:
```bash
npm run validate-levels
```

**Einzelnes Level prüfen** (in TypeScript):
```typescript
import { validateLevelVariant } from './src/utils/levelValidator.ts';
import { LEVEL_1_VARIANT_1 } from './src/levels/level1-variant1.ts';

const result = validateLevelVariant(LEVEL_1_VARIANT_1, 1, 1);
if (!result.isValid) {
  console.log('Verstöße gefunden:', result.violations);
}
```

**Automatische Repositionierung**:
```typescript
const result = validateLevelVariant(LEVEL_1_VARIANT_1, 1, 1, true);
if (result.adjustedEnemies) {
  // Verwende result.adjustedEnemies für angepasste Positionen
}
```

### Level anpassen

**Manuell**: Bearbeite Level-Definition in `src/levels/levelX-variantY.ts`:
- Verschiebe Gegner-Positionen (`enemy.x`, `enemy.y`)
- Validiere erneut mit `validateLevelVariant()`

**Automatisch**: Verwende `autoReposition: true`:
- Tool findet beste verfügbare Positionen
- Entwickler-Warnung wird ausgegeben
- Überprüfe Anpassungen manuell

## Für Spieler

**Keine Änderungen erforderlich** - Feature funktioniert automatisch:
- Gegner sind automatisch sicher positioniert
- 2-Sekunden-Verzögerung beim Level-Start
- Keine sofortigen Angriffe mehr möglich

## Implementierungs-Checkliste

### Phase 1: Core-Funktionen

- [ ] `calculatePathDistance()` implementieren
- [ ] `canEnemyOpenDoors()` implementieren
- [ ] `shouldEnemyMove()` implementieren
- [ ] `GameState` um `levelStartTime` erweitern
- [ ] `createInitialGameState()` aktualisieren

### Phase 2: Bewegungsverzögerung

- [ ] `updateEnemies()` um `levelStartTime` Parameter erweitern
- [ ] Bewegungsverzögerung in `updateEnemies()` implementieren
- [ ] `App.tsx` aktualisieren um `levelStartTime` zu übergeben

### Phase 3: Validierungstool

- [ ] `validateLevelVariant()` implementieren
- [ ] `validateAllLevels()` implementieren
- [ ] Automatische Repositionierung implementieren
- [ ] npm-Script `validate-levels` hinzufügen

### Phase 4: Level-Anpassungen

- [ ] Alle 35 Level-Varianten validieren
- [ ] Verstöße identifizieren
- [ ] Level manuell oder automatisch anpassen
- [ ] Erneut validieren bis alle Level gültig sind

### Phase 5: Testing

- [ ] Build-Test: `npm run build`
- [ ] Lint-Test: `npm run lint`
- [ ] Runtime-Test: `npm run dev`
- [ ] Manuelle Tests: Alle Level starten, Verzögerung prüfen
- [ ] Performance-Test: Game Loop bei 60 FPS

## Häufige Probleme

### Problem: Validierung findet viele Verstöße

**Lösung**: 
1. Prüfe ob Level zu klein ist (weniger als 3 Sekunden Distanz möglich)
2. Verwende automatische Repositionierung mit `autoReposition: true`
3. Überprüfe Anpassungen manuell

### Problem: Bewegungsverzögerung funktioniert nicht

**Lösung**:
1. Prüfe ob `levelStartTime` in `GameState` gesetzt ist
2. Prüfe ob `updateEnemies()` `levelStartTime` Parameter erhält
3. Prüfe ob Zeitstempel korrekt ist (`Date.now()`)

### Problem: Distanzberechnung zu langsam

**Lösung**:
1. Prüfe ob BFS optimiert ist (Early Exit)
2. Validiere nur bei Änderungen, nicht bei jedem Build
3. Verwende Caching für statische Level

## Nächste Schritte

1. ✅ Plan erstellt
2. ✅ Research abgeschlossen
3. ✅ Data Model definiert
4. ✅ Contracts definiert
5. → Task-Liste erstellen: `/speckit.tasks`
6. → Implementierung starten

## Referenzen

- [Plan](./plan.md)
- [Research](./research.md)
- [Data Model](./data-model.md)
- [Contracts](./contracts/functions.md)

