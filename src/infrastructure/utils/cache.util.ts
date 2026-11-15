export interface CachedValue<T> {
  readonly value: T;
  readonly storedAt: number;
  readonly ttlMs: number;
}

export const createCachedValue = <T>(value: T, ttlMs: number, now: number = Date.now()): CachedValue<T> => ({
  value,
  storedAt: now,
  ttlMs,
});

export const getCacheAge = (cached: CachedValue<unknown>, now: number = Date.now()): number =>
  Math.max(0, now - cached.storedAt);

export const getRemainingTTL = (cached: CachedValue<unknown>, now: number = Date.now()): number =>
  Math.max(0, cached.storedAt + cached.ttlMs - now);

export const isCacheExpired = (cached: CachedValue<unknown>, now: number = Date.now()): boolean =>
  getRemainingTTL(cached, now) === 0;

export const buildCacheKey = (...parts: ReadonlyArray<string | number>): string =>
  parts
    .map((part) =>
      String(part)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    )
    .filter((part) => part.length > 0)
    .join(':');

interface MemoryCacheEntry<T> {
  readonly value: T;
  readonly expires: number;
  readonly storedAt: number;
}

export interface MemoryCacheOptions {
  readonly ttlMs?: number;
  readonly cleanupIntervalMs?: number;
  readonly maxEntries?: number;
  readonly onExpire?: (expiredCount: number) => void;
  readonly clock?: () => number;
}

export interface MemoryCache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T, ttlMs?: number): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  keys(): string[];
  size(): number;
  destroy(): void;
}

export const createMemoryCache = <T>(options: MemoryCacheOptions = {}): MemoryCache<T> => {
  const ttlMs = options.ttlMs ?? 60_000;
  const maxEntries = options.maxEntries ?? Number.POSITIVE_INFINITY;
  const now = options.clock ?? Date.now;
  const entries = new Map<string, MemoryCacheEntry<T>>();
  const cleanupIntervalMs = options.cleanupIntervalMs ?? ttlMs;

  const sweep = (): void => {
    const current = now();
    let expiredCount = 0;
    for (const [key, entry] of entries) {
      if (current >= entry.expires) {
        entries.delete(key);
        expiredCount += 1;
      }
    }
    if (expiredCount > 0) {
      options.onExpire?.(expiredCount);
    }
  };

  const timer: ReturnType<typeof setInterval> | null =
    cleanupIntervalMs > 0 ? setInterval(sweep, cleanupIntervalMs) : null;

  return {
    get(key: string): T | undefined {
      const entry = entries.get(key);
      if (!entry) {
        return undefined;
      }
      if (now() >= entry.expires) {
        entries.delete(key);
        options.onExpire?.(1);
        return undefined;
      }
      return entry.value;
    },
    set(key: string, value: T, entryTtlMs?: number): void {
      const storedAt = now();
      entries.delete(key);
      entries.set(key, {
        value,
        storedAt,
        expires: storedAt + (entryTtlMs ?? ttlMs),
      });
      while (entries.size > maxEntries) {
        const oldest = entries.keys().next();
        if (oldest.done) {
          break;
        }
        entries.delete(oldest.value);
      }
    },
    has(key: string): boolean {
      return this.get(key) !== undefined;
    },
    delete(key: string): boolean {
      return entries.delete(key);
    },
    clear(): void {
      entries.clear();
    },
    keys(): string[] {
      sweep();
      return Array.from(entries.keys());
    },
    size(): number {
      sweep();
      return entries.size;
    },
    destroy(): void {
      if (timer !== null) {
        clearInterval(timer);
      }
      entries.clear();
    },
  };
};
