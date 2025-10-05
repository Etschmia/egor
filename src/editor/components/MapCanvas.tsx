import { useEffect, useRef, useState } from 'react';
import type { GameMap } from '../../types';
import type { SelectedEntity } from '../types';
import { renderMap, screenToMapCoordinates, calculateCanvasSize } from '../utils/mapRenderer';

interface MapCanvasProps {
  mapData: GameMap | null;
  selectedEntity?: SelectedEntity | null;
  onTileClick?: (x: number, y: number) => void;
  onContextMenu?: (event: React.MouseEvent, x: number, y: number) => void;
}

export function MapCanvas({ mapData, selectedEntity, onTileClick, onContextMenu }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);

  // Render the map whenever data changes
  useEffect(() => {
    if (!canvasRef.current || !mapData) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    renderMap(ctx, mapData, {
      hoverTile,
      selectedEntity: selectedEntity as { type: string; x?: number; y?: number; id?: string } | null,
    });
  }, [mapData, hoverTile, selectedEntity]);

  // Handle mouse move for hover effect
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !mapData) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const mapCoords = screenToMapCoordinates(screenX, screenY);

    // Check if coordinates are within map bounds
    if (
      mapCoords.x >= 0 &&
      mapCoords.x < mapData.width &&
      mapCoords.y >= 0 &&
      mapCoords.y < mapData.height
    ) {
      setHoverTile(mapCoords);
    } else {
      setHoverTile(null);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoverTile(null);
  };

  // Handle click
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !mapData || !onTileClick) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const mapCoords = screenToMapCoordinates(screenX, screenY);

    // Check if coordinates are within map bounds
    if (
      mapCoords.x >= 0 &&
      mapCoords.x < mapData.width &&
      mapCoords.y >= 0 &&
      mapCoords.y < mapData.height
    ) {
      onTileClick(mapCoords.x, mapCoords.y);
    }
  };

  // Handle right-click for context menu
  const handleContextMenuClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!canvasRef.current || !mapData || !onContextMenu) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const mapCoords = screenToMapCoordinates(screenX, screenY);

    // Check if coordinates are within map bounds
    if (
      mapCoords.x >= 0 &&
      mapCoords.x < mapData.width &&
      mapCoords.y >= 0 &&
      mapCoords.y < mapData.height
    ) {
      onContextMenu(event, mapCoords.x, mapCoords.y);
    }
  };

  if (!mapData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        backgroundColor: '#1a1a1a',
        color: '#888',
        fontSize: '16px',
      }}>
        No level loaded. Select a level to begin editing.
      </div>
    );
  }

  const canvasSize = calculateCanvasSize(mapData);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#1a1a1a',
      overflow: 'auto',
    }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onContextMenu={handleContextMenuClick}
        style={{
          border: '2px solid #444',
          cursor: 'crosshair',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
