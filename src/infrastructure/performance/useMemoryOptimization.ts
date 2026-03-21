import { useEffect, useRef, useCallback, useState } from 'react';

export interface MemoryOptimizationConfig {
  enableCleanupLogging?: boolean;
  trackEventListeners?: boolean;
  trackTimers?: boolean;
  trackSubscriptions?: boolean;
}

export interface CleanupFunction {
  (): void;
}

export const useMemoryOptimization = (config: MemoryOptimizationConfig = {}) => {
  const {
    enableCleanupLogging = import.meta.env.DEV,
    trackEventListeners = true,
    trackTimers = true,
    trackSubscriptions = true
  } = config;

  const cleanupFunctions = useRef<CleanupFunction[]>([]);
  const eventListeners = useRef<Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
    options?: AddEventListenerOptions;
  }>>([]);
  const timers = useRef<Array<{
    id: number;
    type: 'timeout' | 'interval';
  }>>([]);
  const subscriptions = useRef<Array<{
    name: string;
    unsubscribe: () => void;
  }>>([]);

  const addCleanup = useCallback((cleanup: CleanupFunction, name?: string) => {
    cleanupFunctions.current.push(cleanup);

    if (enableCleanupLogging && name) {
      console.log(`[Memory] Added cleanup: ${name}`);
    }

    return () => {
      const index = cleanupFunctions.current.indexOf(cleanup);
      if (index > -1) {
        cleanupFunctions.current.splice(index, 1);
      }
    };
  }, [enableCleanupLogging]);

  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) => {
    if (!trackEventListeners) {
      element.addEventListener(event, handler, options);
      return () => element.removeEventListener(event, handler, options);
    }

    element.addEventListener(event, handler, options);

    const listenerInfo = { element, event, handler, options };
    eventListeners.current.push(listenerInfo);

    if (enableCleanupLogging) {
      console.log(`[Memory] Added event listener: ${event}`);
    }

    return () => {
      element.removeEventListener(event, handler, options);
      const index = eventListeners.current.indexOf(listenerInfo);
      if (index > -1) {
        eventListeners.current.splice(index, 1);
      }
    };
  }, [trackEventListeners, enableCleanupLogging]);

  const setTimeout = useCallback((
    callback: () => void,
    delay: number
  ) => {
    const id = window.setTimeout(callback, delay);

    if (trackTimers) {
      timers.current.push({ id, type: 'timeout' });

      if (enableCleanupLogging) {
        console.log(`[Memory] Added timeout: ${id}`);
      }
    }

    return id;
  }, [trackTimers, enableCleanupLogging]);

  const setInterval = useCallback((
    callback: () => void,
    delay: number
  ) => {
    const id = window.setInterval(callback, delay);

    if (trackTimers) {
      timers.current.push({ id, type: 'interval' });

      if (enableCleanupLogging) {
        console.log(`[Memory] Added interval: ${id}`);
      }
    }

    return id;
  }, [trackTimers, enableCleanupLogging]);

  const clearTimeout = useCallback((id: number) => {
    window.clearTimeout(id);

    if (trackTimers) {
      const index = timers.current.findIndex(timer => timer.id === id);
      if (index > -1) {
        timers.current.splice(index, 1);

        if (enableCleanupLogging) {
          console.log(`[Memory] Cleared timeout: ${id}`);
        }
      }
    }
  }, [trackTimers, enableCleanupLogging]);

  const clearInterval = useCallback((id: number) => {
    window.clearInterval(id);

    if (trackTimers) {
      const index = timers.current.findIndex(timer => timer.id === id);
      if (index > -1) {
        timers.current.splice(index, 1);

        if (enableCleanupLogging) {
          console.log(`[Memory] Cleared interval: ${id}`);
        }
      }
    }
  }, [trackTimers, enableCleanupLogging]);

  const addSubscription = useCallback((
    name: string,
    unsubscribe: () => void
  ) => {
    if (!trackSubscriptions) {
      return unsubscribe;
    }

    const subscription = { name, unsubscribe };
    subscriptions.current.push(subscription);

    if (enableCleanupLogging) {
      console.log(`[Memory] Added subscription: ${name}`);
    }

    return () => {
      unsubscribe();
      const index = subscriptions.current.indexOf(subscription);
      if (index > -1) {
        subscriptions.current.splice(index, 1);

        if (enableCleanupLogging) {
          console.log(`[Memory] Unsubscribed: ${name}`);
        }
      }
    };
  }, [trackSubscriptions, enableCleanupLogging]);

  const getMemoryStats = useCallback(() => {
    return {
      cleanupFunctions: cleanupFunctions.current.length,
      eventListeners: eventListeners.current.length,
      timers: timers.current.length,
      subscriptions: subscriptions.current.length,
      totalTrackedItems:
        cleanupFunctions.current.length +
        eventListeners.current.length +
        timers.current.length +
        subscriptions.current.length
    };
  }, []);

  const cleanup = useCallback(() => {
    if (enableCleanupLogging) {
      const stats = getMemoryStats();
      console.log(`[Memory] Running cleanup with ${stats.totalTrackedItems} items`);
    }

    eventListeners.current.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    eventListeners.current = [];

    timers.current.forEach(({ id, type }) => {
      if (type === 'timeout') {
        window.clearTimeout(id);
      } else {
        window.clearInterval(id);
      }
    });
    timers.current = [];

    subscriptions.current.forEach(({ unsubscribe }) => {
      unsubscribe();
    });
    subscriptions.current = [];

    cleanupFunctions.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('[Memory] Cleanup function failed:', error);
      }
    });
    cleanupFunctions.current = [];

    if (enableCleanupLogging) {
      console.log('[Memory] Cleanup complete');
    }
  }, [enableCleanupLogging, getMemoryStats]);

  useEffect(() => {
    return () => {
      if (enableCleanupLogging) {
        const stats = getMemoryStats();
        console.log(`[Memory] Unmounting with ${stats.totalTrackedItems} items to clean`);
      }

      cleanup();
    };
  }, [cleanup, enableCleanupLogging, getMemoryStats]);

  return {
    addCleanup,
    addEventListener,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    addSubscription,
    getMemoryStats,
    cleanup
  };
};

export const useMemoryLeakDetector = (componentName?: string) => {
  const mountTime = useRef<number>(() => Date.now());
  const [renderCount, setRenderCount] = useState<number>(0);
  const [lifespan, setLifespan] = useState<number>(0);

  useEffect(() => {
    setRenderCount(prev => {
      const newCount = prev + 1;

      if (newCount > 100 && newCount % 10 === 0) {
        console.warn(
          `[Memory Leak] ${componentName || 'Component'} has rendered ${newCount} times. ` +
          'This might indicate a memory leak or unnecessary re-renders.'
        );
      }

      return newCount;
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLifespan(Date.now() - mountTime.current);
    }, 1000);

    return () => {
      clearInterval(interval);
      const finalLifespan = Date.now() - mountTime.current;

      if (import.meta.env.DEV) {
        console.log(
          `[Memory] ${componentName || 'Component'} unmounted after ${finalLifespan}ms ` +
          `with ${renderCount} renders`
        );
      }
    };
  }, [componentName, renderCount]);

  return {
    renderCount,
    lifespan
  };
};
