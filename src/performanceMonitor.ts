// Performance monitoring utility for testing optimization impact

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  renderTime: number;
  collisionTime: number;
  spriteCount: number;
  decorativeObjectCount: number;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private currentFps = 0;
  private frameTimes: number[] = [];
  private maxFrameTimeSamples = 60;
  
  private metrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    renderTime: 0,
    collisionTime: 0,
    spriteCount: 0,
    decorativeObjectCount: 0
  };

  private timers = new Map<string, number>();

  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (startTime === undefined) {
      return 0;
    }
    const elapsed = performance.now() - startTime;
    this.timers.delete(name);
    return elapsed;
  }

  recordFrame(frameTime: number): void {
    this.frameCount++;
    this.frameTimes.push(frameTime);
    
    // Keep only recent samples
    if (this.frameTimes.length > this.maxFrameTimeSamples) {
      this.frameTimes.shift();
    }

    // Update FPS every second
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    // Calculate average frame time
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    
    this.metrics.fps = this.currentFps;
    this.metrics.frameTime = avgFrameTime;
  }

  updateMetrics(partial: Partial<PerformanceMetrics>): void {
    Object.assign(this.metrics, partial);
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
  }

  getMinFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return Math.min(...this.frameTimes);
  }

  getMaxFrameTime(): number {
    if (this.frameTimes.length === 0) return 0;
    return Math.max(...this.frameTimes);
  }

  reset(): void {
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.currentFps = 0;
    this.frameTimes = [];
    this.timers.clear();
    this.metrics = {
      fps: 0,
      frameTime: 0,
      renderTime: 0,
      collisionTime: 0,
      spriteCount: 0,
      decorativeObjectCount: 0
    };
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getMetrics();
    const avgFrameTime = this.getAverageFrameTime();
    const minFrameTime = this.getMinFrameTime();
    const maxFrameTime = this.getMaxFrameTime();

    return `
Performance Report:
==================
FPS: ${metrics.fps}
Frame Time: ${avgFrameTime.toFixed(2)}ms (min: ${minFrameTime.toFixed(2)}ms, max: ${maxFrameTime.toFixed(2)}ms)
Render Time: ${metrics.renderTime.toFixed(2)}ms
Collision Time: ${metrics.collisionTime.toFixed(2)}ms
Sprite Count: ${metrics.spriteCount}
Decorative Objects: ${metrics.decorativeObjectCount}

Performance Status: ${this.getPerformanceStatus(avgFrameTime)}
    `.trim();
  }

  private getPerformanceStatus(avgFrameTime: number): string {
    if (avgFrameTime < 16.67) {
      return '✓ Excellent (60+ FPS)';
    } else if (avgFrameTime < 33.33) {
      return '⚠ Good (30-60 FPS)';
    } else {
      return '✗ Poor (<30 FPS)';
    }
  }

  // Log performance to console
  logPerformance(): void {
    console.log(this.generateReport());
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();
