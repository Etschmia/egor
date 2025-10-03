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

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundSystem = new SoundSystem();
