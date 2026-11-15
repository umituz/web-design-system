import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAsyncOperation } from '../presentation/hooks/useAsyncOperation';

describe('useAsyncOperation', () => {
  it('loads immediately when immediate is true', async () => {
    const fetcher = vi.fn(async () => 'ready');
    const { result } = renderHook(() => useAsyncOperation(fetcher, { immediate: true }));

    await act(async () => {});
    expect(result.current.isIdle).toBe(false);
    expect(result.current.data).toBe('ready');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('stays idle until execute is called', async () => {
    const fetcher = vi.fn(async (value: number) => value * 2);
    const { result } = renderHook(() => useAsyncOperation(fetcher));

    expect(result.current.isIdle).toBe(true);
    let resolved: number | null = null;
    await act(async () => {
      resolved = await result.current.execute(21);
    });
    expect(resolved).toBe(42);
    expect(result.current.data).toBe(42);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('maps failures through toError and clears loading', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('boom');
    });
    const { result } = renderHook(() =>
      useAsyncOperation<string, [], string>(fetcher, {
        toError: (error) => (error instanceof Error ? error.message : String(error)),
      }),
    );

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).toBe('boom');
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('retries failed attempts up to maxRetries', async () => {
    let attempts = 0;
    const fetcher = vi.fn(async () => {
      attempts++;
      if (attempts < 3) throw new Error('nope');
      return 'ok';
    });
    const { result } = renderHook(() => useAsyncOperation(fetcher, { maxRetries: 2 }));

    await act(async () => {
      await result.current.execute();
    });
    expect(attempts).toBe(3);
    expect(result.current.data).toBe('ok');
    expect(result.current.error).toBeNull();
  });

  it('notifies success and error callbacks', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const failing = vi.fn(async () => {
      throw new Error('bad');
    });
    const failingHook = renderHook(() =>
      useAsyncOperation(failing, { onSuccess, onError }),
    );
    await act(async () => {
      await failingHook.result.current.execute();
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();

    const succeeding = vi.fn(async () => 'value');
    const succeedingHook = renderHook(() =>
      useAsyncOperation(succeeding, { onSuccess, onError }),
    );
    await act(async () => {
      await succeedingHook.result.current.execute();
    });
    expect(onSuccess).toHaveBeenCalledWith('value');
  });

  it('reset returns the hook to idle', async () => {
    const fetcher = vi.fn(async () => 'x');
    const { result } = renderHook(() =>
      useAsyncOperation(fetcher, { immediate: true }),
    );
    await act(async () => {});
    expect(result.current.data).toBe('x');

    act(() => result.current.reset());
    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
