import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAsync } from '../presentation/hooks/useAsync';

describe('useAsync', () => {
  it('resolves data and clears loading', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve(42), []));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe(42);
    expect(result.current.error).toBeNull();
  });

  it('captures rejections as errors without throwing', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.reject(new Error('boom')), []));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.data).toBeUndefined();
  });

  it('normalizes non-Error rejections', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.reject('nope'), []));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('nope');
  });

  it('refetches when deps change', async () => {
    const factory = vi.fn((id: number) => Promise.resolve(`value-${id}`));
    const { result, rerender } = renderHook(({ id }) => useAsync(() => factory(id), [id]), {
      initialProps: { id: 1 },
    });

    await waitFor(() => expect(result.current.data).toBe('value-1'));
    rerender({ id: 2 });
    await waitFor(() => expect(result.current.data).toBe('value-2'));
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it('re-runs on reload', async () => {
    const factory = vi.fn(() => Promise.resolve('ok'));
    const { result } = renderHook(() => useAsync(factory, []));

    await waitFor(() => expect(result.current.data).toBe('ok'));
    act(() => result.current.reload());
    await waitFor(() => expect(factory).toHaveBeenCalledTimes(2));
  });

  it('ignores results from a superseded run', async () => {
    let resolveFirst!: (value: string) => void;
    const factory = vi
      .fn()
      .mockImplementationOnce(() => new Promise<string>((resolve) => (resolveFirst = resolve)))
      .mockImplementationOnce(() => Promise.resolve('second'));

    const { result, rerender } = renderHook(({ id }) => useAsync(() => factory(id), [id]), {
      initialProps: { id: 1 },
    });

    rerender({ id: 2 });
    await waitFor(() => expect(result.current.data).toBe('second'));

    act(() => resolveFirst('first'));
    await waitFor(() => expect(result.current.data).toBe('second'));
  });
});
