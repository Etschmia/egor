import { useState, useEffect, useMemo } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import type { GameMap } from '../../types';

interface LevelInfo {
  filename: string;
  level: number;
  variant: number;
}

interface LevelSelectorProps {
  currentLevel: number | null;
  currentVariant: number | null;
  onLevelLoad: (level: number, variant: number, mapData: GameMap) => void;
  onError: (error: string) => void;
}

export function LevelSelector({
  currentLevel,
  currentVariant,
  onLevelLoad,
  onError,
}: LevelSelectorProps) {
  const { fetchLevels, loadLevel, isLoading } = useApiClient();
  const [availableLevels, setAvailableLevels] = useState<LevelInfo[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(currentLevel);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(currentVariant);

  // Fetch available levels on mount
  useEffect(() => {
    const loadAvailableLevels = async () => {
      try {
        const levels = await fetchLevels();
        setAvailableLevels(levels);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to fetch levels');
      }
    };

    loadAvailableLevels();
  }, [fetchLevels, onError]);

  // Get unique level numbers
  const uniqueLevels = useMemo(() => {
    const levelNumbers = new Set(availableLevels.map(l => l.level));
    return Array.from(levelNumbers).sort((a, b) => a - b);
  }, [availableLevels]);

  // Get variants for the selected level
  const availableVariants = useMemo(() => {
    if (selectedLevel === null) return [];
    const variants = availableLevels
      .filter(l => l.level === selectedLevel)
      .map(l => l.variant)
      .sort((a, b) => a - b);
    return variants;
  }, [availableLevels, selectedLevel]);

  // Handle level selection change
  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const level = event.target.value ? parseInt(event.target.value, 10) : null;
    setSelectedLevel(level);
    
    // Reset variant selection when level changes
    setSelectedVariant(null);
  };

  // Handle variant selection change
  const handleVariantChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const variant = event.target.value ? parseInt(event.target.value, 10) : null;
    setSelectedVariant(variant);

    // Load the level if both level and variant are selected
    if (selectedLevel !== null && variant !== null) {
      const filename = `level${selectedLevel}-variant${variant}.ts`;
      try {
        const mapData = await loadLevel(filename);
        onLevelLoad(selectedLevel, variant, mapData);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to load level');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      padding: '0.5rem',
    }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Level:</span>
        <select
          value={selectedLevel ?? ''}
          onChange={handleLevelChange}
          disabled={isLoading || uniqueLevels.length === 0}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#2d2d2d',
            color: '#ffffff',
            cursor: 'pointer',
            minWidth: '100px',
          }}
        >
          <option value="">Select Level</option>
          {uniqueLevels.map(level => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Variant:</span>
        <select
          value={selectedVariant ?? ''}
          onChange={handleVariantChange}
          disabled={isLoading || selectedLevel === null || availableVariants.length === 0}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#2d2d2d',
            color: '#ffffff',
            cursor: 'pointer',
            minWidth: '100px',
          }}
        >
          <option value="">Select Variant</option>
          {availableVariants.map(variant => (
            <option key={variant} value={variant}>
              Variant {variant}
            </option>
          ))}
        </select>
      </label>

      {isLoading && (
        <span style={{ color: '#888', fontSize: '0.9rem' }}>
          Loading...
        </span>
      )}
    </div>
  );
}
