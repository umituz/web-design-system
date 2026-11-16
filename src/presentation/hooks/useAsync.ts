import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

export function useAsync<T>(factory: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [nonce, setNonce] = useState(0);
  const [run, setRun] = useState<unknown[]>(() => [...deps]);
  if (run.length !== deps.length || run.some((d, i) => !Object.is(d, deps[i]))) {
    setRun([...deps]);
  }

  const [settled, setSettled] = useState<{
    run: unknown[];
    nonce: number;
    data?: T;
    error?: Error;
  } | null>(null);

  const factoryRef = useRef(factory);
  useEffect(() => {
    factoryRef.current = factory;
  });

  useEffect(() => {
    let active = true;
    factoryRef
      .current()
      .then((data) => {
        if (active) setSettled({ run, nonce, data });
      })
      .catch((err: unknown) => {
        if (active) {
          setSettled({ run, nonce, error: err instanceof Error ? err : new Error(String(err)) });
        }
      });
    return () => {
      active = false;
    };
  }, [run, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const isCurrent = settled !== null && settled.run === run && settled.nonce === nonce;
  return {
    data: settled?.data,
    loading: !isCurrent,
    error: isCurrent ? (settled.error ?? null) : null,
    reload,
  };
}
