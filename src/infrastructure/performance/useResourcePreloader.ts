import { useState, useCallback } from 'react';

export interface ResourcePreloaderApi {
  preloadImage: (src: string) => Promise<void>;
  preloadedResources: string[];
  loadingResources: string[];
  isPreloaded: (src: string) => boolean;
  isLoading: (src: string) => boolean;
}

export const useResourcePreloader = (): ResourcePreloaderApi => {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());
  const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set());

  const preloadImage = useCallback(
    async (src: string): Promise<void> => {
      if (preloadedResources.has(src) || loadingResources.has(src)) return;

      setLoadingResources((prev) => new Set(prev).add(src));

      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          setPreloadedResources((prev) => new Set(prev).add(src));
          setLoadingResources((prev) => {
            const next = new Set(prev);
            next.delete(src);
            return next;
          });
          resolve();
        };

        img.onerror = () => {
          setLoadingResources((prev) => {
            const next = new Set(prev);
            next.delete(src);
            return next;
          });
          reject(new Error(`Failed to preload image: ${src}`));
        };

        img.src = src;
      });
    },
    [preloadedResources, loadingResources]
  );

  return {
    preloadImage,
    preloadedResources: Array.from(preloadedResources),
    loadingResources: Array.from(loadingResources),
    isPreloaded: (src: string) => preloadedResources.has(src),
    isLoading: (src: string) => loadingResources.has(src),
  };
};
