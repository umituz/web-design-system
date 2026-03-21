import React, { useState, useEffect, useRef, useCallback } from 'react';

export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  const defaultOptions = React.useMemo(() => ({
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  }), [options]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      defaultOptions
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [defaultOptions, hasIntersected]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
  };
};

export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (!hasIntersected || !src) return;

    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsError(false);
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [hasIntersected, src]);

  return {
    targetRef,
    imageSrc,
    isLoaded,
    isError,
    hasIntersected,
  };
};

export const useVirtualList = <T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
  }
) => {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index,
    style: {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      height: itemHeight,
      width: '100%',
    },
  }));

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex,
  };
};

export const useResourcePreloader = () => {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());
  const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set());

  const preloadImage = useCallback(async (src: string): Promise<void> => {
    if (preloadedResources.has(src) || loadingResources.has(src)) {
      return;
    }

    setLoadingResources(prev => new Set(prev).add(src));

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        setPreloadedResources(prev => new Set(prev).add(src));
        setLoadingResources(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
        resolve();
      };

      img.onerror = () => {
        setLoadingResources(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });
        reject(new Error(`Failed to preload image: ${src}`));
      };

      img.src = src;
    });
  }, [preloadedResources, loadingResources]);

  return {
    preloadImage,
    preloadedResources: Array.from(preloadedResources),
    loadingResources: Array.from(loadingResources),
    isPreloaded: (src: string) => preloadedResources.has(src),
    isLoading: (src: string) => loadingResources.has(src),
  };
};

export const useLazyComponent = <TProps = Record<string, unknown>>(
  importFunc: () => Promise<{ default: React.ComponentType<TProps> }>,
  fallback?: React.ComponentType<TProps>
) => {
  const [Component, setComponent] = useState<React.ComponentType<TProps> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { targetRef, hasIntersected } = useIntersectionObserver();

  const loadComponent = useCallback(async () => {
    if (Component || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'));
    } finally {
      setIsLoading(false);
    }
  }, [importFunc, Component, isLoading]);

  useEffect(() => {
    if (hasIntersected) {
      loadComponent();
    }
  }, [hasIntersected, loadComponent]);

  const LazyComponent = useCallback((props: TProps) => {
    if (error) {
      return fallback ? React.createElement(fallback as React.ElementType, props) : null;
    }

    if (isLoading || !Component) {
      return fallback ? React.createElement(fallback as React.ElementType, props) : null;
    }

    return React.createElement(Component as React.ElementType, props);
  }, [Component, isLoading, error, fallback]);

  return {
    targetRef,
    LazyComponent,
    isLoading,
    error,
    hasIntersected,
    loadComponent,
  };
};

export const useProgressiveEnhancement = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    interface NetworkInformation {
      effectiveType?: string;
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    }

    function getConnection(): NetworkInformation | undefined {
      const nav = navigator as unknown as {
        connection?: unknown;
        mozConnection?: unknown;
        webkitConnection?: unknown;
      };
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (
        conn &&
        (typeof conn === 'object') &&
        ('effectiveType' in conn)
      ) {
        return conn as NetworkInformation;
      }
      return undefined;
    }

    const connection = getConnection();

    if (connection) {
      const updateConnectionType = () => {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setConnectionType('slow');
        } else if (effectiveType === '3g' || effectiveType === '4g') {
          setConnectionType('fast');
        } else {
          setConnectionType('unknown');
        }
      };

      updateConnectionType();
      connection.addEventListener?.('change', updateConnectionType);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener?.('change', updateConnectionType);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  const shouldLoadHeavyContent = useCallback(() => {
    return isOnline && connectionType !== 'slow';
  }, [isOnline, connectionType]);

  const shouldPreloadContent = useCallback(() => {
    return isOnline && connectionType === 'fast';
  }, [isOnline, connectionType]);

  return {
    isOnline,
    connectionType,
    shouldLoadHeavyContent,
    shouldPreloadContent,
  };
};

export const useLazyLoading = (options: {
  enableImageLazyLoading?: boolean;
  enableComponentLazyLoading?: boolean;
  enableVirtualization?: boolean;
  enablePreloading?: boolean;
  enableProgressiveEnhancement?: boolean;
} = {}) => {
  const {
    enableImageLazyLoading = true,
    enableComponentLazyLoading = true,
    enableVirtualization = true,
    enablePreloading = true,
    enableProgressiveEnhancement = true,
  } = options;

  const resourcePreloader = useResourcePreloader();
  const progressiveEnhancement = useProgressiveEnhancement();

  return {
    useIntersectionObserver,
    useLazyImage: enableImageLazyLoading ? useLazyImage : null,
    useLazyComponent: enableComponentLazyLoading ? useLazyComponent : null,
    useVirtualList: enableVirtualization ? useVirtualList : null,
    preloadImage: enablePreloading ? resourcePreloader.preloadImage : undefined,
    shouldLoadHeavyContent: enableProgressiveEnhancement ? progressiveEnhancement.shouldLoadHeavyContent : undefined,
    shouldPreloadContent: enableProgressiveEnhancement ? progressiveEnhancement.shouldPreloadContent : undefined,
    isOnline: enableProgressiveEnhancement ? progressiveEnhancement.isOnline : undefined,
    connectionType: enableProgressiveEnhancement ? progressiveEnhancement.connectionType : undefined,
  };
};
