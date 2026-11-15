import { useCallback, useEffect, useRef, useState } from 'react';

export interface InfinitePage<T> {
  readonly items: readonly T[];
  readonly hasMore: boolean;
}

export interface UseInfiniteScrollOptions<T> {
  readonly fetchPage: (page: number) => Promise<InfinitePage<T>>;
  readonly initialPage?: number;
  readonly enabled?: boolean;
  readonly rootMargin?: string;
  readonly onError?: (error: unknown) => void;
}

export interface UseInfiniteScrollReturn<T> {
  readonly items: T[];
  readonly page: number;
  readonly hasMore: boolean;
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: string | null;
  readonly sentinelRef: (node: HTMLElement | null) => void;
  readonly loadMore: () => void;
  readonly reset: () => void;
}

export function useInfiniteScroll<T>(
  options: UseInfiniteScrollOptions<T>
): UseInfiniteScrollReturn<T> {
  const { initialPage = 0, enabled = true, rootMargin, onError } = options;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null);

  const fetchPageRef = useRef(options.fetchPage);
  const onErrorRef = useRef(onError);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(initialPage);

  useEffect(() => {
    fetchPageRef.current = options.fetchPage;
    onErrorRef.current = onError;
  });

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;

    const requestedPage = pageRef.current;
    const isFirst = requestedPage === initialPage;
    if (isFirst) setIsLoading(true);
    else setIsLoadingMore(true);

    void fetchPageRef
      .current(requestedPage)
      .then((result) => {
        setItems((current) => [...current, ...result.items]);
        setHasMore(result.hasMore);
        hasMoreRef.current = result.hasMore;
        setPage(requestedPage + 1);
        pageRef.current = requestedPage + 1;
        setError(null);
      })
      .catch((caught: unknown) => {
        const message = caught instanceof Error ? caught.message : String(caught);
        setError(message);
        onErrorRef.current?.(caught);
      })
      .finally(() => {
        loadingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  }, [initialPage]);

  const reset = useCallback(() => {
    pageRef.current = initialPage;
    hasMoreRef.current = true;
    loadingRef.current = false;
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
  }, [initialPage]);

  const sentinelRef = useCallback((node: HTMLElement | null) => {
    setSentinel(node);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadMore();
  }, [enabled, loadMore]);

  useEffect(() => {
    if (!sentinel || typeof IntersectionObserver === 'undefined' || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      rootMargin ? { rootMargin } : undefined
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, enabled, loadMore, rootMargin]);

  return {
    items,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    sentinelRef,
    loadMore,
    reset,
  };
}
