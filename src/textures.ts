import { EnemyType } from './types.ts';

const textures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const corpseTextures: Partial<Record<EnemyType, CanvasImageSource>> = {};
const wallTextures: Record<string, CanvasImageSource> = {};
const itemTextures: Record<string, CanvasImageSource> = {};

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

  // --- Aggressiver Hund ---
  // Da der Hund kleiner ist, zentrieren wir ihn etwas tiefer
  const yOffset = 16;

  // Beine
  ctx.fillStyle = '#4A2A0A'; // Dunkelbraun
  ctx.fillRect(16, 32 + yOffset, 6, 12); // Vorne links
  ctx.fillRect(42, 32 + yOffset, 6, 12); // Vorne rechts
  ctx.fillRect(18, 30 + yOffset, 6, 10); // Hinten links
  ctx.fillRect(40, 30 + yOffset, 6, 10); // Hinten rechts

  // Körper
  const bodyGradient = ctx.createLinearGradient(0, 20 + yOffset, 0, 36 + yOffset);
  bodyGradient.addColorStop(0, '#6B4A2A');
  bodyGradient.addColorStop(1, '#3A1A0A');
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(16, 20 + yOffset, 32, 16);

  // Kopf
  ctx.fillStyle = '#5A3A1A';
  ctx.fillRect(24, 12 + yOffset, 16, 12);

  // Ohren
  ctx.fillStyle = '#3A1A0A';
  ctx.beginPath();
  ctx.moveTo(24, 12 + yOffset);
  ctx.lineTo(20, 6 + yOffset);
  ctx.lineTo(28, 12 + yOffset);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(40, 12 + yOffset);
  ctx.lineTo(44, 6 + yOffset);
  ctx.lineTo(36, 12 + yOffset);
  ctx.fill();

  // Augen (rot leuchtend)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(28, 16 + yOffset, 4, 4);
  ctx.fillRect(36, 16 + yOffset, 4, 4);

  // Schnauze und Zähne
  ctx.fillStyle = '#3A1A0A';
  ctx.fillRect(28, 20 + yOffset, 8, 4);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(30, 22 + yOffset, 2, 2);
  ctx.fillRect(34, 22 + yOffset, 2, 2);

  return canvas;
}

function createDogCorpseTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Liegender Hund
  ctx.fillStyle = '#3A1A0A'; // Dunkles Braun
  ctx.beginPath();
  ctx.ellipse(32, 54, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blutlache
  ctx.fillStyle = 'rgba(139, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(32, 56, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ohren
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(18, 48, 6, 4);
  ctx.fillRect(40, 48, 6, 4);

  return canvas;
}
