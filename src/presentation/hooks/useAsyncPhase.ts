import { useCallback, useState } from 'react';

export type AsyncPhase = 'idle' | 'loading' | 'error';

const ASYNC_PHASE_TRANSITIONS: Record<AsyncPhase, readonly AsyncPhase[]> = {
  idle: ['loading'],
  loading: ['idle', 'error'],
  error: ['loading'],
};

export function useAsyncPhase(initial: AsyncPhase = 'idle') {
  const [phase, setPhase] = useState<AsyncPhase>(initial);

  const transition = useCallback((next: AsyncPhase) => {
    setPhase((current) => (ASYNC_PHASE_TRANSITIONS[current].includes(next) ? next : current));
  }, []);

  const run = useCallback(
    async <T>(task: () => Promise<T>): Promise<T | undefined> => {
      transition('loading');
      try {
        const result = await task();
        transition('idle');
        return result;
      } catch {
        transition('error');
        return undefined;
      }
    },
    [transition],
  );

  const reset = useCallback(() => setPhase('idle'), []);

  return { phase, transition, run, reset };
}

export type UseAsyncPhaseReturn = ReturnType<typeof useAsyncPhase>;
