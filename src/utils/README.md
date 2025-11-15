# Utils - Utility Functions and Tools

Dieses Verzeichnis enthält Utility-Funktionen und Entwicklertools für das Projekt.

## Struktur

```
src/utils/
├── README.md           # Diese Datei
├── index.ts            # Zentraler Export-Point für alle Utilities
└── levelValidator.ts   # Level-Validierungstool (wird in Phase 4 implementiert)
```

## Level-Validierungstool

Das Level-Validierungstool (`levelValidator.ts`) wird in Phase 4 des Features "Gegner-Spawn-Sicherheit" implementiert. Es ermöglicht:

- Validierung aller Level-Varianten gegen Sicherheitsregeln
- Automatische Repositionierung von Gegnern
- Batch-Validierung aller 35 Level-Varianten

### Verwendung

```typescript
import { validateLevelVariant, validateAllLevels } from './utils/levelValidator.ts';

// Einzelnes Level validieren
const result = validateLevelVariant(level, 1, 1);

// Alle Level validieren
const results = validateAllLevels();
```

### npm-Script

```bash
npm run validate-levels
```

Siehe [docs/enemy-spawn-safety.md](../../docs/enemy-spawn-safety.md) für weitere Informationen.

## Zukünftige Erweiterungen

Dieses Verzeichnis kann für weitere Utility-Funktionen erweitert werden:

- Performance-Monitoring-Tools
- Debugging-Helpers
- Test-Utilities
- Build-Tools

## Referenzen

- [Feature Documentation](../../docs/enemy-spawn-safety.md)
- [Quick Start Guide](../../specs/001-enemy-spawn-safety/quickstart.md)

