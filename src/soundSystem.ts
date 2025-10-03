// Sound-System für das Spiel
// Verwendet Web Audio API für Sound-Erzeugung

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new AudioContext();
    } catch (error) {
      console.error('Audio-Kontext konnte nicht erstellt werden:', error);
      this.enabled = false;
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playShoot() {
    this.playTone(800, 0.1, 'square', 0.2);
  }

  playKnifeAttack() {
    this.playTone(400, 0.15, 'sawtooth', 0.25);
  }

  playChainsawAttack() {
    this.playTone(200, 0.2, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(250, 0.15, 'sawtooth', 0.25), 50);
  }

  playEnemyHit() {
    this.playTone(300, 0.2, 'sawtooth', 0.3);
  }

  playEnemyDeath() {
    this.playTone(200, 0.5, 'sawtooth', 0.35);
    setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.3), 200);
  }

  playPlayerHit() {
    this.playTone(150, 0.3, 'triangle', 0.4);
  }

  playPickup() {
    this.playTone(600, 0.2, 'sine', 0.3);
    setTimeout(() => this.playTone(800, 0.15, 'sine', 0.25), 100);
  }

  playLevelComplete() {
    this.playTone(440, 0.2, 'sine', 0.3);
    setTimeout(() => this.playTone(554, 0.2, 'sine', 0.3), 200);
    setTimeout(() => this.playTone(659, 0.4, 'sine', 0.3), 400);
  }

  playGameOver() {
    this.playTone(400, 0.3, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.3), 300);
    setTimeout(() => this.playTone(200, 0.5, 'sawtooth', 0.3), 600);
  }

  playMenuSelect() {
    this.playTone(500, 0.1, 'square', 0.2);
  }

  playDoorOpen() {
    this.playTone(300, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(350, 0.2, 'sine', 0.2), 100);
  }

  playError() {
    this.playTone(150, 0.2, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(100, 0.15, 'sawtooth', 0.25), 150);
  }

  playDogBark() {
    this.playTone(600, 0.1, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(550, 0.1, 'sawtooth', 0.15), 120);
  }

  play3dSound(source: { x: number; y: number }, listener: { x: number; y: number }, soundFunction: () => void) {
    if (!this.audioContext || !this.enabled) return;

    const dx = source.x - listener.x;
    const dy = source.y - listener.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 20;
    let volume = 1 - distance / maxDistance;

    if (volume < 0) {
      volume = 0;
    }

    const originalPlayTone = this.playTone;
    this.playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', baseVolume: number = 0.3) => {
      originalPlayTone.call(this, frequency, duration, type, baseVolume * volume);
    };

    soundFunction();

    this.playTone = originalPlayTone;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundSystem = new SoundSystem();
