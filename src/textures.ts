import { EnemyType, DecorativeObjectType } from './types.ts';
import { TextureQuality } from './config/graphicsSettings.ts';

// Helper functions for scaled drawing
function scaledRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, scale: number) {
  ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
}

function scaledArc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, scale: number, startAngle: number = 0, endAngle: number = Math.PI * 2) {
  ctx.beginPath();
  ctx.arc(x * scale, y * scale, r * scale, startAngle, endAngle);
  ctx.fill();
}

// Helper for complex paths
function scaledPath(ctx: CanvasRenderingContext2D, points: { x: number, y: number }[], scale: number) {
  ctx.beginPath();
  ctx.moveTo(points[0].x * scale, points[0].y * scale);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * scale, points[i].y * scale);
  }
  ctx.closePath();
  ctx.fill();
}

function scaledEllipse(ctx: CanvasRenderingContext2D, x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, scale: number) {
  ctx.beginPath();
  ctx.ellipse(x * scale, y * scale, radiusX * scale, radiusY * scale, rotation, startAngle, endAngle);
  ctx.fill();
}

const textures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const corpseTextures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const wallTextures: Record<string, CanvasImageSource> = {};
const itemTextures: Record<string, CanvasImageSource> = {};
const decorativeTextures: Partial<Record<DecorativeObjectType, CanvasImageSource>> = {};

// Texture cache for color variants (optimization)
const colorVariantCache = new Map<string, CanvasImageSource>();
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory issues

export function loadTextures(quality: number = TextureQuality.LOW): Promise<void[]> {
  textures[EnemyType.ZOMBIE] = createZombieTexture(quality);
  textures[EnemyType.MONSTER] = createMonsterTexture(quality);
  textures[EnemyType.GHOST] = createGhostTexture(quality);
  textures[EnemyType.DOG] = createDogTexture(quality);

  corpseTextures[EnemyType.ZOMBIE] = createZombieCorpseTexture(quality);
  corpseTextures[EnemyType.MONSTER] = createMonsterCorpseTexture(quality);
  corpseTextures[EnemyType.GHOST] = createGhostCorpseTexture(quality);
  corpseTextures[EnemyType.DOG] = createDogCorpseTexture(quality);

  // Wandtexturen erstellen
  wallTextures['brick'] = createBrickTexture(quality);
  wallTextures['wood'] = createWoodTexture(quality);
  wallTextures['stone'] = createStoneTexture(quality);
  wallTextures['door'] = createDoorTexture(quality);
  wallTextures['exitDoor'] = createExitDoorTexture(quality);

  // Item-Texturen erstellen
  itemTextures['HEALTH_SMALL'] = createHealthSmallTexture(quality);
  itemTextures['HEALTH_LARGE'] = createHealthLargeTexture(quality);
  itemTextures['TREASURE'] = createTreasureTexture(quality);
  itemTextures['AMMO'] = createAmmoTexture(quality);
  itemTextures['WEAPON'] = createWeaponTexture(quality);

  // Dekorative Objekt-Texturen erstellen
  decorativeTextures[DecorativeObjectType.CEILING_LIGHT] = createLightTexture(quality);
  decorativeTextures[DecorativeObjectType.VASE] = createVaseTexture(quality);
  decorativeTextures[DecorativeObjectType.CRATE] = createCrateTexture(quality);
  decorativeTextures[DecorativeObjectType.BENCH] = createBenchTexture(quality);
  decorativeTextures[DecorativeObjectType.TABLE] = createTableTexture(quality);
  decorativeTextures[DecorativeObjectType.CHAIR] = createChairTexture(quality);
  decorativeTextures[DecorativeObjectType.WINE_BOTTLE] = createWineBottleTexture(quality);
  decorativeTextures[DecorativeObjectType.SKELETON] = createSkeletonTexture(quality);

  return Promise.resolve([]);
}

function createZombieTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Detaillierter Zombie mit Gesichtszügen, Wunden und erkennbaren Händen ---

  // Beine (Hose)
  ctx.fillStyle = '#4B3A26'; // Dunkelbraun
  ctx.fillRect(20 * scale, 52 * scale, 8 * scale, 12 * scale);
  ctx.fillRect(36 * scale, 52 * scale, 8 * scale, 12 * scale);

  // Schuhe
  ctx.fillStyle = '#1A1A1A'; // Fast schwarz
  ctx.fillRect(18 * scale, 60 * scale, 10 * scale, 4 * scale);
  ctx.fillRect(34 * scale, 60 * scale, 10 * scale, 4 * scale);

  // Körper (zerrissenes Hemd) mit Farbverlauf
  const shirtGradient = ctx.createLinearGradient(16 * scale, 28 * scale, 48 * scale, 52 * scale);
  shirtGradient.addColorStop(0, '#8B0000'); // Dunkelrot
  shirtGradient.addColorStop(0.5, '#A52A2A'); // Braun-Rot
  shirtGradient.addColorStop(1, '#5A0000'); // Sehr dunkelrot
  ctx.fillStyle = shirtGradient;
  ctx.fillRect(16 * scale, 28 * scale, 32 * scale, 24 * scale);

  // Zerrissene Fetzen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(16 * scale, 50 * scale, 5 * scale, 5 * scale);
  ctx.fillRect(25 * scale, 48 * scale, 8 * scale, 8 * scale);
  ctx.fillRect(40 * scale, 50 * scale, 6 * scale, 6 * scale);

  // Blutflecken auf der Kleidung
  ctx.fillStyle = 'rgba(90, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(22 * scale, 35 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(38 * scale, 42 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(28 * scale, 48 * scale, 2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Arme mit mehreren Grüntönen
  const armGradient = ctx.createLinearGradient(0, 28 * scale, 0, 44 * scale);
  armGradient.addColorStop(0, '#2E8B57'); // Seegrün
  armGradient.addColorStop(0.5, '#3CB371'); // Mittelseegrün
  armGradient.addColorStop(1, '#90EE90'); // Hellgrün
  ctx.fillStyle = armGradient;
  ctx.fillRect(8 * scale, 28 * scale, 8 * scale, 16 * scale);
  ctx.fillRect(48 * scale, 28 * scale, 8 * scale, 16 * scale);

  // Linke Hand mit 5 erkennbaren Fingern
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(6 * scale, 44 * scale, 10 * scale, 6 * scale); // Handfläche
  // Finger
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(6 * scale, 50 * scale, 1.5 * scale, 4 * scale);   // Daumen
  ctx.fillRect(8 * scale, 50 * scale, 1.5 * scale, 5 * scale);   // Zeigefinger
  ctx.fillRect(10 * scale, 50 * scale, 1.5 * scale, 5 * scale);  // Mittelfinger
  ctx.fillRect(12 * scale, 50 * scale, 1.5 * scale, 4 * scale);  // Ringfinger
  ctx.fillRect(14 * scale, 50 * scale, 1.5 * scale, 3 * scale);  // Kleiner Finger

  // Rechte Hand mit 5 erkennbaren Fingern
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(48 * scale, 44 * scale, 10 * scale, 6 * scale); // Handfläche
  // Finger
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(48 * scale, 50 * scale, 1.5 * scale, 4 * scale);  // Daumen
  ctx.fillRect(50 * scale, 50 * scale, 1.5 * scale, 5 * scale);  // Zeigefinger
  ctx.fillRect(52 * scale, 50 * scale, 1.5 * scale, 5 * scale);  // Mittelfinger
  ctx.fillRect(54 * scale, 50 * scale, 1.5 * scale, 4 * scale);  // Ringfinger
  ctx.fillRect(56 * scale, 50 * scale, 1.5 * scale, 3 * scale);  // Kleiner Finger

  // Kopf mit mehreren Grüntönen
  const headGradient = ctx.createRadialGradient(32 * scale, 16 * scale, 2 * scale, 32 * scale, 16 * scale, 10 * scale);
  headGradient.addColorStop(0, '#90EE90'); // Hellgrün
  headGradient.addColorStop(0.5, '#3CB371'); // Mittelseegrün
  headGradient.addColorStop(1, '#2E8B57'); // Seegrün
  ctx.fillStyle = headGradient;
  ctx.fillRect(24 * scale, 8 * scale, 16 * scale, 16 * scale);

  // Wunden und Verfärbungen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(35 * scale, 9 * scale, 4 * scale, 6 * scale);  // Große Wunde rechts
  ctx.fillRect(26 * scale, 11 * scale, 3 * scale, 3 * scale); // Kleine Wunde links
  ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
  ctx.fillRect(30 * scale, 22 * scale, 4 * scale, 2 * scale); // Verfärbung am Kinn

  // Nase
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(31 * scale, 16 * scale, 2 * scale, 3 * scale);

  // Leuchtende gelbe Augen mit radialen Gradienten
  const eyeGradient = ctx.createRadialGradient(28 * scale, 14 * scale, 0.5 * scale, 28 * scale, 14 * scale, 3 * scale);
  eyeGradient.addColorStop(0, '#FFFF00'); // Gelb
  eyeGradient.addColorStop(0.6, '#FFD700'); // Gold
  eyeGradient.addColorStop(1, '#FF8C00'); // Dunkelorange
  ctx.fillStyle = eyeGradient;
  ctx.beginPath();
  ctx.arc(28 * scale, 14 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  const eyeGradient2 = ctx.createRadialGradient(36 * scale, 14 * scale, 0.5 * scale, 36 * scale, 14 * scale, 3 * scale);
  eyeGradient2.addColorStop(0, '#FFFF00');
  eyeGradient2.addColorStop(0.6, '#FFD700');
  eyeGradient2.addColorStop(1, '#FF8C00');
  ctx.fillStyle = eyeGradient2;
  ctx.beginPath();
  ctx.arc(36 * scale, 14 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Pupillen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(28 * scale, 14 * scale, 1 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(36 * scale, 14 * scale, 1 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Mund mit sichtbaren Zähnen
  ctx.fillStyle = '#000000';
  ctx.fillRect(28 * scale, 20 * scale, 8 * scale, 3 * scale); // Mund geöffnet

  // Zähne
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(28 * scale, 20 * scale, 1.5 * scale, 2 * scale);  // Zahn 1
  ctx.fillRect(30 * scale, 20 * scale, 1.5 * scale, 2 * scale);  // Zahn 2
  ctx.fillRect(32 * scale, 20 * scale, 1.5 * scale, 2 * scale);  // Zahn 3
  ctx.fillRect(34 * scale, 20 * scale, 1.5 * scale, 2 * scale);  // Zahn 4

  return canvas;
}

function createMonsterTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Detailliertes Monster mit muskulöser Struktur ---

  // Beine mit Muskelstruktur
  const legGradient = ctx.createLinearGradient(16 * scale, 54 * scale, 28 * scale, 64 * scale);
  legGradient.addColorStop(0, '#DC143C'); // Crimson
  legGradient.addColorStop(0.5, '#8B0000'); // Dunkelrot
  legGradient.addColorStop(1, '#5A0000'); // Sehr dunkelrot
  ctx.fillStyle = legGradient;
  scaledRect(ctx, 18, 54, 10, 10, scale);
  scaledRect(ctx, 36, 54, 10, 10, scale);

  // Muskelschattierungen an Beinen
  ctx.fillStyle = '#5A0000';
  scaledRect(ctx, 20, 56, 2, 8, scale);
  scaledRect(ctx, 38, 56, 2, 8, scale);

  // Klauen an Füßen
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 16, 62, 2, 3, scale);
  scaledRect(ctx, 19, 62, 2, 3, scale);
  scaledRect(ctx, 22, 62, 2, 3, scale);
  scaledRect(ctx, 34, 62, 2, 3, scale);
  scaledRect(ctx, 37, 62, 2, 3, scale);
  scaledRect(ctx, 40, 62, 2, 3, scale);

  // Muskulöser Körper mit mehreren Rottönen
  const bodyGradient = ctx.createRadialGradient(32 * scale, 38 * scale, 5 * scale, 32 * scale, 38 * scale, 22 * scale);
  bodyGradient.addColorStop(0, '#FF4500'); // Orangerot (Highlight)
  bodyGradient.addColorStop(0.4, '#DC143C'); // Crimson
  bodyGradient.addColorStop(0.7, '#8B0000'); // Dunkelrot
  bodyGradient.addColorStop(1, '#5A0000'); // Sehr dunkelrot (Schatten)
  ctx.fillStyle = bodyGradient;
  scaledRect(ctx, 14, 24, 36, 30, scale);

  // Sichtbare Muskelstruktur durch Schattierungen
  ctx.fillStyle = '#5A0000';
  // Brustmuskeln
  scaledRect(ctx, 22, 28, 8, 2, scale);
  scaledRect(ctx, 34, 28, 8, 2, scale);
  // Bauchmuskeln
  scaledRect(ctx, 28, 36, 8, 2, scale);
  scaledRect(ctx, 28, 42, 8, 2, scale);
  scaledRect(ctx, 28, 48, 8, 2, scale);
  // Seitliche Muskeln
  ctx.fillStyle = '#DC143C';
  scaledRect(ctx, 14, 30, 2, 20, scale);
  scaledRect(ctx, 48, 30, 2, 20, scale);

  // Arme mit Muskelstruktur
  const armGradient = ctx.createLinearGradient(0, 28 * scale, 0, 48 * scale);
  armGradient.addColorStop(0, '#DC143C');
  armGradient.addColorStop(0.5, '#8B0000');
  armGradient.addColorStop(1, '#5A0000');
  ctx.fillStyle = armGradient;
  scaledRect(ctx, 4, 28, 10, 20, scale);
  scaledRect(ctx, 50, 28, 10, 20, scale);

  // Muskelschattierungen an Armen
  ctx.fillStyle = '#5A0000';
  scaledRect(ctx, 6, 32, 2, 12, scale);
  scaledRect(ctx, 52, 32, 2, 12, scale);

  // Detaillierte Hände mit einzelnen Krallen
  ctx.fillStyle = '#8B0000';
  scaledRect(ctx, 2, 48, 10, 6, scale); // Linke Hand
  scaledRect(ctx, 52, 48, 10, 6, scale); // Rechte Hand

  // Linke Hand - 4 Krallen
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 2, 54, 2, 5, scale);   // Kralle 1
  scaledRect(ctx, 5, 54, 2, 6, scale);   // Kralle 2
  scaledRect(ctx, 8, 54, 2, 5, scale);   // Kralle 3
  scaledRect(ctx, 11, 54, 2, 4, scale);  // Kralle 4

  // Rechte Hand - 4 Krallen
  scaledRect(ctx, 52, 54, 2, 5, scale);  // Kralle 1
  scaledRect(ctx, 55, 54, 2, 6, scale);  // Kralle 2
  scaledRect(ctx, 58, 54, 2, 5, scale);  // Kralle 3
  scaledRect(ctx, 61, 54, 2, 4, scale);  // Kralle 4

  // Kopf mit Muskelstruktur
  const headGradient = ctx.createRadialGradient(32 * scale, 14 * scale, 3 * scale, 32 * scale, 14 * scale, 12 * scale);
  headGradient.addColorStop(0, '#DC143C');
  headGradient.addColorStop(0.6, '#8B0000');
  headGradient.addColorStop(1, '#5A0000');
  ctx.fillStyle = headGradient;
  scaledRect(ctx, 20, 6, 24, 18, scale);

  // Kiefermuskulatur
  ctx.fillStyle = '#5A0000';
  scaledRect(ctx, 20, 18, 4, 6, scale);
  scaledRect(ctx, 40, 18, 4, 6, scale);

  // Detaillierte 3D-Hörner mit Glanzeffekten
  // Linkes Horn
  const hornGradient1 = ctx.createLinearGradient(18 * scale, 0, 22 * scale, 6 * scale);
  hornGradient1.addColorStop(0, '#C0C0C0'); // Silber (Glanz)
  hornGradient1.addColorStop(0.3, '#E8E8E8'); // Helles Silber (Highlight)
  hornGradient1.addColorStop(0.7, '#A0A0A0'); // Mittelgrau
  hornGradient1.addColorStop(1, '#696969'); // Dunkelgrau (Schatten)
  ctx.fillStyle = hornGradient1;
  scaledPath(ctx, [{ x: 22, y: 6 }, { x: 18, y: -2 }, { x: 20, y: -2 }, { x: 24, y: 6 }], scale);

  // Glanzlicht auf linkem Horn
  ctx.fillStyle = '#FFFFFF';
  scaledRect(ctx, 21, 1, 1, 3, scale);

  // Rechtes Horn
  const hornGradient2 = ctx.createLinearGradient(42 * scale, 0, 46 * scale, 6 * scale);
  hornGradient2.addColorStop(0, '#C0C0C0');
  hornGradient2.addColorStop(0.3, '#E8E8E8');
  hornGradient2.addColorStop(0.7, '#A0A0A0');
  hornGradient2.addColorStop(1, '#696969');
  ctx.fillStyle = hornGradient2;
  scaledPath(ctx, [{ x: 42, y: 6 }, { x: 46, y: -2 }, { x: 44, y: -2 }, { x: 40, y: 6 }], scale);

  // Glanzlicht auf rechtem Horn
  ctx.fillStyle = '#FFFFFF';
  scaledRect(ctx, 43, 1, 1, 3, scale);

  // Leuchtende rot-gelbe Augen mit mehreren Schichten
  // Äußere Glühschicht
  const eyeGlow1 = ctx.createRadialGradient(26 * scale, 12 * scale, 1 * scale, 26 * scale, 12 * scale, 6 * scale);
  eyeGlow1.addColorStop(0, 'rgba(255, 255, 0, 0.8)'); // Gelb
  eyeGlow1.addColorStop(0.5, 'rgba(255, 69, 0, 0.5)'); // Orangerot
  eyeGlow1.addColorStop(1, 'rgba(255, 0, 0, 0)'); // Transparent rot
  ctx.fillStyle = eyeGlow1;
  scaledArc(ctx, 26, 12, 6, scale);

  const eyeGlow2 = ctx.createRadialGradient(38 * scale, 12 * scale, 1 * scale, 38 * scale, 12 * scale, 6 * scale);
  eyeGlow2.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
  eyeGlow2.addColorStop(0.5, 'rgba(255, 69, 0, 0.5)');
  eyeGlow2.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = eyeGlow2;
  scaledArc(ctx, 38, 12, 6, scale);

  // Mittlere Schicht - Rot
  ctx.fillStyle = '#FF0000';
  scaledArc(ctx, 26, 12, 4, scale);
  scaledArc(ctx, 38, 12, 4, scale);

  // Innere Schicht - Gelb
  const eyeCore1 = ctx.createRadialGradient(26 * scale, 12 * scale, 0, 26 * scale, 12 * scale, 3 * scale);
  eyeCore1.addColorStop(0, '#FFFF00'); // Helles Gelb
  eyeCore1.addColorStop(0.6, '#FFD700'); // Gold
  eyeCore1.addColorStop(1, '#FF8C00'); // Dunkelorange
  ctx.fillStyle = eyeCore1;
  scaledArc(ctx, 26, 12, 3, scale);

  const eyeCore2 = ctx.createRadialGradient(38 * scale, 12 * scale, 0, 38 * scale, 12 * scale, 3 * scale);
  eyeCore2.addColorStop(0, '#FFFF00');
  eyeCore2.addColorStop(0.6, '#FFD700');
  eyeCore2.addColorStop(1, '#FF8C00');
  ctx.fillStyle = eyeCore2;
  scaledArc(ctx, 38, 12, 3, scale);

  // Pupillen
  ctx.fillStyle = '#000000';
  scaledArc(ctx, 26, 12, 1, scale);
  scaledArc(ctx, 38, 12, 1, scale);

  // Geöffnetes Maul mit 6-8 sichtbaren Reißzähnen
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 24, 18, 16, 6, scale); // Geöffnetes Maul

  // Obere Reißzähne (4 Stück)
  ctx.fillStyle = '#FFFFFF';
  scaledPath(ctx, [{ x: 25, y: 18 }, { x: 26, y: 21 }, { x: 27, y: 18 }], scale);
  scaledPath(ctx, [{ x: 29, y: 18 }, { x: 30, y: 22 }, { x: 31, y: 18 }], scale);
  scaledPath(ctx, [{ x: 33, y: 18 }, { x: 34, y: 22 }, { x: 35, y: 18 }], scale);
  scaledPath(ctx, [{ x: 37, y: 18 }, { x: 38, y: 21 }, { x: 39, y: 18 }], scale);

  // Untere Reißzähne (4 Stück)
  scaledPath(ctx, [{ x: 26, y: 24 }, { x: 27, y: 21 }, { x: 28, y: 24 }], scale);
  scaledPath(ctx, [{ x: 30, y: 24 }, { x: 31, y: 20 }, { x: 32, y: 24 }], scale);
  scaledPath(ctx, [{ x: 34, y: 24 }, { x: 35, y: 20 }, { x: 36, y: 24 }], scale);
  scaledPath(ctx, [{ x: 38, y: 24 }, { x: 39, y: 21 }, { x: 40, y: 24 }], scale);

  return canvas;
}

function createGhostTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Detaillierter ätherischer Geist mit mehreren Transparenzebenen ---

  // Äußere nebelige Schicht (70% Transparenz)
  ctx.globalAlpha = 0.7;
  const outerMist = ctx.createRadialGradient(32 * scale, 36 * scale, 10 * scale, 32 * scale, 36 * scale, 35 * scale);
  outerMist.addColorStop(0, 'rgba(224, 255, 255, 0.8)'); // #E0FFFF - Hellcyan
  outerMist.addColorStop(0.5, 'rgba(176, 224, 230, 0.5)'); // #B0E0E6 - Puderblau
  outerMist.addColorStop(1, 'rgba(135, 206, 235, 0)'); // #87CEEB - Himmelblau (transparent)
  ctx.fillStyle = outerMist;

  // Wispy, nebelige Ränder mit fließender Form
  ctx.beginPath();
  ctx.moveTo(10 * scale, 60 * scale);
  ctx.bezierCurveTo(-2 * scale, 45 * scale, 5 * scale, 15 * scale, 32 * scale, 8 * scale);
  ctx.bezierCurveTo(59 * scale, 15 * scale, 66 * scale, 45 * scale, 54 * scale, 60 * scale);
  ctx.bezierCurveTo(48 * scale, 52 * scale, 40 * scale, 58 * scale, 32 * scale, 62 * scale);
  ctx.bezierCurveTo(24 * scale, 58 * scale, 16 * scale, 52 * scale, 10 * scale, 60 * scale);
  ctx.closePath();
  ctx.fill();

  // Mittlere ätherische Schicht (80% Transparenz)
  ctx.globalAlpha = 0.8;
  const middleLayer = ctx.createRadialGradient(32 * scale, 34 * scale, 8 * scale, 32 * scale, 34 * scale, 28 * scale);
  middleLayer.addColorStop(0, 'rgba(255, 255, 255, 0.95)'); // #FFFFFF - Weiß
  middleLayer.addColorStop(0.4, 'rgba(224, 255, 255, 0.8)'); // #E0FFFF - Hellcyan
  middleLayer.addColorStop(0.7, 'rgba(176, 224, 230, 0.6)'); // #B0E0E6 - Puderblau
  middleLayer.addColorStop(1, 'rgba(135, 206, 235, 0)'); // #87CEEB - Himmelblau (transparent)
  ctx.fillStyle = middleLayer;

  // Hauptkörper mit fließender, ätherischer Form
  ctx.beginPath();
  ctx.moveTo(12 * scale, 60 * scale);
  ctx.bezierCurveTo(0 * scale, 40 * scale, 10 * scale, 10 * scale, 32 * scale, 10 * scale);
  ctx.bezierCurveTo(54 * scale, 10 * scale, 64 * scale, 40 * scale, 52 * scale, 60 * scale);
  ctx.quadraticCurveTo(42 * scale, 50 * scale, 32 * scale, 62 * scale);
  ctx.quadraticCurveTo(22 * scale, 50 * scale, 12 * scale, 60 * scale);
  ctx.closePath();
  ctx.fill();

  // Innere Leuchtschicht (85% Transparenz)
  ctx.globalAlpha = 0.85;
  const innerGlow = ctx.createRadialGradient(32 * scale, 30 * scale, 2 * scale, 32 * scale, 30 * scale, 20 * scale);
  innerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Helles Zentrum
  innerGlow.addColorStop(0.3, 'rgba(240, 255, 255, 0.9)'); // Fast weiß
  innerGlow.addColorStop(0.6, 'rgba(224, 255, 255, 0.7)'); // #E0FFFF
  innerGlow.addColorStop(1, 'rgba(176, 224, 230, 0)'); // #B0E0E6 (transparent)
  ctx.fillStyle = innerGlow;
  scaledEllipse(ctx, 32, 30, 18, 22, 0, 0, Math.PI * 2, scale);

  // Zusätzliche innere Leuchteffekte (Energie-Wirbel)
  ctx.globalAlpha = 0.75;
  const energyGlow1 = ctx.createRadialGradient(28 * scale, 25 * scale, 1 * scale, 28 * scale, 25 * scale, 8 * scale);
  energyGlow1.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  energyGlow1.addColorStop(0.5, 'rgba(224, 255, 255, 0.6)');
  energyGlow1.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = energyGlow1;
  scaledArc(ctx, 28, 25, 8, scale);

  const energyGlow2 = ctx.createRadialGradient(36 * scale, 25 * scale, 1 * scale, 36 * scale, 25 * scale, 8 * scale);
  energyGlow2.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  energyGlow2.addColorStop(0.5, 'rgba(224, 255, 255, 0.6)');
  energyGlow2.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = energyGlow2;
  scaledArc(ctx, 36, 25, 8, scale);

  // Zentrale Leuchtenergie
  ctx.globalAlpha = 0.8;
  const coreGlow = ctx.createRadialGradient(32 * scale, 35 * scale, 1 * scale, 32 * scale, 35 * scale, 12 * scale);
  coreGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  coreGlow.addColorStop(0.4, 'rgba(240, 255, 255, 0.8)');
  coreGlow.addColorStop(1, 'rgba(224, 255, 255, 0)');
  ctx.fillStyle = coreGlow;
  scaledArc(ctx, 32, 35, 12, scale);

  // Zurücksetzen für Gesichtszüge
  ctx.globalAlpha = 1.0;

  // Hohle, leuchtende Augen mit mehreren Schichten
  // Äußerer Glüheffekt
  const eyeGlow1 = ctx.createRadialGradient(26 * scale, 28 * scale, 1 * scale, 26 * scale, 28 * scale, 8 * scale);
  eyeGlow1.addColorStop(0, 'rgba(135, 206, 235, 0.8)'); // #87CEEB - Himmelblau
  eyeGlow1.addColorStop(0.5, 'rgba(176, 224, 230, 0.5)'); // #B0E0E6
  eyeGlow1.addColorStop(1, 'rgba(135, 206, 235, 0)');
  ctx.fillStyle = eyeGlow1;
  scaledArc(ctx, 26, 28, 8, scale);

  const eyeGlow2 = ctx.createRadialGradient(40 * scale, 28 * scale, 1 * scale, 40 * scale, 28 * scale, 8 * scale);
  eyeGlow2.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
  eyeGlow2.addColorStop(0.5, 'rgba(176, 224, 230, 0.5)');
  eyeGlow2.addColorStop(1, 'rgba(135, 206, 235, 0)');
  ctx.fillStyle = eyeGlow2;
  scaledArc(ctx, 40, 28, 8, scale);

  // Hohle schwarze Augen
  ctx.fillStyle = '#000000';
  scaledArc(ctx, 26, 28, 5, scale);
  scaledArc(ctx, 40, 28, 5, scale);

  // Innerer Leuchteffekt in den Augen
  const eyeInnerGlow1 = ctx.createRadialGradient(26 * scale, 28 * scale, 0, 26 * scale, 28 * scale, 4 * scale);
  eyeInnerGlow1.addColorStop(0, 'rgba(224, 255, 255, 0.9)'); // #E0FFFF
  eyeInnerGlow1.addColorStop(0.6, 'rgba(176, 224, 230, 0.6)'); // #B0E0E6
  eyeInnerGlow1.addColorStop(1, 'rgba(135, 206, 235, 0.3)'); // #87CEEB
  ctx.fillStyle = eyeInnerGlow1;
  scaledArc(ctx, 26, 28, 4, scale);

  const eyeInnerGlow2 = ctx.createRadialGradient(40 * scale, 28 * scale, 0, 40 * scale, 28 * scale, 4 * scale);
  eyeInnerGlow2.addColorStop(0, 'rgba(224, 255, 255, 0.9)');
  eyeInnerGlow2.addColorStop(0.6, 'rgba(176, 224, 230, 0.6)');
  eyeInnerGlow2.addColorStop(1, 'rgba(135, 206, 235, 0.3)');
  ctx.fillStyle = eyeInnerGlow2;
  scaledArc(ctx, 40, 28, 4, scale);

  // Glanzpunkte in den Augen (heller)
  ctx.fillStyle = '#FFFFFF';
  scaledArc(ctx, 24, 26, 2, scale);
  scaledArc(ctx, 38, 26, 2, scale);

  // Kleinere Glanzpunkte
  scaledArc(ctx, 27, 29, 1, scale);
  scaledArc(ctx, 41, 29, 1, scale);

  // Gequälter Gesichtsausdruck mit gebogenem Mund
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(33 * scale, 40 * scale, 8 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Zusätzliche Munddetails für gequälten Ausdruck
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.arc(33 * scale, 41 * scale, 6 * scale, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();

  return canvas;
}

function createLightTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // Lichtschein (Gradient)
  const gradient = ctx.createRadialGradient(32 * scale, 32 * scale, 10 * scale, 32 * scale, 32 * scale, 30 * scale);
  gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)'); // Hellgelb
  gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.2)'); // Gelb transparent
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent

  ctx.fillStyle = gradient;
  scaledRect(ctx, 0, 0, 64, 64, scale);

  // Lampe selbst (Kreis in der Mitte)
  ctx.fillStyle = '#FFFFE0'; // Helles Gelb
  scaledArc(ctx, 32, 32, 8, scale);

  return canvas;
}

function createVaseTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // Vase Form
  ctx.fillStyle = '#8B4513'; // Braun
  ctx.beginPath();
  ctx.ellipse(32 * scale, 40 * scale, 12 * scale, 20 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vasenhals
  ctx.fillStyle = '#A0522D';
  scaledRect(ctx, 24, 10, 16, 15, scale);

  // Verzierung
  ctx.fillStyle = '#DAA520'; // Gold
  scaledRect(ctx, 24, 15, 16, 5, scale);

  return canvas;
}

function createCrateTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Braunes Quadrat mit Holzmaserung
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(8, 8, 48, 48);

  // Holzbretter
  ctx.fillStyle = '#654321';
  for (let x = 8; x < 56; x += 12) {
    ctx.fillRect(x, 8, 10, 48);
  }

  // Holzmaserung - horizontale Linien
  ctx.fillStyle = '#5D4037';
  for (let y = 12; y < 56; y += 6) {
    ctx.fillRect(8, y, 48, 1);
  }

  // Metallbeschläge an den Ecken
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(8, 8, 6, 6);
  ctx.fillRect(50, 8, 6, 6);
  ctx.fillRect(8, 50, 6, 6);
  ctx.fillRect(50, 50, 6, 6);

  // Schatten für 3D-Effekt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(8, 54, 48, 2);
  ctx.fillRect(54, 8, 2, 48);

  return canvas;
}

function createBenchTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // Sitzfläche
  ctx.fillStyle = '#8B4513';
  scaledRect(ctx, 4, 20, 56, 24, scale);

  // Beine
  ctx.fillStyle = '#4A3A2A';
  scaledRect(ctx, 8, 44, 4, 12, scale); // Links vorne
  scaledRect(ctx, 52, 44, 4, 12, scale); // Rechts vorne
  scaledRect(ctx, 8, 12, 4, 8, scale); // Links hinten (Lehne-Halter)
  scaledRect(ctx, 52, 12, 4, 8, scale); // Rechts hinten

  // Rücklehne
  ctx.fillStyle = '#A0522D';
  scaledRect(ctx, 4, 4, 56, 12, scale);

  // Holzmaserung
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  scaledRect(ctx, 4, 28, 56, 1, scale);
  scaledRect(ctx, 4, 36, 56, 1, scale);
  scaledRect(ctx, 4, 10, 56, 1, scale);

  return canvas;
}

function createTableTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Tischplatte
  const gradient = ctx.createRadialGradient(32, 24, 5, 32, 24, 28);
  gradient.addColorStop(0, '#A0522D');
  gradient.addColorStop(0.7, '#8B4513');
  gradient.addColorStop(1, '#654321');

  ctx.fillStyle = gradient;
  ctx.fillRect(8, 16, 48, 16);

  // Holzmaserung
  ctx.fillStyle = '#654321';
  for (let y = 18; y < 32; y += 4) {
    ctx.fillRect(8, y, 48, 1);
  }

  // Tischbeine
  ctx.fillStyle = '#654321';
  ctx.fillRect(12, 32, 6, 20);
  ctx.fillRect(46, 32, 6, 20);

  // Schatten
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(8, 30, 48, 2);

  return canvas;
}

function createChairTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Rückenlehne
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(20, 8, 24, 20);

  // Sitzfläche
  const gradient = ctx.createLinearGradient(0, 28, 0, 40);
  gradient.addColorStop(0, '#A0522D');
  gradient.addColorStop(1, '#8B4513');

  ctx.fillStyle = gradient;
  ctx.fillRect(16, 28, 32, 12);

  // Beine
  ctx.fillStyle = '#654321';
  ctx.fillRect(18, 40, 4, 16);
  ctx.fillRect(42, 40, 4, 16);

  // Details auf Rückenlehne
  ctx.fillStyle = '#654321';
  ctx.fillRect(24, 12, 2, 12);
  ctx.fillRect(38, 12, 2, 12);

  return canvas;
}

function createWineBottleTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // Flasche
  const bottleGradient = ctx.createLinearGradient(20 * scale, 0, 28 * scale, 0);
  bottleGradient.addColorStop(0, '#2F4F2F');
  bottleGradient.addColorStop(0.5, '#3A5F3A');
  bottleGradient.addColorStop(1, '#2F4F2F');

  ctx.fillStyle = bottleGradient;
  // Flaschenhals
  scaledRect(ctx, 22, 10, 4, 8, scale);
  // Flaschenkörper
  scaledRect(ctx, 20, 18, 8, 20, scale);

  // Etikett
  ctx.fillStyle = '#8B0000';
  scaledRect(ctx, 20, 24, 8, 6, scale);

  // Glanzlicht auf Flasche
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  scaledRect(ctx, 21, 20, 2, 10, scale);

  // Glas daneben
  const glassGradient = ctx.createLinearGradient(36 * scale, 0, 44 * scale, 0);
  glassGradient.addColorStop(0, 'rgba(200, 200, 255, 0.6)');
  glassGradient.addColorStop(0.5, 'rgba(220, 220, 255, 0.8)');
  glassGradient.addColorStop(1, 'rgba(200, 200, 255, 0.6)');

  ctx.fillStyle = glassGradient;
  scaledRect(ctx, 36, 26, 8, 12, scale);

  // Glanzlicht auf Glas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  scaledRect(ctx, 37, 28, 2, 6, scale);

  return canvas;
}

function createSkeletonTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // Knochen-Silhouette in Weiß
  ctx.fillStyle = '#E0E0E0';

  // Schädel
  scaledArc(ctx, 32, 20, 10, scale);

  // Augenhöhlen
  ctx.fillStyle = '#000000';
  scaledArc(ctx, 28, 18, 3, scale);
  scaledArc(ctx, 36, 18, 3, scale);

  // Wirbelsäule
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 30, 30, 4, 20, scale);

  // Rippen
  for (let i = 0; i < 4; i++) {
    const y = 32 + i * 4;
    scaledRect(ctx, 20, y, 10, 2, scale);
    scaledRect(ctx, 34, y, 10, 2, scale);
  }

  // Arme (liegend)
  scaledRect(ctx, 12, 36, 16, 3, scale);
  scaledRect(ctx, 36, 36, 16, 3, scale);

  // Beine (liegend)
  scaledRect(ctx, 24, 50, 3, 10, scale);
  scaledRect(ctx, 37, 50, 3, 10, scale);

  return canvas;
}

export function applyColorVariant(
  texture: CanvasImageSource,
  colorVariant: number
): CanvasImageSource {
  // Erstelle temporäres Canvas
  const canvas = document.createElement('canvas');
  canvas.width = (texture as HTMLCanvasElement).width || 64;
  canvas.height = (texture as HTMLCanvasElement).height || 64;
  const ctx = canvas.getContext('2d')!;

  // Zeichne Original-Textur
  ctx.drawImage(texture, 0, 0);

  // Wende Farbmodulation an (Hue-Shift basierend auf colorVariant)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Hue-Shift: colorVariant von 0-1 wird zu -30 bis +30 Grad
  const hueShift = (colorVariant - 0.5) * 60;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // RGB zu HSL konvertieren
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;

    if (max === min) {
      continue; // Graustufen, keine Farbänderung
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r / 255) {
      h = ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g / 255) {
      h = ((b / 255 - r / 255) / d + 2) / 6;
    } else {
      h = ((r / 255 - g / 255) / d + 4) / 6;
    }

    // Hue-Shift anwenden
    h = (h * 360 + hueShift) % 360;
    if (h < 0) h += 360;
    h = h / 360;

    // HSL zurück zu RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    data[i] = hue2rgb(p, q, h + 1 / 3) * 255;
    data[i + 1] = hue2rgb(p, q, h) * 255;
    data[i + 2] = hue2rgb(p, q, h - 1 / 3) * 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function getDecorativeTexture(
  objectType: DecorativeObjectType,
  colorVariant?: number
): CanvasImageSource | undefined {
  const baseTexture = decorativeTextures[objectType];
  if (!baseTexture) {
    return undefined;
  }

  // Wenn colorVariant angegeben ist und nicht 0.5 (neutral), wende Farbmodulation an
  if (colorVariant !== undefined && Math.abs(colorVariant - 0.5) > 0.01) {
    // Optimized: Check cache first
    const cacheKey = `${objectType}_${colorVariant.toFixed(2)}`;

    if (colorVariantCache.has(cacheKey)) {
      return colorVariantCache.get(cacheKey)!;
    }

    // Generate and cache the variant
    const variantTexture = applyColorVariant(baseTexture, colorVariant);

    // Limit cache size
    if (colorVariantCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry (first entry in Map)
      const firstKey = colorVariantCache.keys().next().value;
      if (firstKey !== undefined) {
        colorVariantCache.delete(firstKey);
      }
    }

    colorVariantCache.set(cacheKey, variantTexture);
    return variantTexture;
  }

  return baseTexture;
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

function createBrickTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // Hintergrund - Mörtel
  ctx.fillStyle = '#8B4513'; // D3D3D3' A98961FF
  scaledRect(ctx, 0, 0, 32, 32, scale);

  // Backstein-Muster
  ctx.fillStyle = '#D3D3D3';

  // Horizontale Backsteinreihen
  for (let y = 0; y < 32; y += 8) {
    // Versetzte Backsteine für realistisches Mauerwerk
    const offset = (y / 8) % 2 === 0 ? 0 : 16;

    for (let x = 0; x < 32; x += 32) {
      scaledRect(ctx, x + offset, y, 16, 4, scale);
    }
  }

  // Vertikale Fugen
  ctx.fillStyle = '#A0522D';
  for (let x = 0; x < 32; x += 16) {
    scaledRect(ctx, x, 0, 1, 32, scale);
  }

  return canvas;
}

function createWoodTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // Grundfarbe - dunkles Holz
  ctx.fillStyle = '#8B4513';
  scaledRect(ctx, 0, 0, 32, 32, scale);

  // Holztäfelung - vertikale Bretter
  ctx.fillStyle = '#654321';

  for (let x = 0; x < 32; x += 8) {
    scaledRect(ctx, x, 0, 4, 32, scale);

    // Fugen zwischen Brettern
    ctx.fillStyle = '#4A4A4A';
    scaledRect(ctx, x + 4, 0, 1, 32, scale);
    ctx.fillStyle = '#654321';
  }

  // Holzmaserung - horizontale Linien
  ctx.fillStyle = '#5D4037';
  for (let y = 4; y < 32; y += 8) {
    scaledRect(ctx, 0, y, 32, 1, scale);
  }

  return canvas;
}

function createStoneTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // Grundfarbe - grauer Stein
  ctx.fillStyle = '#708090';
  scaledRect(ctx, 0, 0, 32, 32, scale);

  // Große Steinblöcke mit verschiedenen Grautönen
  const stoneColors = ['#778899', '#696969', '#808080', '#2F4F4F'];

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      scaledRect(ctx, i * 16, j * 16, 16, 16, scale);

      // Schatten an den Rändern für 3D-Effekt
      ctx.fillStyle = '#2F4F4F';
      scaledRect(ctx, i * 16, j * 16, 16, 1, scale);
      scaledRect(ctx, i * 16, j * 16, 1, 16, scale);
    }
  }

  return canvas;
}

function createDoorTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // --- Verbesserte normale Tür mit detaillierter Holzmaserung und 3D-Effekt ---

  // Tür-Grundfarbe - dunkles Holz mit Farbverlauf
  const backgroundGradient = ctx.createLinearGradient(0, 0, 32 * scale, 32 * scale);
  backgroundGradient.addColorStop(0, '#654321'); // Dunkelbraun
  backgroundGradient.addColorStop(0.5, '#5A3A1A'); // Mittleres Braun
  backgroundGradient.addColorStop(1, '#4A2A0A'); // Sehr dunkelbraun
  ctx.fillStyle = backgroundGradient;
  scaledRect(ctx, 0, 0, 32, 32, scale);

  // Schatten an den Rändern für 3D-Wirkung (links und oben)
  ctx.fillStyle = '#2A1A0A'; // Sehr dunkel
  scaledRect(ctx, 0, 0, 1, 32, scale); // Linker Rand
  scaledRect(ctx, 0, 0, 32, 1, scale); // Oberer Rand

  // Highlights für 3D-Wirkung (rechts und unten)
  ctx.fillStyle = '#8B6A3A'; // Helleres Braun
  scaledRect(ctx, 31, 0, 1, 32, scale); // Rechter Rand
  scaledRect(ctx, 0, 31, 32, 1, scale); // Unterer Rand

  // Sichtbare Türfüllungen/Paneele mit vertikalen Brettern
  // Vier vertikale Bretter mit Holzmaserung
  for (let x = 0; x < 32; x += 8) {
    // Brett mit Farbverlauf
    const plankGradient = ctx.createLinearGradient(x * scale, 0, (x + 7) * scale, 0);
    plankGradient.addColorStop(0, '#6B4A2A'); // Dunkler
    plankGradient.addColorStop(0.3, '#8B4513'); // Mittel
    plankGradient.addColorStop(0.7, '#A0522D'); // Hell
    plankGradient.addColorStop(1, '#6B4A2A'); // Dunkler
    ctx.fillStyle = plankGradient;
    scaledRect(ctx, x + 1, 2, 6, 28, scale);

    // Holzmaserung - horizontale Linien für Textur
    ctx.fillStyle = '#5A3A1A';
    for (let y = 4; y < 30; y += 6) {
      scaledRect(ctx, x + 1, y, 6, 1, scale);
      // Zusätzliche feine Maserung
      ctx.fillStyle = 'rgba(90, 58, 26, 0.5)';
      scaledRect(ctx, x + 1, y + 2, 6, 1, scale);
      ctx.fillStyle = '#5A3A1A';
    }

    // Schatten auf der linken Seite jedes Bretts für 3D-Effekt
    ctx.fillStyle = 'rgba(42, 26, 10, 0.6)';
    scaledRect(ctx, x + 1, 2, 1, 28, scale);

    // Highlight auf der rechten Seite jedes Bretts
    ctx.fillStyle = 'rgba(160, 82, 45, 0.4)';
    scaledRect(ctx, x + 6, 2, 1, 28, scale);

    // Fugen zwischen den Brettern
    ctx.fillStyle = '#4A4A4A'; // Dunkelgrau
    scaledRect(ctx, x + 7, 0, 1, 32, scale);

    // Schatten in den Fugen für Tiefe
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    scaledRect(ctx, x + 7, 1, 1, 30, scale);
  }

  // Dunkle Metallscharniere (oben und unten, links)
  ctx.fillStyle = '#2A2A2A'; // Dunkelgrau/Schwarz

  // Oberes Scharnier
  scaledRect(ctx, 2, 6, 6, 3, scale);
  // Schrauben am oberen Scharnier
  ctx.fillStyle = '#1A1A1A';
  scaledRect(ctx, 3, 7, 1, 1, scale);
  scaledRect(ctx, 6, 7, 1, 1, scale);

  // Unteres Scharnier
  ctx.fillStyle = '#2A2A2A';
  scaledRect(ctx, 2, 23, 6, 3, scale);
  // Schrauben am unteren Scharnier
  ctx.fillStyle = '#1A1A1A';
  scaledRect(ctx, 3, 24, 1, 1, scale);
  scaledRect(ctx, 6, 24, 1, 1, scale);

  // Highlights auf Scharnieren für Metall-Effekt
  ctx.fillStyle = '#4A4A4A';
  scaledRect(ctx, 2, 6, 6, 1, scale); // Oberes Scharnier
  scaledRect(ctx, 2, 23, 6, 1, scale); // Unteres Scharnier

  // Goldener Türgriff auf der rechten Seite mit 3D-Effekt
  const handleGradient = ctx.createRadialGradient(26 * scale, 16 * scale, 1 * scale, 26 * scale, 16 * scale, 4 * scale);
  handleGradient.addColorStop(0, '#FFD700'); // Gold
  handleGradient.addColorStop(0.6, '#FFA500'); // Orange-Gold
  handleGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  ctx.fillStyle = handleGradient;
  scaledRect(ctx, 24, 14, 4, 4, scale);

  // Schatten unter dem Türgriff
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  scaledRect(ctx, 24, 17, 4, 1, scale);

  // Highlight auf dem Türgriff für Glanz
  ctx.fillStyle = '#FFFFE0'; // Helles Gelb
  scaledRect(ctx, 24, 14, 3, 1, scale);
  scaledRect(ctx, 24, 14, 1, 2, scale);

  // Türklinke mit 3D-Effekt
  const knobGradient = ctx.createLinearGradient(28 * scale, 15 * scale, 31 * scale, 17 * scale);
  knobGradient.addColorStop(0, '#FFD700'); // Gold
  knobGradient.addColorStop(0.5, '#FFA500'); // Orange-Gold
  knobGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  ctx.fillStyle = knobGradient;
  scaledRect(ctx, 28, 15, 3, 2, scale);

  // Schatten unter der Klinke
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  scaledRect(ctx, 28, 16, 3, 1, scale);

  // Highlight auf der Klinke
  ctx.fillStyle = '#FFFFE0';
  scaledRect(ctx, 28, 15, 2, 1, scale);

  return canvas;
}

function createExitDoorTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // --- Verbesserte Exit-Tür mit grüner Färbung und ähnlicher Struktur wie normale Tür ---

  // Leuchteffekt - heller Rand für Aufmerksamkeit (äußerer Glüheffekt)
  ctx.fillStyle = '#90EE90'; // Hellgrün
  scaledRect(ctx, 0, 0, 32, 32, scale);

  // Tür-Grundfarbe - grünes Holz mit Farbverlauf
  const backgroundGradient = ctx.createLinearGradient(0, 0, 32 * scale, 32 * scale);
  backgroundGradient.addColorStop(0, '#32CD32'); // Limettengrün (hell)
  backgroundGradient.addColorStop(0.5, '#228B22'); // Waldgrün (mittel)
  backgroundGradient.addColorStop(1, '#006400'); // Dunkelgrün
  ctx.fillStyle = backgroundGradient;
  scaledRect(ctx, 1, 1, 30, 30, scale);

  // Schatten an den Rändern für 3D-Wirkung (links und oben)
  ctx.fillStyle = '#004400'; // Sehr dunkelgrün
  scaledRect(ctx, 1, 1, 1, 30, scale); // Linker Rand
  scaledRect(ctx, 1, 1, 30, 1, scale); // Oberer Rand

  // Highlights für 3D-Wirkung (rechts und unten)
  ctx.fillStyle = '#4AE54A'; // Helleres Grün
  scaledRect(ctx, 30, 1, 1, 30, scale); // Rechter Rand
  scaledRect(ctx, 1, 30, 30, 1, scale); // Unterer Rand

  // Sichtbare Türfüllungen/Paneele mit vertikalen Brettern (ähnlich wie normale Tür)
  for (let x = 0; x < 32; x += 8) {
    // Brett mit Farbverlauf
    const plankGradient = ctx.createLinearGradient(x * scale, 0, (x + 7) * scale, 0);
    plankGradient.addColorStop(0, '#1A5A1A'); // Dunkler
    plankGradient.addColorStop(0.3, '#228B22'); // Mittel
    plankGradient.addColorStop(0.7, '#32CD32'); // Hell
    plankGradient.addColorStop(1, '#1A5A1A'); // Dunkler
    ctx.fillStyle = plankGradient;
    scaledRect(ctx, x + 2, 3, 5, 26, scale);

    // Holzmaserung - horizontale Linien für Textur
    ctx.fillStyle = '#1A5A1A';
    for (let y = 5; y < 28; y += 6) {
      scaledRect(ctx, x + 2, y, 5, 1, scale);
      // Zusätzliche feine Maserung
      ctx.fillStyle = 'rgba(26, 90, 26, 0.5)';
      scaledRect(ctx, x + 2, y + 2, 5, 1, scale);
      ctx.fillStyle = '#1A5A1A';
    }

    // Schatten auf der linken Seite jedes Bretts für 3D-Effekt
    ctx.fillStyle = 'rgba(0, 68, 0, 0.6)';
    scaledRect(ctx, x + 2, 3, 1, 26, scale);

    // Highlight auf der rechten Seite jedes Bretts
    ctx.fillStyle = 'rgba(74, 229, 74, 0.4)';
    scaledRect(ctx, x + 6, 3, 1, 26, scale);

    // Fugen zwischen den Brettern
    ctx.fillStyle = '#004400'; // Dunkelgrün
    scaledRect(ctx, x + 7, 1, 1, 30, scale);

    // Schatten in den Fugen für Tiefe
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    scaledRect(ctx, x + 7, 2, 1, 28, scale);
  }

  // Großes, gut sichtbares Exit-Symbol (X) in Gold - zentral positioniert
  // Äußerer Glüheffekt für das Symbol
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 8 * scale;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // X-Symbol mit dicken Linien für bessere Sichtbarkeit
  ctx.strokeStyle = '#FFD700'; // Gold
  ctx.lineWidth = 4 * scale;
  ctx.lineCap = 'round';

  // Diagonale von links oben nach rechts unten
  scaledPath(ctx, [{ x: 10, y: 10 }, { x: 22, y: 22 }], scale);
  ctx.stroke();

  // Diagonale von rechts oben nach links unten
  scaledPath(ctx, [{ x: 22, y: 10 }, { x: 10, y: 22 }], scale);
  ctx.stroke();

  // Schatten zurücksetzen
  ctx.shadowBlur = 0;

  // Zusätzliche Highlights auf dem X für mehr Kontrast
  ctx.strokeStyle = '#FFFFE0'; // Helles Gelb
  ctx.lineWidth = 2 * scale;

  // Highlight-Linien (etwas versetzt für 3D-Effekt)
  scaledPath(ctx, [{ x: 10, y: 10 }, { x: 21, y: 21 }], scale);
  ctx.stroke();

  scaledPath(ctx, [{ x: 22, y: 10 }, { x: 11, y: 21 }], scale);
  ctx.stroke();

  // Dunkler Rand um das X für hohen Kontrast
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5 * scale;
  ctx.globalAlpha = 0.3;

  scaledPath(ctx, [{ x: 10, y: 10 }, { x: 22, y: 22 }], scale);
  ctx.stroke();

  scaledPath(ctx, [{ x: 22, y: 10 }, { x: 10, y: 22 }], scale);
  ctx.stroke();

  ctx.globalAlpha = 1.0;

  return canvas;
}

function createHealthSmallTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // --- Verbessertes kleines Medi-Pack mit 3D-Effekt ---

  // Dunkler Rand für bessere Definition
  ctx.fillStyle = '#8B0000'; // Dunkelrot
  scaledRect(ctx, 0, 0, 32, 32, scale);

  // 3D-Box-Effekt mit Schattierungen - Hauptkörper
  const boxGradient = ctx.createLinearGradient(2 * scale, 2 * scale, 30 * scale, 30 * scale);
  boxGradient.addColorStop(0, '#FF4444'); // Hellrot (Highlight)
  boxGradient.addColorStop(0.5, '#FF0000'); // Rot
  boxGradient.addColorStop(1, '#CC0000'); // Dunkelrot (Schatten)
  ctx.fillStyle = boxGradient;
  scaledRect(ctx, 2, 2, 28, 28, scale);

  // Schatten für 3D-Effekt (unten und rechts)
  ctx.fillStyle = '#8B0000';
  scaledRect(ctx, 2, 29, 28, 1, scale); // Unten
  scaledRect(ctx, 29, 2, 1, 28, scale); // Rechts

  // Zusätzliche Schattierung für mehr Tiefe
  ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
  scaledRect(ctx, 3, 28, 26, 1, scale);
  scaledRect(ctx, 28, 3, 1, 26, scale);

  // Weiße Highlights für Plastik-Glanz-Effekt (oben und links)
  ctx.fillStyle = '#FFFFFF';
  scaledRect(ctx, 2, 2, 26, 1, scale); // Oben
  scaledRect(ctx, 2, 2, 1, 26, scale); // Links

  // Zusätzliche Highlights für mehr Glanz
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  scaledRect(ctx, 3, 3, 24, 1, scale);
  scaledRect(ctx, 3, 3, 1, 24, scale);

  // Deutliches weißes Kreuz auf rotem Hintergrund
  ctx.fillStyle = '#FFFFFF';
  scaledRect(ctx, 13, 7, 6, 18, scale);  // Vertikaler Balken
  scaledRect(ctx, 7, 13, 18, 6, scale);  // Horizontaler Balken

  // Schatten am Kreuz für 3D-Effekt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  scaledRect(ctx, 13, 24, 6, 1, scale); // Schatten unten am vertikalen Balken
  scaledRect(ctx, 24, 13, 1, 6, scale); // Schatten rechts am horizontalen Balken

  // Highlights am Kreuz für Plastik-Effekt
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  scaledRect(ctx, 13, 7, 6, 1, scale); // Highlight oben am vertikalen Balken
  scaledRect(ctx, 7, 13, 1, 6, scale); // Highlight links am horizontalen Balken

  return canvas;
}

function createHealthLargeTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Verbessertes großes Medi-Pack mit 3D-Effekt und visuellen Größenunterschieden ---

  // Dunkler Rand für bessere Definition (dicker als beim kleinen Pack)
  ctx.fillStyle = '#5A0000'; // Sehr dunkelrot
  ctx.fillRect(0, 0, 32, 32);

  // Zweiter Rand für mehr Tiefe
  ctx.fillStyle = '#8B0000'; // Dunkelrot
  ctx.fillRect(1, 1, 30, 30);

  // 3D-Box-Effekt mit Schattierungen - Hauptkörper
  const boxGradient = ctx.createLinearGradient(2, 2, 30, 30);
  boxGradient.addColorStop(0, '#FF4444'); // Hellrot (Highlight)
  boxGradient.addColorStop(0.3, '#FF0000'); // Rot
  boxGradient.addColorStop(0.7, '#CC0000'); // Dunkelrot
  boxGradient.addColorStop(1, '#8B0000'); // Sehr dunkelrot (Schatten)
  ctx.fillStyle = boxGradient;
  ctx.fillRect(2, 2, 28, 28);

  // Stärkere Schatten für 3D-Effekt (unten und rechts)
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(2, 29, 28, 1); // Unten
  ctx.fillRect(29, 2, 1, 28); // Rechts
  ctx.fillRect(3, 28, 26, 1); // Zusätzlicher Schatten unten
  ctx.fillRect(28, 3, 1, 26); // Zusätzlicher Schatten rechts

  // Noch mehr Schattierung für Tiefe
  ctx.fillStyle = 'rgba(90, 0, 0, 0.6)';
  ctx.fillRect(4, 27, 24, 1);
  ctx.fillRect(27, 4, 1, 24);

  // Weiße Highlights für Plastik-Glanz-Effekt (oben und links)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(2, 2, 26, 2); // Oben (dicker)
  ctx.fillRect(2, 2, 2, 26); // Links (dicker)

  // Zusätzliche Highlights für mehr Glanz
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(4, 4, 22, 1);
  ctx.fillRect(4, 4, 1, 22);

  // Sekundäre Highlights für starken Plastik-Effekt
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillRect(5, 5, 20, 1);
  ctx.fillRect(5, 5, 1, 20);

  // Deutliches weißes Kreuz (dickere Balken als beim kleinen Pack)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(11, 5, 10, 22);  // Vertikaler Balken (dicker)
  ctx.fillRect(5, 11, 22, 10);  // Horizontaler Balken (dicker)

  // Schatten am Kreuz für 3D-Effekt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(11, 26, 10, 1); // Schatten unten am vertikalen Balken
  ctx.fillRect(26, 11, 1, 10); // Schatten rechts am horizontalen Balken
  ctx.fillRect(12, 25, 8, 1); // Zusätzlicher Schatten
  ctx.fillRect(25, 12, 1, 8); // Zusätzlicher Schatten

  // Starke Highlights am Kreuz für Plastik-Effekt
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(11, 5, 10, 2); // Highlight oben am vertikalen Balken (dicker)
  ctx.fillRect(5, 11, 2, 10); // Highlight links am horizontalen Balken (dicker)

  // Sekundäre Highlights am Kreuz
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(12, 7, 8, 1);
  ctx.fillRect(7, 12, 1, 8);

  // Zusätzliche Details für "großes" Pack - Metallverschlüsse
  ctx.fillStyle = '#C0C0C0'; // Silber
  ctx.fillRect(6, 6, 2, 2); // Oben links
  ctx.fillRect(24, 6, 2, 2); // Oben rechts
  ctx.fillRect(6, 24, 2, 2); // Unten links
  ctx.fillRect(24, 24, 2, 2); // Unten rechts

  // Glanzpunkte auf Metallverschlüssen
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(6, 6, 1, 1);
  ctx.fillRect(24, 6, 1, 1);
  ctx.fillRect(6, 24, 1, 1);
  ctx.fillRect(24, 24, 1, 1);

  return canvas;
}

function createTreasureTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierter Kelch mit organischen Kurven und 3D-Effekt ---

  // Basis des Kelchs mit goldenem Farbverlauf
  const baseGradient = ctx.createLinearGradient(10, 26, 22, 30);
  baseGradient.addColorStop(0, '#FFD700'); // Gold
  baseGradient.addColorStop(0.5, '#FFA500'); // Orange
  baseGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  ctx.fillStyle = baseGradient;

  ctx.beginPath();
  ctx.moveTo(10, 28);
  ctx.bezierCurveTo(10, 30, 22, 30, 22, 28); // Untere Kurve
  ctx.lineTo(20, 24);
  ctx.lineTo(12, 24);
  ctx.closePath();
  ctx.fill();

  // Dunkler Rand für 3D-Effekt an der Basis
  ctx.strokeStyle = '#6B4A0A';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Schatten unter der Basis
  ctx.fillStyle = 'rgba(107, 74, 10, 0.5)';
  ctx.beginPath();
  ctx.ellipse(16, 30, 6, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stiel mit Farbverlauf und organischer Form
  const stemGradient = ctx.createLinearGradient(14, 24, 18, 12);
  stemGradient.addColorStop(0, '#B8860B'); // Dunkelgold
  stemGradient.addColorStop(0.3, '#FFA500'); // Orange
  stemGradient.addColorStop(0.7, '#FFD700'); // Gold
  stemGradient.addColorStop(1, '#FFA500'); // Orange
  ctx.fillStyle = stemGradient;

  ctx.beginPath();
  ctx.moveTo(14, 24);
  ctx.bezierCurveTo(13, 18, 13, 16, 14, 12); // Linke Seite mit Kurve
  ctx.lineTo(18, 12);
  ctx.bezierCurveTo(19, 16, 19, 18, 18, 24); // Rechte Seite mit Kurve
  ctx.closePath();
  ctx.fill();

  // Dunkler Rand am Stiel
  ctx.strokeStyle = '#6B4A0A';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Highlight auf dem Stiel (links)
  ctx.fillStyle = '#FFFFE0';
  ctx.fillRect(14.5, 14, 1, 8);

  // Knauf am Stiel (dekoratives Element)
  const knobGradient = ctx.createRadialGradient(16, 18, 1, 16, 18, 3);
  knobGradient.addColorStop(0, '#FFFFE0'); // Helles Highlight
  knobGradient.addColorStop(0.5, '#FFD700'); // Gold
  knobGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  ctx.fillStyle = knobGradient;
  ctx.beginPath();
  ctx.ellipse(16, 18, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#6B4A0A';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Oberteil des Kelchs (Schale) mit organischen Kurven
  const cupGradient = ctx.createRadialGradient(16, 8, 2, 16, 8, 12);
  cupGradient.addColorStop(0, '#FFFFE0'); // Helles Zentrum (Highlight)
  cupGradient.addColorStop(0.3, '#FFD700'); // Gold
  cupGradient.addColorStop(0.6, '#FFA500'); // Orange
  cupGradient.addColorStop(1, '#B8860B'); // Dunkelgold (Schatten)
  ctx.fillStyle = cupGradient;

  ctx.beginPath();
  ctx.moveTo(8, 12);
  // Linke Seite mit eleganter Kurve
  ctx.bezierCurveTo(6, 10, 5, 6, 8, 4);
  ctx.bezierCurveTo(10, 2, 12, 2, 16, 3);
  // Rechte Seite mit eleganter Kurve
  ctx.bezierCurveTo(20, 2, 22, 2, 24, 4);
  ctx.bezierCurveTo(27, 6, 26, 10, 24, 12);
  ctx.closePath();
  ctx.fill();

  // Dunkler Rand für 3D-Effekt
  ctx.strokeStyle = '#6B4A0A';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Innere Schattierung für Tiefe
  ctx.fillStyle = 'rgba(184, 134, 11, 0.4)';
  ctx.beginPath();
  ctx.moveTo(10, 12);
  ctx.bezierCurveTo(10, 10, 12, 8, 16, 8);
  ctx.bezierCurveTo(20, 8, 22, 10, 22, 12);
  ctx.closePath();
  ctx.fill();

  // Glanzlichter auf der Schale (mehrere für metallischen Effekt)
  ctx.fillStyle = '#FFFFE0';
  // Hauptglanzlicht links
  ctx.beginPath();
  ctx.ellipse(11, 6, 2, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Kleineres Glanzlicht rechts
  ctx.beginPath();
  ctx.ellipse(20, 7, 1.5, 2, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Sehr helles Highlight (Spitzlicht)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(10, 5, 1, 0, Math.PI * 2);
  ctx.fill();

  // Edelstein (roter Rubin) auf dem Knauf
  const gemGradient = ctx.createRadialGradient(16, 18, 0.5, 16, 18, 2);
  gemGradient.addColorStop(0, '#FF6B6B'); // Helles Rot (Glanz)
  gemGradient.addColorStop(0.5, '#FF0000'); // Rot
  gemGradient.addColorStop(1, '#8B0000'); // Dunkelrot
  ctx.fillStyle = gemGradient;
  ctx.beginPath();
  ctx.arc(16, 18, 2, 0, Math.PI * 2);
  ctx.fill();

  // Dunkler Rand am Edelstein
  ctx.strokeStyle = '#5A0000';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Glanzpunkt auf dem Edelstein
  ctx.fillStyle = '#FFB6C1';
  ctx.beginPath();
  ctx.arc(15.5, 17.5, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Zusätzlicher blauer Edelstein auf der Schale (Akzent)
  const blueGemGradient = ctx.createRadialGradient(16, 6, 0.3, 16, 6, 1.5);
  blueGemGradient.addColorStop(0, '#87CEEB'); // Hellblau (Glanz)
  blueGemGradient.addColorStop(0.5, '#0000FF'); // Blau
  blueGemGradient.addColorStop(1, '#00008B'); // Dunkelblau
  ctx.fillStyle = blueGemGradient;
  ctx.beginPath();
  ctx.arc(16, 6, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Dunkler Rand am blauen Edelstein
  ctx.strokeStyle = '#000080';
  ctx.lineWidth = 0.4;
  ctx.stroke();

  // Glanzpunkt auf dem blauen Edelstein
  ctx.fillStyle = '#ADD8E6';
  ctx.beginPath();
  ctx.arc(15.7, 5.7, 0.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createAmmoTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // --- Militärische Munitionskiste mit detailliertem 3D-Effekt ---

  // Hauptkörper der Kiste mit Farbverlauf für 3D-Effekt
  const boxGradient = ctx.createLinearGradient(4 * scale, 10 * scale, 28 * scale, 28 * scale);
  boxGradient.addColorStop(0, '#6B8E23'); // Olivgrün (Highlight)
  boxGradient.addColorStop(0.5, '#556B2F'); // Dunkelolivgrün
  boxGradient.addColorStop(1, '#3A4A1F'); // Sehr dunkel (Schatten)
  ctx.fillStyle = boxGradient;
  scaledRect(ctx, 4, 10, 24, 18, scale);

  // Schattierungen für Tiefenwirkung - rechte Seite
  ctx.fillStyle = '#2A3A0F';
  scaledRect(ctx, 27, 11, 1, 17, scale); // Rechter Rand
  scaledRect(ctx, 26, 12, 1, 15, scale); // Zusätzlicher Schatten

  // Schattierungen für Tiefenwirkung - untere Seite
  ctx.fillStyle = '#2A3A0F';
  scaledRect(ctx, 5, 27, 22, 1, scale); // Unterer Rand
  scaledRect(ctx, 6, 26, 20, 1, scale); // Zusätzlicher Schatten

  // Highlights für 3D-Effekt - obere und linke Seite
  ctx.fillStyle = '#7A9E33';
  scaledRect(ctx, 4, 10, 23, 1, scale); // Oberer Rand
  scaledRect(ctx, 4, 11, 1, 16, scale); // Linker Rand

  // Deckel mit dunklerer Farbe
  const lidGradient = ctx.createLinearGradient(2 * scale, 6 * scale, 30 * scale, 10 * scale);
  lidGradient.addColorStop(0, '#4A5A2F'); // Mittleres Olivgrün
  lidGradient.addColorStop(0.5, '#3A4A1F'); // Dunkel
  lidGradient.addColorStop(1, '#2A3A0F'); // Sehr dunkel
  ctx.fillStyle = lidGradient;
  scaledRect(ctx, 2, 6, 28, 4, scale);

  // Deckel-Schattierung
  ctx.fillStyle = '#1A2A0F';
  scaledRect(ctx, 2, 9, 28, 1, scale); // Schatten unter dem Deckel

  // Deckel-Highlight
  ctx.fillStyle = '#5A6A3F';
  scaledRect(ctx, 2, 6, 28, 1, scale); // Highlight oben

  // Schwarze Riemen über die Kiste (2 Riemen)
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 10, 6, 3, 22, scale); // Linker Riemen
  scaledRect(ctx, 19, 6, 3, 22, scale); // Rechter Riemen

  // Riemen-Highlights für Leder-Effekt
  ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
  scaledRect(ctx, 10, 6, 1, 22, scale); // Linker Riemen Highlight
  scaledRect(ctx, 19, 6, 1, 22, scale); // Rechter Riemen Highlight

  // Metallschnallen an den Riemen
  ctx.fillStyle = '#696969'; // Dunkelgrau
  scaledRect(ctx, 10, 14, 3, 4, scale); // Linke Schnalle
  scaledRect(ctx, 19, 14, 3, 4, scale); // Rechte Schnalle

  // Schnallen-Highlights
  ctx.fillStyle = '#A0A0A0';
  scaledRect(ctx, 10, 14, 3, 1, scale); // Linke Schnalle Highlight
  scaledRect(ctx, 19, 14, 3, 1, scale); // Rechte Schnalle Highlight

  // Weißes Label für "AMMO" Beschriftung
  ctx.fillStyle = '#FFFFFF';
  scaledRect(ctx, 13, 16, 6, 6, scale);

  // Label-Rand
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 0.5 * scale;
  ctx.strokeRect(13 * scale, 16 * scale, 6 * scale, 6 * scale);

  // "AMMO" Beschriftung
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${4 * scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AMMO', 16 * scale, 19 * scale);

  // Sichtbare Patronenspitzen in Gold (3-4 Stück)
  const bulletGradient = ctx.createRadialGradient(8 * scale, 24 * scale, 0, 8 * scale, 24 * scale, 2 * scale);
  bulletGradient.addColorStop(0, '#FFD700'); // Gold
  bulletGradient.addColorStop(0.7, '#DAA520'); // Goldenrod
  bulletGradient.addColorStop(1, '#B8860B'); // Dunkelgold

  // Patrone 1 (links)
  ctx.fillStyle = bulletGradient;
  scaledArc(ctx, 6, 24, 1.5, scale);

  // Patronenhülse
  ctx.fillStyle = '#B8860B';
  scaledRect(ctx, 5, 25, 2, 2, scale);

  // Patrone 2
  const bulletGradient2 = ctx.createRadialGradient(14 * scale, 24 * scale, 0, 14 * scale, 24 * scale, 2 * scale);
  bulletGradient2.addColorStop(0, '#FFD700');
  bulletGradient2.addColorStop(0.7, '#DAA520');
  bulletGradient2.addColorStop(1, '#B8860B');
  ctx.fillStyle = bulletGradient2;
  scaledArc(ctx, 14, 24, 1.5, scale);

  ctx.fillStyle = '#B8860B';
  scaledRect(ctx, 13, 25, 2, 2, scale);

  // Patrone 3
  const bulletGradient3 = ctx.createRadialGradient(18 * scale, 24 * scale, 0, 18 * scale, 24 * scale, 2 * scale);
  bulletGradient3.addColorStop(0, '#FFD700');
  bulletGradient3.addColorStop(0.7, '#DAA520');
  bulletGradient3.addColorStop(1, '#B8860B');
  ctx.fillStyle = bulletGradient3;
  scaledArc(ctx, 18, 24, 1.5, scale);

  ctx.fillStyle = '#B8860B';
  scaledRect(ctx, 17, 25, 2, 2, scale);

  // Patrone 4 (rechts)
  const bulletGradient4 = ctx.createRadialGradient(26 * scale, 24 * scale, 0, 26 * scale, 24 * scale, 2 * scale);
  bulletGradient4.addColorStop(0, '#FFD700');
  bulletGradient4.addColorStop(0.7, '#DAA520');
  bulletGradient4.addColorStop(1, '#B8860B');
  ctx.fillStyle = bulletGradient4;
  scaledArc(ctx, 26, 24, 1.5, scale);

  ctx.fillStyle = '#B8860B';
  scaledRect(ctx, 25, 25, 2, 2, scale);

  // Highlights auf Patronenspitzen für metallischen Glanz
  ctx.fillStyle = '#FFFFE0';
  scaledArc(ctx, 5.5, 23.5, 0.5, scale);
  scaledArc(ctx, 13.5, 23.5, 0.5, scale);
  scaledArc(ctx, 17.5, 23.5, 0.5, scale);
  scaledArc(ctx, 25.5, 23.5, 0.5, scale);

  return canvas;
}

function createWeaponTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 32; // Original was 32x32

  // --- Detailliertes Sturmgewehr mit erkennbaren Komponenten ---

  // Schulterstütze (hinten) mit metallischem Farbverlauf
  const stockGradient = ctx.createLinearGradient(2 * scale, 13 * scale, 2 * scale, 17 * scale);
  stockGradient.addColorStop(0, '#4A4A4A'); // Hellgrau
  stockGradient.addColorStop(0.5, '#2A2A2A'); // Mittelgrau
  stockGradient.addColorStop(1, '#1A1A1A'); // Dunkelgrau
  ctx.fillStyle = stockGradient;
  scaledRect(ctx, 2, 13, 5, 4, scale); // Hauptteil der Stütze

  // Schulterstütze - Verbindung zum Körper
  ctx.fillStyle = '#2A2A2A';
  scaledRect(ctx, 6, 14, 2, 2, scale);

  // Highlight auf Schulterstütze für Metall-Glanz
  ctx.fillStyle = '#696969';
  scaledRect(ctx, 2, 13, 5, 1, scale);

  // Hauptkörper der Waffe (Receiver) mit metallischem Farbverlauf
  const bodyGradient = ctx.createLinearGradient(8 * scale, 11 * scale, 8 * scale, 19 * scale);
  bodyGradient.addColorStop(0, '#4A4A4A'); // Hellgrau (Highlight)
  bodyGradient.addColorStop(0.3, '#2A2A2A'); // Mittelgrau
  bodyGradient.addColorStop(0.7, '#1A1A1A'); // Dunkelgrau
  bodyGradient.addColorStop(1, '#0A0A0A'); // Sehr dunkelgrau (Schatten)
  ctx.fillStyle = bodyGradient;
  scaledRect(ctx, 8, 11, 14, 8, scale); // Hauptkörper

  // Obere Schiene (Rail) für Visier
  ctx.fillStyle = '#1A1A1A';
  scaledRect(ctx, 10, 10, 10, 1, scale);

  // Schatten am Hauptkörper für 3D-Effekt
  ctx.fillStyle = '#0A0A0A';
  scaledRect(ctx, 8, 18, 14, 1, scale); // Unten
  scaledRect(ctx, 21, 11, 1, 8, scale); // Rechts

  // Highlights am Hauptkörper für Metall-Glanz
  ctx.fillStyle = '#696969';
  scaledRect(ctx, 8, 11, 14, 1, scale); // Oben
  scaledRect(ctx, 8, 11, 1, 8, scale); // Links

  // Zusätzliche Highlights für starken Metall-Effekt
  ctx.fillStyle = '#8A8A8A';
  scaledRect(ctx, 9, 12, 12, 1, scale);
  scaledRect(ctx, 9, 12, 1, 6, scale);

  // Lauf mit metallischem Farbverlauf
  const barrelGradient = ctx.createLinearGradient(22 * scale, 14 * scale, 30 * scale, 14 * scale);
  barrelGradient.addColorStop(0, '#3A3A3A');
  barrelGradient.addColorStop(0.5, '#5A5A5A');
  barrelGradient.addColorStop(1, '#2A2A2A');
  ctx.fillStyle = barrelGradient;
  scaledRect(ctx, 22, 14, 8, 2, scale);

  // Mündung (etwas breiter)
  ctx.fillStyle = '#1A1A1A';
  scaledRect(ctx, 30, 13, 1, 4, scale);

  // Mündungsfeuer-Dämpfer (Schlitze)
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 29, 14, 1, 2, scale);

  // Vordergriff / Handschutz
  ctx.fillStyle = '#2F4F2F'; // Dunkelgrün (Armee-Look)
  scaledRect(ctx, 22, 16, 6, 3, scale);

  // Struktur auf Handschutz
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  scaledRect(ctx, 23, 16, 1, 3, scale);
  scaledRect(ctx, 25, 16, 1, 3, scale);
  scaledRect(ctx, 27, 16, 1, 3, scale);

  // Magazin (gebogen angedeutet)
  const magGradient = ctx.createLinearGradient(14 * scale, 19 * scale, 18 * scale, 25 * scale);
  magGradient.addColorStop(0, '#3A3A3A');
  magGradient.addColorStop(1, '#1A1A1A');
  ctx.fillStyle = magGradient;
  ctx.fillRect(14, 21, 4, 1);
  ctx.fillRect(14, 23, 4, 1);
  ctx.fillRect(14, 25, 4, 1);

  // Griff (Pistol Grip) mit ergonomischer Form
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.moveTo(10, 19);
  ctx.lineTo(8, 27);
  ctx.lineTo(11, 27);
  ctx.lineTo(13, 19);
  ctx.closePath();
  ctx.fill();

  // Griff - Textur für besseren Halt
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(9, 21, 3, 1);
  ctx.fillRect(9, 23, 3, 1);
  ctx.fillRect(9, 25, 3, 1);

  // Highlight am Griff
  ctx.fillStyle = '#2A2A2A';
  ctx.beginPath();
  ctx.moveTo(10, 19);
  ctx.lineTo(10, 20);
  ctx.lineTo(11, 19);
  ctx.closePath();
  ctx.fill();

  // Abzug (Trigger)
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(11, 17, 2, 3);

  // Abzugsbügel (Trigger Guard)
  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(12, 18, 2, 0, Math.PI);
  ctx.stroke();

  // Highlight am Abzug
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(11, 17, 2, 1);

  // Schrauben und kleine Details für Realismus
  ctx.fillStyle = '#0A0A0A';
  // Schrauben am Hauptkörper
  ctx.fillRect(9, 13, 1, 1);
  ctx.fillRect(9, 16, 1, 1);
  ctx.fillRect(15, 13, 1, 1);
  ctx.fillRect(20, 13, 1, 1);

  // Highlights auf Schrauben (Metall-Glanz)
  ctx.fillStyle = '#696969';
  ctx.fillRect(9, 13, 1, 0.5);
  ctx.fillRect(15, 13, 1, 0.5);
  ctx.fillRect(20, 13, 1, 0.5);

  // Auswurfschacht (Ejection Port) - Detail
  ctx.fillStyle = '#000000';
  ctx.fillRect(16, 12, 3, 2);

  // Highlight am Auswurfschacht
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(16, 12, 3, 1);

  // Zusätzliche Glanzlichter für starken Metall-Effekt
  ctx.fillStyle = 'rgba(138, 138, 138, 0.6)';
  ctx.fillRect(10, 12, 1, 1); // Glanzpunkt 1
  ctx.fillRect(17, 13, 1, 1); // Glanzpunkt 2
  ctx.fillRect(24, 13, 1, 1); // Glanzpunkt 3 am Lauf

  return canvas;
}

function createZombieCorpseTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // Blutlache (größer und realistischer)
  const bloodGradient = ctx.createRadialGradient(32 * scale, 54 * scale, 5 * scale, 32 * scale, 54 * scale, 28 * scale);
  bloodGradient.addColorStop(0, '#8B0000'); // Dunkelrot
  bloodGradient.addColorStop(0.5, '#5A0000'); // Sehr dunkelrot
  bloodGradient.addColorStop(1, 'rgba(90, 0, 0, 0.3)'); // Transparent
  ctx.fillStyle = bloodGradient;
  scaledEllipse(ctx, 32, 54, 28, 12, 0, 0, Math.PI * 2, scale);

  // Liegender Körper (zerrissenes Hemd)
  ctx.fillStyle = '#5A0000'; // Dunkelrotes Hemd
  scaledRect(ctx, 14, 48, 36, 10, scale); // Hauptkörper

  // Körper-Schattierung
  ctx.fillStyle = '#3A0000';
  scaledRect(ctx, 14, 48, 36, 2, scale); // Oberer Schatten

  // Linker Arm ausgestreckt
  ctx.fillStyle = '#2E8B57'; // Grüne Haut
  scaledRect(ctx, 6, 50, 10, 6, scale);
  // Linke Hand
  ctx.fillStyle = '#3CB371';
  scaledRect(ctx, 4, 52, 4, 4, scale);
  // Finger angedeutet
  ctx.fillStyle = '#2E8B57';
  scaledRect(ctx, 2, 53, 2, 1, scale);
  scaledRect(ctx, 2, 55, 2, 1, scale);

  // Rechter Arm ausgestreckt
  ctx.fillStyle = '#2E8B57';
  scaledRect(ctx, 48, 50, 10, 6, scale);
  // Rechte Hand
  ctx.fillStyle = '#3CB371';
  scaledRect(ctx, 56, 52, 4, 4, scale);
  // Finger angedeutet
  ctx.fillStyle = '#2E8B57';
  scaledRect(ctx, 60, 53, 2, 1, scale);
  scaledRect(ctx, 60, 55, 2, 1, scale);

  // Kopf (seitlich liegend)
  ctx.fillStyle = '#3CB371'; // Grüne Haut
  scaledRect(ctx, 26, 44, 12, 8, scale);

  // Wunde am Kopf
  ctx.fillStyle = '#5A0000';
  scaledRect(ctx, 32, 45, 4, 3, scale);

  // Beine (angewinkelt)
  ctx.fillStyle = '#4B3A26'; // Braune Hose
  scaledRect(ctx, 18, 56, 8, 6, scale);
  scaledRect(ctx, 38, 56, 8, 6, scale);

  // Schuhe
  ctx.fillStyle = '#1A1A1A';
  scaledRect(ctx, 16, 58, 6, 4, scale);
  scaledRect(ctx, 40, 58, 6, 4, scale);

  return canvas;
}

function createMonsterCorpseTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Zusammengesunkener Monster-Leichnam ---

  // Blutlache
  const bloodGradient = ctx.createRadialGradient(32 * scale, 54 * scale, 5 * scale, 32 * scale, 54 * scale, 30 * scale);
  bloodGradient.addColorStop(0, '#8B0000'); // Dunkelrot
  bloodGradient.addColorStop(0.5, '#5A0000'); // Sehr dunkelrot
  bloodGradient.addColorStop(1, 'rgba(90, 0, 0, 0.2)'); // Transparent
  ctx.fillStyle = bloodGradient;
  scaledEllipse(ctx, 32, 56, 32, 14, 0, 0, Math.PI * 2, scale);

  // Zusammengesunkener Körper (flach)
  const corpseGradient = ctx.createRadialGradient(32 * scale, 52 * scale, 5 * scale, 32 * scale, 52 * scale, 24 * scale);
  corpseGradient.addColorStop(0, '#5A0000'); // Sehr dunkelrot
  corpseGradient.addColorStop(0.5, '#3A0000'); // Fast schwarz-rot
  corpseGradient.addColorStop(1, '#2A0000'); // Sehr dunkel
  ctx.fillStyle = corpseGradient;
  scaledEllipse(ctx, 32, 52, 26, 12, 0, 0, Math.PI * 2, scale);

  // Muskelstruktur noch sichtbar (Schattierungen)
  ctx.fillStyle = '#1A0000';
  scaledRect(ctx, 28, 48, 8, 2, scale);
  scaledRect(ctx, 28, 52, 8, 2, scale);
  scaledRect(ctx, 28, 56, 8, 2, scale);

  // Ausgestreckte Arme
  ctx.fillStyle = '#3A0000';
  scaledEllipse(ctx, 12, 52, 8, 4, 0, 0, Math.PI * 2, scale);
  scaledEllipse(ctx, 52, 52, 8, 4, 0, 0, Math.PI * 2, scale);

  // Klauen noch sichtbar
  ctx.fillStyle = '#808080';
  scaledRect(ctx, 6, 52, 2, 3, scale);
  scaledRect(ctx, 9, 52, 2, 3, scale);
  scaledRect(ctx, 56, 52, 2, 3, scale);
  scaledRect(ctx, 59, 52, 2, 3, scale);

  // Beine zusammengesunken
  ctx.fillStyle = '#3A0000';
  scaledEllipse(ctx, 22, 58, 6, 4, 0, 0, Math.PI * 2, scale);
  scaledEllipse(ctx, 42, 58, 6, 4, 0, 0, Math.PI * 2, scale);

  // Kopf seitlich liegend
  ctx.fillStyle = '#4A0000';
  scaledRect(ctx, 26, 44, 12, 8, scale);

  // Hörner noch sichtbar (seitlich)
  const hornGradient = ctx.createLinearGradient(10 * scale, 44 * scale, 18 * scale, 48 * scale);
  hornGradient.addColorStop(0, '#A0A0A0');
  hornGradient.addColorStop(0.5, '#808080');
  hornGradient.addColorStop(1, '#505050');
  ctx.fillStyle = hornGradient;
  scaledRect(ctx, 10, 44, 10, 4, scale); // Linkes Horn

  const hornGradient2 = ctx.createLinearGradient(44 * scale, 44 * scale, 52 * scale, 48 * scale);
  hornGradient2.addColorStop(0, '#A0A0A0');
  hornGradient2.addColorStop(0.5, '#808080');
  hornGradient2.addColorStop(1, '#505050');
  ctx.fillStyle = hornGradient2;
  scaledRect(ctx, 44, 44, 10, 4, scale); // Rechtes Horn

  // Hornspitzen
  ctx.fillStyle = '#C0C0C0';
  scaledRect(ctx, 8, 44, 3, 2, scale);
  scaledRect(ctx, 53, 44, 3, 2, scale);

  // Erloschene Augen
  ctx.fillStyle = '#1A0000';
  scaledArc(ctx, 30, 47, 2, scale);
  scaledArc(ctx, 34, 47, 2, scale);

  return canvas;
}

function createGhostCorpseTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Verblassender Geist mit mehreren Transparenzebenen ---

  // Äußerste Schicht - fast vollständig verblasst (30% Transparenz)
  ctx.globalAlpha = 0.3;
  const outerFade = ctx.createRadialGradient(32 * scale, 52 * scale, 8 * scale, 32 * scale, 52 * scale, 32 * scale);
  outerFade.addColorStop(0, 'rgba(176, 224, 230, 0.4)'); // #B0E0E6 - Puderblau
  outerFade.addColorStop(0.5, 'rgba(135, 206, 235, 0.2)'); // #87CEEB - Himmelblau
  outerFade.addColorStop(1, 'rgba(135, 206, 235, 0)'); // Vollständig transparent
  ctx.fillStyle = outerFade;

  // Verblassende Geisterform (flach am Boden)
  scaledEllipse(ctx, 32, 52, 28, 10, 0, 0, Math.PI * 2, scale);

  // Mittlere Schicht - stärker sichtbar (45% Transparenz)
  ctx.globalAlpha = 0.45;
  const middleFade = ctx.createRadialGradient(32 * scale, 50 * scale, 5 * scale, 32 * scale, 50 * scale, 22 * scale);
  middleFade.addColorStop(0, 'rgba(200, 220, 255, 0.6)'); // Hellblau
  middleFade.addColorStop(0.5, 'rgba(176, 224, 230, 0.4)'); // #B0E0E6
  middleFade.addColorStop(1, 'rgba(135, 206, 235, 0)'); // #87CEEB (transparent)
  ctx.fillStyle = middleFade;
  scaledEllipse(ctx, 32, 50, 22, 8, 0, 0, Math.PI * 2, scale);

  // Innere Schicht - noch erkennbar (55% Transparenz)
  ctx.globalAlpha = 0.55;
  const innerFade = ctx.createRadialGradient(32 * scale, 48 * scale, 3 * scale, 32 * scale, 48 * scale, 16 * scale);
  innerFade.addColorStop(0, 'rgba(224, 255, 255, 0.7)'); // #E0FFFF - Hellcyan
  innerFade.addColorStop(0.5, 'rgba(200, 220, 255, 0.5)');
  innerFade.addColorStop(1, 'rgba(176, 224, 230, 0)'); // #B0E0E6 (transparent)
  ctx.fillStyle = innerFade;
  scaledEllipse(ctx, 32, 48, 16, 6, 0, 0, Math.PI * 2, scale);

  // Kern - letzter Rest der Energie (65% Transparenz)
  ctx.globalAlpha = 0.65;
  const coreFade = ctx.createRadialGradient(32 * scale, 48 * scale, 1 * scale, 32 * scale, 48 * scale, 10 * scale);
  coreFade.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Weißer Kern
  coreFade.addColorStop(0.4, 'rgba(224, 255, 255, 0.6)'); // #E0FFFF
  coreFade.addColorStop(1, 'rgba(200, 220, 255, 0)'); // Transparent
  ctx.fillStyle = coreFade;
  scaledEllipse(ctx, 32, 48, 10, 4, 0, 0, Math.PI * 2, scale);

  // Letzte Energiefunken (sehr schwach, 40% Transparenz)
  ctx.globalAlpha = 0.4;
  const spark1 = ctx.createRadialGradient(28 * scale, 46 * scale, 0, 28 * scale, 46 * scale, 4 * scale);
  spark1.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  spark1.addColorStop(0.5, 'rgba(224, 255, 255, 0.4)');
  spark1.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = spark1;
  scaledArc(ctx, 28, 46, 4, scale);

  const spark2 = ctx.createRadialGradient(36 * scale, 46 * scale, 0, 36 * scale, 46 * scale, 4 * scale);
  spark2.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  spark2.addColorStop(0.5, 'rgba(224, 255, 255, 0.4)');
  spark2.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = spark2;
  scaledArc(ctx, 36, 46, 4, scale);

  // Schwache Augenreste (25% Transparenz)
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = 'rgba(135, 206, 235, 0.5)'; // #87CEEB
  scaledArc(ctx, 28, 47, 2, scale);
  scaledArc(ctx, 36, 47, 2, scale);

  // Zurücksetzen
  ctx.globalAlpha = 1.0;

  return canvas;
}

export function getCorpseTexture(enemyType: EnemyType): CanvasImageSource | undefined {
  return corpseTextures[enemyType];
}

function createDogTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Detaillierter aggressiver Kampfhund ---
  const yOffset = 12 * scale;

  // Hintere Beine (weiter hinten für Tiefenwirkung)
  const legGradient1 = ctx.createLinearGradient(0, 32 * scale + yOffset, 0, 48 * scale + yOffset);
  legGradient1.addColorStop(0, '#5A3A1A'); // Mittelbraun
  legGradient1.addColorStop(0.5, '#3A1A0A'); // Dunkelbraun
  legGradient1.addColorStop(1, '#2A0A0A'); // Sehr dunkelbraun
  ctx.fillStyle = legGradient1;
  scaledRect(ctx, 18, 32 + 12, 7, 16, scale); // Hinten links (adjusting for yOffset logic)
  scaledRect(ctx, 39, 32 + 12, 7, 16, scale); // Hinten rechts

  // Pfoten hinten mit Krallen
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 17, 46 + 12, 9, 5, scale); // Linke Hinterpfote
  scaledRect(ctx, 38, 46 + 12, 9, 5, scale); // Rechte Hinterpfote

  // Krallen hinten
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 16, 50 + 12, 2, 3, scale); // Kralle 1 links
  scaledRect(ctx, 19, 50 + 12, 2, 3, scale); // Kralle 2 links
  scaledRect(ctx, 22, 50 + 12, 2, 3, scale); // Kralle 3 links
  scaledRect(ctx, 37, 50 + 12, 2, 3, scale); // Kralle 1 rechts
  scaledRect(ctx, 40, 50 + 12, 2, 3, scale); // Kralle 2 rechts
  scaledRect(ctx, 43, 50 + 12, 2, 3, scale); // Kralle 3 rechts

  // Körper mit Fellstruktur (mehrere Brauntöne)
  const bodyGradient = ctx.createLinearGradient(0, 20 * scale + yOffset, 0, 40 * scale + yOffset);
  bodyGradient.addColorStop(0, '#6B4A2A'); // Hellbraun (Rücken)
  bodyGradient.addColorStop(0.4, '#5A3A1A'); // Mittelbraun
  bodyGradient.addColorStop(0.7, '#3A1A0A'); // Dunkelbraun
  bodyGradient.addColorStop(1, '#2A0A0A'); // Sehr dunkelbraun (Bauch)
  ctx.fillStyle = bodyGradient;
  scaledRect(ctx, 14, 20 + 12, 36, 20, scale);

  // Fellstruktur durch Schattierungen
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 16, 22 + 12, 32, 1, scale); // Rückenlinie
  scaledRect(ctx, 16, 26 + 12, 32, 1, scale); // Mittellinie
  ctx.fillStyle = '#5A3A1A';
  scaledRect(ctx, 16, 38 + 12, 32, 1, scale); // Bauchlinie

  // Vordere Beine (aggressive Angriffsstellung - leicht nach vorne)
  const legGradient2 = ctx.createLinearGradient(0, 32 * scale + yOffset, 0, 50 * scale + yOffset);
  legGradient2.addColorStop(0, '#5A3A1A');
  legGradient2.addColorStop(0.5, '#3A1A0A');
  legGradient2.addColorStop(1, '#2A0A0A');
  ctx.fillStyle = legGradient2;
  scaledRect(ctx, 14, 34 + 12, 8, 16, scale); // Vorne links
  scaledRect(ctx, 42, 34 + 12, 8, 16, scale); // Vorne rechts

  // Pfoten vorne mit Krallen
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 12, 48 + 12, 10, 6, scale); // Linke Vorderpfote
  scaledRect(ctx, 41, 48 + 12, 10, 6, scale); // Rechte Vorderpfote

  // Krallen vorne (länger für aggressive Haltung)
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 11, 53 + 12, 2, 4, scale); // Kralle 1 links
  scaledRect(ctx, 14, 53 + 12, 2, 5, scale); // Kralle 2 links
  scaledRect(ctx, 17, 53 + 12, 2, 4, scale); // Kralle 3 links
  scaledRect(ctx, 20, 53 + 12, 2, 3, scale); // Kralle 4 links
  scaledRect(ctx, 40, 53 + 12, 2, 4, scale); // Kralle 1 rechts
  scaledRect(ctx, 43, 53 + 12, 2, 5, scale); // Kralle 2 rechts
  scaledRect(ctx, 46, 53 + 12, 2, 4, scale); // Kralle 3 rechts
  scaledRect(ctx, 49, 53 + 12, 2, 3, scale); // Kralle 4 rechts

  // Kopf mit detaillierter Fellstruktur
  const headGradient = ctx.createLinearGradient(0, 8 * scale + yOffset, 0, 24 * scale + yOffset);
  headGradient.addColorStop(0, '#6B4A2A'); // Hellbraun (Stirn)
  headGradient.addColorStop(0.5, '#5A3A1A'); // Mittelbraun
  headGradient.addColorStop(1, '#3A1A0A'); // Dunkelbraun (Schnauze)
  ctx.fillStyle = headGradient;
  scaledRect(ctx, 22, 8 + 12, 20, 16, scale);

  // Fellschattierungen am Kopf
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 24, 10 + 12, 16, 1, scale);
  scaledRect(ctx, 24, 14 + 12, 16, 1, scale);

  // Angelegte Ohren (aggressive Haltung)
  ctx.fillStyle = '#3A1A0A';
  scaledPath(ctx, [{ x: 24, y: 10 + 12 }, { x: 18, y: 12 + 12 }, { x: 22, y: 16 + 12 }], scale);
  scaledPath(ctx, [{ x: 40, y: 10 + 12 }, { x: 46, y: 12 + 12 }, { x: 42, y: 16 + 12 }], scale);

  // Innere Ohrdetails
  ctx.fillStyle = '#5A3A1A';
  scaledPath(ctx, [{ x: 24, y: 11 + 12 }, { x: 20, y: 12 + 12 }, { x: 23, y: 14 + 12 }], scale);
  scaledPath(ctx, [{ x: 40, y: 11 + 12 }, { x: 44, y: 12 + 12 }, { x: 41, y: 14 + 12 }], scale);

  // Leuchtend rote Augen mit Glüheffekt
  // Äußerer Glüheffekt
  const eyeGlow1 = ctx.createRadialGradient(27 * scale, (14 + 12) * scale, 1 * scale, 27 * scale, (14 + 12) * scale, 5 * scale);
  eyeGlow1.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
  eyeGlow1.addColorStop(0.5, 'rgba(255, 0, 0, 0.5)');
  eyeGlow1.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = eyeGlow1;
  scaledArc(ctx, 27, 14 + 12, 5, scale);

  const eyeGlow2 = ctx.createRadialGradient(37 * scale, (14 + 12) * scale, 1 * scale, 37 * scale, (14 + 12) * scale, 5 * scale);
  eyeGlow2.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
  eyeGlow2.addColorStop(0.5, 'rgba(255, 0, 0, 0.5)');
  eyeGlow2.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = eyeGlow2;
  scaledArc(ctx, 37, 14 + 12, 5, scale);

  // Hauptaugen
  ctx.fillStyle = '#FF0000';
  scaledArc(ctx, 27, 14 + 12, 3, scale);
  scaledArc(ctx, 37, 14 + 12, 3, scale);

  // Pupillen
  ctx.fillStyle = '#000000';
  scaledArc(ctx, 27, 14 + 12, 1, scale);
  scaledArc(ctx, 37, 14 + 12, 1, scale);

  // Detaillierte Schnauze
  ctx.fillStyle = '#2A0A0A';
  scaledRect(ctx, 26, 18 + 12, 12, 6, scale);

  // Nase
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 30, 18 + 12, 4, 3, scale);

  // Geblecktes Maul mit mindestens 4 Zähnen
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 26, 22 + 12, 12, 4, scale); // Geöffnetes Maul

  // Obere Zähne (Reißzähne)
  ctx.fillStyle = '#FFFFFF';
  scaledPath(ctx, [{ x: 27, y: 22 + 12 }, { x: 28, y: 25 + 12 }, { x: 29, y: 22 + 12 }], scale);
  scaledPath(ctx, [{ x: 30, y: 22 + 12 }, { x: 31, y: 25 + 12 }, { x: 32, y: 22 + 12 }], scale);
  scaledPath(ctx, [{ x: 33, y: 22 + 12 }, { x: 34, y: 25 + 12 }, { x: 35, y: 22 + 12 }], scale);
  scaledPath(ctx, [{ x: 36, y: 22 + 12 }, { x: 37, y: 25 + 12 }, { x: 38, y: 22 + 12 }], scale);

  // Untere Zähne
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 28, 24 + 12, 2, 2, scale);
  scaledRect(ctx, 31, 24 + 12, 2, 2, scale);
  scaledRect(ctx, 34, 24 + 12, 2, 2, scale);

  return canvas;
}

function createDogCorpseTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const scale = size / 64;

  // --- Detaillierter liegender Hund mit Blutlache ---

  // Große Blutlache mit Farbverlauf
  const bloodGradient = ctx.createRadialGradient(32 * scale, 56 * scale, 5 * scale, 32 * scale, 56 * scale, 30 * scale);
  bloodGradient.addColorStop(0, '#8B0000'); // Dunkelrot (Zentrum)
  bloodGradient.addColorStop(0.4, '#5A0000'); // Sehr dunkelrot
  bloodGradient.addColorStop(0.7, 'rgba(90, 0, 0, 0.6)'); // Transparent werdend
  bloodGradient.addColorStop(1, 'rgba(90, 0, 0, 0)'); // Vollständig transparent
  ctx.fillStyle = bloodGradient;
  scaledEllipse(ctx, 32, 56, 30, 14, 0, 0, Math.PI * 2, scale);

  // Hintere Beine (ausgestreckt)
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 12, 52, 6, 10, scale); // Hinten links
  scaledRect(ctx, 46, 52, 6, 10, scale); // Hinten rechts

  // Hinterpfoten
  ctx.fillStyle = '#2A0A0A';
  scaledRect(ctx, 10, 58, 8, 4, scale);
  scaledRect(ctx, 46, 58, 8, 4, scale);

  // Hauptkörper (liegend, seitlich) mit Fellstruktur
  const bodyGradient = ctx.createLinearGradient(0, 48 * scale, 0, 56 * scale);
  bodyGradient.addColorStop(0, '#5A3A1A'); // Mittelbraun (Rücken)
  bodyGradient.addColorStop(0.5, '#3A1A0A'); // Dunkelbraun
  bodyGradient.addColorStop(1, '#2A0A0A'); // Sehr dunkelbraun (Bauch)
  ctx.fillStyle = bodyGradient;
  scaledEllipse(ctx, 32, 52, 24, 10, 0, 0, Math.PI * 2, scale);

  // Fellschattierungen
  ctx.fillStyle = '#2A0A0A';
  scaledEllipse(ctx, 32, 50, 22, 3, 0, 0, Math.PI * 2, scale);

  // Vordere Beine (ausgestreckt nach vorne)
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 20, 54, 6, 8, scale); // Vorne links
  scaledRect(ctx, 38, 54, 6, 8, scale); // Vorne rechts

  // Vorderpfoten
  ctx.fillStyle = '#2A0A0A';
  scaledRect(ctx, 18, 58, 8, 4, scale);
  scaledRect(ctx, 38, 58, 8, 4, scale);

  // Krallen sichtbar
  ctx.fillStyle = '#E0E0E0';
  scaledRect(ctx, 17, 60, 1, 2, scale);
  scaledRect(ctx, 20, 60, 1, 2, scale);
  scaledRect(ctx, 23, 60, 1, 2, scale);
  scaledRect(ctx, 38, 60, 1, 2, scale);
  scaledRect(ctx, 41, 60, 1, 2, scale);
  scaledRect(ctx, 44, 60, 1, 2, scale);

  // Kopf (seitlich liegend)
  const headGradient = ctx.createLinearGradient(0, 44 * scale, 0, 52 * scale);
  headGradient.addColorStop(0, '#5A3A1A');
  headGradient.addColorStop(1, '#3A1A0A');
  ctx.fillStyle = headGradient;
  scaledRect(ctx, 24, 44, 16, 10, scale);

  // Schnauze
  ctx.fillStyle = '#2A0A0A';
  scaledRect(ctx, 22, 48, 8, 4, scale);

  // Nase
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 22, 49, 3, 2, scale);

  // Ohr (sichtbar, da seitlich liegend)
  ctx.fillStyle = '#2A0A0A';
  scaledPath(ctx, [{ x: 36, y: 44 }, { x: 42, y: 42 }, { x: 38, y: 48 }], scale);

  // Inneres Ohr
  ctx.fillStyle = '#3A1A0A';
  scaledPath(ctx, [{ x: 37, y: 45 }, { x: 40, y: 44 }, { x: 38, y: 47 }], scale);

  // Geschlossenes Auge
  ctx.fillStyle = '#000000';
  scaledRect(ctx, 32, 48, 4, 1, scale);

  // Blutflecken auf dem Fell
  ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
  scaledArc(ctx, 28, 50, 2, scale);
  scaledArc(ctx, 36, 52, 3, scale);
  scaledArc(ctx, 42, 54, 2, scale);

  // Schwanz (ausgestreckt)
  ctx.fillStyle = '#3A1A0A';
  scaledRect(ctx, 52, 54, 8, 3, scale);
  ctx.fillStyle = '#2A0A0A';
  scaledRect(ctx, 58, 55, 4, 2, scale);

  return canvas;
}
