import { useCallback, useContext } from 'react';
import { LoadingContext } from '../providers/LoadingProvider';

export interface UseGlobalLoadingReturn {
  isLoading: boolean;
  message: string | undefined;
  show: (message?: string) => void;
  hide: () => void;
  reset: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>, message?: string) => Promise<T>;
}

export function useGlobalLoading(): UseGlobalLoadingReturn {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }

  const { show, hide } = context;

  const withLoading = useCallback(
    async <T,>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
      show(message);
      try {
        return await asyncFn();
      } finally {
        hide();
      }
    },
    [show, hide]
  );

  return { ...context, withLoading };
}
