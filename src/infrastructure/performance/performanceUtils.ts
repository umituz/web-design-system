/**
 * Performance Utilities
 * @description Standalone helpers for measuring performance across components
 */

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

const SLOW_RENDER_THRESHOLD_MS = 16;

const readMemory = () => {
  if (typeof performance === 'undefined') return null;
  const perf = performance as unknown as PerformanceWithMemory;
  return perf.memory ?? null;
};

const isDev = (): boolean =>
  typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;

export const performanceUtils = {
  measureRender: (componentName: string, fn: () => void): number => {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;

    if (isDev() && duration > SLOW_RENDER_THRESHOLD_MS) {
      console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`);
    }

    return duration;
  },

  measureAsync: async <T>(
    componentName: string,
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      if (isDev()) {
        console.log(
          `[Performance] ${componentName} ${operation} completed in ${duration.toFixed(2)}ms`
        );
      }
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(
        `[Performance] ${componentName} ${operation} failed after ${duration.toFixed(2)}ms:`,
        error
      );
      throw error;
    }
  },

  getMetrics: () => {
    if (typeof performance === 'undefined') return null;
    const mem = readMemory();
    if (!mem) return null;

    return {
      memory: {
        usedJSHeapSize: mem.usedJSHeapSize,
        totalJSHeapSize: mem.totalJSHeapSize,
        jsHeapSizeLimit: mem.jsHeapSizeLimit,
      },
      navigation: performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined,
    };
  },

  logSummary: (): void => {
    const metrics = performanceUtils.getMetrics();
    if (!metrics) return;

    if (isDev() && metrics.memory) {
      const memoryUsage = (
        (metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) *
        100
      ).toFixed(2);
      console.log(`[Performance] Memory usage: ${memoryUsage}%`);
    }

    if (metrics.navigation) {
      const loadTime = metrics.navigation.loadEventEnd - metrics.navigation.fetchStart;
      console.log(`[Performance] Page load time: ${loadTime.toFixed(2)}ms`);
    }
  },
};
