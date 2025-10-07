import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { LivePreviewProps } from '../types';
import { textureGenerator } from '../../shared/texture-generation';
import { themeManager } from '../../shared/design-tokens';

export const LivePreview: React.FC<LivePreviewProps> = ({
  wallTypeId,
  themeId,
  width = 256,
  height = 256,
  scale = 8
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [renderStats, setRenderStats] = useState({
    generationTime: 0,
    renderTime: 0,
    totalTextures: 0
  });

  // Debounced update function to prevent excessive re-rendering
  const debouncedUpdate = useCallback(
    debounce(() => {
      updatePreview();
    }, 100),
    [wallTypeId, themeId]
  );

  useEffect(() => {
    debouncedUpdate();
  }, [wallTypeId, themeId, debouncedUpdate]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setLastUpdate(Date.now());
      debouncedUpdate();
    };

    themeManager.addEventListener('themeChanged', handleThemeChange);
    themeManager.addEventListener('tokenUpdated', handleThemeChange);

    return () => {
      themeManager.removeEventListener('themeChanged', handleThemeChange);
      themeManager.removeEventListener('tokenUpdated', handleThemeChange);
    };
  }, [debouncedUpdate]);

  const updatePreview = async () => {
    if (!canvasRef.current || !previewCanvasRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      const startTime = performance.now();

      // Generate the base texture
      const texture = textureGenerator.generateTexture({
        wallTypeId,
        themeId,
        width: 32,
        height: 32
      });

      const generationTime = performance.now() - startTime;

      // Render the tiled preview
      const renderStartTime = performance.now();
      await renderTiledPreview(texture, previewCanvasRef.current, width, height, scale);
      const renderTime = performance.now() - renderStartTime;

      // Update render stats
      setRenderStats({
        generationTime: Math.round(generationTime * 100) / 100,
        renderTime: Math.round(renderTime * 100) / 100,
        totalTextures: textureGenerator.getCacheSize()
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      console.error('Preview generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTiledPreview = (
    texture: HTMLCanvasElement,
    canvas: HTMLCanvasElement,
    previewWidth: number,
    previewHeight: number,
    tileScale: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve();
        return;
      }

      canvas.width = previewWidth;
      canvas.height = previewHeight;

      // Calculate tile dimensions
      const tileWidth = texture.width * tileScale;
      const tileHeight = texture.height * tileScale;

      // Calculate how many tiles we need
      const tilesX = Math.ceil(previewWidth / tileWidth) + 1;
      const tilesY = Math.ceil(previewHeight / tileHeight) + 1;

      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        // Clear canvas
        ctx.clearRect(0, 0, previewWidth, previewHeight);

        // Set image rendering for pixelated textures
        ctx.imageSmoothingEnabled = false;

        // Render tiles
        for (let y = 0; y < tilesY; y++) {
          for (let x = 0; x < tilesX; x++) {
            const xPos = x * tileWidth;
            const yPos = y * tileHeight;

            ctx.drawImage(
              texture,
              xPos,
              yPos,
              tileWidth,
              tileHeight
            );
          }
        }

        // Add a subtle border for better visualization
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, previewWidth, previewHeight);

        resolve();
      });
    });
  };

  const handleExportTexture = () => {
    if (!previewCanvasRef.current) return;

    const link = document.createElement('a');
    link.download = `${wallTypeId}-${themeId}-preview.png`;
    link.href = previewCanvasRef.current.toDataURL();
    link.click();
  };

  const handleZoomIn = () => {
    if (scale < 16) {
      updatePreview();
    }
  };

  const handleZoomOut = () => {
    if (scale > 2) {
      updatePreview();
    }
  };

  const handleRefresh = () => {
    // Clear cache and force regeneration
    textureGenerator.clearCache();
    updatePreview();
  };

  return (
    <div className="live-preview">
      <div className="live-preview__header">
        <h3 className="live-preview__title">Live Preview</h3>
        
        <div className="live-preview__controls">
          <button
            className="live-preview__control-button"
            onClick={handleZoomOut}
            disabled={scale <= 2}
            title="Zoom Out"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <span className="live-preview__zoom-level">{scale}x</span>

          <button
            className="live-preview__control-button"
            onClick={handleZoomIn}
            disabled={scale >= 16}
            title="Zoom In"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="live-preview__control-divider" />

          <button
            className="live-preview__control-button"
            onClick={handleRefresh}
            disabled={isGenerating}
            title="Refresh Preview"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.705 8.005a.75.75 0 0 1 .834.656A5.5 5.5 0 0 0 9.131 13H8.002a.75.75 0 0 1 0-1.5h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 1 1-1.5 0v-1.129A7 7 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834Z"/>
              <path d="M14.295 7.995a.75.75 0 0 1-.834-.656A5.5 5.5 0 0 0 6.869 3H7.998a.75.75 0 1 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v1.129A7 7 0 0 1 14.95 7.16a.75.75 0 0 1-.656.834Z"/>
            </svg>
          </button>

          <button
            className="live-preview__control-button"
            onClick={handleExportTexture}
            disabled={isGenerating}
            title="Export Preview as PNG"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.5 1a.5.5 0 0 0-1 0v6.793L6.354 6.646a.5.5 0 1 0-.708.708l2.5 2.5a.5.5 0 0 0 .708 0l2.5-2.5a.5.5 0 0 0-.708-.708L9.5 7.793V1z"/>
              <path d="M3 9.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
              <path d="M2.5 11.5A1.5 1.5 0 0 1 4 10h8a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 12 15H4a1.5 1.5 0 0 1-1.5-1.5v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="live-preview__content">
        {error ? (
          <div className="live-preview__error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="live-preview__error-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h4>Preview Error</h4>
            <p>{error}</p>
            <button onClick={handleRefresh} className="live-preview__retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <div className="live-preview__canvas-container">
            {isGenerating && (
              <div className="live-preview__loading">
                <div className="live-preview__spinner" />
                <span>Generating...</span>
              </div>
            )}

            <canvas
              ref={previewCanvasRef}
              className="live-preview__canvas"
              style={{
                opacity: isGenerating ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            />

            {/* Hidden canvas for texture generation */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>

      {/* Performance stats */}
      <div className="live-preview__stats">
        <div className="live-preview__stat">
          <span className="live-preview__stat-label">Generation:</span>
          <span className="live-preview__stat-value">{renderStats.generationTime}ms</span>
        </div>
        <div className="live-preview__stat">
          <span className="live-preview__stat-label">Render:</span>
          <span className="live-preview__stat-value">{renderStats.renderTime}ms</span>
        </div>
        <div className="live-preview__stat">
          <span className="live-preview__stat-label">Cache:</span>
          <span className="live-preview__stat-value">{renderStats.totalTextures} textures</span>
        </div>
        <div className="live-preview__stat">
          <span className="live-preview__stat-label">Last Update:</span>
          <span className="live-preview__stat-value">
            {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>

      {/* Preview info */}
      <div className="live-preview__info">
        <p className="live-preview__info-text">
          Previewing <strong>{wallTypeId}</strong> from theme <strong>{themeId}</strong>
        </p>
        <p className="live-preview__info-text">
          Resolution: {width} × {height} pixels at {scale}× scale
        </p>
      </div>
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
