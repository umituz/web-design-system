import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAsyncPhase } from '../presentation/hooks/useAsyncPhase';

afterEach(cleanup);

describe('useAsyncPhase', () => {
  it('starts idle and walks loading → idle on success', async () => {
    const { result } = renderHook(() => useAsyncPhase());
    expect(result.current.phase).toBe('idle');

    let captured: string | undefined;
    await act(async () => {
      const value = await result.current.run(async () => 'ok');
      captured = value;
    });
    expect(captured).toBe('ok');
    expect(result.current.phase).toBe('idle');
  });

  it('settles into error when the task throws and returns undefined', async () => {
    const { result } = renderHook(() => useAsyncPhase());
    let captured: unknown = 'sentinel';
    await act(async () => {
      captured = await result.current.run(async () => {
        throw new Error('boom');
      });
    });
    expect(captured).toBeUndefined();
    expect(result.current.phase).toBe('error');
  });

  it('recovers from error by starting a new run', async () => {
    const { result } = renderHook(() => useAsyncPhase());
    await act(async () => {
      await result.current.run(async () => {
        throw new Error('boom');
      });
    });
    expect(result.current.phase).toBe('error');
    await act(async () => {
      await result.current.run(async () => 1);
    });
    expect(result.current.phase).toBe('idle');
  });

  it('ignores illegal transitions but allows same-value rewrites', () => {
    const { result } = renderHook(() => useAsyncPhase());
    act(() => {
      result.current.transition('idle');
    });
    expect(result.current.phase).toBe('idle');
    act(() => {
      result.current.transition('error');
    });
    expect(result.current.phase).toBe('idle');
    act(() => {
      result.current.transition('loading');
    });
    expect(result.current.phase).toBe('loading');
    act(() => {
      result.current.transition('idle');
    });
    expect(result.current.phase).toBe('idle');
  });

  it('resets to idle regardless of the current phase', () => {
    const { result } = renderHook(() => useAsyncPhase('error'));
    expect(result.current.phase).toBe('error');
    act(() => {
      result.current.reset();
    });
    expect(result.current.phase).toBe('idle');
  });

  it('starts the task immediately', async () => {
    const { result } = renderHook(() => useAsyncPhase());
    const task = vi.fn(async () => 'late');
    let pending!: Promise<string | undefined>;
    act(() => {
      pending = result.current.run(task);
    });
    expect(task).toHaveBeenCalled();
    await act(async () => {
      await pending;
    });
  });
});
