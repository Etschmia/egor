// src/soundSystem.ts

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.initNoiseBuffer();
    } catch (error) {
      console.error('Audio-Kontext konnte nicht erstellt werden:', error);
      this.enabled = false;
    }
  }

  private initNoiseBuffer() {
    if (!this.audioContext) return;
    const bufferSize = this.audioContext.sampleRate * 2.0; // 2 seconds of noise
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3, slideTo?: number) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    if (slideTo) {
      oscillator.frequency.exponentialRampToValueAtTime(slideTo, this.audioContext.currentTime + duration);
    }
    oscillator.type = type;

    // ADSR Envelope simplified
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration); // Decay/Release

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.5, playbackRate: number = 1.0, filterFreq: number = 0) {
    if (!this.audioContext || !this.enabled || !this.noiseBuffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.playbackRate.value = playbackRate;

    const gainNode = this.audioContext.createGain();

    // Optional filter
    if (filterFreq > 0) {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = filterFreq;
      source.connect(filter);
      filter.connect(gainNode);
    } else {
      source.connect(gainNode);
    }

    gainNode.connect(this.audioContext.destination);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    source.start(this.audioContext.currentTime);
    source.stop(this.audioContext.currentTime + duration);
  }

  // --- Specific Game Sounds ---

  playShoot() {
    // Punchy attack
    this.playTone(150, 0.1, 'square', 0.2, 50);
    // Noise tail for explosion effect
    this.playNoise(0.2, 0.3, 0.5, 2000);
  }

  playShotgun() {
    // Deeper, louder noise
    this.playTone(100, 0.15, 'square', 0.3, 30);
    this.playNoise(0.4, 0.5, 0.4, 1500);
  }

  playKnifeAttack() {
    this.playTone(600, 0.05, 'sawtooth', 0.2, 300); // "Swish"
    this.playNoise(0.1, 0.1, 2.0, 5000);
  }

  playChainsawAttack() {
    // Revving sound using modulated sawtooth
    this.playTone(150, 0.3, 'sawtooth', 0.2, 180);
    this.playNoise(0.3, 0.2, 0.8, 1000);
  }

  playEnemyHit() {
    // Squish/Impact
    this.playTone(200, 0.1, 'sawtooth', 0.2, 50);
    this.playNoise(0.1, 0.2, 0.6);
  }

  playEnemyDeath() {
    // Groan + Thud
    this.playTone(150, 0.4, 'sawtooth', 0.3, 50);
    this.playNoise(0.3, 0.2, 0.5, 800); // Thud
  }

  playPlayerHit() {
    this.playTone(400, 0.2, 'sawtooth', 0.3, 100); // Ouch!
  }

  playPickup() {
    // Coin/Item upward slide
    this.playTone(1000, 0.15, 'sine', 0.2, 2000);
  }

  playLevelComplete() {
    setTimeout(() => this.playTone(440, 0.2, 'square', 0.3), 0);
    setTimeout(() => this.playTone(554, 0.2, 'square', 0.3), 150);
    setTimeout(() => this.playTone(659, 0.4, 'square', 0.3), 300);
    setTimeout(() => this.playTone(880, 0.6, 'sine', 0.3), 450);
  }

  playGameOver() {
    this.playTone(300, 0.5, 'sawtooth', 0.3, 100);
    setTimeout(() => this.playTone(200, 0.6, 'sawtooth', 0.3, 50), 400);
  }

  playMenuSelect() {
    this.playTone(1200, 0.05, 'square', 0.1); // Short blip
  }

  playDoorOpen() {
    // Creaking mechanical slide
    this.playTone(200, 0.4, 'sawtooth', 0.2, 400); // Pitch up
    this.playNoise(0.4, 0.1, 0.5, 1000); // Texture
  }

  playError() {
    this.playTone(100, 0.2, 'sawtooth', 0.3); // Buzz
  }

  playDogBark() {
    // Short aggressive noise burst
    this.playTone(400, 0.1, 'square', 0.2, 300);
    this.playNoise(0.15, 0.3, 0.7, 3000);
  }

  playFootstep() {
    // Soft thud
    this.playNoise(0.05, 0.1, 0.3, 600);
  }

  play3dSound(source: { x: number; y: number }, listener: { x: number; y: number }, soundFunction: () => void) {
    if (!this.audioContext || !this.enabled) return;

    const dx = source.x - listener.x;
    const dy = source.y - listener.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 20;
    const volume = Math.max(0, 1 - distance / maxDistance);

    if (volume <= 0) return;

    // Temporary override volume logic for next call (hacky but works for this simple system)
    // Note: A better 3D system would pass source coordinates to play functions, 
    // but refactoring all calls is out of scope for now.
    // We effectively just check distance to decide whether to play at all or reduce volume?
    // The previous implementation wrapped functions. Let's replicate that.

    // BUT: The new functions contain specific volume logic. 
    // We can't easily intercept the internal GainNodes without exposure.
    // For now, we will assume 3D sounds are just "played if close enough" or we accept we control global volume context?

    // Let's implement a simplified volume scaler property for the class

    // ... Actually, the original implementation wrapped `playTone`. I can do that again.

    const originalPlayTone = this.playTone;
    const originalPlayNoise = this.playNoise;

    this.playTone = (f, d, t, v, s) => {
      originalPlayTone.call(this, f, d, t, (v || 0.3) * volume, s);
    };

    this.playNoise = (d, v, p, f) => {
      originalPlayNoise.call(this, d, (v || 0.5) * volume, p, f);
    };

    soundFunction();

    this.playTone = originalPlayTone;
    this.playNoise = originalPlayNoise;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled && this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

export const soundSystem = new SoundSystem();
