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
