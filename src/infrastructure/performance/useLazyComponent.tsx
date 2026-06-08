import { useState, useEffect, useCallback, createElement, type ComponentType, type ReactElement, type RefObject } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

export interface LazyComponentApi<TProps> {
  targetRef: RefObject<HTMLElement | null>;
  LazyComponent: (props: TProps) => ReactElement | null;
  isLoading: boolean;
  error: Error | null;
  hasIntersected: boolean;
  loadComponent: () => Promise<void>;
}

export const useLazyComponent = <TProps extends object = Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<TProps> }>,
  fallback?: ComponentType<TProps>
): LazyComponentApi<TProps> => {
  const [Component, setComponent] = useState<ComponentType<TProps> | null>(null);
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
      void loadComponent();
    }
  }, [hasIntersected, loadComponent]);

  const LazyComponent = useCallback(
    (props: TProps): ReactElement | null => {
      const renderWith = (Renderer: ComponentType<TProps>): ReactElement =>
        createElement(Renderer, props);

      if (error) {
        return fallback ? renderWith(fallback) : null;
      }
      if (isLoading || !Component) {
        return fallback ? renderWith(fallback) : null;
      }
      return renderWith(Component);
    },
    [Component, isLoading, error, fallback]
  );

  return {
    targetRef,
    LazyComponent,
    isLoading,
    error,
    hasIntersected,
    loadComponent,
  };
};
