export { usePerformanceMonitor, useRenderPerformance } from './usePerformanceMonitor';
export { useLazyLoading } from './useLazyLoading';
export { useMemoryOptimization, useMemoryLeakDetector } from './useMemoryOptimization';

export type { PerformanceMetrics, PerformanceConfig } from './usePerformanceMonitor';
export type { MemoryOptimizationConfig, CleanupFunction } from './useMemoryOptimization';

// Performance monitoring utilities
export const performanceUtils = {
  // Measure render performance
  measureRender: (componentName: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();

    if (import.meta.env.DEV) {
      const duration = end - start;
      if (duration > 16) {
        console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    }

    return end - start;
  },

  // Measure async operation
  measureAsync: async <T>(componentName: string, operation: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;

      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} ${operation} completed in ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Performance] ${componentName} ${operation} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Get performance metrics
  getMetrics: () => {
    if (typeof performance === 'undefined' || !performance.memory) {
      return null;
    }

    return {
      memory: {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      },
      navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined,
    };
  },

  // Log performance summary
  logSummary: () => {
    const metrics = performanceUtils.getMetrics();
    if (!metrics) return;

    if (import.meta.env.DEV && metrics.memory) {
      const memoryUsage = ((metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100).toFixed(2);
      console.log(`[Performance] Memory usage: ${memoryUsage}%`);
    }

    if (metrics.navigation) {
      const loadTime = metrics.navigation.loadEventEnd - metrics.navigation.fetchStart;
      console.log(`[Performance] Page load time: ${loadTime.toFixed(2)}ms`);
    }
  },
};
