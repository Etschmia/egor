import { EnemyType } from './types.ts';

const textures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const corpseTextures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const wallTextures: Record<string, CanvasImageSource> = {};
const itemTextures: Record<string, CanvasImageSource> = {};

export function loadTextures(): Promise<void[]> {
  textures[EnemyType.ZOMBIE] = createZombieTexture();
  textures[EnemyType.MONSTER] = createMonsterTexture();
  textures[EnemyType.GHOST] = createGhostTexture();

  corpseTextures[EnemyType.ZOMBIE] = createZombieCorpseTexture();
  corpseTextures[EnemyType.MONSTER] = createMonsterCorpseTexture();
  corpseTextures[EnemyType.GHOST] = createGhostCorpseTexture();

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

  // --- Detaillierterer Zombie ---

  // Beine (Hose)
  ctx.fillStyle = '#4B3A26'; // Dunkelbraun
  ctx.fillRect(20, 52, 8, 12);
  ctx.fillRect(36, 52, 8, 12);
  // Schuhe
  ctx.fillStyle = '#1A1A1A'; // Fast schwarz
  ctx.fillRect(18, 60, 10, 4);
  ctx.fillRect(34, 60, 10, 4);

  // Körper (zerissenes Hemd)
  ctx.fillStyle = '#8B0000'; // Dunkelrot
  ctx.fillRect(16, 28, 32, 24);
  // Fetzen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(16, 50, 5, 5);
  ctx.fillRect(25, 48, 8, 8);
  ctx.fillRect(40, 50, 6, 6);


  // Arme
  const skinGradient = ctx.createLinearGradient(0, 28, 0, 44);
  skinGradient.addColorStop(0, '#556B2F'); // Dunkles Olivgrün
  skinGradient.addColorStop(1, '#8FBC8F'); // Helles Seegrün
  ctx.fillStyle = skinGradient;
  ctx.fillRect(8, 28, 8, 16);
  ctx.fillRect(48, 28, 8, 16);

  // Kopf
  const headGradient = ctx.createRadialGradient(32, 16, 4, 32, 16, 16);
  headGradient.addColorStop(0, '#90EE90'); // Hellgrün
  headGradient.addColorStop(1, '#2E8B57'); // Seegrün
  ctx.fillStyle = headGradient;
  ctx.fillRect(24, 8, 16, 16);
  // Wunde
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(35, 9, 4, 6);


  // Augen (glühend)
  const eyeGradient = ctx.createRadialGradient(30, 14, 1, 30, 14, 4);
  eyeGradient.addColorStop(0, '#FFFF00'); // Gelb
  eyeGradient.addColorStop(1, '#FF4500'); // Orangerot
  ctx.fillStyle = eyeGradient;
  ctx.fillRect(28, 12, 4, 4);
  const eyeGradient2 = ctx.createRadialGradient(38, 14, 1, 38, 14, 4);
  eyeGradient2.addColorStop(0, '#FFFF00');
  eyeGradient2.addColorStop(1, '#FF4500');
  ctx.fillStyle = eyeGradient2;
  ctx.fillRect(36, 12, 4, 4);

  // Mund
  ctx.fillStyle = '#000000';
  ctx.fillRect(30, 20, 8, 2);
  // Zahn
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(31, 20, 2, 2);


  return canvas;
}

function createMonsterTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierteres Monster ---

  // Beine
  ctx.fillStyle = '#6B2A00';
  ctx.fillRect(16, 54, 12, 10);
  ctx.fillRect(36, 54, 12, 10);

  // Körper
  const bodyGradient = ctx.createRadialGradient(32, 40, 5, 32, 40, 30);
  bodyGradient.addColorStop(0, '#FF4500'); // Orangerot
  bodyGradient.addColorStop(1, '#8B0000'); // Dunkelrot
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(12, 20, 40, 36);

  // Kopf
  ctx.fillStyle = '#D2691E'; // Schokoladenbraun
  ctx.fillRect(20, 4, 24, 20);

  // Hörner
  ctx.fillStyle = '#C0C0C0'; // Silber
  ctx.beginPath();
  ctx.moveTo(20, 4);
  ctx.lineTo(16, -4);
  ctx.lineTo(24, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(44, 4);
  ctx.lineTo(48, -4);
  ctx.lineTo(40, 4);
  ctx.fill();


  // Augen
  const eyeGradient = ctx.createRadialGradient(27, 11, 1, 27, 11, 5);
  eyeGradient.addColorStop(0, '#FFFF00'); // Gelb
  eyeGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = '#FF0000'; // Roter Augenhintergrund
  ctx.fillRect(24, 8, 6, 6);
  ctx.fillRect(34, 8, 6, 6);
  ctx.fillStyle = eyeGradient;
  ctx.fillRect(24, 8, 6, 6);
  const eyeGradient2 = ctx.createRadialGradient(37, 11, 1, 37, 11, 5);
  eyeGradient2.addColorStop(0, '#FFFF00');
  eyeGradient2.addColorStop(1, 'transparent');
  ctx.fillStyle = eyeGradient2;
  ctx.fillRect(34, 8, 6, 6);


  // Zähne
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(22 + i * 4, 20);
    ctx.lineTo(24 + i * 4, 24);
    ctx.lineTo(26 + i * 4, 20);
    ctx.fill();
  }

  // Klauen / Arme
  ctx.fillStyle = '#4A4A4A'; // Dunkelgrau
  ctx.fillRect(4, 28, 8, 12);
  ctx.fillRect(52, 28, 8, 12);
  // Krallen
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(4, 40, 2, 4);
  ctx.fillRect(8, 40, 2, 4);
  ctx.fillRect(54, 40, 2, 4);
  ctx.fillRect(58, 40, 2, 4);


  return canvas;
}

function createGhostTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierterer Geist ---

  ctx.globalAlpha = 0.85;

  // Körper mit Farbverlauf für ätherisches Aussehen
  const gradient = ctx.createRadialGradient(32, 32, 5, 32, 32, 30);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(200, 220, 255, 0.7)');
  gradient.addColorStop(1, 'rgba(150, 200, 255, 0)');

  ctx.fillStyle = gradient;

  // Geisterform
  ctx.beginPath();
  ctx.moveTo(12, 60);
  ctx.bezierCurveTo(0, 40, 10, 10, 32, 10);
  ctx.bezierCurveTo(54, 10, 64, 40, 52, 60);
  ctx.quadraticCurveTo(42, 50, 32, 62);
  ctx.quadraticCurveTo(22, 50, 12, 60);
  ctx.closePath();
  ctx.fill();


  ctx.globalAlpha = 1.0;

  // Augen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(26, 28, 5, 0, Math.PI * 2);
  ctx.arc(40, 28, 5, 0, Math.PI * 2);
  ctx.fill();

  // Glanzpunkt in den Augen
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(25, 27, 1.5, 0, Math.PI * 2);
  ctx.arc(39, 27, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Mund (gequält)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(33, 40, 8, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();


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

  // --- Detaillierterer Schatz (Kelch) ---

  // Farbverlauf für goldenen Effekt
  const gradient = ctx.createLinearGradient(0, 0, 32, 32);
  gradient.addColorStop(0, '#FFD700'); // Gold
  gradient.addColorStop(0.3, '#FFFFE0'); // Hellgelb (Glanz)
  gradient.addColorStop(0.6, '#B8860B'); // Dunkelgold
  gradient.addColorStop(1, '#FFD700');

  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#422A00'; // Dunkelbrauner Rand
  ctx.lineWidth = 1;

  // Kelchform
  ctx.beginPath();
  ctx.moveTo(6, 28);
  ctx.lineTo(26, 28); // Basis
  ctx.lineTo(24, 24);
  ctx.lineTo(8, 24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();


  // Stiel
  ctx.beginPath();
  ctx.moveTo(14, 24);
  ctx.lineTo(14, 12);
  ctx.lineTo(18, 12);
  ctx.lineTo(18, 24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();


  // Oberteil des Kelchs
  ctx.beginPath();
  ctx.moveTo(8, 12);
  ctx.bezierCurveTo(4, 0, 28, 0, 24, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();


  // Edelstein
  ctx.fillStyle = '#FF0000'; // Rot
  ctx.strokeStyle = '#8B0000'; // Dunkelrot
  ctx.beginPath();
  ctx.arc(16, 18, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();


  return canvas;
}

function createAmmoTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Detailliertere Munitionskiste ---

  // Box-Körper mit Farbverlauf für 3D-Effekt
  const gradient = ctx.createLinearGradient(0, 0, 32, 32);
  gradient.addColorStop(0, '#556B2F'); // Dunkelolivgrün
  gradient.addColorStop(1, '#8FBC8F'); // Helles Seegrün
  ctx.fillStyle = gradient;
  ctx.fillRect(4, 8, 24, 20);

  // Deckel der Box
  ctx.fillStyle = '#3A4A1F';
  ctx.fillRect(2, 6, 28, 4);

  // Riemen
  ctx.fillStyle = '#000000';
  ctx.fillRect(14, 6, 4, 24);

  // Label
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(6, 12, 8, 8);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 6px Arial';
  ctx.fillText('AMMO', 7, 18);


  // Sichtbare Patronenspitzen
  ctx.fillStyle = '#FFD700'; // Gold
  ctx.fillRect(20, 10, 2, 4);
  ctx.fillRect(23, 10, 2, 4);
  ctx.fillRect(26, 10, 2, 4);


  return canvas;
}

function createWeaponTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierteres Sturmgewehr ---

  // Hauptkörper der Waffe
  const bodyGradient = ctx.createLinearGradient(0, 12, 0, 22);
  bodyGradient.addColorStop(0, '#4A4A4A'); // Dunkelgrau
  bodyGradient.addColorStop(1, '#2A2A2A'); // Sehr dunkelgrau
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(4, 12, 24, 6); // Hauptteil

  // Lauf
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(24, 13, 6, 4);

  // Magazin
  ctx.fillStyle = '#333333';
  ctx.fillRect(12, 18, 6, 8);

  // Griff
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  ctx.moveTo(8, 18);
  ctx.lineTo(6, 26);
  ctx.lineTo(10, 26);
  ctx.lineTo(12, 18);
  ctx.closePath();
  ctx.fill();

  // Visier
  ctx.fillStyle = '#111111';
  ctx.fillRect(6, 10, 4, 2);
  ctx.fillRect(20, 10, 4, 2);

  // Schulterstütze
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(2, 14, 4, 2);
  ctx.fillRect(2, 14, 2, 8);


  return canvas;
}

function createZombieCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Dunklere, flachere Version des Zombies
  ctx.fillStyle = '#3A4A1F'; // Dunkles Grün
  ctx.fillRect(12, 48, 40, 12); // Körper

  ctx.fillStyle = '#5A0000'; // Dunkelrot (Blutlache)
  ctx.beginPath();
  ctx.ellipse(32, 54, 25, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#222'; // Dunkle Gliedmaßen
  ctx.fillRect(8, 46, 8, 8);
  ctx.fillRect(48, 46, 8, 8);

  return canvas;
}

function createMonsterCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Dunklere, flachere Version des Monsters
  ctx.fillStyle = '#5A0000';
  ctx.beginPath();
  ctx.ellipse(32, 52, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#D2691E'; // Horn-Farbe
  ctx.fillRect(10, 50, 8, 4);
  ctx.fillRect(46, 50, 8, 4);

  return canvas;
}

function createGhostCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Verblassender Geist
  const gradient = ctx.createRadialGradient(32, 50, 5, 32, 50, 25);
  gradient.addColorStop(0, 'rgba(200, 220, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  return canvas;
}

export function getCorpseTexture(enemyType: EnemyType): CanvasImageSource | undefined {
  return corpseTextures[enemyType];
}