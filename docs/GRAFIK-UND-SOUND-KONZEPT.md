# Konzept: Optische und Akustische Aufwertung

## Inhaltsverzeichnis
1. [Ist-Zustand Analyse](#ist-zustand-analyse)
2. [Grafik-Verbesserungen](#grafik-verbesserungen)
3. [Sound-Verbesserungen](#sound-verbesserungen)
4. [Performance-Strategie](#performance-strategie)
5. [Implementierungsplan](#implementierungsplan)

---

## Ist-Zustand Analyse

### Aktuelle Grafik-Implementierung

| Komponente | Aktuell | Limitierung |
|------------|---------|-------------|
| Sprite-Auflösung | 64x64 Pixel | Pixelig bei Nahansicht |
| Wand-Texturen | 64x64 Pixel | Wiederholungsmuster sichtbar |
| Generierung | Prozedural (Canvas 2D API) | Limitierte Detailtiefe |
| Caching | `colorVariantCache` (max 100 Einträge) | Gut, aber Texturen sind klein |

**Betroffene Assets:**
- 4 Gegner (Zombie, Monster, Geist, Hund) + jeweils Leichen-Variante
- 5 Wand-Typen (Ziegel, Holz, Stein, Tür, Exit-Tür)
- 5 Items (2x Gesundheit, Schatz, Munition, Waffe)
- 8 Dekorative Objekte (Licht, Vase, Kiste, Bank, Tisch, Stuhl, Weinflasche, Skelett)

### Aktuelle Sound-Implementierung

| Sound-Typ | Aktuelle Methode | Problem |
|-----------|------------------|---------|
| Schuss | `playTone(800, 0.1, 'square')` | Unrealistisch, wie 8-Bit |
| Tür öffnen | `playTone(300, 0.15, 'sine')` | Kein mechanisches Geräusch |
| Hundebellen | `playTone(600, 0.1, 'sawtooth')` | Klingt nicht nach Hund |
| Gegner-Tod | `playTone(200, 0.5, 'sawtooth')` | Kein Schmerzensschrei |
| Item aufheben | `playTone(600, 0.2, 'sine')` | OK für Retro-Stil |

**Verfügbare Sound-Typen:**
- `playShoot()`, `playKnifeAttack()`, `playChainsawAttack()`
- `playEnemyHit()`, `playEnemyDeath()`, `playPlayerHit()`
- `playPickup()`, `playLevelComplete()`, `playGameOver()`
- `playMenuSelect()`, `playDoorOpen()`, `playError()`, `playDogBark()`
- `play3dSound()` - Räumlicher Sound mit Distanz-Abfall

---

## Grafik-Verbesserungen

### Phase 1: Auflösungs-Upgrade (Basis)

**Ziel:** Sprites von 64x64 auf 128x128 oder 256x256 Pixel erhöhen

#### Schritt 1.1: Konfigurierbare Textur-Auflösung

```typescript
// src/config/graphicsSettings.ts (NEU)
export enum TextureQuality {
  LOW = 64,      // Original, für schwache Geräte
  MEDIUM = 128,  // Doppelte Auflösung
  HIGH = 256,    // Vierfache Auflösung
  ULTRA = 512    // Maximale Qualität
}

export interface GraphicsSettings {
  textureQuality: TextureQuality;
  enableMipmaps: boolean;
  spriteInterpolation: 'nearest' | 'linear';
}
```

#### Schritt 1.2: Dynamische Textur-Generierung

Alle `createXXXTexture()`-Funktionen müssen angepasst werden:

```typescript
// Vorher:
function createZombieTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 64;  // ❌ Fest
  canvas.height = 64;
  // ...
}

// Nachher:
function createZombieTexture(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;   // ✅ Dynamisch
  canvas.height = size;
  const scale = size / 64;  // Skalierungsfaktor
  // Alle Koordinaten mit `scale` multiplizieren
}
```

#### Schritt 1.3: Automatische Skalierung

```typescript
// Helper-Funktion für skalierte Zeichnungen
function scaledRect(ctx: CanvasRenderingContext2D, x: number, y: number,
                    w: number, h: number, scale: number) {
  ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
}

function scaledArc(ctx: CanvasRenderingContext2D, x: number, y: number,
                   r: number, scale: number) {
  ctx.beginPath();
  ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2);
  ctx.fill();
}
```

### Phase 2: Detail-Verbesserungen

#### Schritt 2.1: Schattierung und Tiefe

```typescript
// Ambient Occlusion Simulation
function addAmbientOcclusion(ctx: CanvasRenderingContext2D,
                              width: number, height: number) {
  // Leichte Abdunkelung an Rändern
  const gradient = ctx.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, width/2
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
```

#### Schritt 2.2: Animations-Frames für Gegner

**Konzept:** Mehrere Frames pro Gegner für verschiedene Zustände

```typescript
interface EnemySprites {
  idle: HTMLCanvasElement[];      // 2-4 Frames für Idle-Animation
  walking: HTMLCanvasElement[];   // 4-8 Frames für Lauf-Animation
  attacking: HTMLCanvasElement[]; // 2-4 Frames für Angriff
  hurt: HTMLCanvasElement;        // 1 Frame wenn getroffen
  dead: HTMLCanvasElement;        // Leiche
}

// Implementierung in textures.ts
function createZombieSprites(size: number = 64): EnemySprites {
  return {
    idle: [
      createZombieIdle1(size),
      createZombieIdle2(size)
    ],
    walking: [
      createZombieWalk1(size),
      createZombieWalk2(size),
      createZombieWalk3(size),
      createZombieWalk4(size)
    ],
    attacking: [
      createZombieAttack1(size),
      createZombieAttack2(size)
    ],
    hurt: createZombieHurt(size),
    dead: createZombieCorpse(size)
  };
}
```

#### Schritt 2.3: Partikel-Effekte

```typescript
// src/effects/particleSystem.ts (NEU)
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles = 200;

  spawnBlood(x: number, y: number, count: number = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 1,
        color: `rgb(${150 + Math.random() * 50}, 0, 0)`,
        size: 2 + Math.random() * 3
      });
    }
  }

  spawnMuzzleFlash(x: number, y: number) {
    // Gelb-orangene Partikel für Mündungsfeuer
  }

  update(deltaTime: number) {
    // Partikel bewegen und verblassen lassen
  }
}
```

### Phase 3: Fortgeschrittene Grafik

#### Schritt 3.1: Dynamische Beleuchtung

```typescript
// Beleuchtungs-Map für jeden Frame
interface LightSource {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  color: string;
}

function applyLighting(
  ctx: CanvasRenderingContext2D,
  lights: LightSource[],
  playerX: number,
  playerY: number
) {
  // Basis-Dunkelheit
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(50, 50, 60, 0.5)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Lichtquellen addieren
  ctx.globalCompositeOperation = 'screen';
  for (const light of lights) {
    const gradient = ctx.createRadialGradient(
      light.x, light.y, 0,
      light.x, light.y, light.radius
    );
    gradient.addColorStop(0, light.color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  ctx.globalCompositeOperation = 'source-over';
}
```

#### Schritt 3.2: Hochauflösende Wand-Texturen mit Detailstufen

```typescript
// Mipmap-ähnliches System
const wallTextureMipmaps: Map<string, HTMLCanvasElement[]> = new Map();

function generateWallMipmaps(type: string, baseSize: number = 512) {
  const mipmaps: HTMLCanvasElement[] = [];
  let size = baseSize;

  while (size >= 32) {
    mipmaps.push(createWallTexture(type, size));
    size /= 2;
  }

  wallTextureMipmaps.set(type, mipmaps);
}

// Bei Rendering: Wähle Mipmap basierend auf Distanz
function getWallTextureForDistance(type: string, distance: number): HTMLCanvasElement {
  const mipmaps = wallTextureMipmaps.get(type)!;
  const level = Math.min(
    Math.floor(distance / 2),  // Je weiter weg, desto niedriger
    mipmaps.length - 1
  );
  return mipmaps[level];
}
```

---

## Sound-Verbesserungen

### Phase 1: Komplexere prozedurale Sounds

#### Schritt 1.1: Sound-Synthese-Klassen

```typescript
// src/audio/soundSynthesis.ts (NEU)

class RealisticSoundGenerator {
  private ctx: AudioContext;

  // Realistischerer Schuss-Sound
  generateGunshot(): void {
    // 1. Initialer Knall (sehr kurz, laut)
    const impactOsc = this.ctx.createOscillator();
    impactOsc.type = 'sawtooth';
    impactOsc.frequency.setValueAtTime(800, this.ctx.currentTime);
    impactOsc.frequency.exponentialRampToValueAtTime(
      200, this.ctx.currentTime + 0.05
    );

    // 2. Noise für "Explosion"-Charakter
    const noiseBuffer = this.createNoiseBuffer(0.1);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // 3. Filter für Charakter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(5000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      200, this.ctx.currentTime + 0.15
    );

    // 4. Envelope
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01, this.ctx.currentTime + 0.2
    );

    // Verbindungen
    noiseSource.connect(filter);
    filter.connect(gainNode);
    impactOsc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    impactOsc.start();
    noiseSource.start();
    impactOsc.stop(this.ctx.currentTime + 0.05);
    noiseSource.stop(this.ctx.currentTime + 0.2);
  }

  // White Noise Buffer für Explosionen, Schüsse etc.
  private createNoiseBuffer(duration: number): AudioBuffer {
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}
```

#### Schritt 1.2: Realistisches Hundebellen

```typescript
generateDogBark(): void {
  // Hundebellen besteht aus mehreren kurzen "Woof"-Lauten
  const barkCount = 2 + Math.floor(Math.random() * 2); // 2-3 Beller

  for (let i = 0; i < barkCount; i++) {
    const startTime = this.ctx.currentTime + i * 0.15;

    // Grundton
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300 + Math.random() * 100, startTime);
    osc.frequency.exponentialRampToValueAtTime(150, startTime + 0.08);

    // Formant-Filter für "Woof"-Charakter
    const formant = this.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.value = 800;
    formant.Q.value = 2;

    // Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.5, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    osc.connect(formant);
    formant.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.1);
  }
}
```

#### Schritt 1.3: Tür-Geräusch

```typescript
generateDoorSound(isOpening: boolean): void {
  // 1. Quietschen (optional, für alte Türen)
  const creakOsc = this.ctx.createOscillator();
  creakOsc.type = 'sine';
  creakOsc.frequency.setValueAtTime(400, this.ctx.currentTime);
  creakOsc.frequency.linearRampToValueAtTime(
    isOpening ? 600 : 300,
    this.ctx.currentTime + 0.3
  );

  // 2. Mechanisches Klicken (Schloss/Griff)
  const clickBuffer = this.createClickBuffer();
  const clickSource = this.ctx.createBufferSource();
  clickSource.buffer = clickBuffer;

  // 3. Schweres "Thud" am Ende
  const thudOsc = this.ctx.createOscillator();
  thudOsc.type = 'sine';
  thudOsc.frequency.value = 80;

  const thudGain = this.ctx.createGain();
  thudGain.gain.setValueAtTime(0, this.ctx.currentTime + 0.25);
  thudGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.27);
  thudGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

  // Verbindungen...
}
```

### Phase 2: Audio-Samples (Optional)

Falls prozedurale Sounds nicht ausreichen, können echte Audio-Samples eingebunden werden.

#### Schritt 2.1: Sample-Loader

```typescript
// src/audio/sampleLoader.ts (NEU)

interface SoundSamples {
  gunshot: AudioBuffer[];      // Mehrere Varianten
  dogBark: AudioBuffer[];
  doorOpen: AudioBuffer;
  doorClose: AudioBuffer;
  footsteps: AudioBuffer[];
  zombieGroan: AudioBuffer[];
  monsterRoar: AudioBuffer[];
  ghostWail: AudioBuffer[];
}

class SampleLoader {
  private ctx: AudioContext;
  private samples: Partial<SoundSamples> = {};

  async loadSample(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.ctx.decodeAudioData(arrayBuffer);
  }

  async loadAllSamples(): Promise<void> {
    // Nur laden wenn verfügbar (graceful degradation)
    try {
      this.samples.gunshot = [
        await this.loadSample('/audio/gunshot1.ogg'),
        await this.loadSample('/audio/gunshot2.ogg'),
      ];
      // ... weitere Samples
    } catch (error) {
      console.warn('Audio samples not found, using procedural audio');
    }
  }

  playSample(name: keyof SoundSamples, variation: number = 0): void {
    const sample = this.samples[name];
    if (!sample) {
      // Fallback zu prozeduralem Sound
      return;
    }

    const buffer = Array.isArray(sample)
      ? sample[variation % sample.length]
      : sample;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.ctx.destination);
    source.start();
  }
}
```

#### Schritt 2.2: Empfohlene Sound-Quellen (Kostenlos/CC0)

| Sound | Empfohlene Quelle | Format |
|-------|-------------------|--------|
| Schüsse | freesound.org | OGG/MP3 |
| Hundebellen | freesound.org (z.B. "aggressive dog bark") | OGG |
| Türen | opengameart.org | OGG |
| Monster-Geräusche | opengameart.org | OGG |
| Schritte | freesound.org | OGG |

**Audio-Verzeichnis-Struktur:**
```
public/
└── audio/
    ├── weapons/
    │   ├── pistol.ogg
    │   ├── machinegun.ogg
    │   ├── chainsaw.ogg
    │   └── knife.ogg
    ├── enemies/
    │   ├── zombie_groan1.ogg
    │   ├── zombie_death.ogg
    │   ├── dog_bark1.ogg
    │   ├── dog_bark2.ogg
    │   └── ghost_wail.ogg
    ├── environment/
    │   ├── door_open.ogg
    │   ├── door_close.ogg
    │   └── footstep.ogg
    └── ui/
        ├── pickup.ogg
        └── levelup.ogg
```

### Phase 3: 3D-Audio Verbesserungen

```typescript
// Erweitertes 3D-Audio-System
class Spatial3DAudio {
  private ctx: AudioContext;
  private listener: AudioListener;
  private pannerPool: PannerNode[] = [];

  constructor() {
    this.ctx = new AudioContext();
    this.listener = this.ctx.listener;
  }

  updateListenerPosition(x: number, y: number, angle: number) {
    // Listener-Position und -Orientierung setzen
    this.listener.positionX.value = x;
    this.listener.positionY.value = y;
    this.listener.positionZ.value = 0;

    // Blickrichtung basierend auf Spieler-Winkel
    this.listener.forwardX.value = Math.cos(angle);
    this.listener.forwardY.value = Math.sin(angle);
    this.listener.forwardZ.value = 0;
  }

  playAtPosition(
    buffer: AudioBuffer,
    x: number,
    y: number,
    options: {
      rolloff?: number;
      maxDistance?: number;
    } = {}
  ) {
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const panner = this.ctx.createPanner();
    panner.panningModel = 'HRTF';  // Realistisches 3D-Audio
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = options.maxDistance || 20;
    panner.rolloffFactor = options.rolloff || 1;
    panner.positionX.value = x;
    panner.positionY.value = y;
    panner.positionZ.value = 0;

    source.connect(panner);
    panner.connect(this.ctx.destination);
    source.start();
  }
}
```

---

## Performance-Strategie

### Grafik-Performance

#### Level of Detail (LOD) System

```typescript
// Automatische Qualitätsanpassung basierend auf Distanz
function getTextureForDistance(
  baseTexture: HTMLCanvasElement,
  distance: number,
  mipmaps: HTMLCanvasElement[]
): HTMLCanvasElement {
  if (distance > 10) return mipmaps[3];  // 64x64
  if (distance > 5) return mipmaps[2];   // 128x128
  if (distance > 2) return mipmaps[1];   // 256x256
  return mipmaps[0];                      // 512x512 (nur ganz nah)
}
```

#### Lazy Loading für hochauflösende Texturen

```typescript
class TextureManager {
  private highResQueue: Set<string> = new Set();
  private isLoading = false;

  // Lade hochauflösende Version im Hintergrund
  async loadHighResVersion(textureId: string): Promise<void> {
    if (this.highResQueue.has(textureId)) return;
    this.highResQueue.add(textureId);

    // Im nächsten Idle-Moment laden
    requestIdleCallback(async () => {
      const highRes = await this.generateHighRes(textureId);
      this.cache.set(`${textureId}_high`, highRes);
    });
  }
}
```

#### Frame-Budget-System

```typescript
// Begrenze Zeit pro Frame für Textur-Updates
const FRAME_BUDGET_MS = 4; // ~240 FPS headroom bei 60 FPS Ziel

class FrameBudget {
  private frameStart: number = 0;

  startFrame() {
    this.frameStart = performance.now();
  }

  hasTimeRemaining(): boolean {
    return performance.now() - this.frameStart < FRAME_BUDGET_MS;
  }
}
```

### Audio-Performance

#### Sound-Pooling

```typescript
class SoundPool {
  private pools: Map<string, AudioBufferSourceNode[]> = new Map();
  private maxPoolSize = 8;

  getSource(soundName: string): AudioBufferSourceNode | null {
    const pool = this.pools.get(soundName);
    if (!pool || pool.length === 0) return null;
    return pool.pop()!;
  }

  returnToPool(soundName: string, source: AudioBufferSourceNode) {
    let pool = this.pools.get(soundName);
    if (!pool) {
      pool = [];
      this.pools.set(soundName, pool);
    }
    if (pool.length < this.maxPoolSize) {
      pool.push(source);
    }
  }
}
```

#### Sound-Priorisierung

```typescript
enum SoundPriority {
  CRITICAL = 0,   // Spieler-Treffer, Tod
  HIGH = 1,       // Schüsse, Gegner-Tod
  MEDIUM = 2,     // Türen, Items
  LOW = 3         // Ambient, Schritte
}

class PrioritizedSoundQueue {
  private maxConcurrentSounds = 8;
  private activeSounds: { priority: SoundPriority; endTime: number }[] = [];

  canPlay(priority: SoundPriority): boolean {
    // Entferne beendete Sounds
    this.activeSounds = this.activeSounds.filter(
      s => s.endTime > performance.now()
    );

    if (this.activeSounds.length < this.maxConcurrentSounds) {
      return true;
    }

    // Ersetze niedrigere Priorität
    return this.activeSounds.some(s => s.priority > priority);
  }
}
```

### Qualitätseinstellungen UI

```typescript
// src/components/GraphicsSettings.tsx (NEU)
interface QualityPresets {
  low: GraphicsSettings;
  medium: GraphicsSettings;
  high: GraphicsSettings;
  ultra: GraphicsSettings;
}

const QUALITY_PRESETS: QualityPresets = {
  low: {
    textureQuality: TextureQuality.LOW,      // 64x64
    enableMipmaps: false,
    spriteInterpolation: 'nearest',
    particleCount: 50,
    enableDynamicLighting: false,
    animationFrames: 1
  },
  medium: {
    textureQuality: TextureQuality.MEDIUM,   // 128x128
    enableMipmaps: true,
    spriteInterpolation: 'linear',
    particleCount: 100,
    enableDynamicLighting: false,
    animationFrames: 2
  },
  high: {
    textureQuality: TextureQuality.HIGH,     // 256x256
    enableMipmaps: true,
    spriteInterpolation: 'linear',
    particleCount: 150,
    enableDynamicLighting: true,
    animationFrames: 4
  },
  ultra: {
    textureQuality: TextureQuality.ULTRA,    // 512x512
    enableMipmaps: true,
    spriteInterpolation: 'linear',
    particleCount: 200,
    enableDynamicLighting: true,
    animationFrames: 8
  }
};
```

---

## Implementierungsplan

### Phase 1: Grundlagen (Empfohlener Start)

| Schritt | Beschreibung | Aufwand | Dateien |
|---------|--------------|---------|---------|
| 1.1 | GraphicsSettings-System erstellen | 2-3h | `src/config/graphicsSettings.ts` (NEU) |
| 1.2 | Textur-Funktionen parametrisieren (2 Funktionen aktualisiert) | 4-6h | `src/textures.ts` |
| 1.3 | Sound-Synthese verbessern | 3-4h | `src/soundSystem.ts` |
| 1.4 | Qualitäts-Menü im UI | 2h | `src/App.tsx` |

**Sofort spielbarer Nutzen:** Konfigurierbare Textur-Qualität, bessere Sounds

### Phase 2: Animationen und Partikel

| Schritt | Beschreibung | Aufwand | Dateien |
|---------|--------------|---------|---------|
| 2.1 | Sprite-Animation-System | 4-5h | `src/animation/spriteAnimator.ts` (NEU) |
| 2.2 | Gegner-Animations-Frames erstellen | 6-8h | `src/textures.ts` |
| 2.3 | Partikel-System | 3-4h | `src/effects/particleSystem.ts` (NEU) |
| 2.4 | Partikel in Raycaster integrieren | 2h | `src/raycasting.ts` |

### Phase 3: Audio-Samples (Optional)

| Schritt | Beschreibung | Aufwand | Dateien |
|---------|--------------|---------|---------|
| 3.1 | Sample-Loader implementieren | 2-3h | `src/audio/sampleLoader.ts` (NEU) |
| 3.2 | CC0-Sounds sammeln und konvertieren | 3-4h | `public/audio/` |
| 3.3 | 3D-Audio-System verbessern | 3h | `src/soundSystem.ts` |
| 3.4 | Fallback-System (prozedural wenn keine Samples) | 1h | `src/soundSystem.ts` |

### Phase 4: Fortgeschritten (Optional)

| Schritt | Beschreibung | Aufwand | Dateien |
|---------|--------------|---------|---------|
| 4.1 | Dynamische Beleuchtung | 4-6h | `src/raycasting.ts`, `src/lighting.ts` (NEU) |
| 4.2 | LOD-System für Texturen | 3h | `src/textures.ts` |
| 4.3 | Performance-Profiler | 2h | `src/performanceMonitor.ts` |

---

## Zusammenfassung der Prioritäten

### Höchste Priorität (Bester ROI)
1. **Skalierbare Textur-Auflösung** - Einfache Änderung mit großem visuellen Effekt
2. **Verbesserte prozedurale Sounds** - Kostenlos, keine externen Assets nötig
3. **Qualitäts-Einstellungen** - Erlaubt Spielern, Performance vs. Grafik zu wählen

### Mittlere Priorität
4. **Sprite-Animationen** - Mehr Lebendigkeit, aber aufwändiger
5. **Partikel-Effekte** - Visuelles Feedback verbessern
6. **3D-Audio mit HRTF** - Immersion erhöhen

### Niedrigere Priorität (Nice-to-have)
7. **Audio-Samples** - Nur wenn prozedurale Sounds nicht ausreichen
8. **Dynamische Beleuchtung** - Aufwändig, aber sehr cool
9. **Mipmap-System** - Für optimale Qualität auf allen Distanzen

---

## Risiken und Mitigation

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Performance-Einbruch bei hoher Auflösung | Mittel | LOD-System, Qualitätseinstellungen |
| Memory-Probleme bei vielen Texturen | Niedrig | Texture-Cache mit Limit, Lazy Loading |
| Audio-Clipping bei vielen Sounds | Mittel | Sound-Pooling, Priorisierung |
| Browser-Kompatibilität (HRTF) | Niedrig | Fallback auf Standard-Panning |

---

*Erstellt: 2025-12-15*
*Für: Hundefelsen (Wolfenstein 3D Clone)*
