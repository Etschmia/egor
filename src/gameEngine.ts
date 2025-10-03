import { type GameState, type Player, Difficulty, WeaponType, EnemyType, type Enemy, type Item, ItemType } from './types.ts';
import { LEVELS } from './levels.ts';
import { WEAPONS } from './weapons.ts';

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
      [EnemyType.GHOST]: 0
    }
  };
}

export function createInitialGameState(difficulty: Difficulty): GameState {
  const player = createInitialPlayer(difficulty);
  const level = LEVELS[0];

  player.x = level.playerStartX;
  player.y = level.playerStartY;
  player.direction = level.playerStartDirection;

  return {
    player,
    currentLevel: 0,
    difficulty,
    isPaused: false,
    isGameOver: false,
    enemies: JSON.parse(JSON.stringify(level.enemies)),
    items: JSON.parse(JSON.stringify(level.items)),
    currentMap: level,
    gameStartTime: Date.now()
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

export function movePlayer(
  player: Player,
  moveX: number,
  moveY: number,
  tiles: number[][]
): Player {
  const newX = player.x + moveX;
  const newY = player.y + moveY;

  const collisionMargin = 0.2;

  if (!checkCollision(newX, player.y, tiles)) {
    if (
      !checkCollision(newX, player.y + collisionMargin, tiles) &&
      !checkCollision(newX, player.y - collisionMargin, tiles)
    ) {
      player.x = newX;
    }
  }

  if (!checkCollision(player.x, newY, tiles)) {
    if (
      !checkCollision(player.x + collisionMargin, newY, tiles) &&
      !checkCollision(player.x - collisionMargin, newY, tiles)
    ) {
      player.y = newY;
    }
  }

  return player;
}

export function rotatePlayer(player: Player, rotation: number): Player {
  player.direction += rotation;
  return player;
}

export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  tiles: number[][],
  deltaTime: number,
  difficulty: Difficulty
): { enemies: Enemy[]; player: Player } {
  const difficultyMultiplier = {
    [Difficulty.EASY]: 0.7,
    [Difficulty.NORMAL]: 1.0,
    [Difficulty.HARD]: 1.5
  };

  const multiplier = difficultyMultiplier[difficulty];

  enemies.forEach((enemy) => {
    if (!enemy.isAlive) return;

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 15) {
      const moveX = (dx / distance) * enemy.speed * multiplier * deltaTime;
      const moveY = (dy / distance) * enemy.speed * multiplier * deltaTime;

      const newX = enemy.x + moveX;
      const newY = enemy.y + moveY;

      if (!checkCollision(newX, enemy.y, tiles)) {
        enemy.x = newX;
      }
      if (!checkCollision(enemy.x, newY, tiles)) {
        enemy.y = newY;
      }

      enemy.direction = Math.atan2(dy, dx);

      // Angriff wenn nah genug
      if (distance < 1.5) {
        const now = Date.now();
        if (now - enemy.lastAttackTime > enemy.attackCooldown) {
          player.health -= enemy.damage * multiplier;
          enemy.lastAttackTime = now;
        }
      }
    }
  });

  return { enemies, player };
}

export function fireWeapon(
  player: Player,
  enemies: Enemy[],
  playerDirX: number,
  playerDirY: number
): { player: Player; enemies: Enemy[]; hit: boolean; enemyHit?: Enemy } {
  const weapon = WEAPONS[player.currentWeapon];

  if (weapon.needsAmmo && player.ammo[player.currentWeapon] <= 0) {
    return { player, enemies, hit: false };
  }

  if (weapon.needsAmmo) {
    player.ammo[player.currentWeapon]--;
  }

  // Suche nach Gegner in Schussrichtung
  let closestEnemy: Enemy | null = null;
  let closestDistance = weapon.range;

  enemies.forEach((enemy) => {
    if (!enemy.isAlive) return;

    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > weapon.range) return;

    // Prüfe ob Gegner in Schussrichtung
    const enemyDirX = dx / distance;
    const enemyDirY = dy / distance;

    const dotProduct = playerDirX * enemyDirX + playerDirY * enemyDirY;

    if (dotProduct > 0.9 && distance < closestDistance) {
      closestEnemy = enemy;
      closestDistance = distance;
    }
  });

  if (closestEnemy) {
    closestEnemy.health -= weapon.damage;
    if (closestEnemy.health <= 0) {
      closestEnemy.isAlive = false;
      player.score += 100;
      // Statistiken aktualisieren
      player.killedEnemies[closestEnemy.type]++;
    }
    return { player, enemies, hit: true, enemyHit: closestEnemy };
  }

  return { player, enemies, hit: false };
}

export function collectItem(player: Player, items: Item[], gameState?: GameState): { player: Player; notification?: string } {
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
            itemMessage = 'Waffe bereits vorhanden';
          }
          break;
      }

      notification = itemMessage;
    }
  });

  return { player, notification };
}

export function checkLevelComplete(enemies: Enemy[]): boolean {
  return enemies.every((enemy) => !enemy.isAlive);
}

export function loadNextLevel(gameState: GameState): GameState {
  if (gameState.currentLevel >= LEVELS.length - 1) {
    // Spiel gewonnen!
    return gameState;
  }

  const nextLevel = gameState.currentLevel + 1;
  const level = LEVELS[nextLevel];

  gameState.currentLevel = nextLevel;
  gameState.currentMap = level;
  gameState.enemies = JSON.parse(JSON.stringify(level.enemies));
  gameState.items = JSON.parse(JSON.stringify(level.items));
  gameState.player.x = level.playerStartX;
  gameState.player.y = level.playerStartY;
  gameState.player.direction = level.playerStartDirection;

  // Benachrichtigung zurücksetzen
  delete gameState.lastItemNotification;

  return gameState;
}

export function openDoor(player: Player, tiles: number[][], enemies: Enemy[]): { tiles: number[][]; doorOpened: boolean; isExitDoor?: boolean } {
  const dirX = Math.cos(player.direction);
  const dirY = Math.sin(player.direction);

  // Prüfe Position direkt vor dem Spieler (größerer Radius für bessere Erkennung)
  const checkDistance = 2.0;
  const checkX = player.x + dirX * checkDistance;
  const checkY = player.y + dirY * checkDistance;

  const mapX = Math.floor(checkX);
  const mapY = Math.floor(checkY);

  // Debug-Ausgabe für Tür-Erkennung (kann später entfernt werden)
  console.log(`Tür-Prüfung bei (${mapX}, ${mapY}): Wert = ${tiles[mapY]?.[mapX] || 'undefined'}`);

  // Prüfe ob es eine normale Tür ist (Wert 2)
  if (
    mapX >= 0 &&
    mapX < tiles[0].length &&
    mapY >= 0 &&
    mapY < tiles.length &&
    tiles[mapY][mapX] === 2
  ) {
    // Öffne die Tür (setze auf 0)
    tiles[mapY][mapX] = 0;
    return { tiles, doorOpened: true };
  }

  // Prüfe ob es eine Exit-Tür ist (Wert 3)
  if (
    mapX >= 0 &&
    mapX < tiles[0].length &&
    mapY >= 0 &&
    mapY < tiles.length &&
    tiles[mapY][mapX] === 3
  ) {
    // Prüfe ob alle Gegner tot sind
    const allEnemiesDead = enemies.every(enemy => !enemy.isAlive);
    const aliveEnemies = enemies.filter(enemy => enemy.isAlive);

    console.log(`Exit-Tür gefunden bei (${mapX}, ${mapY})`);
    console.log(`Alle Gegner tot? ${allEnemiesDead}`);
    console.log(`Lebende Gegner: ${aliveEnemies.length}`);

    if (allEnemiesDead) {
      console.log('Exit-Tür wird geöffnet!');
      // Exit-Tür öffnen (setze auf 0)
      tiles[mapY][mapX] = 0;
      return { tiles, doorOpened: true, isExitDoor: true };
    } else {
      console.log('Exit-Tür kann noch nicht geöffnet werden - Gegner leben noch');
      // Exit-Tür kann noch nicht geöffnet werden
      return { tiles, doorOpened: false };
    }
  }

  return { tiles, doorOpened: false };
}
