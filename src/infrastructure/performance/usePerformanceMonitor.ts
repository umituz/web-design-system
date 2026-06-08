import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

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

const SLOW_RENDER_THRESHOLD_MS = 16;
const MAX_TRACKED_RENDER_TIMES = 50;
const REPORT_LOG_INTERVAL = 10;

const isDev = (): boolean =>
  typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;

const readMemoryUsage = (trackMemory: boolean): number | undefined => {
  if (!trackMemory) return undefined;
  if (typeof performance === 'undefined') return undefined;
  const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
  return memory?.usedJSHeapSize;
};

const gradeFor = (avg: number): 'A' | 'B' | 'C' | 'D' =>
  avg < 5 ? 'A' : avg < 10 ? 'B' : avg < SLOW_RENDER_THRESHOLD_MS ? 'C' : 'D';

export const usePerformanceMonitor = (config: PerformanceConfig = {}) => {
  const {
    trackRenders = true,
    trackMemory = false,
    sampleRate = 1.0,
    componentName = 'Unknown',
    onMetricsUpdate,
  } = config;

  // Use a ref for the callback to avoid retriggering the effect on every render.
  const onMetricsUpdateRef = useRef(onMetricsUpdate);
  onMetricsUpdateRef.current = onMetricsUpdate;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    componentName,
  });

  const mountTimeRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);
  const renderTimesRef = useRef<number[]>([]);
  const updateCountRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    renderStartRef.current = performance.now();
  }, [componentName]);

  useEffect(() => {
    if (!trackRenders || Math.random() > sampleRate) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartRef.current;

    renderTimesRef.current.push(renderTime);
    updateCountRef.current += 1;

    if (renderTimesRef.current.length > MAX_TRACKED_RENDER_TIMES) {
      renderTimesRef.current = renderTimesRef.current.slice(-MAX_TRACKED_RENDER_TIMES);
    }

    const averageRenderTime =
      renderTimesRef.current.reduce((sum, time) => sum + time, 0) /
      renderTimesRef.current.length;

    const memoryUsage = readMemoryUsage(trackMemory);

    const newMetrics: PerformanceMetrics = {
      renderTime,
      mountTime: renderEndTime - mountTimeRef.current,
      updateCount: updateCountRef.current,
      lastRenderTime: renderTime,
      averageRenderTime,
      memoryUsage,
      componentName,
    };

    setMetrics(newMetrics);
    onMetricsUpdateRef.current?.(newMetrics);

    renderStartRef.current = performance.now();

    if (isDev()) {
      if (renderTime > SLOW_RENDER_THRESHOLD_MS) {
        console.warn(`[Performance] Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
      if (updateCountRef.current % REPORT_LOG_INTERVAL === 0) {
        console.log({
          renders: updateCountRef.current,
          avgRenderTime: `${averageRenderTime.toFixed(2)}ms`,
          lastRenderTime: `${renderTime.toFixed(2)}ms`,
        });
      }
    }
  }, [trackRenders, sampleRate, trackMemory, componentName]);

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
      componentName,
    });
  }, [componentName]);

  const getPerformanceReport = useCallback(
    () => ({
      ...metrics,
      renderTimes: [...renderTimesRef.current],
      isSlowComponent: metrics.averageRenderTime > SLOW_RENDER_THRESHOLD_MS,
      performanceGrade: gradeFor(metrics.averageRenderTime),
    }),
    [metrics]
  );

  return { metrics, resetMetrics, getPerformanceReport };
};

export const useRenderPerformance = (componentName?: string) => {
  const [renderStats, setRenderStats] = useState({
    lastRenderTime: 0,
    renderCount: 0,
  });
  const startTime = useMemo(() => performance.now(), [componentName]);

  useEffect(() => {
    setRenderStats((prev) => ({
      lastRenderTime: performance.now() - startTime,
      renderCount: prev.renderCount + 1,
    }));
  }, [componentName, startTime]);

  return renderStats;
};
