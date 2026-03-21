import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
  componentName?: string;
}

export interface PerformanceConfig {
  trackRenders?: boolean;
  trackMemory?: boolean;
  sampleRate?: number;
  componentName?: string;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceMonitor = (config: PerformanceConfig = {}) => {
  const {
    trackRenders = true,
    trackMemory = false,
    sampleRate = 1.0,
    componentName = 'Unknown',
    onMetricsUpdate
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    componentName
  });

  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const renderTimesRef = useRef<number[]>([]);
  const updateCountRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderStartRef.current = performance.now();

    return () => {
      // Component unmount
    };
  }, [componentName]);

  useEffect(() => {
    if (!trackRenders || Math.random() > sampleRate) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartRef.current;

    renderTimesRef.current.push(renderTime);
    updateCountRef.current += 1;

    if (renderTimesRef.current.length > 50) {
      renderTimesRef.current = renderTimesRef.current.slice(-50);
    }

    const averageRenderTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0) / renderTimesRef.current.length;

    let memoryUsage: number | undefined;
    if (trackMemory && 'memory' in performance) {
      memoryUsage = (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
    }

    const newMetrics: PerformanceMetrics = {
      renderTime,
      mountTime: renderEndTime - mountTimeRef.current,
      updateCount: updateCountRef.current,
      lastRenderTime: renderTime,
      averageRenderTime,
      memoryUsage,
      componentName
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);

    renderStartRef.current = performance.now();

    if (import.meta.env.DEV) {
      if (renderTime > 16) {
        console.warn(`[Performance] Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
      if (updateCountRef.current % 10 === 0) {
        console.log({
          renders: updateCountRef.current,
          avgRenderTime: averageRenderTime.toFixed(2) + 'ms',
          lastRenderTime: renderTime.toFixed(2) + 'ms'
        });
      }
    }
  }, [trackRenders, sampleRate, trackMemory, componentName, onMetricsUpdate]);

  const resetMetrics = useCallback(() => {
    renderTimesRef.current = [];
    updateCountRef.current = 0;
    mountTimeRef.current = performance.now();
    renderStartRef.current = performance.now();

    setMetrics({
      renderTime: 0,
      mountTime: 0,
      updateCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      componentName
    });
  }, [componentName]);

  const getPerformanceReport = useCallback(() => {
    return {
      ...metrics,
      renderTimes: [...renderTimesRef.current],
      isSlowComponent: metrics.averageRenderTime > 16,
      performanceGrade: metrics.averageRenderTime < 5 ? 'A' :
                       metrics.averageRenderTime < 10 ? 'B' :
                       metrics.averageRenderTime < 16 ? 'C' : 'D'
    };
  }, [metrics]);

  return {
    metrics,
    resetMetrics,
    getPerformanceReport
  };
};

export const useRenderPerformance = (componentName?: string) => {
  const renderStartTime = useRef<number>(0);
  const [renderStats, setRenderStats] = useState<{
    lastRenderTime: number;
    renderCount: number;
  }>({
    lastRenderTime: 0,
    renderCount: 0
  });

  const startTime = performance.now();

  useEffect(() => {
    setRenderStats(prev => ({
      lastRenderTime: performance.now() - startTime,
      renderCount: prev.renderCount + 1
    }));

    renderStartTime.current = performance.now();
  }, [componentName, renderStats, startTime]);

  return renderStats;
};
