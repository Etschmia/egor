import { EnemyType } from './types.ts';

const textures: Partial<Record<EnemyType, HTMLImageElement>> = {};

export function loadTextures(): Promise<void[]> {
  textures[EnemyType.ZOMBIE] = createZombieTexture();
  textures[EnemyType.MONSTER] = createMonsterTexture();
  textures[EnemyType.GHOST] = createGhostTexture();
  return Promise.resolve([]);
}

function createZombieTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  // Grüner Körper
  ctx.fillStyle = '#228B22';
  ctx.fillRect(16, 24, 32, 32);
  
  // Kopf
  ctx.fillStyle = '#90EE90';
  ctx.fillRect(24, 8, 16, 16);
  
  // Augen
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(28, 12, 4, 4);
  ctx.fillRect(36, 12, 4, 4);
  
  // Mund
  ctx.fillStyle = '#000000';
  ctx.fillRect(30, 20, 8, 2);
  
  // Arme
  ctx.fillStyle = '#228B22';
  ctx.fillRect(8, 28, 8, 12);
  ctx.fillRect(48, 28, 8, 12);
  
  // Beine
  ctx.fillRect(20, 48, 8, 12);
  ctx.fillRect(36, 48, 8, 12);
  
  return canvas;
}

function createMonsterTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  // Roter Körper
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(12, 20, 40, 36);
  
  // Kopf
  ctx.fillStyle = '#FF4500';
  ctx.fillRect(20, 4, 24, 16);
  
  // Augen
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(24, 8, 6, 6);
  ctx.fillRect(34, 8, 6, 6);
  
  // Zähne
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(22 + i * 4, 16, 2, 4);
  }
  
  // Klauen
  ctx.fillStyle = '#000000';
  ctx.fillRect(4, 28, 8, 8);
  ctx.fillRect(52, 28, 8, 8);
  ctx.fillRect(4, 44, 8, 8);
  ctx.fillRect(52, 44, 8, 8);
  
  return canvas;
}

function createGhostTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  
  // Weißer Geist
  ctx.fillStyle = '#F8F8FF';
  ctx.beginPath();
  ctx.arc(32, 24, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // Schwanz
  ctx.beginPath();
  ctx.moveTo(12, 44);
  ctx.lineTo(32, 60);
  ctx.lineTo(52, 44);
  ctx.closePath();
  ctx.fill();
  
  // Augen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(24, 20, 4, 0, Math.PI * 2);
  ctx.arc(40, 20, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Transparenz-Effekt (auf das gesamte Bild anwenden)
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#F8F8FF';
  ctx.fillRect(0, 0, 64, 64);
  ctx.globalAlpha = 1.0;
  
  return canvas;
}

export function getTexture(enemyType: EnemyType): CanvasImageSource | undefined {
  return textures[enemyType];
}