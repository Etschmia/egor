import type { GameMap } from '../types';

export interface EditorState {
  currentLevel: number | null;
  currentVariant: number | null;
  mapData: GameMap | null;
  selectedEntity: SelectedEntity | null;
  isDirty: boolean; // Ungespeicherte Änderungen
  contextMenu: ContextMenuState | null;
}

export type SelectedEntity = 
  | { type: 'tile', x: number, y: number }
  | { type: 'enemy', id: string }
  | { type: 'item', id: string }
  | { type: 'decorative', id: string }
  | { type: 'wallPicture', id: string }
  | { type: 'playerStart' };

export interface ContextMenuState {
  x: number; // Screen coordinates
  y: number;
  options: ContextMenuOption[];
}

export interface ContextMenuOption {
  label: string;
  action: () => void;
  icon?: string;
}
