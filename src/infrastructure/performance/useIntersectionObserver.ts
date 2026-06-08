import { useState, useEffect, useRef, useMemo, useCallback, type RefObject } from 'react';

export interface IntersectionObserverState {
  targetRef: RefObject<HTMLElement | null>;
  isIntersecting: boolean;
  hasIntersected: boolean;
}

export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): IntersectionObserverState => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const defaultOptions = useMemo(
    () => ({ threshold: 0.1, rootMargin: '50px', ...options }),
    [options]
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting;
      setIsIntersecting(isVisible);

      if (isVisible && !hasIntersected) {
        setHasIntersected(true);
      }
    }, defaultOptions);

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [defaultOptions, hasIntersected]);

  return { targetRef, isIntersecting, hasIntersected };
};

export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder ?? '');
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

  return { targetRef, imageSrc, isLoaded, isError, hasIntersected };
};

export const useLazyImageCallback = useCallback;
