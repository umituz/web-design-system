import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '../presentation/hooks/useInfiniteScroll';
import type { InfinitePage } from '../presentation/hooks/useInfiniteScroll';

interface PageFixture {
  readonly fetchPage: ReturnType<typeof vi.fn>;
}

const makePages = (): PageFixture => {
  const pages: InfinitePage<string>[] = [
    { items: ['a', 'b'], hasMore: true },
    { items: ['c'], hasMore: false },
  ];
  const fetchPage = vi.fn((page: number) =>
    Promise.resolve(pages[page] ?? { items: [], hasMore: false }),
  );
  return { fetchPage };
};

afterEach(() => {
  cleanup();
});

describe('useInfiniteScroll', () => {
  it('auto-loads the first page', async () => {
    const { fetchPage } = makePages();
    const { result } = renderHook(() => useInfiniteScroll({ fetchPage }));

    await act(async () => {});
    expect(result.current.items).toEqual(['a', 'b']);
    expect(result.current.page).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  it('appends subsequent pages and stops at the end', async () => {
    const { fetchPage } = makePages();
    const { result } = renderHook(() => useInfiniteScroll({ fetchPage }));

    await act(async () => {});
    act(() => result.current.loadMore());
    await act(async () => {});

    expect(result.current.items).toEqual(['a', 'b', 'c']);
    expect(result.current.hasMore).toBe(false);

    act(() => result.current.loadMore());
    await act(async () => {});
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('guards against concurrent loads', async () => {
    const { fetchPage } = makePages();
    const { result } = renderHook(() => useInfiniteScroll({ fetchPage }));

    await act(async () => {});
    act(() => {
      result.current.loadMore();
      result.current.loadMore();
      result.current.loadMore();
    });
    await act(async () => {});
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('captures fetch errors', async () => {
    const fetchPage = vi.fn(() => Promise.reject(new Error('network down')));
    const onError = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll({ fetchPage, onError }));

    await act(async () => {});
    expect(result.current.error).toBe('network down');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual([]);
  });

  it('does not auto-load when disabled', async () => {
    const { fetchPage } = makePages();
    renderHook(() => useInfiniteScroll({ fetchPage, enabled: false }));

    await act(async () => {});
    expect(fetchPage).not.toHaveBeenCalled();
  });

  it('reset clears items and rewinds pagination', async () => {
    const { fetchPage } = makePages();
    const { result } = renderHook(() => useInfiniteScroll({ fetchPage }));

    await act(async () => {});
    act(() => result.current.loadMore());
    await act(async () => {});
    expect(result.current.items.length).toBe(3);

    act(() => result.current.reset());
    expect(result.current.items).toEqual([]);
    expect(result.current.page).toBe(0);
    expect(result.current.hasMore).toBe(true);
  });

  it('attaches the sentinel ref without IntersectionObserver', async () => {
    const { fetchPage } = makePages();

    function Probe() {
      const { sentinelRef } = useInfiniteScroll({ fetchPage });
      return <div ref={sentinelRef}>sentinel</div>;
    }

    await act(async () => {
      render(<Probe />);
    });
  });
});
