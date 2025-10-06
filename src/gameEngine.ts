import { type GameState, type Player, Difficulty, WeaponType, EnemyType, type Enemy, type Item, ItemType, type DecorativeObject, DecorativeObjectType } from './types.ts';
import { getTexture } from './textures.ts';
import { LEVEL_VARIANTS } from './levels.ts';
import { WEAPONS } from './weapons.ts';
import { soundSystem } from './soundSystem.ts';
import { loadMapHistory, saveMapHistory, selectMapVariant, recordMapPlay, getMap } from './mapSelectionSystem.ts';

export function createInitialPlayer(difficulty: Difficulty): Player {
  const maxHealthMap = {
    [Difficulty.EASY]: 150,
    [Difficulty.NORMAL]: 100,
    [Difficulty.HARD]: 75
  };

  const maxHealth = maxHealthMap[difficulty];

  return {
    x: 2,
    y: 2,
    direction: 0,
    health: maxHealth,
    maxHealth,
    currentWeapon: WeaponType.PISTOL,
    weapons: [WeaponType.KNIFE, WeaponType.PISTOL],
    ammo: {
      [WeaponType.KNIFE]: -1,
      [WeaponType.PISTOL]: 50,
      [WeaponType.MACHINE_PISTOL]: 0,
      [WeaponType.CHAINSAW]: -1,
      [WeaponType.ASSAULT_RIFLE]: 0,
      [WeaponType.HEAVY_MG]: 0
    },
    score: 0,
    collectedItems: {
      [ItemType.HEALTH_SMALL]: 0,
      [ItemType.HEALTH_LARGE]: 0,
      [ItemType.TREASURE]: 0,
      [ItemType.AMMO]: 0,
      [ItemType.WEAPON]: 0
    },
    killedEnemies: {
      [EnemyType.ZOMBIE]: 0,
      [EnemyType.MONSTER]: 0,
      [EnemyType.GHOST]: 0,
      [EnemyType.DOG]: 0
    }
  };
}

export function createInitialGameState(difficulty: Difficulty): GameState {
  const player = createInitialPlayer(difficulty);
  
  // Load map history and select variant for level 0
  const history = loadMapHistory();
  const variant = selectMapVariant(0, history);
  const level = getMap(0, variant, LEVEL_VARIANTS);
  
  // Record this map selection in history
  const updatedHistory = recordMapPlay(0, variant, history);
  saveMapHistory(updatedHistory);

  player.x = level.playerStartX;
  player.y = level.playerStartY;
  player.direction = level.playerStartDirection;

  const state = {
    player,
    currentLevel: 0,
    currentVariant: variant,
    difficulty,
    isPaused: false,
    isGameOver: false,
    enemies: JSON.parse(JSON.stringify(level.enemies)),
    items: JSON.parse(JSON.stringify(level.items)),
    currentMap: level,
    gameStartTime: Date.now()
  };
  state.enemies.forEach((enemy: Enemy) => {
    enemy.texture = getTexture(enemy.type);
    enemy.state = 'alive';
  });

  // Füge einen Hund hinzu
  const dog = createDog(state.currentMap.tiles);
  if (dog) {
    state.enemies.push(dog);
  }

  return state;
}

function findRandomValidPosition(tiles: number[][]): { x: number; y: number } | null {
  const freeTiles: { x: number; y: number }[] = [];
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      if (tiles[y][x] === 0) {
        freeTiles.push({ x, y });
      }
    }
  }

  if (freeTiles.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * freeTiles.length);
  return freeTiles[randomIndex];
}

function createDog(tiles: number[][]): Enemy | null {
  const position = findRandomValidPosition(tiles);
  if (!position) {
    return null;
  }

  return {
    id: `dog-${Date.now()}`,
    type: EnemyType.DOG,
    x: position.x,
    y: position.y,
    health: 50,
    maxHealth: 50,
    damage: 15,
    speed: 0.04,
    isAlive: true,
    direction: 0,
    lastAttackTime: 0,
    attackCooldown: 500,
    state: 'alive',
    texture: getTexture(EnemyType.DOG)
  };
}

export function checkCollision(x: number, y: number, tiles: number[][]): boolean {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);

  if (mapX < 0 || mapX >= tiles[0].length || mapY < 0 || mapY >= tiles.length) {
    return true;
  }

  return tiles[mapY][mapX] !== 0;
}

// Kollisionsradien für alle dekorativen Objekt-Typen
const DECORATIVE_OBJECT_COLLISION_RADII: Record<DecorativeObjectType, number> = {
  [DecorativeObjectType.CEILING_LIGHT]: 0, // Keine Kollision
  [DecorativeObjectType.VASE]: 0.25,
  [DecorativeObjectType.CRATE]: 0.35,
  [DecorativeObjectType.BENCH]: 0.4,
  [DecorativeObjectType.TABLE]: 0.45,
  [DecorativeObjectType.CHAIR]: 0.3,
  [DecorativeObjectType.WINE_BOTTLE]: 0.1,
  [DecorativeObjectType.SKELETON]: 0.2
};

// Optimized collision detection with early distance check
export function checkDecorativeObjectCollision(
  x: number,
  y: number,
  decorativeObjects: DecorativeObject[]
): boolean {
  // Early exit if no objects
  if (decorativeObjects.length === 0) {
    return false;
  }

  // Optimized: Only check objects within reasonable distance (3 units)
  const maxCheckDistance = 3;
  
  for (const obj of decorativeObjects) {
    // Verwende den Kollisionsradius aus dem Objekt oder den Standard-Radius
    const collisionRadius = obj.collisionRadius || DECORATIVE_OBJECT_COLLISION_RADII[obj.type];
    
    // Überspringe Objekte ohne Kollision
    if (collisionRadius === 0) {
      continue;
    }
    
    const dx = x - obj.x;
    const dy = y - obj.y;
    
    // Optimized: Quick distance check using squared distance to avoid sqrt
    const distanceSquared = dx * dx + dy * dy;
    const maxDistSquared = maxCheckDistance * maxCheckDistance;
    
    // Skip objects that are too far away
    if (distanceSquared > maxDistSquared) {
      continue;
    }
    
    // Only calculate sqrt for nearby objects
    const distance = Math.sqrt(distanceSquared);
    
    if (distance < collisionRadius) {
      return true; // Kollision erkannt
    }
  }
  return false;
}

export function movePlayer(
  player: Player,
  moveX: number,
  moveY: number,
  tiles: number[][],
  decorativeObjects: DecorativeObject[] = []
): Player {
  const newX = player.x + moveX;
  const newY = player.y + moveY;

  const collisionMargin = 0.2;
  
  // Während des Sprungs ignoriere Kollisionen mit dekorativen Objekten
  const ignoreDecorativeCollisions = player.isJumping || false;

  if (!checkCollision(newX, player.y, tiles) && (ignoreDecorativeCollisions || !checkDecorativeObjectCollision(newX, player.y, decorativeObjects))) {
    if (
      !checkCollision(newX, player.y + collisionMargin, tiles) &&
      !checkCollision(newX, player.y - collisionMargin, tiles) &&
      (ignoreDecorativeCollisions || (!checkDecorativeObjectCollision(newX, player.y + collisionMargin, decorativeObjects) &&
      !checkDecorativeObjectCollision(newX, player.y - collisionMargin, decorativeObjects)))
    ) {
      player.x = newX;
    }
  }

  if (!checkCollision(player.x, newY, tiles) && (ignoreDecorativeCollisions || !checkDecorativeObjectCollision(player.x, newY, decorativeObjects))) {
    if (
      !checkCollision(player.x + collisionMargin, newY, tiles) &&
      !checkCollision(player.x - collisionMargin, newY, tiles) &&
      (ignoreDecorativeCollisions || (!checkDecorativeObjectCollision(player.x + collisionMargin, newY, decorativeObjects) &&
      !checkDecorativeObjectCollision(player.x - collisionMargin, newY, decorativeObjects)))
    ) {
      player.y = newY;
    }
  }

  return player;
}

// Sprung-Funktion
export function startJump(player: Player): Player {
  // Nur springen wenn nicht bereits am Springen
  if (!player.isJumping) {
    return {
      ...player,
      isJumping: true,
      jumpStartTime: Date.now(),
      jumpDuration: 400 // 400ms Sprungdauer
    };
  }
  return player;
}

// Update Jump-Status
export function updateJump(player: Player): Player {
  if (player.isJumping && player.jumpStartTime && player.jumpDuration) {
    const elapsed = Date.now() - player.jumpStartTime;
    if (elapsed >= player.jumpDuration) {
      // Sprung beendet
      return {
        ...player,
        isJumping: false,
        jumpStartTime: undefined,
        jumpDuration: undefined
      };
    }
  }
  return player;
}

export function rotatePlayer(player: Player, rotation: number): Player {
  player.direction += rotation;
  return player;
}

// Hilfsfunktion für Gegner-Türinteraktion
function tryOpenDoorForEnemy(enemy: Enemy, tiles: number[][], targetX: number, targetY: number): { tiles: number[][]; doorOpened: boolean } {
  const mapX = Math.floor(targetX);
  const mapY = Math.floor(targetY);

  // Prüfe ob es eine normale Tür ist (Wert 2)
  if (
    mapX >= 0 &&
    mapX < tiles[0].length &&
    mapY >= 0 &&
    mapY < tiles.length &&
    tiles[mapY][mapX] === 2
  ) {
    // Hunde können keine Türen öffnen
    if (enemy.type === EnemyType.DOG) {
      return { tiles, doorOpened: false };
    }

    // Erstelle eine tiefe Kopie der tiles-Array
    const tilesCopy = tiles.map(row => [...row]);
    
    // Öffne die Tür (setze auf 0)
    tilesCopy[mapY][mapX] = 0;
    
    // Spiele Türöffnungsgeräusch ab (3D-positioniert)
    soundSystem.play3dSound(
      { x: enemy.x, y: enemy.y },
      { x: targetX, y: targetY },
      () => soundSystem.playDoorOpen()
    );
    
    return { tiles: tilesCopy, doorOpened: true };
  }

  // Exit-Türen (Wert 3) können von Gegnern nicht geöffnet werden
  return { tiles, doorOpened: false };
}

// Verbesserte Pathfinding-Funktion für Gegner
function findPathToPlayer(enemy: Enemy, player: Player, tiles: number[][], decorativeObjects: DecorativeObject[] = []): { moveX: number; moveY: number; tilesUpdated?: number[][] } {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 0.1) {
    return { moveX: 0, moveY: 0 };
  }

  // Normalisierte Bewegungsrichtung
  const dirX = dx / distance;
  const dirY = dy / distance;
  
  const speed = enemy.speed;
  let moveX = dirX * speed;
  let moveY = dirY * speed;

  // Teste Bewegung in X-Richtung
  const newX = enemy.x + moveX;
  if (checkCollision(newX, enemy.y, tiles) || checkDecorativeObjectCollision(newX, enemy.y, decorativeObjects)) {
    // Prüfe ob es eine Tür ist, die geöffnet werden kann (nur bei Wand-Kollision)
    if (checkCollision(newX, enemy.y, tiles)) {
      const doorResult = tryOpenDoorForEnemy(enemy, tiles, newX, enemy.y);
      if (doorResult.doorOpened) {
        return { moveX, moveY: 0, tilesUpdated: doorResult.tiles };
      }
    }
    moveX = 0; // Blockiert, keine Bewegung in X
  }

  // Teste Bewegung in Y-Richtung
  const newY = enemy.y + moveY;
  if (checkCollision(enemy.x, newY, tiles) || checkDecorativeObjectCollision(enemy.x, newY, decorativeObjects)) {
    // Prüfe ob es eine Tür ist, die geöffnet werden kann (nur bei Wand-Kollision)
    if (checkCollision(enemy.x, newY, tiles)) {
      const doorResult = tryOpenDoorForEnemy(enemy, tiles, enemy.x, newY);
      if (doorResult.doorOpened) {
        return { moveX: 0, moveY, tilesUpdated: doorResult.tiles };
      }
    }
    moveY = 0; // Blockiert, keine Bewegung in Y
  }

  // Falls beide Richtungen blockiert sind, versuche Ausweichmanöver
  if (moveX === 0 && moveY === 0) {
    // Versuche seitliche Bewegung
    const sideX = -dirY * speed * 0.5; // Senkrecht zur Hauptrichtung
    const sideY = dirX * speed * 0.5;
    
    if (!checkCollision(enemy.x + sideX, enemy.y, tiles) && !checkDecorativeObjectCollision(enemy.x + sideX, enemy.y, decorativeObjects)) {
      moveX = sideX;
    } else if (!checkCollision(enemy.x - sideX, enemy.y, tiles) && !checkDecorativeObjectCollision(enemy.x - sideX, enemy.y, decorativeObjects)) {
      moveX = -sideX;
    }
    
    if (!checkCollision(enemy.x, enemy.y + sideY, tiles) && !checkDecorativeObjectCollision(enemy.x, enemy.y + sideY, decorativeObjects)) {
      moveY = sideY;
    } else if (!checkCollision(enemy.x, enemy.y - sideY, tiles) && !checkDecorativeObjectCollision(enemy.x, enemy.y - sideY, decorativeObjects)) {
      moveY = -sideY;
    }
  }

  return { moveX, moveY };
}

export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  tiles: number[][],
  deltaTime: number,
  difficulty: Difficulty,
  decorativeObjects: DecorativeObject[] = []
): { enemies: Enemy[]; player: Player; tilesUpdated?: number[][] } {
  const difficultyMultiplier = {
    [Difficulty.EASY]: 0.7,
    [Difficulty.NORMAL]: 1.0,
    [Difficulty.HARD]: 1.5
  };

  const multiplier = difficultyMultiplier[difficulty];
  let updatedTiles = tiles;

  enemies.forEach((enemy) => {
    // Animation vom Sterben zum toten Zustand
    if (enemy.state === 'dying') {
      const DEATH_ANIMATION_TIME = 500; // 0.5 Sekunden
      if (Date.now() - (enemy.timeOfDeath || 0) > DEATH_ANIMATION_TIME) {
        enemy.state = 'dead';
      }
      return; // Keine weitere Logik für sterbende Gegner
    }

    if (enemy.state !== 'alive') return;

    // Bell-Sound für den Hund
    if (enemy.type === EnemyType.DOG) {
      if (Math.random() < 0.01) {
        soundSystem.play3dSound({ x: enemy.x, y: enemy.y }, { x: player.x, y: player.y }, () => {
          soundSystem.playDogBark();
        });
      }
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 15 && distance > 0.1) {
      // Verwende verbesserte Pathfinding mit dekorativen Objekten
      const pathResult = findPathToPlayer(enemy, player, updatedTiles, decorativeObjects);
      
      // Wenn eine Tür geöffnet wurde, aktualisiere die Karte
      if (pathResult.tilesUpdated) {
        updatedTiles = pathResult.tilesUpdated;
      }
      
      // Bewege den Gegner
      const moveX = pathResult.moveX * multiplier * deltaTime;
      const moveY = pathResult.moveY * multiplier * deltaTime;

      if (moveX !== 0 && !checkCollision(enemy.x + moveX, enemy.y, updatedTiles) && !checkDecorativeObjectCollision(enemy.x + moveX, enemy.y, decorativeObjects)) {
        enemy.x += moveX;
      }
      if (moveY !== 0 && !checkCollision(enemy.x, enemy.y + moveY, updatedTiles) && !checkDecorativeObjectCollision(enemy.x, enemy.y + moveY, decorativeObjects)) {
        enemy.y += moveY;
      }

      enemy.direction = Math.atan2(dy, dx);
    }

    // Angriff wenn nah genug
    if (distance < 1.5 && distance > 0.1) {
      const now = Date.now();
      if (now - enemy.lastAttackTime > enemy.attackCooldown) {
        player.health -= enemy.damage * multiplier;
        enemy.lastAttackTime = now;
      }
    }
  });

  return { enemies, player, tilesUpdated: updatedTiles !== tiles ? updatedTiles : undefined };
}

export function fireWeapon(
  player: Player,
  enemies: Enemy[],
  playerDirX: number,
  playerDirY: number
): { player: Player; enemies: Enemy[]; hit: boolean; enemyHit?: Enemy; outOfAmmo?: boolean } {
  const weapon = WEAPONS[player.currentWeapon];

  if (weapon.needsAmmo && player.ammo[player.currentWeapon] <= 0) {
    return { player, enemies, hit: false, outOfAmmo: true };
  }

  if (weapon.needsAmmo) {
    player.ammo[player.currentWeapon]--;
  }

  // Suche nach Gegner in Schussrichtung
  let closestEnemy: Enemy | null = null;
  let closestDistance = weapon.range;

  for (const enemy of enemies) {
    if (enemy.state !== 'alive') continue;

    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > weapon.range || distance < 0.1) continue;

    // Prüfe ob Gegner in Schussrichtung
    const enemyDirX = dx / distance;
    const enemyDirY = dy / distance;

    const dotProduct = playerDirX * enemyDirX + playerDirY * enemyDirY;

    if (dotProduct > 0.9 && distance < closestDistance) {
      closestEnemy = enemy;
      closestDistance = distance;
    }
  }

  if (closestEnemy) {
    closestEnemy.health -= weapon.damage;
    if (closestEnemy.health <= 0) {
      closestEnemy.state = 'dying';
      closestEnemy.timeOfDeath = Date.now();
      player.score += 100;
      // Statistiken aktualisieren
      player.killedEnemies[closestEnemy.type]++;
    }
    return { player, enemies, hit: true, enemyHit: closestEnemy, outOfAmmo: false };
  }

  return { player, enemies, hit: false, outOfAmmo: false };
}

export function collectItem(player: Player, items: Item[]): { player: Player; notification?: string } {
  let notification: string | undefined;

  items.forEach((item) => {
    if (item.collected) return;

    const dx = item.x - player.x;
    const dy = item.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.7) {
      item.collected = true;

      // Statistiken aktualisieren
      player.collectedItems[item.type]++;

      let itemMessage = '';
      switch (item.type) {
        case ItemType.HEALTH_SMALL:
          player.health = Math.min(player.health + (item.value || 25), player.maxHealth);
          itemMessage = `Kleine Heilung (+${item.value || 25} HP)`;
          break;
        case ItemType.HEALTH_LARGE:
          player.health = Math.min(player.health + (item.value || 50), player.maxHealth);
          itemMessage = `Große Heilung (+${item.value || 50} HP)`;
          break;
        case ItemType.TREASURE:
          player.score += item.value || 0;
          itemMessage = `Schatz (+${item.value || 0} Punkte)`;
          break;
        case ItemType.AMMO:
          Object.keys(player.ammo).forEach((key) => {
            const weaponType = key as WeaponType;
            if (WEAPONS[weaponType].needsAmmo) {
              player.ammo[weaponType] += item.value || 30;
            }
          });
          itemMessage = `Munition (+${item.value || 30})`;
          break;
        case ItemType.WEAPON:
          if (item.weaponType && !player.weapons.includes(item.weaponType)) {
            player.weapons.push(item.weaponType);
            player.ammo[item.weaponType] = WEAPONS[item.weaponType].ammo;
            itemMessage = `${WEAPONS[item.weaponType!].name} gefunden!`;
          } else {
            // Waffe bereits vorhanden - gebe stattdessen Munition
            Object.keys(player.ammo).forEach((key) => {
              const weaponType = key as WeaponType;
              if (WEAPONS[weaponType].needsAmmo) {
                player.ammo[weaponType] += 30;
              }
            });
            itemMessage = 'Waffe bereits vorhanden - Munition erhalten (+30)';
          }
          break;
      }

      notification = itemMessage;
    }
  });

  return { player, notification };
}

export function checkLevelComplete(enemies: Enemy[]): boolean {
  return enemies.every((enemy) => enemy.state !== 'alive');
}

export function loadNextLevel(gameState: GameState): GameState {
  const maxLevel = Math.max(...Object.keys(LEVEL_VARIANTS).map(Number));
  if (gameState.currentLevel >= maxLevel - 1) {
    // Spiel gewonnen!
    return gameState;
  }

  const nextLevel = gameState.currentLevel + 1;
  
  // Load map history and select variant for next level
  const history = loadMapHistory();
  const variant = selectMapVariant(nextLevel, history);
  const level = getMap(nextLevel, variant, LEVEL_VARIANTS);
  
  // Record this map selection in history
  const updatedHistory = recordMapPlay(nextLevel, variant, history);
  saveMapHistory(updatedHistory);

  gameState.currentLevel = nextLevel;
  gameState.currentVariant = variant;
  gameState.currentMap = level;
  gameState.enemies = JSON.parse(JSON.stringify(level.enemies));

  // Füge einen Hund hinzu
  const dog = createDog(gameState.currentMap.tiles);
  if (dog) {
    gameState.enemies.push(dog);
  }

  gameState.enemies.forEach((enemy: Enemy) => {
    enemy.texture = getTexture(enemy.type);
    enemy.state = 'alive';
  });
  gameState.items = JSON.parse(JSON.stringify(level.items));
  gameState.player.x = level.playerStartX;
  gameState.player.y = level.playerStartY;
  gameState.player.direction = level.playerStartDirection;

  // Gebe dem Spieler 25 HP für das Erreichen des nächsten Levels
  gameState.player.health = Math.min(gameState.player.health + 25, gameState.player.maxHealth);

  // Benachrichtigung zurücksetzen
  delete gameState.lastItemNotification;

  return gameState;
}

export function openDoor(player: Player, tiles: number[][], enemies: Enemy[]): { tiles: number[][]; doorOpened: boolean; isExitDoor?: boolean } {
  const dirX = Math.cos(player.direction);
  const dirY = Math.sin(player.direction);

  // Erstelle eine tiefe Kopie der tiles-Array für sichere Modifikation
  const tilesCopy = tiles.map(row => [...row]);

  // Prüfe mehrere Positionen vor dem Spieler für bessere Tür-Erkennung
  const checkDistance = 1.8; // Optimaler Abstand für Tür-Erkennung
  const checkPositions = [
    { x: player.x + dirX * checkDistance, y: player.y + dirY * checkDistance }, // Direkt vor dem Spieler
    { x: player.x + dirX * checkDistance * 0.8, y: player.y + dirY * checkDistance * 0.8 }, // Etwas näher
  ];

  // Zusätzlich prüfe seitlich versetzt (für breitere Tür-Erkennung)
  const perpDirX = Math.cos(player.direction + Math.PI / 2) * 0.25;
  const perpDirY = Math.sin(player.direction + Math.PI / 2) * 0.25;

  checkPositions.push(
    { x: player.x + dirX * checkDistance + perpDirX, y: player.y + dirY * checkDistance + perpDirY },
    { x: player.x + dirX * checkDistance - perpDirX, y: player.y + dirY * checkDistance - perpDirY }
  );

  for (const pos of checkPositions) {
    const mapX = Math.floor(pos.x);
    const mapY = Math.floor(pos.y);

    // Debug-Ausgabe für Tür-Erkennung (kann später entfernt werden)
    console.log(`Tür-Prüfung bei (${mapX}, ${mapY}): Wert = ${tilesCopy[mapY]?.[mapX] || 'undefined'}`);

    // Prüfe ob es eine normale Tür ist (Wert 2)
    if (
      mapX >= 0 &&
      mapX < tilesCopy[0].length &&
      mapY >= 0 &&
      mapY < tilesCopy.length &&
      tilesCopy[mapY][mapX] === 2
    ) {
      // Öffne die Tür (setze auf 0)
      tilesCopy[mapY][mapX] = 0;
      return { tiles: tilesCopy, doorOpened: true };
    }

    // Prüfe ob es eine Exit-Tür ist (Wert 3)
    if (
      mapX >= 0 &&
      mapX < tilesCopy[0].length &&
      mapY >= 0 &&
      mapY < tilesCopy.length &&
      tilesCopy[mapY][mapX] === 3
    ) {
      // Prüfe ob alle Gegner tot sind
      const allEnemiesDead = enemies.every(enemy => enemy.state !== 'alive');
      const aliveEnemies = enemies.filter(enemy => enemy.state === 'alive');

      console.log(`Exit-Tür gefunden bei (${mapX}, ${mapY})`);
      console.log(`Alle Gegner tot? ${allEnemiesDead}`);
      console.log(`Lebende Gegner: ${aliveEnemies.length}`);

      if (allEnemiesDead) {
        console.log('Exit-Tür wird geöffnet!');
        // Die Tür wird NICHT mehr hier entfernt.
        // Stattdessen signalisieren wir nur, dass sie geöffnet werden kann.
        return { tiles: tiles, doorOpened: true, isExitDoor: true };
      } else {
        console.log('Exit-Tür kann nicht geöffnet werden - Gegner leben noch');
        // Bei Exit-Türen: Wenn nicht alle Gegner tot sind, Tür NICHT öffnen aber auch nicht verschwinden lassen
        return { tiles: tiles, doorOpened: false };
      }
    }
  }

  return { tiles: tiles, doorOpened: false };
}
