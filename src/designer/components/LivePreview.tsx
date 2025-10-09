import { useEffect, useRef, useState, useCallback } from 'react';
import { textureGenerator } from '../../shared/texture-generation/TextureGenerator';
import type { LivePreviewProps } from '../types';

interface PerformanceStats {
  generationTime: number;
  renderTime: number;
  cacheHit: boolean;
  cacheStats: {
    size: number;
    maxSize: number;
    hits: number;
    misses: number;
    hitRate: number;
    evictions: number;
  };
}

export function LivePreview({ 
  wallTypeId, 
  themeId, 
  width = 512, 
  height = 512,
  scale = 2 
}: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRenderRef = useRef<{ wallTypeId: string; themeId: string } | null>(null);

  /**
   * Render the texture to the canvas with tiling using requestAnimationFrame
   */
  const renderTexture = useCallback(() => {
    if (!canvasRef.current) return;

    const renderStartTime = performance.now();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      setError('Failed to get canvas context');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const generationStartTime = performance.now();
      
      // Get cache stats before generation
      const cacheStatsBefore = textureGenerator.getCacheStatistics();
      
      // Generate texture (32x32 base texture)
      const texture = textureGenerator.generateTexture({
        wallTypeId,
        themeId,
        width: 32,
        height: 32,
      });

      const generationEndTime = performance.now();
      const generationTime = generationEndTime - generationStartTime;
      
      // Get cache stats after generation
      const cacheStatsAfter = textureGenerator.getCacheStatistics();

      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        if (!canvasRef.current || !ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Fill background with dark color
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Calculate how many tiles we need
        const tilesX = Math.ceil(width / (32 * scale));
        const tilesY = Math.ceil(height / (32 * scale));

        // Draw tiled texture
        for (let y = 0; y < tilesY; y++) {
          for (let x = 0; x < tilesX; x++) {
            ctx.drawImage(
              texture,
              x * 32 * scale,
              y * 32 * scale,
              32 * scale,
              32 * scale
            );
          }
        }

        const renderEndTime = performance.now();
        const renderTime = renderEndTime - renderStartTime;

        // Update performance stats
        setStats({
          generationTime,
          renderTime,
          cacheHit: cacheStatsAfter.hits > cacheStatsBefore.hits,
          cacheStats: cacheStatsAfter,
        });

        setIsLoading(false);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate texture';
      setError(errorMessage);
      setIsLoading(false);
      
      // Draw error state on canvas using requestAnimationFrame
      requestAnimationFrame(() => {
        if (!canvasRef.current || !ctx) return;

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#f44336';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠ Error generating texture', width / 2, height / 2 - 10);
        
        ctx.fillStyle = '#888888';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(errorMessage, width / 2, height / 2 + 10);
      });
    }
  }, [wallTypeId, themeId, width, height, scale]);

  /**
   * Debounced render function (100ms delay)
   */
  const debouncedRender = useCallback(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set loading state immediately for visual feedback
    setIsLoading(true);

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      renderTexture();
    }, 100);
  }, [renderTexture]);

  /**
   * Effect to trigger render when props change
   */
  useEffect(() => {
    // Check if we need to re-render
    const needsRender = 
      !lastRenderRef.current ||
      lastRenderRef.current.wallTypeId !== wallTypeId ||
      lastRenderRef.current.themeId !== themeId;

    if (needsRender) {
      lastRenderRef.current = { wallTypeId, themeId };
      debouncedRender();
    }

    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [wallTypeId, themeId, debouncedRender]);

  /**
   * Format time in milliseconds
   */
  const formatTime = (ms: number): string => {
    if (ms < 1) {
      return `${(ms * 1000).toFixed(0)}μs`;
    }
    return `${ms.toFixed(2)}ms`;
  };

  return (
    <div className="live-preview">
      <div className="live-preview__container">
        {/* Canvas */}
        <div className="live-preview__canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="live-preview__canvas"
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="live-preview__loading">
              <div className="live-preview__spinner" />
              <div className="live-preview__loading-text">Generating texture...</div>
            </div>
          )}

          {/* Error Overlay */}
          {error && !isLoading && (
            <div className="live-preview__error">
              <div className="live-preview__error-icon">⚠</div>
              <div className="live-preview__error-title">Generation Error</div>
              <div className="live-preview__error-message">{error}</div>
              <button
                className="designer-button live-preview__retry-button"
                onClick={renderTexture}
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Performance Statistics */}
        {stats && !error && (
          <div className="live-preview__stats">
            <div className="live-preview__stats-title">Performance</div>
            <div className="live-preview__stats-grid">
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Generation</div>
                <div className="live-preview__stat-value">
                  {formatTime(stats.generationTime)}
                </div>
              </div>
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Render</div>
                <div className="live-preview__stat-value">
                  {formatTime(stats.renderTime)}
                </div>
              </div>
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Cache</div>
                <div className="live-preview__stat-value">
                  {stats.cacheHit ? '✓ Hit' : '✗ Miss'}
                </div>
              </div>
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Cache Size</div>
                <div className="live-preview__stat-value">
                  {stats.cacheStats.size} / {stats.cacheStats.maxSize}
                </div>
              </div>
            </div>
            
            {/* Detailed Cache Statistics */}
            <div className="live-preview__stats-title" style={{ marginTop: '12px' }}>
              Cache Statistics
            </div>
            <div className="live-preview__stats-grid">
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Hit Rate</div>
                <div className="live-preview__stat-value">
                  {stats.cacheStats.hitRate.toFixed(1)}%
                </div>
              </div>
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Hits</div>
                <div className="live-preview__stat-value">
                  {stats.cacheStats.hits}
                </div>
              </div>
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Misses</div>
                <div className="live-preview__stat-value">
                  {stats.cacheStats.misses}
                </div>
              </div>
              <div className="live-preview__stat">
                <div className="live-preview__stat-label">Evictions</div>
                <div className="live-preview__stat-value">
                  {stats.cacheStats.evictions}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className="live-preview__info">
          <div className="live-preview__info-item">
            <span className="live-preview__info-label">Wall Type:</span>
            <span className="live-preview__info-value">{wallTypeId}</span>
          </div>
          <div className="live-preview__info-item">
            <span className="live-preview__info-label">Theme:</span>
            <span className="live-preview__info-value">{themeId}</span>
          </div>
          <div className="live-preview__info-item">
            <span className="live-preview__info-label">Resolution:</span>
            <span className="live-preview__info-value">{width}×{height}</span>
          </div>
          <div className="live-preview__info-item">
            <span className="live-preview__info-label">Scale:</span>
            <span className="live-preview__info-value">{scale}×</span>
          </div>
        </div>
      </div>
    </div>
  );
}
