import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import type { GameState, WallPicture } from './types.ts';
import { Difficulty, WeaponType, WallPictureType } from './types.ts';
import {
  createInitialGameState,
  movePlayer,
  rotatePlayer,
  updateEnemies,
  fireWeapon,
  collectItem,
  checkLevelComplete,
  loadNextLevel,
  openDoor
} from './gameEngine.ts';
import { castRay, getSpritesToRender } from './raycasting.ts';
import { WEAPONS } from './weapons.ts';
import { saveGame, loadGame, getAllSaveGames, deleteSaveGame } from './saveLoadSystem.ts';
import { soundSystem } from './soundSystem.ts';

type GameMode = 'menu' | 'playing' | 'paused' | 'help' | 'save' | 'load' | 'difficulty' | 'levelComplete';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [saveName, setSaveName] = useState('spielstand1');
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());
  const lastFireTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState | null>(null);
  const gameModeRef = useRef<GameMode>('menu');

  const screenWidth = 800;
  const screenHeight = 600;

  // Synchronisiere Refs mit State
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  // Initialisiere Spiel mit gewähltem Schwierigkeitsgrad
  const startNewGame = (difficulty: Difficulty) => {
    const newGameState = createInitialGameState(difficulty);
    setGameState(newGameState);
    setGameMode('playing');
    soundSystem.playMenuSelect();
  };

  // Speichern
  const handleSaveGame = () => {
    if (gameState && saveName.trim()) {
      const success = saveGame(gameState, saveName.trim());
      if (success) {
        alert(`Spielstand "${saveName}" wurde gespeichert!`);
        setGameMode('playing');
        soundSystem.playPickup();
      } else {
        alert('Fehler beim Speichern!');
      }
    }
  };

  // Laden
  const handleLoadGame = (name: string) => {
    const loadedState = loadGame(name);
    if (loadedState) {
      setGameState(loadedState);
      setGameMode('playing');
      soundSystem.playPickup();
    } else {
      alert('Fehler beim Laden!');
    }
  };

  // Nächstes Level laden
  const handleContinueToNextLevel = () => {
    if (gameState) {
      const newState = loadNextLevel(gameState);
      newState.isPaused = false;
      setGameState(newState);
      setGameMode('playing');
      soundSystem.playMenuSelect();
    }
  };

  // Tastatur-Eingaben
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));

      // Spezielle Tasten
      if (e.key.toLowerCase() === 'h') {
        setGameMode((prev) => (prev === 'help' ? 'playing' : 'help'));
        soundSystem.playMenuSelect();
      } else if (e.key.toLowerCase() === 'm') {
        setGameMode((prev) => prev === 'playing' ? 'save' : prev);
        soundSystem.playMenuSelect();
      } else if (e.key.toLowerCase() === 'l') {
        setGameMode((prev) => prev === 'playing' ? 'load' : prev);
        soundSystem.playMenuSelect();
      } else if (e.key.toLowerCase() === 'p') {
        setGameMode((prev) => {
          if (prev === 'playing') {
            setGameState((state) => state ? { ...state, isPaused: !state.isPaused } : state);
          }
          return prev;
        });
      } else if (e.key === 'Escape') {
        setGameMode((prev) => prev !== 'menu' ? 'playing' : prev);
      } else if (e.key.toLowerCase() === 'e') {
        // Tür öffnen
        setGameState((prev) => {
          if (prev && gameMode === 'playing' && !prev.isPaused) {
            const result = openDoor(prev.player, prev.currentMap.tiles);
            if (result.doorOpened) {
              soundSystem.playDoorOpen();
              return {
                ...prev,
                currentMap: {
                  ...prev.currentMap,
                  tiles: result.tiles
                }
              };
            }
          }
          return prev;
        });
      }

      // Waffen wechseln (1-6)
      const weaponKeys = ['1', '2', '3', '4', '5', '6'];
      const keyIndex = weaponKeys.indexOf(e.key);
      if (keyIndex >= 0) {
        const weaponTypes = [
          WeaponType.KNIFE,
          WeaponType.PISTOL,
          WeaponType.MACHINE_PISTOL,
          WeaponType.CHAINSAW,
          WeaponType.ASSAULT_RIFLE,
          WeaponType.HEAVY_MG
        ];
        const selectedWeapon = weaponTypes[keyIndex];
        setGameState((prev) => {
          if (prev && prev.player.weapons.includes(selectedWeapon)) {
            return { ...prev, player: { ...prev.player, currentWeapon: selectedWeapon } };
          }
          return prev;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameMode]);

  // Spiel-Loop
  const gameLoop = useCallback(() => {
    const gameState = gameStateRef.current;
    const gameMode = gameModeRef.current;
    
    if (!gameState || gameMode !== 'playing' || gameState.isPaused || gameState.isGameOver) {
      return;
    }

    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 16.67; // Normalisiert auf 60 FPS
    lastTimeRef.current = now;

    let newState = { ...gameState };

    // Bewegung
    const moveSpeed = 0.05 * deltaTime;
    const rotSpeed = 0.03 * deltaTime;

    const dirX = Math.cos(newState.player.direction);
    const dirY = Math.sin(newState.player.direction);
    const planeX = Math.cos(newState.player.direction + Math.PI / 2) * 0.66;
    const planeY = Math.sin(newState.player.direction + Math.PI / 2) * 0.66;

    if (keys['w'] || keys['arrowup']) {
      newState.player = movePlayer(
        newState.player,
        dirX * moveSpeed,
        dirY * moveSpeed,
        newState.currentMap.tiles
      );
    }
    if (keys['s'] || keys['arrowdown']) {
      newState.player = movePlayer(
        newState.player,
        -dirX * moveSpeed,
        -dirY * moveSpeed,
        newState.currentMap.tiles
      );
    }
    if (keys['a']) {
      newState.player = movePlayer(
        newState.player,
        -planeX * moveSpeed,
        -planeY * moveSpeed,
        newState.currentMap.tiles
      );
    }
    if (keys['d']) {
      newState.player = movePlayer(
        newState.player,
        planeX * moveSpeed,
        planeY * moveSpeed,
        newState.currentMap.tiles
      );
    }
    if (keys['arrowleft']) {
      newState.player = rotatePlayer(newState.player, -rotSpeed);
    }
    if (keys['arrowright']) {
      newState.player = rotatePlayer(newState.player, rotSpeed);
    }

    // Schießen
    if (keys[' ']) {
      const weapon = WEAPONS[newState.player.currentWeapon];
      const fireInterval = 1000 / weapon.fireRate;

      if (now - lastFireTimeRef.current > fireInterval) {
        const result = fireWeapon(newState.player, newState.enemies, dirX, dirY);
        newState.player = result.player;
        newState.enemies = result.enemies;
        lastFireTimeRef.current = now;

        // Sound abspielen
        if (weapon.type === WeaponType.KNIFE) {
          soundSystem.playKnifeAttack();
        } else if (weapon.type === WeaponType.CHAINSAW) {
          soundSystem.playChainsawAttack();
        } else {
          soundSystem.playShoot();
        }

        if (result.hit) {
          soundSystem.playEnemyHit();
          if (result.enemyHit && !result.enemyHit.isAlive) {
            soundSystem.playEnemyDeath();
          }
        }
      }
    }

    // Gegner-Update
    const enemyUpdate = updateEnemies(
      newState.enemies,
      newState.player,
      newState.currentMap.tiles,
      deltaTime,
      newState.difficulty
    );
    newState.enemies = enemyUpdate.enemies;
    
    // Prüfe ob Spieler Schaden genommen hat
    if (enemyUpdate.player.health < newState.player.health) {
      soundSystem.playPlayerHit();
    }
    newState.player = enemyUpdate.player;

    // Items sammeln
    newState.player = collectItem(newState.player, newState.items);

    // Level-Check
    if (checkLevelComplete(newState.enemies)) {
      if (newState.currentLevel < 4) {
        soundSystem.playLevelComplete();
        setGameMode('levelComplete');
        newState.isPaused = true;
      }
    }

    // Game Over?
    if (newState.player.health <= 0) {
      newState.isGameOver = true;
      soundSystem.playGameOver();
    }

    setGameState(newState);
  }, [keys]);

  // Hilfsfunktion zum Prüfen, ob auf einer Wand ein Bild ist
  const findWallPicture = (hitX: number, hitY: number, side: number, wallX: number, pictures: WallPicture[]) => {
    return pictures.find(pic => {
      if (pic.x !== hitX || pic.y !== hitY || pic.side !== side) {
        return false;
      }
      // Prüfe ob die wallX Position nahe am offset des Bildes ist
      const tolerance = 0.15; // Bildbreite
      return Math.abs(wallX - pic.offset) < tolerance;
    });
  };

  // Rendering
  const render = useCallback(() => {
    const gameState = gameStateRef.current;
    const gameMode = gameModeRef.current;
    
    if (!canvasRef.current || !gameState || gameMode !== 'playing') {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Himmel und Boden
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height / 2);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, height / 2, width, height / 2);

    const player = gameState.player;
    const dirX = Math.cos(player.direction);
    const dirY = Math.sin(player.direction);
    const planeX = Math.cos(player.direction + Math.PI / 2) * 0.66;
    const planeY = Math.sin(player.direction + Math.PI / 2) * 0.66;

    const zBuffer: number[] = [];

    // Wände rendern
    for (let x = 0; x < width; x++) {
      const cameraX = (2 * x) / width - 1;
      const rayDirX = dirX + planeX * cameraX;
      const rayDirY = dirY + planeY * cameraX;

      const result = castRay(player.x, player.y, rayDirX, rayDirY, gameState.currentMap);

      zBuffer[x] = result.distance;

      const lineHeight = height / result.distance;
      const drawStart = Math.max(0, -lineHeight / 2 + height / 2);
      const drawEnd = Math.min(height, lineHeight / 2 + height / 2);

      // Berechne Position auf der Wand (0.0 bis 1.0)
      let wallX: number;
      if (result.side === 0) {
        wallX = player.y + result.distance * rayDirY;
      } else {
        wallX = player.x + result.distance * rayDirX;
      }
      wallX -= Math.floor(wallX);

      // Wandfarbe basierend auf Typ und Seite
      let color = result.wallType === 2 ? '#654321' : '#888';
      if (result.side === 1) {
        color = result.wallType === 2 ? '#543210' : '#666';
      }

      // Prüfe ob ein Bild an dieser Wand ist
      const picture = findWallPicture(result.hitX, result.hitY, result.side, wallX, gameState.currentMap.wallPictures);

      // Schatten basierend auf Entfernung
      const brightness = Math.max(0.3, 1 - result.distance / 20);
      
      if (picture && result.distance < 15) {
        // Rendere Bild
        const pictureHeight = lineHeight * 0.5; // Bild nimmt 50% der Wandhöhe ein
        const pictureWidth = pictureHeight * (picture.type === WallPictureType.LANDSCAPE ? 1.5 : 0.7);
        
        const pictureDrawStart = height / 2 - pictureHeight / 2;
        const pictureDrawEnd = height / 2 + pictureHeight / 2;

        // Prüfe ob wir im Bild-Bereich sind
        const distFromCenter = Math.abs(wallX - picture.offset);
        const pictureWidthNormalized = 0.15; // Bildbreite auf der Wand
        
        if (distFromCenter < pictureWidthNormalized) {
          // Zeichne erst die Wand
          ctx.fillStyle = color;
          ctx.globalAlpha = brightness;
          ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
          
          // Dann das Bild darüber
          let pictureColor: string;
          switch (picture.type) {
            case WallPictureType.PORTRAIT:
              pictureColor = '#c4a060'; // Goldener Rahmen
              break;
            case WallPictureType.LANDSCAPE:
              pictureColor = '#6090c4'; // Blau
              break;
            case WallPictureType.ABSTRACT:
              pictureColor = '#c46090'; // Pink/Lila
              break;
          }
          
          ctx.fillStyle = pictureColor;
          ctx.globalAlpha = brightness * 0.9;
          ctx.fillRect(x, pictureDrawStart, 1, pictureDrawEnd - pictureDrawStart);
          
          // Rahmen
          if (Math.random() < 0.3) { // Nur bei einigen Stripes für Rahmen-Effekt
            ctx.fillStyle = '#333';
            ctx.globalAlpha = brightness;
            ctx.fillRect(x, pictureDrawStart, 1, 2);
            ctx.fillRect(x, pictureDrawEnd - 2, 1, 2);
          }
        } else {
          // Normale Wand
          ctx.fillStyle = color;
          ctx.globalAlpha = brightness;
          ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
      } else {
        // Normale Wand ohne Bild
        ctx.fillStyle = color;
        ctx.globalAlpha = brightness;
        ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
      }
      
      ctx.globalAlpha = 1;
    }

    // Sprites (Gegner und Items) rendern
    const sprites = getSpritesToRender(
      player.x,
      player.y,
      dirX,
      dirY,
      planeX,
      planeY,
      gameState.enemies,
      gameState.items
    );

    sprites.forEach((sprite) => {
      const spriteScreenX = ((width / 2) * (1 + sprite.x / sprite.y));
      const spriteHeight = Math.abs(height / sprite.y);
      const spriteWidth = spriteHeight;

      const drawStartX = -spriteWidth / 2 + spriteScreenX;
      const drawEndX = spriteWidth / 2 + spriteScreenX;
      const drawStartY = -spriteHeight / 2 + height / 2;
      const drawEndY = spriteHeight / 2 + height / 2;

      // Nur zeichnen wenn vor der Kamera
      for (let stripe = Math.max(0, drawStartX); stripe < Math.min(width, drawEndX); stripe++) {
        if (sprite.distance < zBuffer[Math.floor(stripe)]) {
          const brightness = Math.max(0.3, 1 - sprite.distance / 15);
          ctx.globalAlpha = brightness;

          if (sprite.type === 'enemy') {
            ctx.fillStyle = '#0f0';
          } else {
            ctx.fillStyle = '#ff0';
          }

          ctx.fillRect(stripe, drawStartY, 1, drawEndY - drawStartY);
        }
      }
      ctx.globalAlpha = 1;
    });
  }, [findWallPicture]);

  // Game-Loop und Rendering
  useEffect(() => {
    if (gameMode !== 'playing' || !gameState) {
      return;
    }

    const loop = () => {
      gameLoop();
      render();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, render, gameMode, gameState]);

  // Menü-Rendering
  const renderMenu = () => {
    switch (gameMode) {
      case 'menu':
        return (
          <div className="menu-overlay">
            <div className="menu-title">EGOR</div>
            <div className="menu-content">
              <button className="menu-button" onClick={() => setGameMode('difficulty')}>
                Neues Spiel
              </button>
              <button className="menu-button" onClick={() => setGameMode('load')}>
                Spiel Laden
              </button>
              <button className="menu-button" onClick={() => setGameMode('help')}>
                Hilfe
              </button>
            </div>
          </div>
        );

      case 'difficulty':
        return (
          <div className="menu-overlay">
            <div className="menu-title">Schwierigkeitsgrad</div>
            <div className="menu-content">
              <div className="difficulty-buttons">
                <button className="menu-button" onClick={() => startNewGame(Difficulty.EASY)}>
                  Leicht (150 HP)
                </button>
                <button className="menu-button" onClick={() => startNewGame(Difficulty.NORMAL)}>
                  Normal (100 HP)
                </button>
                <button className="menu-button" onClick={() => startNewGame(Difficulty.HARD)}>
                  Schwer (75 HP)
                </button>
              </div>
              <button className="menu-button" onClick={() => setGameMode('menu')}>
                Zurück
              </button>
            </div>
          </div>
        );

      case 'save':
        return (
          <div className="menu-overlay">
            <div className="menu-title">Spiel Speichern</div>
            <div className="menu-content">
              <input
                type="text"
                className="menu-input"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Spielstand-Name"
              />
              <button className="menu-button" onClick={handleSaveGame}>
                Speichern
              </button>
              <button className="menu-button" onClick={() => setGameMode('playing')}>
                Abbrechen
              </button>
            </div>
          </div>
        );

      case 'load':
        const saves = getAllSaveGames();
        return (
          <div className="menu-overlay">
            <div className="menu-title">Spiel Laden</div>
            <div className="menu-content">
              {saves.length === 0 ? (
                <p>Keine gespeicherten Spielstände vorhanden.</p>
              ) : (
                <ul className="save-list">
                  {saves.map((save) => (
                    <li
                      key={save.name}
                      className="save-item"
                      onClick={() => handleLoadGame(save.name)}
                    >
                      <div className="save-item-info">
                        <div className="save-item-name">{save.name}</div>
                        <div className="save-item-date">
                          Level {save.gameState.currentLevel + 1} -{' '}
                          {new Date(save.timestamp).toLocaleString('de-DE')}
                        </div>
                      </div>
                      <button
                        className="save-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSaveGame(save.name);
                          setGameMode('load'); // Refresh
                        }}
                      >
                        Löschen
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button className="menu-button" onClick={() => setGameMode(gameState ? 'playing' : 'menu')}>
                Zurück
              </button>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="menu-overlay">
            <div className="menu-title">Steuerung & Hilfe</div>
            <div className="menu-content help-content">
              <div className="help-section">
                <h3>Bewegung:</h3>
                <div className="help-key">
                  <span className="help-key-button">W / ↑</span>
                  <span>Vorwärts</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">S / ↓</span>
                  <span>Rückwärts</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">A</span>
                  <span>Links bewegen</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">D</span>
                  <span>Rechts bewegen</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">← →</span>
                  <span>Umschauen</span>
                </div>
              </div>

              <div className="help-section">
                <h3>Kampf:</h3>
                <div className="help-key">
                  <span className="help-key-button">SPACE</span>
                  <span>Schießen / Angreifen</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">1-6</span>
                  <span>Waffe wechseln</span>
                </div>
              </div>

              <div className="help-section">
                <h3>Spiel:</h3>
                <div className="help-key">
                  <span className="help-key-button">E</span>
                  <span>Tür öffnen</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">M</span>
                  <span>Spielstand speichern</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">L</span>
                  <span>Spielstand laden</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">H</span>
                  <span>Diese Hilfe anzeigen/verbergen</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">P</span>
                  <span>Pause</span>
                </div>
                <div className="help-key">
                  <span className="help-key-button">ESC</span>
                  <span>Dialog schließen</span>
                </div>
              </div>

              <button className="menu-button" onClick={() => setGameMode(gameState ? 'playing' : 'menu')}>
                Zurück
              </button>
            </div>
          </div>
        );

      case 'levelComplete':
        return (
          <div className="menu-overlay">
            <div className="victory-text">LEVEL ABGESCHLOSSEN!</div>
            <div className="menu-content">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                  Glückwunsch!
                </div>
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>
                  Level {gameState ? gameState.currentLevel + 1 : 0} abgeschlossen!
                </div>
                <div style={{ fontSize: '18px' }}>
                  Punkte: {gameState ? gameState.player.score : 0}
                </div>
              </div>
              <button className="menu-button" onClick={handleContinueToNextLevel}>
                Weiter zu Level {gameState ? gameState.currentLevel + 2 : 0}
              </button>
              <button className="menu-button" onClick={() => {
                setGameMode('menu');
                setGameState(null);
                soundSystem.playMenuSelect();
              }}>
                Hauptmenü
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // HUD
  const renderHUD = () => {
    if (!gameState || gameMode !== 'playing') return null;

    const weapon = WEAPONS[gameState.player.currentWeapon];
    const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;

    return (
      <>
        <div className="level-info">
          Level {gameState.currentLevel + 1} / 5
        </div>
        <div className="crosshair"></div>
        <div className="hud">
          <div className="hud-left">
            <div>Gesundheit</div>
            <div className="health-bar">
              <div className="health-bar-fill" style={{ width: `${healthPercent}%` }}></div>
            </div>
            <div>{Math.max(0, Math.floor(gameState.player.health))} HP</div>
          </div>
          <div className="hud-center">
            <div>Waffe: {weapon.name}</div>
            <div>
              {weapon.needsAmmo
                ? `Munition: ${gameState.player.ammo[gameState.player.currentWeapon]}`
                : 'Unendlich'}
            </div>
          </div>
          <div className="hud-right">
            <div>Punkte: {gameState.player.score}</div>
            <div>
              Gegner: {gameState.enemies.filter((e) => e.isAlive).length} /{' '}
              {gameState.enemies.length}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Game Over / Victory
  const renderGameStatus = () => {
    if (!gameState) return null;

    if (gameState.isGameOver) {
      return (
        <div className="menu-overlay">
          <div className="game-over-text">GAME OVER</div>
          <div className="menu-content">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                Punkte: {gameState.player.score}
              </div>
              <div style={{ fontSize: '18px' }}>
                Level erreicht: {gameState.currentLevel + 1} / 5
              </div>
            </div>
            <button className="menu-button" onClick={() => {
              setGameMode('menu');
              setGameState(null);
              soundSystem.playMenuSelect();
            }}>
              Hauptmenü
            </button>
          </div>
        </div>
      );
    }

    if (
      gameState.currentLevel === 4 &&
      gameState.enemies.every((e) => !e.isAlive)
    ) {
      return (
        <div className="menu-overlay">
          <div className="victory-text">SIEG!</div>
          <div className="menu-content">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                Herzlichen Glückwunsch!
              </div>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>
                Alle Level abgeschlossen!
              </div>
              <div style={{ fontSize: '18px' }}>
                Endpunkte: {gameState.player.score}
              </div>
            </div>
            <button className="menu-button" onClick={() => {
              setGameMode('menu');
              setGameState(null);
              soundSystem.playMenuSelect();
            }}>
              Hauptmenü
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="game-container">
      <div className="canvas-container">
        <canvas ref={canvasRef} width={screenWidth} height={screenHeight} />
      </div>
      {renderHUD()}
      {renderMenu()}
      {renderGameStatus()}
    </div>
  );
}

export default App;
