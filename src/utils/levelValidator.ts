/**
 * Level Validator - Gegner-Spawn-Sicherheit
 * 
 * Validiert alle Level-Varianten gegen die Sicherheitsregeln:
 * - Jeder Gegner muss mindestens 3 Sekunden vom Spieler-Startpunkt entfernt sein
 * - Automatische Repositionierung mit Fallback auf 2 Sekunden für sehr kleine Level
 */

import type { GameMap, Enemy, ValidationResult, ValidationViolation, DecorativeObject } from '../types.ts';
import { EnemyType, DecorativeObjectType } from '../types.ts';
import { calculatePathDistance, ENEMY_SAFETY_RULES } from '../gameEngine.ts';
import { getAllLevelVariants } from '../levels.ts';

// Kollisionsradien für dekorative Objekte (kopiert aus gameEngine.ts für Validierung)
const DECORATIVE_OBJECT_COLLISION_RADII: Record<DecorativeObjectType, number> = {
  [DecorativeObjectType.CEILING_LIGHT]: 0,
  [DecorativeObjectType.VASE]: 0.25,
  [DecorativeObjectType.CRATE]: 0.35,
  [DecorativeObjectType.BENCH]: 0.4,
  [DecorativeObjectType.TABLE]: 0.45,
  [DecorativeObjectType.CHAIR]: 0.3,
  [DecorativeObjectType.WINE_BOTTLE]: 0.1,
  [DecorativeObjectType.SKELETON]: 0.2
};

/**
 * Prüft ob eine Position frei ist (nicht in einer Wand oder kollidiert mit dekorativen Objekten).
 */
function isPositionValid(
  x: number,
  y: number,
  tiles: number[][],
  decorativeObjects: DecorativeObject[] = []
): boolean {
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);

  // Prüfe Grenzen
  if (
    tileX < 0 || tileX >= tiles[0].length ||
    tileY < 0 || tileY >= tiles.length
  ) {
    return false;
  }

  // Prüfe Tile (0 = frei, 1+ = Wand/Tür)
  if (tiles[tileY][tileX] !== 0) {
    return false;
  }

  // Prüfe dekorative Objekte
  const worldX = x;
  const worldY = y;

  for (const obj of decorativeObjects) {
    const collisionRadius = obj.collisionRadius || DECORATIVE_OBJECT_COLLISION_RADII[obj.type];
    if (collisionRadius === 0) {
      continue; // Keine Kollision
    }

    const dx = worldX - obj.x;
    const dy = worldY - obj.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < collisionRadius) {
      return false;
    }
  }

  return true;
}

/**
 * Findet eine gültige Position für einen Gegner mit Mindestdistanz zum Spieler-Startpunkt.
 * Gibt null zurück, wenn keine passende Position gefunden wird.
 */
function findValidPositionWithMinimumDistance(
  enemy: Enemy,
  playerStartX: number,
  playerStartY: number,
  tiles: number[][],
  decorativeObjects: DecorativeObject[] = [],
  minimumDistanceSeconds: number = ENEMY_SAFETY_RULES.FALLBACK_MINIMUM_DISTANCE_SECONDS
): { x: number; y: number } | null {
  // Finde alle freien Positionen
  const freePositions: { x: number; y: number }[] = [];
  
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      const worldX = x + 0.5; // Zentrum des Tiles
      const worldY = y + 0.5;
      
      if (isPositionValid(worldX, worldY, tiles, decorativeObjects)) {
        freePositions.push({ x: worldX, y: worldY });
      }
    }
  }

  if (freePositions.length === 0) {
    return null;
  }

  // Prüfe jede freie Position und finde die beste mit Mindestdistanz
  let bestPosition: { x: number; y: number } | null = null;
  let bestDistance = 0;

  for (const pos of freePositions) {
    // Erstelle temporären Gegner an dieser Position
    const testEnemy: Enemy = {
      ...enemy,
      x: pos.x,
      y: pos.y
    };

    // Berechne Distanz
    const distanceResult = calculatePathDistance(
      testEnemy,
      playerStartX,
      playerStartY,
      tiles,
      decorativeObjects
    );

    // Wenn kein Pfad existiert (Infinity), überspringe
    if (distanceResult.distance === Infinity) {
      continue;
    }

    // Wenn Distanz ausreicht, prüfe ob sie besser ist als bisher beste
    if (distanceResult.distance >= minimumDistanceSeconds) {
      if (bestPosition === null || distanceResult.distance > bestDistance) {
        bestPosition = pos;
        bestDistance = distanceResult.distance;
      }
    }
  }

  // Wenn keine Position mit Mindestdistanz gefunden, nimm die beste verfügbare
  if (bestPosition === null) {
    for (const pos of freePositions) {
      const testEnemy: Enemy = {
        ...enemy,
        x: pos.x,
        y: pos.y
      };

      const distanceResult = calculatePathDistance(
        testEnemy,
        playerStartX,
        playerStartY,
        tiles,
        decorativeObjects
      );

      if (distanceResult.distance !== Infinity && distanceResult.distance > bestDistance) {
        bestPosition = pos;
        bestDistance = distanceResult.distance;
      }
    }
  }

  return bestPosition;
}

/**
 * Validiert eine Level-Variante gegen alle Sicherheitsanforderungen.
 * 
 * @param level - Die Level-Definition
 * @param levelNumber - Level-Nummer (1-7)
 * @param variantNumber - Varianten-Nummer (1-5)
 * @param autoReposition - Automatische Repositionierung aktivieren (Standard: false)
 * @returns ValidationResult mit allen gefundenen Verstößen
 */
export function validateLevelVariant(
  level: GameMap,
  levelNumber: number,
  variantNumber: number,
  autoReposition: boolean = false
): ValidationResult {
  const violations: ValidationViolation[] = [];
  const warnings: string[] = [];
  const adjustedEnemies: Enemy[] = [];

  // Prüfe jeden Gegner
  for (const enemy of level.enemies) {
    const distanceResult = calculatePathDistance(
      enemy,
      level.playerStartX,
      level.playerStartY,
      level.tiles,
      level.decorativeObjects
    );

    // Wenn kein Pfad existiert (Infinity), gilt als sicher
    if (distanceResult.distance === Infinity) {
      adjustedEnemies.push(enemy);
      continue;
    }

    // Prüfe ob Distanz ausreicht
    if (distanceResult.distance < ENEMY_SAFETY_RULES.MINIMUM_DISTANCE_SECONDS) {
      const violation: ValidationViolation = {
        enemyId: enemy.id,
        enemyType: enemy.type,
        currentDistance: distanceResult.distance,
        requiredDistance: ENEMY_SAFETY_RULES.MINIMUM_DISTANCE_SECONDS,
        reason: `Gegner ${enemy.id} (${enemy.type}) ist nur ${distanceResult.distance.toFixed(2)} Sekunden vom Spieler-Startpunkt entfernt (erforderlich: ${ENEMY_SAFETY_RULES.MINIMUM_DISTANCE_SECONDS} Sekunden)`
      };

      violations.push(violation);

      // Automatische Repositionierung
      if (autoReposition) {
        const newPosition = findValidPositionWithMinimumDistance(
          enemy,
          level.playerStartX,
          level.playerStartY,
          level.tiles,
          level.decorativeObjects,
          ENEMY_SAFETY_RULES.FALLBACK_MINIMUM_DISTANCE_SECONDS
        );

        if (newPosition) {
          const adjustedEnemy: Enemy = {
            ...enemy,
            x: newPosition.x,
            y: newPosition.y
          };

          // Prüfe neue Distanz
          const newDistanceResult = calculatePathDistance(
            adjustedEnemy,
            level.playerStartX,
            level.playerStartY,
            level.tiles,
            level.decorativeObjects
          );

          if (newDistanceResult.distance !== Infinity) {
            adjustedEnemies.push(adjustedEnemy);
            violation.suggestedPosition = newPosition;

            // Wenn immer noch nicht die volle Distanz erreicht, Warnung ausgeben
            if (newDistanceResult.distance < ENEMY_SAFETY_RULES.MINIMUM_DISTANCE_SECONDS) {
              warnings.push(
                `Warnung: Level ${levelNumber}-Variant ${variantNumber}, Gegner ${enemy.id}: ` +
                `Repositionierung auf ${newDistanceResult.distance.toFixed(2)} Sekunden ` +
                `(erforderlich: ${ENEMY_SAFETY_RULES.MINIMUM_DISTANCE_SECONDS} Sekunden, ` +
                `Fallback: ${ENEMY_SAFETY_RULES.FALLBACK_MINIMUM_DISTANCE_SECONDS} Sekunden)`
              );
            }
          } else {
            // Kein Pfad von neuer Position, verwende ursprüngliche Position
            adjustedEnemies.push(enemy);
            warnings.push(
              `Warnung: Level ${levelNumber}-Variant ${variantNumber}, Gegner ${enemy.id}: ` +
              `Kein gültiger Pfad von Repositions-Position gefunden, ursprüngliche Position beibehalten`
            );
          }
        } else {
          // Keine gültige Position gefunden
          adjustedEnemies.push(enemy);
          warnings.push(
            `Warnung: Level ${levelNumber}-Variant ${variantNumber}, Gegner ${enemy.id}: ` +
            `Keine gültige Repositions-Position gefunden, ursprüngliche Position beibehalten`
          );
        }
      } else {
        // Keine automatische Repositionierung
        adjustedEnemies.push(enemy);
      }
    } else {
      // Distanz ausreichend
      adjustedEnemies.push(enemy);
    }
  }

  return {
    levelNumber,
    variantNumber,
    isValid: violations.length === 0,
    violations,
    adjustedEnemies: autoReposition && violations.length > 0 ? adjustedEnemies : undefined,
    warnings
  };
}

/**
 * Validiert alle 35 Level-Varianten (7 Level × 5 Varianten).
 * 
 * @param autoReposition - Automatische Repositionierung aktivieren (Standard: false)
 * @returns Array mit 35 ValidationResult-Objekten
 */
export function validateAllLevels(autoReposition: boolean = false): ValidationResult[] {
  const levelVariants = getAllLevelVariants();
  const results: ValidationResult[] = [];

  for (const variant of levelVariants) {
    const result = validateLevelVariant(
      variant.level,
      variant.levelNumber,
      variant.variantNumber,
      autoReposition
    );
    results.push(result);
  }

  return results;
}

/**
 * Hauptfunktion für Command-Line-Ausführung.
 * Kann als Skript ausgeführt werden: `tsx src/utils/levelValidator.ts`
 */
// Prüfe ob als Skript ausgeführt (nicht als importiertes Modul)
// In Node.js mit ESM: import.meta.url enthält die URL der aktuellen Datei
const currentFileUrl = import.meta.url;
const isMainModule = typeof process !== 'undefined' && 
                     process.argv.length > 1 &&
                     (process.argv[1]?.includes('levelValidator') || 
                      currentFileUrl.endsWith('levelValidator.ts'));

if (isMainModule) {
  const autoReposition = process.argv.includes('--auto-reposition');
  const verbose = process.argv.includes('--verbose');

  console.log('=== Level-Validierung: Gegner-Spawn-Sicherheit ===\n');
  
  if (autoReposition) {
    console.log('Automatische Repositionierung: AKTIVIERT\n');
  }

  const results = validateAllLevels(autoReposition);

  let totalViolations = 0;
  let totalValid = 0;
  let totalWarnings = 0;

  for (const result of results) {
    if (result.isValid) {
      totalValid++;
      if (verbose) {
        console.log(`✓ Level ${result.levelNumber}-Variant ${result.variantNumber}: Gültig`);
      }
    } else {
      totalViolations++;
      console.log(`✗ Level ${result.levelNumber}-Variant ${result.variantNumber}: ${result.violations.length} Verstöße`);
      
      for (const violation of result.violations) {
        console.log(`  - ${violation.reason}`);
        if (violation.suggestedPosition) {
          console.log(`    Vorschlag: x=${violation.suggestedPosition.x.toFixed(2)}, y=${violation.suggestedPosition.y.toFixed(2)}`);
        }
      }
    }

    if (result.warnings.length > 0) {
      totalWarnings += result.warnings.length;
      for (const warning of result.warnings) {
        console.log(`  ⚠ ${warning}`);
      }
    }
  }

  console.log('\n=== Zusammenfassung ===');
  console.log(`Gültige Level: ${totalValid}/${results.length}`);
  console.log(`Level mit Verstößen: ${totalViolations}/${results.length}`);
  console.log(`Gesamtwarnungen: ${totalWarnings}`);

  if (totalViolations === 0) {
    console.log('\n✓ Alle Level erfüllen die Sicherheitsregeln!');
    process.exit(0);
  } else {
    console.log('\n✗ Einige Level erfüllen die Sicherheitsregeln nicht.');
    console.log('Verwende --auto-reposition für automatische Repositionierung.');
    process.exit(1);
  }
}

