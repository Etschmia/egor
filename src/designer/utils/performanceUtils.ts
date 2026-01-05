/**
 * Performance utilities for the Designer Mode
 * Provides debouncing, throttling, and performance monitoring helpers
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= wait) {
      lastCall = now;
      func(...args);
    } else {
      // Schedule the next call
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, wait - timeSinceLastCall);
    }
  };
}

/**
 * Wraps a function to execute it in the next animation frame
 */
export function rafSchedule<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function scheduled(...args: Parameters<T>) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Performance mark for measuring execution time
 */
export class PerformanceMark {
  private startTime: number;
  private endTime: number | null = null;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(): number {
    this.endTime = performance.now();
    return this.getDuration();
  }

  getDuration(): number {
    const end = this.endTime || performance.now();
    return end - this.startTime;
  }

  log(): void {
    if (import.meta.env.DEV) {
      const duration = this.getDuration();
      console.log(`[Performance] ${this.name}: ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Batch multiple state updates into a single render cycle
 */
export function batchUpdates(
  updates: Array<() => void>,
  callback?: () => void
): void {
  // Use requestAnimationFrame to batch updates
  requestAnimationFrame(() => {
    updates.forEach(update => update());
    if (callback) {
      callback();
    }
  });
}

/**
 * Memoize expensive function calls
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Check if the browser supports a feature
 */
export const browserSupport = {
  requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
  requestIdleCallback: typeof requestIdleCallback !== 'undefined',
  IntersectionObserver: typeof IntersectionObserver !== 'undefined',
  ResizeObserver: typeof ResizeObserver !== 'undefined',
};

/**
 * Execute a function when the browser is idle
 */
export function runWhenIdle(
  callback: () => void,
  options?: IdleRequestOptions
): void {
  if (browserSupport.requestIdleCallback) {
    requestIdleCallback(callback, options);
  } else {
    // Fallback to setTimeout
    setTimeout(callback, 1);
  }
}

/**
 * Measure and log component render time
 */
export function measureRender(componentName: string): () => void {
  const mark = new PerformanceMark(`${componentName} render`);

  return () => {
    const duration = mark.end();
    if (duration > 16.67) {
      // Warn if render takes longer than one frame (60fps)
      console.warn(
        `[Performance Warning] ${componentName} render took ${duration.toFixed(2)}ms (> 16.67ms)`
      );
    }
  };
}

/**
 * Create a performance observer for monitoring long tasks
 */
export function observeLongTasks(
  callback: (entries: PerformanceEntry[]) => void
): PerformanceObserver | null {
  if (!('PerformanceObserver' in window)) {
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
    });

    observer.observe({ entryTypes: ['longtask'] });
    return observer;
  } catch {
    console.warn('Long task observation not supported');
    return null;
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get memory usage information (if available)
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  limit: number;
} | null {
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}
