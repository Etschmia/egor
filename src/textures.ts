import { EnemyType, DecorativeObjectType } from './types.ts';

const textures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const corpseTextures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const wallTextures: Record<string, CanvasImageSource> = {};
const itemTextures: Record<string, CanvasImageSource> = {};
const decorativeTextures: Partial<Record<DecorativeObjectType, CanvasImageSource>> = {};

// Texture cache for color variants (optimization)
const colorVariantCache = new Map<string, CanvasImageSource>();
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory issues

export function loadTextures(): Promise<void[]> {
  textures[EnemyType.ZOMBIE] = createZombieTexture();
  textures[EnemyType.MONSTER] = createMonsterTexture();
  textures[EnemyType.GHOST] = createGhostTexture();
  textures[EnemyType.DOG] = createDogTexture();

  corpseTextures[EnemyType.ZOMBIE] = createZombieCorpseTexture();
  corpseTextures[EnemyType.MONSTER] = createMonsterCorpseTexture();
  corpseTextures[EnemyType.GHOST] = createGhostCorpseTexture();
  corpseTextures[EnemyType.DOG] = createDogCorpseTexture();

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

  // Dekorative Objekt-Texturen erstellen
  decorativeTextures[DecorativeObjectType.CEILING_LIGHT] = createLightTexture();
  decorativeTextures[DecorativeObjectType.VASE] = createVaseTexture();
  decorativeTextures[DecorativeObjectType.CRATE] = createCrateTexture();
  decorativeTextures[DecorativeObjectType.BENCH] = createBenchTexture();
  decorativeTextures[DecorativeObjectType.TABLE] = createTableTexture();
  decorativeTextures[DecorativeObjectType.CHAIR] = createChairTexture();
  decorativeTextures[DecorativeObjectType.WINE_BOTTLE] = createWineBottleTexture();
  decorativeTextures[DecorativeObjectType.SKELETON] = createSkeletonTexture();

  return Promise.resolve([]);
}

function createZombieTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierter Zombie mit Gesichtszügen, Wunden und erkennbaren Händen ---

  // Beine (Hose)
  ctx.fillStyle = '#4B3A26'; // Dunkelbraun
  ctx.fillRect(20, 52, 8, 12);
  ctx.fillRect(36, 52, 8, 12);
  
  // Schuhe
  ctx.fillStyle = '#1A1A1A'; // Fast schwarz
  ctx.fillRect(18, 60, 10, 4);
  ctx.fillRect(34, 60, 10, 4);

  // Körper (zerrissenes Hemd) mit Farbverlauf
  const shirtGradient = ctx.createLinearGradient(16, 28, 48, 52);
  shirtGradient.addColorStop(0, '#8B0000'); // Dunkelrot
  shirtGradient.addColorStop(0.5, '#A52A2A'); // Braun-Rot
  shirtGradient.addColorStop(1, '#5A0000'); // Sehr dunkelrot
  ctx.fillStyle = shirtGradient;
  ctx.fillRect(16, 28, 32, 24);
  
  // Zerrissene Fetzen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(16, 50, 5, 5);
  ctx.fillRect(25, 48, 8, 8);
  ctx.fillRect(40, 50, 6, 6);
  
  // Blutflecken auf der Kleidung
  ctx.fillStyle = 'rgba(90, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(22, 35, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(38, 42, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(28, 48, 2, 0, Math.PI * 2);
  ctx.fill();

  // Arme mit mehreren Grüntönen
  const armGradient = ctx.createLinearGradient(0, 28, 0, 44);
  armGradient.addColorStop(0, '#2E8B57'); // Seegrün
  armGradient.addColorStop(0.5, '#3CB371'); // Mittelseegrün
  armGradient.addColorStop(1, '#90EE90'); // Hellgrün
  ctx.fillStyle = armGradient;
  ctx.fillRect(8, 28, 8, 16);
  ctx.fillRect(48, 28, 8, 16);

  // Linke Hand mit 5 erkennbaren Fingern
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(6, 44, 10, 6); // Handfläche
  // Finger
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(6, 50, 1.5, 4);   // Daumen
  ctx.fillRect(8, 50, 1.5, 5);   // Zeigefinger
  ctx.fillRect(10, 50, 1.5, 5);  // Mittelfinger
  ctx.fillRect(12, 50, 1.5, 4);  // Ringfinger
  ctx.fillRect(14, 50, 1.5, 3);  // Kleiner Finger

  // Rechte Hand mit 5 erkennbaren Fingern
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(48, 44, 10, 6); // Handfläche
  // Finger
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(48, 50, 1.5, 4);  // Daumen
  ctx.fillRect(50, 50, 1.5, 5);  // Zeigefinger
  ctx.fillRect(52, 50, 1.5, 5);  // Mittelfinger
  ctx.fillRect(54, 50, 1.5, 4);  // Ringfinger
  ctx.fillRect(56, 50, 1.5, 3);  // Kleiner Finger

  // Kopf mit mehreren Grüntönen
  const headGradient = ctx.createRadialGradient(32, 16, 2, 32, 16, 10);
  headGradient.addColorStop(0, '#90EE90'); // Hellgrün
  headGradient.addColorStop(0.5, '#3CB371'); // Mittelseegrün
  headGradient.addColorStop(1, '#2E8B57'); // Seegrün
  ctx.fillStyle = headGradient;
  ctx.fillRect(24, 8, 16, 16);
  
  // Wunden und Verfärbungen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(35, 9, 4, 6);  // Große Wunde rechts
  ctx.fillRect(26, 11, 3, 3); // Kleine Wunde links
  ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
  ctx.fillRect(30, 22, 4, 2); // Verfärbung am Kinn

  // Nase
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(31, 16, 2, 3);

  // Leuchtende gelbe Augen mit radialen Gradienten
  const eyeGradient = ctx.createRadialGradient(28, 14, 0.5, 28, 14, 3);
  eyeGradient.addColorStop(0, '#FFFF00'); // Gelb
  eyeGradient.addColorStop(0.6, '#FFD700'); // Gold
  eyeGradient.addColorStop(1, '#FF8C00'); // Dunkelorange
  ctx.fillStyle = eyeGradient;
  ctx.beginPath();
  ctx.arc(28, 14, 3, 0, Math.PI * 2);
  ctx.fill();
  
  const eyeGradient2 = ctx.createRadialGradient(36, 14, 0.5, 36, 14, 3);
  eyeGradient2.addColorStop(0, '#FFFF00');
  eyeGradient2.addColorStop(0.6, '#FFD700');
  eyeGradient2.addColorStop(1, '#FF8C00');
  ctx.fillStyle = eyeGradient2;
  ctx.beginPath();
  ctx.arc(36, 14, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupillen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(28, 14, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(36, 14, 1, 0, Math.PI * 2);
  ctx.fill();

  // Mund mit sichtbaren Zähnen
  ctx.fillStyle = '#000000';
  ctx.fillRect(28, 20, 8, 3); // Mund geöffnet
  
  // Zähne
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(28, 20, 1.5, 2);  // Zahn 1
  ctx.fillRect(30, 20, 1.5, 2);  // Zahn 2
  ctx.fillRect(32, 20, 1.5, 2);  // Zahn 3
  ctx.fillRect(34, 20, 1.5, 2);  // Zahn 4

  return canvas;
}

function createMonsterTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detailliertes Monster mit muskulöser Struktur ---

  // Beine mit Muskelstruktur
  const legGradient = ctx.createLinearGradient(16, 54, 28, 64);
  legGradient.addColorStop(0, '#DC143C'); // Crimson
  legGradient.addColorStop(0.5, '#8B0000'); // Dunkelrot
  legGradient.addColorStop(1, '#5A0000'); // Sehr dunkelrot
  ctx.fillStyle = legGradient;
  ctx.fillRect(18, 54, 10, 10);
  ctx.fillRect(36, 54, 10, 10);
  
  // Muskelschattierungen an Beinen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(20, 56, 2, 8); // Schatten links
  ctx.fillRect(38, 56, 2, 8); // Schatten rechts
  
  // Klauen an Füßen
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(16, 62, 2, 3); // Linker Fuß - Kralle 1
  ctx.fillRect(19, 62, 2, 3); // Linker Fuß - Kralle 2
  ctx.fillRect(22, 62, 2, 3); // Linker Fuß - Kralle 3
  ctx.fillRect(34, 62, 2, 3); // Rechter Fuß - Kralle 1
  ctx.fillRect(37, 62, 2, 3); // Rechter Fuß - Kralle 2
  ctx.fillRect(40, 62, 2, 3); // Rechter Fuß - Kralle 3

  // Muskulöser Körper mit mehreren Rottönen
  const bodyGradient = ctx.createRadialGradient(32, 38, 5, 32, 38, 22);
  bodyGradient.addColorStop(0, '#FF4500'); // Orangerot (Highlight)
  bodyGradient.addColorStop(0.4, '#DC143C'); // Crimson
  bodyGradient.addColorStop(0.7, '#8B0000'); // Dunkelrot
  bodyGradient.addColorStop(1, '#5A0000'); // Sehr dunkelrot (Schatten)
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(14, 24, 36, 30);
  
  // Sichtbare Muskelstruktur durch Schattierungen
  ctx.fillStyle = '#5A0000';
  // Brustmuskeln
  ctx.fillRect(22, 28, 8, 2);
  ctx.fillRect(34, 28, 8, 2);
  // Bauchmuskeln
  ctx.fillRect(28, 36, 8, 2);
  ctx.fillRect(28, 42, 8, 2);
  ctx.fillRect(28, 48, 8, 2);
  // Seitliche Muskeln
  ctx.fillStyle = '#DC143C';
  ctx.fillRect(14, 30, 2, 20);
  ctx.fillRect(48, 30, 2, 20);

  // Arme mit Muskelstruktur
  const armGradient = ctx.createLinearGradient(0, 28, 0, 48);
  armGradient.addColorStop(0, '#DC143C');
  armGradient.addColorStop(0.5, '#8B0000');
  armGradient.addColorStop(1, '#5A0000');
  ctx.fillStyle = armGradient;
  ctx.fillRect(4, 28, 10, 20);
  ctx.fillRect(50, 28, 10, 20);
  
  // Muskelschattierungen an Armen
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(6, 32, 2, 12);
  ctx.fillRect(52, 32, 2, 12);

  // Detaillierte Hände mit einzelnen Krallen
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(2, 48, 10, 6); // Linke Hand
  ctx.fillRect(52, 48, 10, 6); // Rechte Hand
  
  // Linke Hand - 4 Krallen
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(2, 54, 2, 5);   // Kralle 1
  ctx.fillRect(5, 54, 2, 6);   // Kralle 2
  ctx.fillRect(8, 54, 2, 5);   // Kralle 3
  ctx.fillRect(11, 54, 2, 4);  // Kralle 4
  
  // Rechte Hand - 4 Krallen
  ctx.fillRect(52, 54, 2, 5);  // Kralle 1
  ctx.fillRect(55, 54, 2, 6);  // Kralle 2
  ctx.fillRect(58, 54, 2, 5);  // Kralle 3
  ctx.fillRect(61, 54, 2, 4);  // Kralle 4

  // Kopf mit Muskelstruktur
  const headGradient = ctx.createRadialGradient(32, 14, 3, 32, 14, 12);
  headGradient.addColorStop(0, '#DC143C');
  headGradient.addColorStop(0.6, '#8B0000');
  headGradient.addColorStop(1, '#5A0000');
  ctx.fillStyle = headGradient;
  ctx.fillRect(20, 6, 24, 18);
  
  // Kiefermuskulatur
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(20, 18, 4, 6);
  ctx.fillRect(40, 18, 4, 6);

  // Detaillierte 3D-Hörner mit Glanzeffekten
  // Linkes Horn
  const hornGradient1 = ctx.createLinearGradient(18, 0, 22, 6);
  hornGradient1.addColorStop(0, '#C0C0C0'); // Silber (Glanz)
  hornGradient1.addColorStop(0.3, '#E8E8E8'); // Helles Silber (Highlight)
  hornGradient1.addColorStop(0.7, '#A0A0A0'); // Mittelgrau
  hornGradient1.addColorStop(1, '#696969'); // Dunkelgrau (Schatten)
  ctx.fillStyle = hornGradient1;
  ctx.beginPath();
  ctx.moveTo(22, 6);
  ctx.lineTo(18, -2);
  ctx.lineTo(20, -2);
  ctx.lineTo(24, 6);
  ctx.closePath();
  ctx.fill();
  
  // Glanzlicht auf linkem Horn
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(21, 1, 1, 3);
  
  // Rechtes Horn
  const hornGradient2 = ctx.createLinearGradient(42, 0, 46, 6);
  hornGradient2.addColorStop(0, '#C0C0C0');
  hornGradient2.addColorStop(0.3, '#E8E8E8');
  hornGradient2.addColorStop(0.7, '#A0A0A0');
  hornGradient2.addColorStop(1, '#696969');
  ctx.fillStyle = hornGradient2;
  ctx.beginPath();
  ctx.moveTo(42, 6);
  ctx.lineTo(46, -2);
  ctx.lineTo(44, -2);
  ctx.lineTo(40, 6);
  ctx.closePath();
  ctx.fill();
  
  // Glanzlicht auf rechtem Horn
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(43, 1, 1, 3);

  // Leuchtende rot-gelbe Augen mit mehreren Schichten
  // Äußere Glühschicht
  const eyeGlow1 = ctx.createRadialGradient(26, 12, 1, 26, 12, 6);
  eyeGlow1.addColorStop(0, 'rgba(255, 255, 0, 0.8)'); // Gelb
  eyeGlow1.addColorStop(0.5, 'rgba(255, 69, 0, 0.5)'); // Orangerot
  eyeGlow1.addColorStop(1, 'rgba(255, 0, 0, 0)'); // Transparent rot
  ctx.fillStyle = eyeGlow1;
  ctx.beginPath();
  ctx.arc(26, 12, 6, 0, Math.PI * 2);
  ctx.fill();
  
  const eyeGlow2 = ctx.createRadialGradient(38, 12, 1, 38, 12, 6);
  eyeGlow2.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
  eyeGlow2.addColorStop(0.5, 'rgba(255, 69, 0, 0.5)');
  eyeGlow2.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = eyeGlow2;
  ctx.beginPath();
  ctx.arc(38, 12, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Mittlere Schicht - Rot
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(26, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(38, 12, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Innere Schicht - Gelb
  const eyeCore1 = ctx.createRadialGradient(26, 12, 0, 26, 12, 3);
  eyeCore1.addColorStop(0, '#FFFF00'); // Helles Gelb
  eyeCore1.addColorStop(0.6, '#FFD700'); // Gold
  eyeCore1.addColorStop(1, '#FF8C00'); // Dunkelorange
  ctx.fillStyle = eyeCore1;
  ctx.beginPath();
  ctx.arc(26, 12, 3, 0, Math.PI * 2);
  ctx.fill();
  
  const eyeCore2 = ctx.createRadialGradient(38, 12, 0, 38, 12, 3);
  eyeCore2.addColorStop(0, '#FFFF00');
  eyeCore2.addColorStop(0.6, '#FFD700');
  eyeCore2.addColorStop(1, '#FF8C00');
  ctx.fillStyle = eyeCore2;
  ctx.beginPath();
  ctx.arc(38, 12, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupillen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(26, 12, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(38, 12, 1, 0, Math.PI * 2);
  ctx.fill();

  // Geöffnetes Maul mit 6-8 sichtbaren Reißzähnen
  ctx.fillStyle = '#000000';
  ctx.fillRect(24, 18, 16, 6); // Geöffnetes Maul
  
  // Obere Reißzähne (4 Stück)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(25, 18);
  ctx.lineTo(26, 21);
  ctx.lineTo(27, 18);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(29, 18);
  ctx.lineTo(30, 22);
  ctx.lineTo(31, 18);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(33, 18);
  ctx.lineTo(34, 22);
  ctx.lineTo(35, 18);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(37, 18);
  ctx.lineTo(38, 21);
  ctx.lineTo(39, 18);
  ctx.closePath();
  ctx.fill();
  
  // Untere Reißzähne (4 Stück)
  ctx.beginPath();
  ctx.moveTo(26, 24);
  ctx.lineTo(27, 21);
  ctx.lineTo(28, 24);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(30, 24);
  ctx.lineTo(31, 20);
  ctx.lineTo(32, 24);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(34, 24);
  ctx.lineTo(35, 20);
  ctx.lineTo(36, 24);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(38, 24);
  ctx.lineTo(39, 21);
  ctx.lineTo(40, 24);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

function createGhostTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierter ätherischer Geist mit mehreren Transparenzebenen ---

  // Äußere nebelige Schicht (70% Transparenz)
  ctx.globalAlpha = 0.7;
  const outerMist = ctx.createRadialGradient(32, 36, 10, 32, 36, 35);
  outerMist.addColorStop(0, 'rgba(224, 255, 255, 0.8)'); // #E0FFFF - Hellcyan
  outerMist.addColorStop(0.5, 'rgba(176, 224, 230, 0.5)'); // #B0E0E6 - Puderblau
  outerMist.addColorStop(1, 'rgba(135, 206, 235, 0)'); // #87CEEB - Himmelblau (transparent)
  ctx.fillStyle = outerMist;
  
  // Wispy, nebelige Ränder mit fließender Form
  ctx.beginPath();
  ctx.moveTo(10, 60);
  ctx.bezierCurveTo(-2, 45, 5, 15, 32, 8);
  ctx.bezierCurveTo(59, 15, 66, 45, 54, 60);
  ctx.bezierCurveTo(48, 52, 40, 58, 32, 62);
  ctx.bezierCurveTo(24, 58, 16, 52, 10, 60);
  ctx.closePath();
  ctx.fill();

  // Mittlere ätherische Schicht (80% Transparenz)
  ctx.globalAlpha = 0.8;
  const middleLayer = ctx.createRadialGradient(32, 34, 8, 32, 34, 28);
  middleLayer.addColorStop(0, 'rgba(255, 255, 255, 0.95)'); // #FFFFFF - Weiß
  middleLayer.addColorStop(0.4, 'rgba(224, 255, 255, 0.8)'); // #E0FFFF - Hellcyan
  middleLayer.addColorStop(0.7, 'rgba(176, 224, 230, 0.6)'); // #B0E0E6 - Puderblau
  middleLayer.addColorStop(1, 'rgba(135, 206, 235, 0)'); // #87CEEB - Himmelblau (transparent)
  ctx.fillStyle = middleLayer;
  
  // Hauptkörper mit fließender, ätherischer Form
  ctx.beginPath();
  ctx.moveTo(12, 60);
  ctx.bezierCurveTo(0, 40, 10, 10, 32, 10);
  ctx.bezierCurveTo(54, 10, 64, 40, 52, 60);
  ctx.quadraticCurveTo(42, 50, 32, 62);
  ctx.quadraticCurveTo(22, 50, 12, 60);
  ctx.closePath();
  ctx.fill();

  // Innere Leuchtschicht (85% Transparenz)
  ctx.globalAlpha = 0.85;
  const innerGlow = ctx.createRadialGradient(32, 30, 2, 32, 30, 20);
  innerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Helles Zentrum
  innerGlow.addColorStop(0.3, 'rgba(240, 255, 255, 0.9)'); // Fast weiß
  innerGlow.addColorStop(0.6, 'rgba(224, 255, 255, 0.7)'); // #E0FFFF
  innerGlow.addColorStop(1, 'rgba(176, 224, 230, 0)'); // #B0E0E6 (transparent)
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.ellipse(32, 30, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Zusätzliche innere Leuchteffekte (Energie-Wirbel)
  ctx.globalAlpha = 0.75;
  const energyGlow1 = ctx.createRadialGradient(28, 25, 1, 28, 25, 8);
  energyGlow1.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  energyGlow1.addColorStop(0.5, 'rgba(224, 255, 255, 0.6)');
  energyGlow1.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = energyGlow1;
  ctx.beginPath();
  ctx.arc(28, 25, 8, 0, Math.PI * 2);
  ctx.fill();

  const energyGlow2 = ctx.createRadialGradient(36, 25, 1, 36, 25, 8);
  energyGlow2.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  energyGlow2.addColorStop(0.5, 'rgba(224, 255, 255, 0.6)');
  energyGlow2.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = energyGlow2;
  ctx.beginPath();
  ctx.arc(36, 25, 8, 0, Math.PI * 2);
  ctx.fill();

  // Zentrale Leuchtenergie
  ctx.globalAlpha = 0.8;
  const coreGlow = ctx.createRadialGradient(32, 35, 1, 32, 35, 12);
  coreGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  coreGlow.addColorStop(0.4, 'rgba(240, 255, 255, 0.8)');
  coreGlow.addColorStop(1, 'rgba(224, 255, 255, 0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(32, 35, 12, 0, Math.PI * 2);
  ctx.fill();

  // Zurücksetzen für Gesichtszüge
  ctx.globalAlpha = 1.0;

  // Hohle, leuchtende Augen mit mehreren Schichten
  // Äußerer Glüheffekt
  const eyeGlow1 = ctx.createRadialGradient(26, 28, 1, 26, 28, 8);
  eyeGlow1.addColorStop(0, 'rgba(135, 206, 235, 0.8)'); // #87CEEB - Himmelblau
  eyeGlow1.addColorStop(0.5, 'rgba(176, 224, 230, 0.5)'); // #B0E0E6
  eyeGlow1.addColorStop(1, 'rgba(135, 206, 235, 0)');
  ctx.fillStyle = eyeGlow1;
  ctx.beginPath();
  ctx.arc(26, 28, 8, 0, Math.PI * 2);
  ctx.fill();

  const eyeGlow2 = ctx.createRadialGradient(40, 28, 1, 40, 28, 8);
  eyeGlow2.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
  eyeGlow2.addColorStop(0.5, 'rgba(176, 224, 230, 0.5)');
  eyeGlow2.addColorStop(1, 'rgba(135, 206, 235, 0)');
  ctx.fillStyle = eyeGlow2;
  ctx.beginPath();
  ctx.arc(40, 28, 8, 0, Math.PI * 2);
  ctx.fill();

  // Hohle schwarze Augen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(26, 28, 5, 0, Math.PI * 2);
  ctx.arc(40, 28, 5, 0, Math.PI * 2);
  ctx.fill();

  // Innerer Leuchteffekt in den Augen
  const eyeInnerGlow1 = ctx.createRadialGradient(26, 28, 0, 26, 28, 4);
  eyeInnerGlow1.addColorStop(0, 'rgba(224, 255, 255, 0.9)'); // #E0FFFF
  eyeInnerGlow1.addColorStop(0.6, 'rgba(176, 224, 230, 0.6)'); // #B0E0E6
  eyeInnerGlow1.addColorStop(1, 'rgba(135, 206, 235, 0.3)'); // #87CEEB
  ctx.fillStyle = eyeInnerGlow1;
  ctx.beginPath();
  ctx.arc(26, 28, 4, 0, Math.PI * 2);
  ctx.fill();

  const eyeInnerGlow2 = ctx.createRadialGradient(40, 28, 0, 40, 28, 4);
  eyeInnerGlow2.addColorStop(0, 'rgba(224, 255, 255, 0.9)');
  eyeInnerGlow2.addColorStop(0.6, 'rgba(176, 224, 230, 0.6)');
  eyeInnerGlow2.addColorStop(1, 'rgba(135, 206, 235, 0.3)');
  ctx.fillStyle = eyeInnerGlow2;
  ctx.beginPath();
  ctx.arc(40, 28, 4, 0, Math.PI * 2);
  ctx.fill();

  // Glanzpunkte in den Augen (heller)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(24, 26, 2, 0, Math.PI * 2);
  ctx.arc(38, 26, 2, 0, Math.PI * 2);
  ctx.fill();

  // Kleinere Glanzpunkte
  ctx.beginPath();
  ctx.arc(27, 29, 1, 0, Math.PI * 2);
  ctx.arc(41, 29, 1, 0, Math.PI * 2);
  ctx.fill();

  // Gequälter Gesichtsausdruck mit gebogenem Mund
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(33, 40, 8, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Zusätzliche Munddetails für gequälten Ausdruck
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(33, 41, 6, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();

  return canvas;
}

function createLightTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Gelber Kreis mit Glow-Effekt
  const gradient = ctx.createRadialGradient(32, 32, 5, 32, 32, 30);
  gradient.addColorStop(0, '#FFFF00'); // Helles Gelb
  gradient.addColorStop(0.3, '#FFD700'); // Gold
  gradient.addColorStop(0.6, '#FFA500'); // Orange
  gradient.addColorStop(1, 'rgba(255, 165, 0, 0)'); // Transparent

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  // Innerer heller Kern
  const coreGradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 12);
  coreGradient.addColorStop(0, '#FFFFFF');
  coreGradient.addColorStop(0.5, '#FFFF00');
  coreGradient.addColorStop(1, '#FFD700');

  ctx.fillStyle = coreGradient;
  ctx.beginPath();
  ctx.arc(32, 32, 12, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createVaseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Vertikales Rechteck mit Muster
  const gradient = ctx.createLinearGradient(20, 0, 44, 0);
  gradient.addColorStop(0, '#8B4513');
  gradient.addColorStop(0.5, '#A0522D');
  gradient.addColorStop(1, '#8B4513');

  ctx.fillStyle = gradient;
  ctx.fillRect(20, 10, 24, 44);

  // Vasenform - oben schmaler
  ctx.fillRect(24, 6, 16, 4);
  
  // Muster - horizontale Streifen
  ctx.fillStyle = '#654321';
  for (let y = 15; y < 50; y += 8) {
    ctx.fillRect(20, y, 24, 3);
  }

  // Highlights für 3D-Effekt
  ctx.fillStyle = 'rgba(160, 82, 45, 0.5)';
  ctx.fillRect(20, 10, 2, 44);

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

function createBenchTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Horizontales Rechteck mit Beinen
  const gradient = ctx.createLinearGradient(0, 20, 0, 40);
  gradient.addColorStop(0, '#8B4513');
  gradient.addColorStop(0.5, '#A0522D');
  gradient.addColorStop(1, '#654321');

  // Sitzfläche
  ctx.fillStyle = gradient;
  ctx.fillRect(4, 20, 56, 12);

  // Holzmaserung
  ctx.fillStyle = '#654321';
  for (let x = 8; x < 60; x += 8) {
    ctx.fillRect(x, 20, 1, 12);
  }

  // Beine
  ctx.fillStyle = '#654321';
  ctx.fillRect(8, 32, 6, 20);
  ctx.fillRect(50, 32, 6, 20);

  // Schatten unter der Bank
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(4, 50, 56, 2);

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

function createWineBottleTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Flasche
  const bottleGradient = ctx.createLinearGradient(20, 0, 28, 0);
  bottleGradient.addColorStop(0, '#2F4F2F');
  bottleGradient.addColorStop(0.5, '#3A5F3A');
  bottleGradient.addColorStop(1, '#2F4F2F');

  ctx.fillStyle = bottleGradient;
  // Flaschenhals
  ctx.fillRect(22, 10, 4, 8);
  // Flaschenkörper
  ctx.fillRect(20, 18, 8, 20);

  // Etikett
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(20, 24, 8, 6);

  // Glanzlicht auf Flasche
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(21, 20, 2, 10);

  // Glas daneben
  const glassGradient = ctx.createLinearGradient(36, 0, 44, 0);
  glassGradient.addColorStop(0, 'rgba(200, 200, 255, 0.6)');
  glassGradient.addColorStop(0.5, 'rgba(220, 220, 255, 0.8)');
  glassGradient.addColorStop(1, 'rgba(200, 200, 255, 0.6)');

  ctx.fillStyle = glassGradient;
  ctx.fillRect(36, 26, 8, 12);

  // Glanzlicht auf Glas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(37, 28, 2, 6);

  return canvas;
}

function createSkeletonTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Knochen-Silhouette in Weiß
  ctx.fillStyle = '#E0E0E0';

  // Schädel
  ctx.beginPath();
  ctx.arc(32, 20, 10, 0, Math.PI * 2);
  ctx.fill();

  // Augenhöhlen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(28, 18, 3, 0, Math.PI * 2);
  ctx.arc(36, 18, 3, 0, Math.PI * 2);
  ctx.fill();

  // Wirbelsäule
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(30, 30, 4, 20);

  // Rippen
  for (let i = 0; i < 4; i++) {
    const y = 32 + i * 4;
    ctx.fillRect(20, y, 10, 2);
    ctx.fillRect(34, y, 10, 2);
  }

  // Arme (liegend)
  ctx.fillRect(12, 36, 16, 3);
  ctx.fillRect(36, 36, 16, 3);

  // Beine (liegend)
  ctx.fillRect(24, 50, 3, 10);
  ctx.fillRect(37, 50, 3, 10);

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

function createBrickTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Hintergrund - Mörtel
  ctx.fillStyle = '#8B4513'; // D3D3D3' A98961FF
  ctx.fillRect(0, 0, 32, 32);

  // Backstein-Muster
  ctx.fillStyle = '#D3D3D3';

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

  // --- Verbesserte normale Tür mit detaillierter Holzmaserung und 3D-Effekt ---

  // Tür-Grundfarbe - dunkles Holz mit Farbverlauf
  const backgroundGradient = ctx.createLinearGradient(0, 0, 32, 32);
  backgroundGradient.addColorStop(0, '#654321'); // Dunkelbraun
  backgroundGradient.addColorStop(0.5, '#5A3A1A'); // Mittleres Braun
  backgroundGradient.addColorStop(1, '#4A2A0A'); // Sehr dunkelbraun
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, 32, 32);

  // Schatten an den Rändern für 3D-Wirkung (links und oben)
  ctx.fillStyle = '#2A1A0A'; // Sehr dunkel
  ctx.fillRect(0, 0, 1, 32); // Linker Rand
  ctx.fillRect(0, 0, 32, 1); // Oberer Rand

  // Highlights für 3D-Wirkung (rechts und unten)
  ctx.fillStyle = '#8B6A3A'; // Helleres Braun
  ctx.fillRect(31, 0, 1, 32); // Rechter Rand
  ctx.fillRect(0, 31, 32, 1); // Unterer Rand

  // Sichtbare Türfüllungen/Paneele mit vertikalen Brettern
  const woodGradient = ctx.createLinearGradient(0, 0, 32, 0);
  woodGradient.addColorStop(0, '#8B4513'); // Sattelbraun
  woodGradient.addColorStop(0.5, '#A0522D'); // Sienna
  woodGradient.addColorStop(1, '#8B4513'); // Sattelbraun
  
  // Vier vertikale Bretter mit Holzmaserung
  for (let x = 0; x < 32; x += 8) {
    // Brett mit Farbverlauf
    const plankGradient = ctx.createLinearGradient(x, 0, x + 7, 0);
    plankGradient.addColorStop(0, '#6B4A2A'); // Dunkler
    plankGradient.addColorStop(0.3, '#8B4513'); // Mittel
    plankGradient.addColorStop(0.7, '#A0522D'); // Hell
    plankGradient.addColorStop(1, '#6B4A2A'); // Dunkler
    ctx.fillStyle = plankGradient;
    ctx.fillRect(x + 1, 2, 6, 28);

    // Holzmaserung - horizontale Linien für Textur
    ctx.fillStyle = '#5A3A1A';
    for (let y = 4; y < 30; y += 6) {
      ctx.fillRect(x + 1, y, 6, 1);
      // Zusätzliche feine Maserung
      ctx.fillStyle = 'rgba(90, 58, 26, 0.5)';
      ctx.fillRect(x + 1, y + 2, 6, 1);
      ctx.fillStyle = '#5A3A1A';
    }

    // Schatten auf der linken Seite jedes Bretts für 3D-Effekt
    ctx.fillStyle = 'rgba(42, 26, 10, 0.6)';
    ctx.fillRect(x + 1, 2, 1, 28);

    // Highlight auf der rechten Seite jedes Bretts
    ctx.fillStyle = 'rgba(160, 82, 45, 0.4)';
    ctx.fillRect(x + 6, 2, 1, 28);

    // Fugen zwischen den Brettern
    ctx.fillStyle = '#4A4A4A'; // Dunkelgrau
    ctx.fillRect(x + 7, 0, 1, 32);
    
    // Schatten in den Fugen für Tiefe
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 7, 1, 1, 30);
  }

  // Dunkle Metallscharniere (oben und unten, links)
  ctx.fillStyle = '#2A2A2A'; // Dunkelgrau/Schwarz
  
  // Oberes Scharnier
  ctx.fillRect(2, 6, 6, 3);
  // Schrauben am oberen Scharnier
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(3, 7, 1, 1);
  ctx.fillRect(6, 7, 1, 1);
  
  // Unteres Scharnier
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(2, 23, 6, 3);
  // Schrauben am unteren Scharnier
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(3, 24, 1, 1);
  ctx.fillRect(6, 24, 1, 1);

  // Highlights auf Scharnieren für Metall-Effekt
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(2, 6, 6, 1); // Oberes Scharnier
  ctx.fillRect(2, 23, 6, 1); // Unteres Scharnier

  // Goldener Türgriff auf der rechten Seite mit 3D-Effekt
  const handleGradient = ctx.createRadialGradient(26, 16, 1, 26, 16, 4);
  handleGradient.addColorStop(0, '#FFD700'); // Gold
  handleGradient.addColorStop(0.6, '#FFA500'); // Orange-Gold
  handleGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  ctx.fillStyle = handleGradient;
  ctx.fillRect(24, 14, 4, 4);

  // Schatten unter dem Türgriff
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(24, 17, 4, 1);

  // Highlight auf dem Türgriff für Glanz
  ctx.fillStyle = '#FFFFE0'; // Helles Gelb
  ctx.fillRect(24, 14, 3, 1);
  ctx.fillRect(24, 14, 1, 2);

  // Türklinke mit 3D-Effekt
  const knobGradient = ctx.createLinearGradient(28, 15, 31, 17);
  knobGradient.addColorStop(0, '#FFD700'); // Gold
  knobGradient.addColorStop(0.5, '#FFA500'); // Orange-Gold
  knobGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  ctx.fillStyle = knobGradient;
  ctx.fillRect(28, 15, 3, 2);

  // Schatten unter der Klinke
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(28, 16, 3, 1);

  // Highlight auf der Klinke
  ctx.fillStyle = '#FFFFE0';
  ctx.fillRect(28, 15, 2, 1);

  return canvas;
}

function createExitDoorTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Verbesserte Exit-Tür mit grüner Färbung und ähnlicher Struktur wie normale Tür ---

  // Leuchteffekt - heller Rand für Aufmerksamkeit (äußerer Glüheffekt)
  ctx.fillStyle = '#90EE90'; // Hellgrün
  ctx.fillRect(0, 0, 32, 32);

  // Tür-Grundfarbe - grünes Holz mit Farbverlauf
  const backgroundGradient = ctx.createLinearGradient(0, 0, 32, 32);
  backgroundGradient.addColorStop(0, '#32CD32'); // Limettengrün (hell)
  backgroundGradient.addColorStop(0.5, '#228B22'); // Waldgrün (mittel)
  backgroundGradient.addColorStop(1, '#006400'); // Dunkelgrün
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(1, 1, 30, 30);

  // Schatten an den Rändern für 3D-Wirkung (links und oben)
  ctx.fillStyle = '#004400'; // Sehr dunkelgrün
  ctx.fillRect(1, 1, 1, 30); // Linker Rand
  ctx.fillRect(1, 1, 30, 1); // Oberer Rand

  // Highlights für 3D-Wirkung (rechts und unten)
  ctx.fillStyle = '#4AE54A'; // Helleres Grün
  ctx.fillRect(30, 1, 1, 30); // Rechter Rand
  ctx.fillRect(1, 30, 30, 1); // Unterer Rand

  // Sichtbare Türfüllungen/Paneele mit vertikalen Brettern (ähnlich wie normale Tür)
  for (let x = 0; x < 32; x += 8) {
    // Brett mit Farbverlauf
    const plankGradient = ctx.createLinearGradient(x, 0, x + 7, 0);
    plankGradient.addColorStop(0, '#1A5A1A'); // Dunkler
    plankGradient.addColorStop(0.3, '#228B22'); // Mittel
    plankGradient.addColorStop(0.7, '#32CD32'); // Hell
    plankGradient.addColorStop(1, '#1A5A1A'); // Dunkler
    ctx.fillStyle = plankGradient;
    ctx.fillRect(x + 2, 3, 5, 26);

    // Holzmaserung - horizontale Linien für Textur
    ctx.fillStyle = '#1A5A1A';
    for (let y = 5; y < 28; y += 6) {
      ctx.fillRect(x + 2, y, 5, 1);
      // Zusätzliche feine Maserung
      ctx.fillStyle = 'rgba(26, 90, 26, 0.5)';
      ctx.fillRect(x + 2, y + 2, 5, 1);
      ctx.fillStyle = '#1A5A1A';
    }

    // Schatten auf der linken Seite jedes Bretts für 3D-Effekt
    ctx.fillStyle = 'rgba(0, 68, 0, 0.6)';
    ctx.fillRect(x + 2, 3, 1, 26);

    // Highlight auf der rechten Seite jedes Bretts
    ctx.fillStyle = 'rgba(74, 229, 74, 0.4)';
    ctx.fillRect(x + 6, 3, 1, 26);

    // Fugen zwischen den Brettern
    ctx.fillStyle = '#004400'; // Dunkelgrün
    ctx.fillRect(x + 7, 1, 1, 30);
    
    // Schatten in den Fugen für Tiefe
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 7, 2, 1, 28);
  }

  // Großes, gut sichtbares Exit-Symbol (X) in Gold - zentral positioniert
  // Äußerer Glüheffekt für das Symbol
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // X-Symbol mit dicken Linien für bessere Sichtbarkeit
  ctx.strokeStyle = '#FFD700'; // Gold
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // Diagonale von links oben nach rechts unten
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(22, 22);
  ctx.stroke();

  // Diagonale von rechts oben nach links unten
  ctx.beginPath();
  ctx.moveTo(22, 10);
  ctx.lineTo(10, 22);
  ctx.stroke();

  // Schatten zurücksetzen
  ctx.shadowBlur = 0;

  // Zusätzliche Highlights auf dem X für mehr Kontrast
  ctx.strokeStyle = '#FFFFE0'; // Helles Gelb
  ctx.lineWidth = 2;

  // Highlight-Linien (etwas versetzt für 3D-Effekt)
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(21, 21);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(22, 10);
  ctx.lineTo(11, 21);
  ctx.stroke();

  // Dunkler Rand um das X für hohen Kontrast
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.3;

  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(22, 22);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(22, 10);
  ctx.lineTo(10, 22);
  ctx.stroke();

  ctx.globalAlpha = 1.0;

  return canvas;
}

function createHealthSmallTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Verbessertes kleines Medi-Pack mit 3D-Effekt ---

  // Dunkler Rand für bessere Definition
  ctx.fillStyle = '#8B0000'; // Dunkelrot
  ctx.fillRect(0, 0, 32, 32);

  // 3D-Box-Effekt mit Schattierungen - Hauptkörper
  const boxGradient = ctx.createLinearGradient(2, 2, 30, 30);
  boxGradient.addColorStop(0, '#FF4444'); // Hellrot (Highlight)
  boxGradient.addColorStop(0.5, '#FF0000'); // Rot
  boxGradient.addColorStop(1, '#CC0000'); // Dunkelrot (Schatten)
  ctx.fillStyle = boxGradient;
  ctx.fillRect(2, 2, 28, 28);

  // Schatten für 3D-Effekt (unten und rechts)
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(2, 29, 28, 1); // Unten
  ctx.fillRect(29, 2, 1, 28); // Rechts

  // Zusätzliche Schattierung für mehr Tiefe
  ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
  ctx.fillRect(3, 28, 26, 1);
  ctx.fillRect(28, 3, 1, 26);

  // Weiße Highlights für Plastik-Glanz-Effekt (oben und links)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(2, 2, 26, 1); // Oben
  ctx.fillRect(2, 2, 1, 26); // Links

  // Zusätzliche Highlights für mehr Glanz
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(3, 3, 24, 1);
  ctx.fillRect(3, 3, 1, 24);

  // Deutliches weißes Kreuz auf rotem Hintergrund
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(13, 7, 6, 18);  // Vertikaler Balken
  ctx.fillRect(7, 13, 18, 6);  // Horizontaler Balken

  // Schatten am Kreuz für 3D-Effekt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(13, 24, 6, 1); // Schatten unten am vertikalen Balken
  ctx.fillRect(24, 13, 1, 6); // Schatten rechts am horizontalen Balken

  // Highlights am Kreuz für Plastik-Effekt
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(13, 7, 6, 1); // Highlight oben am vertikalen Balken
  ctx.fillRect(7, 13, 1, 6); // Highlight links am horizontalen Balken

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

function createAmmoTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // --- Militärische Munitionskiste mit detailliertem 3D-Effekt ---

  // Hauptkörper der Kiste mit Farbverlauf für 3D-Effekt
  const boxGradient = ctx.createLinearGradient(4, 10, 28, 28);
  boxGradient.addColorStop(0, '#6B8E23'); // Olivgrün (Highlight)
  boxGradient.addColorStop(0.5, '#556B2F'); // Dunkelolivgrün
  boxGradient.addColorStop(1, '#3A4A1F'); // Sehr dunkel (Schatten)
  ctx.fillStyle = boxGradient;
  ctx.fillRect(4, 10, 24, 18);

  // Schattierungen für Tiefenwirkung - rechte Seite
  ctx.fillStyle = '#2A3A0F';
  ctx.fillRect(27, 11, 1, 17); // Rechter Rand
  ctx.fillRect(26, 12, 1, 15); // Zusätzlicher Schatten

  // Schattierungen für Tiefenwirkung - untere Seite
  ctx.fillStyle = '#2A3A0F';
  ctx.fillRect(5, 27, 22, 1); // Unterer Rand
  ctx.fillRect(6, 26, 20, 1); // Zusätzlicher Schatten

  // Highlights für 3D-Effekt - obere und linke Seite
  ctx.fillStyle = '#7A9E33';
  ctx.fillRect(4, 10, 23, 1); // Oberer Rand
  ctx.fillRect(4, 11, 1, 16); // Linker Rand

  // Deckel mit dunklerer Farbe
  const lidGradient = ctx.createLinearGradient(2, 6, 30, 10);
  lidGradient.addColorStop(0, '#4A5A2F'); // Mittleres Olivgrün
  lidGradient.addColorStop(0.5, '#3A4A1F'); // Dunkel
  lidGradient.addColorStop(1, '#2A3A0F'); // Sehr dunkel
  ctx.fillStyle = lidGradient;
  ctx.fillRect(2, 6, 28, 4);

  // Deckel-Schattierung
  ctx.fillStyle = '#1A2A0F';
  ctx.fillRect(2, 9, 28, 1); // Schatten unter dem Deckel

  // Deckel-Highlight
  ctx.fillStyle = '#5A6A3F';
  ctx.fillRect(2, 6, 28, 1); // Highlight oben

  // Schwarze Riemen über die Kiste (2 Riemen)
  ctx.fillStyle = '#000000';
  ctx.fillRect(10, 6, 3, 22); // Linker Riemen
  ctx.fillRect(19, 6, 3, 22); // Rechter Riemen

  // Riemen-Highlights für Leder-Effekt
  ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
  ctx.fillRect(10, 6, 1, 22); // Linker Riemen Highlight
  ctx.fillRect(19, 6, 1, 22); // Rechter Riemen Highlight

  // Metallschnallen an den Riemen
  ctx.fillStyle = '#696969'; // Dunkelgrau
  ctx.fillRect(10, 14, 3, 4); // Linke Schnalle
  ctx.fillRect(19, 14, 3, 4); // Rechte Schnalle

  // Schnallen-Highlights
  ctx.fillStyle = '#A0A0A0';
  ctx.fillRect(10, 14, 3, 1); // Linke Schnalle Highlight
  ctx.fillRect(19, 14, 3, 1); // Rechte Schnalle Highlight

  // Weißes Label für "AMMO" Beschriftung
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(13, 16, 6, 6);

  // Label-Rand
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(13, 16, 6, 6);

  // "AMMO" Beschriftung
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 4px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AMMO', 16, 19);

  // Sichtbare Patronenspitzen in Gold (3-4 Stück)
  const bulletGradient = ctx.createRadialGradient(8, 24, 0, 8, 24, 2);
  bulletGradient.addColorStop(0, '#FFD700'); // Gold
  bulletGradient.addColorStop(0.7, '#DAA520'); // Goldenrod
  bulletGradient.addColorStop(1, '#B8860B'); // Dunkelgold
  
  // Patrone 1 (links)
  ctx.fillStyle = bulletGradient;
  ctx.beginPath();
  ctx.arc(6, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Patronenhülse
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(5, 25, 2, 2);

  // Patrone 2
  const bulletGradient2 = ctx.createRadialGradient(14, 24, 0, 14, 24, 2);
  bulletGradient2.addColorStop(0, '#FFD700');
  bulletGradient2.addColorStop(0.7, '#DAA520');
  bulletGradient2.addColorStop(1, '#B8860B');
  ctx.fillStyle = bulletGradient2;
  ctx.beginPath();
  ctx.arc(14, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(13, 25, 2, 2);

  // Patrone 3
  const bulletGradient3 = ctx.createRadialGradient(18, 24, 0, 18, 24, 2);
  bulletGradient3.addColorStop(0, '#FFD700');
  bulletGradient3.addColorStop(0.7, '#DAA520');
  bulletGradient3.addColorStop(1, '#B8860B');
  ctx.fillStyle = bulletGradient3;
  ctx.beginPath();
  ctx.arc(18, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(17, 25, 2, 2);

  // Patrone 4 (rechts)
  const bulletGradient4 = ctx.createRadialGradient(26, 24, 0, 26, 24, 2);
  bulletGradient4.addColorStop(0, '#FFD700');
  bulletGradient4.addColorStop(0.7, '#DAA520');
  bulletGradient4.addColorStop(1, '#B8860B');
  ctx.fillStyle = bulletGradient4;
  ctx.beginPath();
  ctx.arc(26, 24, 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#B8860B';
  ctx.fillRect(25, 25, 2, 2);

  // Highlights auf Patronenspitzen für metallischen Glanz
  ctx.fillStyle = '#FFFFE0';
  ctx.beginPath();
  ctx.arc(5.5, 23.5, 0.5, 0, Math.PI * 2);
  ctx.arc(13.5, 23.5, 0.5, 0, Math.PI * 2);
  ctx.arc(17.5, 23.5, 0.5, 0, Math.PI * 2);
  ctx.arc(25.5, 23.5, 0.5, 0, Math.PI * 2);
  ctx.fill();


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

  // --- Detailliertes Sturmgewehr mit erkennbaren Komponenten ---

  // Schulterstütze (hinten) mit metallischem Farbverlauf
  const stockGradient = ctx.createLinearGradient(2, 13, 2, 17);
  stockGradient.addColorStop(0, '#4A4A4A'); // Hellgrau
  stockGradient.addColorStop(0.5, '#2A2A2A'); // Mittelgrau
  stockGradient.addColorStop(1, '#1A1A1A'); // Dunkelgrau
  ctx.fillStyle = stockGradient;
  ctx.fillRect(2, 13, 5, 4); // Hauptteil der Stütze
  
  // Schulterstütze - Verbindung zum Körper
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(6, 14, 2, 2);
  
  // Highlight auf Schulterstütze für Metall-Glanz
  ctx.fillStyle = '#696969';
  ctx.fillRect(2, 13, 5, 1);

  // Hauptkörper der Waffe (Receiver) mit metallischem Farbverlauf
  const bodyGradient = ctx.createLinearGradient(8, 11, 8, 19);
  bodyGradient.addColorStop(0, '#4A4A4A'); // Hellgrau (Highlight)
  bodyGradient.addColorStop(0.3, '#2A2A2A'); // Mittelgrau
  bodyGradient.addColorStop(0.7, '#1A1A1A'); // Dunkelgrau
  bodyGradient.addColorStop(1, '#0A0A0A'); // Sehr dunkelgrau (Schatten)
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(8, 11, 14, 8); // Hauptkörper
  
  // Obere Schiene (Rail) für Visier
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(10, 10, 10, 1);
  
  // Schatten am Hauptkörper für 3D-Effekt
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(8, 18, 14, 1); // Unten
  ctx.fillRect(21, 11, 1, 8); // Rechts
  
  // Highlights am Hauptkörper für Metall-Glanz
  ctx.fillStyle = '#696969';
  ctx.fillRect(8, 11, 14, 1); // Oben
  ctx.fillRect(8, 11, 1, 8); // Links
  
  // Zusätzliche Highlights für starken Metall-Effekt
  ctx.fillStyle = '#8A8A8A';
  ctx.fillRect(9, 12, 12, 1);
  ctx.fillRect(9, 12, 1, 6);

  // Lauf mit metallischem Farbverlauf
  const barrelGradient = ctx.createLinearGradient(22, 12, 22, 18);
  barrelGradient.addColorStop(0, '#2A2A2A'); // Helleres Grau
  barrelGradient.addColorStop(0.5, '#1A1A1A'); // Dunkelgrau
  barrelGradient.addColorStop(1, '#0A0A0A'); // Sehr dunkelgrau
  ctx.fillStyle = barrelGradient;
  ctx.fillRect(22, 12, 8, 6); // Lauf
  
  // Laufmündung (dunkler)
  ctx.fillStyle = '#000000';
  ctx.fillRect(29, 13, 1, 4);
  
  // Rillen am Lauf für Details
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(24, 12, 1, 6);
  ctx.fillRect(26, 12, 1, 6);
  ctx.fillRect(28, 12, 1, 6);
  
  // Highlights am Lauf
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(22, 12, 8, 1); // Oben
  ctx.fillRect(23, 13, 1, 1); // Glanzpunkt

  // Visier (vorne) mit Details
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(20, 9, 3, 2); // Vorderes Visier
  ctx.fillRect(21, 8, 1, 1); // Spitze
  
  // Visier (hinten)
  ctx.fillRect(10, 9, 3, 2);
  ctx.fillRect(11, 8, 1, 1); // Spitze
  
  // Highlight auf Visieren
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(20, 9, 3, 1);
  ctx.fillRect(10, 9, 3, 1);

  // Magazin unter dem Hauptkörper mit Farbverlauf
  const magGradient = ctx.createLinearGradient(13, 19, 13, 27);
  magGradient.addColorStop(0, '#2A2A2A'); // Helleres Grau
  magGradient.addColorStop(0.5, '#1A1A1A'); // Mittelgrau
  magGradient.addColorStop(1, '#0A0A0A'); // Dunkelgrau
  ctx.fillStyle = magGradient;
  ctx.fillRect(13, 19, 6, 8); // Magazin
  
  // Magazin - gebogene Form (unten breiter)
  ctx.fillRect(12, 25, 8, 2);
  
  // Schatten am Magazin
  ctx.fillStyle = '#000000';
  ctx.fillRect(18, 19, 1, 8); // Rechts
  ctx.fillRect(13, 26, 6, 1); // Unten
  
  // Highlights am Magazin
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(13, 19, 6, 1); // Oben
  ctx.fillRect(13, 19, 1, 8); // Links
  
  // Rillen am Magazin für Grip-Textur
  ctx.fillStyle = '#0A0A0A';
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

function createZombieCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Blutlache (größer und realistischer)
  const bloodGradient = ctx.createRadialGradient(32, 54, 5, 32, 54, 28);
  bloodGradient.addColorStop(0, '#8B0000'); // Dunkelrot
  bloodGradient.addColorStop(0.5, '#5A0000'); // Sehr dunkelrot
  bloodGradient.addColorStop(1, 'rgba(90, 0, 0, 0.3)'); // Transparent
  ctx.fillStyle = bloodGradient;
  ctx.beginPath();
  ctx.ellipse(32, 54, 28, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Liegender Körper (zerrissenes Hemd)
  ctx.fillStyle = '#5A0000'; // Dunkelrotes Hemd
  ctx.fillRect(14, 48, 36, 10); // Hauptkörper
  
  // Körper-Schattierung
  ctx.fillStyle = '#3A0000';
  ctx.fillRect(14, 48, 36, 2); // Oberer Schatten

  // Linker Arm ausgestreckt
  ctx.fillStyle = '#2E8B57'; // Grüne Haut
  ctx.fillRect(6, 50, 10, 6);
  // Linke Hand
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(4, 52, 4, 4);
  // Finger angedeutet
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(2, 53, 2, 1);
  ctx.fillRect(2, 55, 2, 1);

  // Rechter Arm ausgestreckt
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(48, 50, 10, 6);
  // Rechte Hand
  ctx.fillStyle = '#3CB371';
  ctx.fillRect(56, 52, 4, 4);
  // Finger angedeutet
  ctx.fillStyle = '#2E8B57';
  ctx.fillRect(60, 53, 2, 1);
  ctx.fillRect(60, 55, 2, 1);

  // Kopf (seitlich liegend)
  ctx.fillStyle = '#3CB371'; // Grüne Haut
  ctx.fillRect(26, 44, 12, 8);
  
  // Wunde am Kopf
  ctx.fillStyle = '#5A0000';
  ctx.fillRect(32, 45, 4, 3);

  // Beine (angewinkelt)
  ctx.fillStyle = '#4B3A26'; // Braune Hose
  ctx.fillRect(18, 56, 8, 6);
  ctx.fillRect(38, 56, 8, 6);
  
  // Schuhe
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(16, 58, 6, 4);
  ctx.fillRect(40, 58, 6, 4);

  return canvas;
}

function createMonsterCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Zusammengesunkener Monster-Leichnam ---

  // Blutlache
  const bloodGradient = ctx.createRadialGradient(32, 54, 5, 32, 54, 30);
  bloodGradient.addColorStop(0, '#8B0000'); // Dunkelrot
  bloodGradient.addColorStop(0.5, '#5A0000'); // Sehr dunkelrot
  bloodGradient.addColorStop(1, 'rgba(90, 0, 0, 0.2)'); // Transparent
  ctx.fillStyle = bloodGradient;
  ctx.beginPath();
  ctx.ellipse(32, 56, 32, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Zusammengesunkener Körper (flach)
  const corpseGradient = ctx.createRadialGradient(32, 52, 5, 32, 52, 24);
  corpseGradient.addColorStop(0, '#5A0000'); // Sehr dunkelrot
  corpseGradient.addColorStop(0.5, '#3A0000'); // Fast schwarz-rot
  corpseGradient.addColorStop(1, '#2A0000'); // Sehr dunkel
  ctx.fillStyle = corpseGradient;
  ctx.beginPath();
  ctx.ellipse(32, 52, 26, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Muskelstruktur noch sichtbar (Schattierungen)
  ctx.fillStyle = '#1A0000';
  ctx.fillRect(28, 48, 8, 2);
  ctx.fillRect(28, 52, 8, 2);
  ctx.fillRect(28, 56, 8, 2);

  // Ausgestreckte Arme
  ctx.fillStyle = '#3A0000';
  ctx.beginPath();
  ctx.ellipse(12, 52, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(52, 52, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Klauen noch sichtbar
  ctx.fillStyle = '#808080';
  ctx.fillRect(6, 52, 2, 3);
  ctx.fillRect(9, 52, 2, 3);
  ctx.fillRect(56, 52, 2, 3);
  ctx.fillRect(59, 52, 2, 3);

  // Beine zusammengesunken
  ctx.fillStyle = '#3A0000';
  ctx.beginPath();
  ctx.ellipse(22, 58, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(42, 58, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kopf seitlich liegend
  ctx.fillStyle = '#4A0000';
  ctx.fillRect(26, 44, 12, 8);
  
  // Hörner noch sichtbar (seitlich)
  const hornGradient = ctx.createLinearGradient(10, 44, 18, 48);
  hornGradient.addColorStop(0, '#A0A0A0');
  hornGradient.addColorStop(0.5, '#808080');
  hornGradient.addColorStop(1, '#505050');
  ctx.fillStyle = hornGradient;
  ctx.fillRect(10, 44, 10, 4); // Linkes Horn
  
  const hornGradient2 = ctx.createLinearGradient(44, 44, 52, 48);
  hornGradient2.addColorStop(0, '#A0A0A0');
  hornGradient2.addColorStop(0.5, '#808080');
  hornGradient2.addColorStop(1, '#505050');
  ctx.fillStyle = hornGradient2;
  ctx.fillRect(44, 44, 10, 4); // Rechtes Horn
  
  // Hornspitzen
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(8, 44, 3, 2);
  ctx.fillRect(53, 44, 3, 2);

  // Erloschene Augen
  ctx.fillStyle = '#1A0000';
  ctx.beginPath();
  ctx.arc(30, 47, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(34, 47, 2, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createGhostCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Verblassender Geist mit mehreren Transparenzebenen ---

  // Äußerste Schicht - fast vollständig verblasst (30% Transparenz)
  ctx.globalAlpha = 0.3;
  const outerFade = ctx.createRadialGradient(32, 52, 8, 32, 52, 32);
  outerFade.addColorStop(0, 'rgba(176, 224, 230, 0.4)'); // #B0E0E6 - Puderblau
  outerFade.addColorStop(0.5, 'rgba(135, 206, 235, 0.2)'); // #87CEEB - Himmelblau
  outerFade.addColorStop(1, 'rgba(135, 206, 235, 0)'); // Vollständig transparent
  ctx.fillStyle = outerFade;
  
  // Verblassende Geisterform (flach am Boden)
  ctx.beginPath();
  ctx.ellipse(32, 52, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mittlere Schicht - stärker sichtbar (45% Transparenz)
  ctx.globalAlpha = 0.45;
  const middleFade = ctx.createRadialGradient(32, 50, 5, 32, 50, 22);
  middleFade.addColorStop(0, 'rgba(200, 220, 255, 0.6)'); // Hellblau
  middleFade.addColorStop(0.5, 'rgba(176, 224, 230, 0.4)'); // #B0E0E6
  middleFade.addColorStop(1, 'rgba(135, 206, 235, 0)'); // #87CEEB (transparent)
  ctx.fillStyle = middleFade;
  ctx.beginPath();
  ctx.ellipse(32, 50, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Innere Schicht - noch erkennbar (55% Transparenz)
  ctx.globalAlpha = 0.55;
  const innerFade = ctx.createRadialGradient(32, 48, 3, 32, 48, 16);
  innerFade.addColorStop(0, 'rgba(224, 255, 255, 0.7)'); // #E0FFFF - Hellcyan
  innerFade.addColorStop(0.5, 'rgba(200, 220, 255, 0.5)');
  innerFade.addColorStop(1, 'rgba(176, 224, 230, 0)'); // #B0E0E6 (transparent)
  ctx.fillStyle = innerFade;
  ctx.beginPath();
  ctx.ellipse(32, 48, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kern - letzter Rest der Energie (65% Transparenz)
  ctx.globalAlpha = 0.65;
  const coreFade = ctx.createRadialGradient(32, 48, 1, 32, 48, 10);
  coreFade.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Weißer Kern
  coreFade.addColorStop(0.4, 'rgba(224, 255, 255, 0.6)'); // #E0FFFF
  coreFade.addColorStop(1, 'rgba(200, 220, 255, 0)'); // Transparent
  ctx.fillStyle = coreFade;
  ctx.beginPath();
  ctx.ellipse(32, 48, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Letzte Energiefunken (sehr schwach, 40% Transparenz)
  ctx.globalAlpha = 0.4;
  const spark1 = ctx.createRadialGradient(28, 46, 0, 28, 46, 4);
  spark1.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  spark1.addColorStop(0.5, 'rgba(224, 255, 255, 0.4)');
  spark1.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = spark1;
  ctx.beginPath();
  ctx.arc(28, 46, 4, 0, Math.PI * 2);
  ctx.fill();

  const spark2 = ctx.createRadialGradient(36, 46, 0, 36, 46, 4);
  spark2.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  spark2.addColorStop(0.5, 'rgba(224, 255, 255, 0.4)');
  spark2.addColorStop(1, 'rgba(176, 224, 230, 0)');
  ctx.fillStyle = spark2;
  ctx.beginPath();
  ctx.arc(36, 46, 4, 0, Math.PI * 2);
  ctx.fill();

  // Schwache Augenreste (25% Transparenz)
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = 'rgba(135, 206, 235, 0.5)'; // #87CEEB
  ctx.beginPath();
  ctx.arc(28, 47, 2, 0, Math.PI * 2);
  ctx.arc(36, 47, 2, 0, Math.PI * 2);
  ctx.fill();

  // Zurücksetzen
  ctx.globalAlpha = 1.0;

  return canvas;
}

export function getCorpseTexture(enemyType: EnemyType): CanvasImageSource | undefined {
  return corpseTextures[enemyType];
}

function createDogTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierter aggressiver Kampfhund ---
  const yOffset = 12;

  // Hintere Beine (weiter hinten für Tiefenwirkung)
  const legGradient1 = ctx.createLinearGradient(0, 32 + yOffset, 0, 48 + yOffset);
  legGradient1.addColorStop(0, '#5A3A1A'); // Mittelbraun
  legGradient1.addColorStop(0.5, '#3A1A0A'); // Dunkelbraun
  legGradient1.addColorStop(1, '#2A0A0A'); // Sehr dunkelbraun
  ctx.fillStyle = legGradient1;
  ctx.fillRect(18, 32 + yOffset, 7, 16); // Hinten links
  ctx.fillRect(39, 32 + yOffset, 7, 16); // Hinten rechts
  
  // Pfoten hinten mit Krallen
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(17, 46 + yOffset, 9, 5); // Linke Hinterpfote
  ctx.fillRect(38, 46 + yOffset, 9, 5); // Rechte Hinterpfote
  
  // Krallen hinten
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(16, 50 + yOffset, 2, 3); // Kralle 1 links
  ctx.fillRect(19, 50 + yOffset, 2, 3); // Kralle 2 links
  ctx.fillRect(22, 50 + yOffset, 2, 3); // Kralle 3 links
  ctx.fillRect(37, 50 + yOffset, 2, 3); // Kralle 1 rechts
  ctx.fillRect(40, 50 + yOffset, 2, 3); // Kralle 2 rechts
  ctx.fillRect(43, 50 + yOffset, 2, 3); // Kralle 3 rechts

  // Körper mit Fellstruktur (mehrere Brauntöne)
  const bodyGradient = ctx.createLinearGradient(0, 20 + yOffset, 0, 40 + yOffset);
  bodyGradient.addColorStop(0, '#6B4A2A'); // Hellbraun (Rücken)
  bodyGradient.addColorStop(0.4, '#5A3A1A'); // Mittelbraun
  bodyGradient.addColorStop(0.7, '#3A1A0A'); // Dunkelbraun
  bodyGradient.addColorStop(1, '#2A0A0A'); // Sehr dunkelbraun (Bauch)
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(14, 20 + yOffset, 36, 20);
  
  // Fellstruktur durch Schattierungen
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(16, 22 + yOffset, 32, 1); // Rückenlinie
  ctx.fillRect(16, 26 + yOffset, 32, 1); // Mittellinie
  ctx.fillStyle = '#5A3A1A';
  ctx.fillRect(16, 38 + yOffset, 32, 1); // Bauchlinie

  // Vordere Beine (aggressive Angriffsstellung - leicht nach vorne)
  const legGradient2 = ctx.createLinearGradient(0, 32 + yOffset, 0, 50 + yOffset);
  legGradient2.addColorStop(0, '#5A3A1A');
  legGradient2.addColorStop(0.5, '#3A1A0A');
  legGradient2.addColorStop(1, '#2A0A0A');
  ctx.fillStyle = legGradient2;
  ctx.fillRect(14, 34 + yOffset, 8, 16); // Vorne links
  ctx.fillRect(42, 34 + yOffset, 8, 16); // Vorne rechts
  
  // Pfoten vorne mit Krallen
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(12, 48 + yOffset, 10, 6); // Linke Vorderpfote
  ctx.fillRect(41, 48 + yOffset, 10, 6); // Rechte Vorderpfote
  
  // Krallen vorne (länger für aggressive Haltung)
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(11, 53 + yOffset, 2, 4); // Kralle 1 links
  ctx.fillRect(14, 53 + yOffset, 2, 5); // Kralle 2 links
  ctx.fillRect(17, 53 + yOffset, 2, 4); // Kralle 3 links
  ctx.fillRect(20, 53 + yOffset, 2, 3); // Kralle 4 links
  ctx.fillRect(40, 53 + yOffset, 2, 4); // Kralle 1 rechts
  ctx.fillRect(43, 53 + yOffset, 2, 5); // Kralle 2 rechts
  ctx.fillRect(46, 53 + yOffset, 2, 4); // Kralle 3 rechts
  ctx.fillRect(49, 53 + yOffset, 2, 3); // Kralle 4 rechts

  // Kopf mit detaillierter Fellstruktur
  const headGradient = ctx.createLinearGradient(0, 8 + yOffset, 0, 24 + yOffset);
  headGradient.addColorStop(0, '#6B4A2A'); // Hellbraun (Stirn)
  headGradient.addColorStop(0.5, '#5A3A1A'); // Mittelbraun
  headGradient.addColorStop(1, '#3A1A0A'); // Dunkelbraun (Schnauze)
  ctx.fillStyle = headGradient;
  ctx.fillRect(22, 8 + yOffset, 20, 16);
  
  // Fellschattierungen am Kopf
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(24, 10 + yOffset, 16, 1);
  ctx.fillRect(24, 14 + yOffset, 16, 1);

  // Angelegte Ohren (aggressive Haltung)
  ctx.fillStyle = '#3A1A0A';
  ctx.beginPath();
  ctx.moveTo(24, 10 + yOffset);
  ctx.lineTo(18, 12 + yOffset);
  ctx.lineTo(22, 16 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(40, 10 + yOffset);
  ctx.lineTo(46, 12 + yOffset);
  ctx.lineTo(42, 16 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  // Innere Ohrdetails
  ctx.fillStyle = '#5A3A1A';
  ctx.beginPath();
  ctx.moveTo(24, 11 + yOffset);
  ctx.lineTo(20, 12 + yOffset);
  ctx.lineTo(23, 14 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(40, 11 + yOffset);
  ctx.lineTo(44, 12 + yOffset);
  ctx.lineTo(41, 14 + yOffset);
  ctx.closePath();
  ctx.fill();

  // Leuchtend rote Augen mit Glüheffekt
  // Äußerer Glüheffekt
  const eyeGlow1 = ctx.createRadialGradient(27, 14 + yOffset, 1, 27, 14 + yOffset, 5);
  eyeGlow1.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
  eyeGlow1.addColorStop(0.5, 'rgba(255, 0, 0, 0.5)');
  eyeGlow1.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = eyeGlow1;
  ctx.beginPath();
  ctx.arc(27, 14 + yOffset, 5, 0, Math.PI * 2);
  ctx.fill();
  
  const eyeGlow2 = ctx.createRadialGradient(37, 14 + yOffset, 1, 37, 14 + yOffset, 5);
  eyeGlow2.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
  eyeGlow2.addColorStop(0.5, 'rgba(255, 0, 0, 0.5)');
  eyeGlow2.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = eyeGlow2;
  ctx.beginPath();
  ctx.arc(37, 14 + yOffset, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Hauptaugen
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(27, 14 + yOffset, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(37, 14 + yOffset, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupillen
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(27, 14 + yOffset, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(37, 14 + yOffset, 1, 0, Math.PI * 2);
  ctx.fill();

  // Detaillierte Schnauze
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(26, 18 + yOffset, 12, 6);
  
  // Nase
  ctx.fillStyle = '#000000';
  ctx.fillRect(30, 18 + yOffset, 4, 3);

  // Geblecktes Maul mit mindestens 4 Zähnen
  ctx.fillStyle = '#000000';
  ctx.fillRect(26, 22 + yOffset, 12, 4); // Geöffnetes Maul
  
  // Obere Zähne (Reißzähne)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(27, 22 + yOffset);
  ctx.lineTo(28, 25 + yOffset);
  ctx.lineTo(29, 22 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(30, 22 + yOffset);
  ctx.lineTo(31, 25 + yOffset);
  ctx.lineTo(32, 22 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(33, 22 + yOffset);
  ctx.lineTo(34, 25 + yOffset);
  ctx.lineTo(35, 22 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(36, 22 + yOffset);
  ctx.lineTo(37, 25 + yOffset);
  ctx.lineTo(38, 22 + yOffset);
  ctx.closePath();
  ctx.fill();
  
  // Untere Zähne
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(28, 24 + yOffset, 2, 2);
  ctx.fillRect(31, 24 + yOffset, 2, 2);
  ctx.fillRect(34, 24 + yOffset, 2, 2);

  return canvas;
}

function createDogCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // --- Detaillierter liegender Hund mit Blutlache ---

  // Große Blutlache mit Farbverlauf
  const bloodGradient = ctx.createRadialGradient(32, 56, 5, 32, 56, 30);
  bloodGradient.addColorStop(0, '#8B0000'); // Dunkelrot (Zentrum)
  bloodGradient.addColorStop(0.4, '#5A0000'); // Sehr dunkelrot
  bloodGradient.addColorStop(0.7, 'rgba(90, 0, 0, 0.6)'); // Transparent werdend
  bloodGradient.addColorStop(1, 'rgba(90, 0, 0, 0)'); // Vollständig transparent
  ctx.fillStyle = bloodGradient;
  ctx.beginPath();
  ctx.ellipse(32, 56, 30, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hintere Beine (ausgestreckt)
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(12, 52, 6, 10); // Hinten links
  ctx.fillRect(46, 52, 6, 10); // Hinten rechts
  
  // Hinterpfoten
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(10, 58, 8, 4);
  ctx.fillRect(46, 58, 8, 4);

  // Hauptkörper (liegend, seitlich) mit Fellstruktur
  const bodyGradient = ctx.createLinearGradient(0, 48, 0, 56);
  bodyGradient.addColorStop(0, '#5A3A1A'); // Mittelbraun (Rücken)
  bodyGradient.addColorStop(0.5, '#3A1A0A'); // Dunkelbraun
  bodyGradient.addColorStop(1, '#2A0A0A'); // Sehr dunkelbraun (Bauch)
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.ellipse(32, 52, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Fellschattierungen
  ctx.fillStyle = '#2A0A0A';
  ctx.beginPath();
  ctx.ellipse(32, 50, 22, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vordere Beine (ausgestreckt nach vorne)
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(20, 54, 6, 8); // Vorne links
  ctx.fillRect(38, 54, 6, 8); // Vorne rechts
  
  // Vorderpfoten
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(18, 58, 8, 4);
  ctx.fillRect(38, 58, 8, 4);
  
  // Krallen sichtbar
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(17, 60, 1, 2);
  ctx.fillRect(20, 60, 1, 2);
  ctx.fillRect(23, 60, 1, 2);
  ctx.fillRect(38, 60, 1, 2);
  ctx.fillRect(41, 60, 1, 2);
  ctx.fillRect(44, 60, 1, 2);

  // Kopf (seitlich liegend)
  const headGradient = ctx.createLinearGradient(0, 44, 0, 52);
  headGradient.addColorStop(0, '#5A3A1A');
  headGradient.addColorStop(1, '#3A1A0A');
  ctx.fillStyle = headGradient;
  ctx.fillRect(24, 44, 16, 10);
  
  // Schnauze
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(22, 48, 8, 4);
  
  // Nase
  ctx.fillStyle = '#000000';
  ctx.fillRect(22, 49, 3, 2);

  // Ohr (sichtbar, da seitlich liegend)
  ctx.fillStyle = '#2A0A0A';
  ctx.beginPath();
  ctx.moveTo(36, 44);
  ctx.lineTo(42, 42);
  ctx.lineTo(38, 48);
  ctx.closePath();
  ctx.fill();
  
  // Inneres Ohr
  ctx.fillStyle = '#3A1A0A';
  ctx.beginPath();
  ctx.moveTo(37, 45);
  ctx.lineTo(40, 44);
  ctx.lineTo(38, 47);
  ctx.closePath();
  ctx.fill();

  // Geschlossenes Auge
  ctx.fillStyle = '#000000';
  ctx.fillRect(32, 48, 4, 1);

  // Blutflecken auf dem Fell
  ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(28, 50, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(36, 52, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(42, 54, 2, 0, Math.PI * 2);
  ctx.fill();

  // Schwanz (ausgestreckt)
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(52, 54, 8, 3);
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(58, 55, 4, 2);

  return canvas;
}
