import { EnemyType } from './types.ts';

const textures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const wallTextures: Record<string, CanvasImageSource> = {};
const itemTextures: Record<string, CanvasImageSource> = {};

export function loadTextures(): Promise<void[]> {
  textures[EnemyType.ZOMBIE] = createZombieTexture();
  textures[EnemyType.MONSTER] = createMonsterTexture();
  textures[EnemyType.GHOST] = createGhostTexture();

  // Wandtexturen erstellen
  wallTextures['brick'] = createBrickTexture();
  wallTextures['wood'] = createWoodTexture();
  wallTextures['stone'] = createStoneTexture();
  wallTextures['door'] = createDoorTexture();
  wallTextures['exitDoor'] = createExitDoorTexture();

  // Item-Texturen erstellen
  itemTextures['HEALTH_SMALL'] = createHealthSmallTexture();
  itemTextures['HEALTH_LARGE'] = createHealthLargeTexture();
  itemTextures['TREASURE'] = createTreasureTexture();
  itemTextures['AMMO'] = createAmmoTexture();
  itemTextures['WEAPON'] = createWeaponTexture();

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
  
  // Weißer Geist mit Transparenz
  ctx.globalAlpha = 0.8;
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
  ctx.globalAlpha = 1.0;
  
  // Augen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(24, 20, 4, 0, Math.PI * 2);
  ctx.arc(40, 20, 4, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas;
}

export function getTexture(enemyType: EnemyType): CanvasImageSource | undefined {
  return textures[enemyType];
}

export function getWallTexture(textureName: string): CanvasImageSource | undefined {
  return wallTextures[textureName];
}

export function getItemTexture(itemType: string): CanvasImageSource | undefined {
  return itemTextures[itemType];
}

function createBrickTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Hintergrund - Mörtel
  ctx.fillStyle = '#D3D3D3';
  ctx.fillRect(0, 0, 32, 32);

  // Backstein-Muster
  ctx.fillStyle = '#8B4513';

  // Horizontale Backsteinreihen
  for (let y = 0; y < 32; y += 8) {
    // Versetzte Backsteine für realistisches Mauerwerk
    const offset = (y / 8) % 2 === 0 ? 0 : 16;

    for (let x = 0; x < 32; x += 32) {
      ctx.fillRect(x + offset, y, 16, 4);
    }
  }

  // Vertikale Fugen
  ctx.fillStyle = '#A0522D';
  for (let x = 0; x < 32; x += 16) {
    ctx.fillRect(x, 0, 1, 32);
  }

  return canvas;
}

function createWoodTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Grundfarbe - dunkles Holz
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, 32, 32);

  // Holztäfelung - vertikale Bretter
  ctx.fillStyle = '#654321';

  for (let x = 0; x < 32; x += 8) {
    ctx.fillRect(x, 0, 4, 32);

    // Fugen zwischen Brettern
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(x + 4, 0, 1, 32);
    ctx.fillStyle = '#654321';
  }

  // Holzmaserung - horizontale Linien
  ctx.fillStyle = '#5D4037';
  for (let y = 4; y < 32; y += 8) {
    ctx.fillRect(0, y, 32, 1);
  }

  return canvas;
}

function createStoneTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Grundfarbe - grauer Stein
  ctx.fillStyle = '#708090';
  ctx.fillRect(0, 0, 32, 32);

  // Große Steinblöcke mit verschiedenen Grautönen
  const stoneColors = ['#778899', '#696969', '#808080', '#2F4F4F'];

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      ctx.fillRect(i * 16, j * 16, 16, 16);

      // Schatten an den Rändern für 3D-Effekt
      ctx.fillStyle = '#2F4F4F';
      ctx.fillRect(i * 16, j * 16, 16, 1);
      ctx.fillRect(i * 16, j * 16, 1, 16);
    }
  }

  return canvas;
}

function createDoorTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Tür-Grundfarbe - dunkles Holz
  ctx.fillStyle = '#654321';
  ctx.fillRect(0, 0, 32, 32);

  // Türfüllungen - vertikale Bretter
  ctx.fillStyle = '#8B4513';
  for (let x = 0; x < 32; x += 8) {
    ctx.fillRect(x, 0, 4, 32);

    // Fugen
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(x + 4, 0, 1, 32);
    ctx.fillStyle = '#8B4513';
  }

  // Türgriff (rechte Seite)
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(24, 14, 4, 4);

  // Türklinke
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(28, 15, 3, 2);

  return canvas;
}

function createExitDoorTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Exit-Tür - grünes Holz
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, 32, 32);

  // Türfüllungen
  ctx.fillStyle = '#32CD32';
  for (let x = 0; x < 32; x += 8) {
    ctx.fillRect(x, 0, 4, 32);

    // Fugen
    ctx.fillStyle = '#006400';
    ctx.fillRect(x + 4, 0, 1, 32);
    ctx.fillStyle = '#32CD32';
  }

  // Exit-Symbol (X)
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('X', 16, 16);

  return canvas;
}

function createHealthSmallTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Weißes Kreuz auf rotem Hintergrund
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 32, 32);

  // Weißes Kreuz
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(12, 6, 8, 20);  // Vertikaler Balken
  ctx.fillRect(6, 12, 20, 8);  // Horizontaler Balken

  return canvas;
}

function createHealthLargeTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Roter Hintergrund mit weißem Rand
  ctx.fillStyle = '#CC0000';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(2, 2, 28, 28);

  // Weißes Kreuz (größer als kleines)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(10, 4, 12, 24);  // Vertikaler Balken
  ctx.fillRect(4, 10, 24, 12);  // Horizontaler Balken

  return canvas;
}

function createTreasureTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Goldener Schatz
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, 32, 32);

  // Schatz-Symbol (Münzen)
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.arc(16, 16, 12, 0, Math.PI * 2);
  ctx.fill();

  // Glanz-Effekt
  ctx.fillStyle = '#FFFFE0';
  ctx.beginPath();
  ctx.arc(12, 12, 4, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createAmmoTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Grauer Hintergrund
  ctx.fillStyle = '#666666';
  ctx.fillRect(0, 0, 32, 32);

  // Patronenhülse
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(8, 8, 16, 24);

  // Kugelkopf
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(10, 4, 12, 8);

  return canvas;
}

function createWeaponTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Dunkler Hintergrund
  ctx.fillStyle = '#333333';
  ctx.fillRect(0, 0, 32, 32);

  // Waffe (vereinfachte Pistole)
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(6, 12, 20, 8);  // Lauf
  ctx.fillRect(4, 10, 8, 12);  // Griff

  // Mündung
  ctx.fillStyle = '#000000';
  ctx.fillRect(26, 14, 4, 4);

  return canvas;
}