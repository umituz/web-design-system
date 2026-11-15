import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LoadingProvider } from '../presentation/providers/LoadingProvider';
import { useGlobalLoading } from '../presentation/hooks/useGlobalLoading';
import { LoadingOverlay } from '../presentation/molecules/LoadingOverlay';

const wrapper = ({ children }: { children: ReactNode }) => (
  <LoadingProvider>{children}</LoadingProvider>
);

const wrapperWithMinimum = ({ children }: { children: ReactNode }) => (
  <LoadingProvider minDisplayTime={300}>{children}</LoadingProvider>
);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useGlobalLoading', () => {
  it('throws when used outside a LoadingProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useGlobalLoading())).toThrow(/LoadingProvider/);
    spy.mockRestore();
  });

  it('stays hidden until shown', () => {
    const { result } = renderHook(() => useGlobalLoading(), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toBeUndefined();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows the overlay with a message and hides it again', () => {
    const { result } = renderHook(() => useGlobalLoading(), { wrapper });

    act(() => result.current.show('Saving…'));
    expect(result.current.isLoading).toBe(true);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Saving…')).toBeTruthy();

    act(() => result.current.hide());
    expect(result.current.isLoading).toBe(false);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('falls back to the provider default message', () => {
    const localWrapper = ({ children }: { children: ReactNode }) => (
      <LoadingProvider defaultMessage="Loading">{children}</LoadingProvider>
    );
    const { result } = renderHook(() => useGlobalLoading(), { wrapper: localWrapper });

    act(() => result.current.show());
    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('keeps the overlay visible while overlapping loads are open', () => {
    const { result } = renderHook(() => useGlobalLoading(), { wrapper });

    act(() => result.current.show('first'));
    act(() => result.current.show('second'));
    expect(screen.getByText('second')).toBeTruthy();

    act(() => result.current.hide());
    expect(result.current.isLoading).toBe(true);
    expect(screen.getByRole('status')).toBeTruthy();

    act(() => result.current.hide());
    expect(result.current.isLoading).toBe(false);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('reset closes the overlay regardless of open count', () => {
    const { result } = renderHook(() => useGlobalLoading(), { wrapper });

    act(() => result.current.show('one'));
    act(() => result.current.show('two'));
    act(() => result.current.reset());

    expect(result.current.isLoading).toBe(false);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('withLoading wraps the awaited work with show and hide', async () => {
    const { result } = renderHook(() => useGlobalLoading(), { wrapper });

    let resolveWork: (value: string) => void = () => {};
    const work = new Promise<string>((resolve) => {
      resolveWork = resolve;
    });

    let wrapped: Promise<string> | null = null;
    act(() => {
      wrapped = result.current.withLoading(() => work, 'Working');
    });
    expect(screen.getByText('Working')).toBeTruthy();

    let settled: string | null = null;
    await act(async () => {
      resolveWork('done');
      settled = await wrapped;
    });

    expect(settled).toBe('done');
    expect(result.current.isLoading).toBe(false);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('withLoading hides the overlay even when the work rejects', async () => {
    const { result } = renderHook(() => useGlobalLoading(), { wrapper });

    let caught: unknown = null;
    await act(async () => {
      try {
        await result.current.withLoading(async () => {
          throw new Error('boom');
        });
      } catch (error) {
        caught = error;
      }
    });

    expect(caught).toBeInstanceOf(Error);
    expect(result.current.isLoading).toBe(false);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('holds the overlay for minDisplayTime after a fast load finishes', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useGlobalLoading(), { wrapper: wrapperWithMinimum });

    act(() => result.current.show());
    act(() => result.current.hide());

    expect(result.current.isLoading).toBe(false);
    expect(screen.getByRole('status')).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(screen.getByRole('status')).toBeTruthy();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('LoadingOverlay', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <div>
        <LoadingOverlay visible={false} message="Hidden" />
      </div>
    );
    expect(container.textContent).toBe('');
  });

  it('renders the spinner and message when visible', () => {
    render(<LoadingOverlay visible message="Preparing" />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Preparing')).toBeTruthy();
    expect(screen.getByRole('status').getAttribute('aria-busy')).toBe('true');
  });
});
