import { useRef, useEffect } from 'react';
import type { GameState } from './types';
import './MiniMap.css';

interface MiniMapProps {
  gameState: GameState;
}

const TILE_SIZE = 6; // Größe jeder Kachel auf der Mini-Map
const PLAYER_SIZE = 8; // Größe des Spieler-Punktes

function MiniMap({ gameState }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { player, currentMap } = gameState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mapWidth = currentMap.tiles[0].length;
    const mapHeight = currentMap.tiles.length;

    // Canvas-Größe anpassen
    canvas.width = mapWidth * TILE_SIZE;
    canvas.height = mapHeight * TILE_SIZE;

    // Hintergrund zeichnen
    ctx.fillStyle = '#000000'; // Schwarz
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Kacheln (Wände und Türen) zeichnen
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tileType = currentMap.tiles[y][x];
        let color = '';

        switch (tileType) {
          case 1: // Wand
            color = '#FFFFFF'; // Weiß
            break;
          case 2: // Normale Tür
            color = '#8B4513'; // Braun
            break;
          case 3: // Exit-Tür
            color = '#00FF00'; // Grün
            break;
        }

        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          // Optional: Ein kleiner Rand für bessere Sichtbarkeit
          ctx.strokeStyle = '#333';
          ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Spieler zeichnen
    const playerX = player.x * TILE_SIZE;
    const playerY = player.y * TILE_SIZE;

    ctx.fillStyle = '#0000FF'; // Blau
    ctx.beginPath();
    ctx.arc(playerX, playerY, PLAYER_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();

  }, [player.x, player.y, currentMap]);

  return (
    <div className="minimap-container">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default MiniMap;
