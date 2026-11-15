import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildCacheKey,
  createCachedValue,
  createMemoryCache,
  getCacheAge,
  getRemainingTTL,
  isCacheExpired,
} from '../infrastructure/utils';

describe('createCachedValue', () => {
  it('stores the value with the capture timestamp', () => {
    const cached = createCachedValue({ id: 1 }, 60_000, 1_000);
    expect(cached).toEqual({ value: { id: 1 }, storedAt: 1_000, ttlMs: 60_000 });
  });
});

describe('cache freshness', () => {
  const cached = createCachedValue('payload', 10_000, 1_000);

  it('reports age since capture', () => {
    expect(getCacheAge(cached, 4_000)).toBe(3_000);
  });

  it('reports remaining ttl', () => {
    expect(getRemainingTTL(cached, 6_000)).toBe(5_000);
    expect(getRemainingTTL(cached, 60_000)).toBe(0);
  });

  it('expires only after the ttl window', () => {
    expect(isCacheExpired(cached, 10_999)).toBe(false);
    expect(isCacheExpired(cached, 11_000)).toBe(true);
  });
});

describe('buildCacheKey', () => {
  it('joins sanitized parts with colons', () => {
    expect(buildCacheKey('projects', 'My Project!', 42)).toBe('projects:my-project:42');
  });

  it('drops empty segments', () => {
    expect(buildCacheKey('users', '  ', 'settings')).toBe('users:settings');
  });

  it('keeps dots, dashes and underscores', () => {
    expect(buildCacheKey('cache', 'session.v2-beta_1')).toBe('cache:session.v2-beta_1');
  });
});

describe('createMemoryCache', () => {
  const caches: ReturnType<typeof createMemoryCache>[] = [];

  afterEach(() => {
    for (const cache of caches.splice(0)) {
      cache.destroy();
    }
    vi.useRealTimers();
  });

  const makeClock = () => {
    let current = 1_000;
    return {
      now: () => current,
      advance: (ms: number) => {
        current += ms;
      },
    };
  };

  it('stores and returns values', () => {
    const clock = makeClock();
    const cache = createMemoryCache<string>({ clock: clock.now });
    caches.push(cache);

    cache.set('greeting', 'hello');
    expect(cache.get('greeting')).toBe('hello');
    expect(cache.has('greeting')).toBe(true);
    expect(cache.size()).toBe(1);
    expect(cache.keys()).toEqual(['greeting']);
  });

  it('expires values after the TTL', () => {
    const clock = makeClock();
    const cache = createMemoryCache<string>({ ttlMs: 500, clock: clock.now });
    caches.push(cache);

    cache.set('session', 'abc');
    clock.advance(499);
    expect(cache.get('session')).toBe('abc');

    clock.advance(1);
    expect(cache.get('session')).toBeUndefined();
    expect(cache.has('session')).toBe(false);
    expect(cache.size()).toBe(0);
  });

  it('honors a per-entry TTL override', () => {
    const clock = makeClock();
    const cache = createMemoryCache<number>({ ttlMs: 10_000, clock: clock.now });
    caches.push(cache);

    cache.set('long', 1);
    cache.set('short', 2, 100);
    clock.advance(101);

    expect(cache.get('long')).toBe(1);
    expect(cache.get('short')).toBeUndefined();
  });

  it('evicts the oldest entries beyond maxEntries', () => {
    const clock = makeClock();
    const cache = createMemoryCache<number>({ maxEntries: 2, clock: clock.now });
    caches.push(cache);

    cache.set('a', 1);
    clock.advance(10);
    cache.set('b', 2);
    clock.advance(10);
    cache.set('c', 3);

    expect(cache.keys()).toEqual(['b', 'c']);
  });

  it('refreshes an existing key instead of counting it twice', () => {
    const clock = makeClock();
    const cache = createMemoryCache<number>({ maxEntries: 2, clock: clock.now });
    caches.push(cache);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('a', 9);

    expect(cache.get('a')).toBe(9);
    expect(cache.size()).toBe(2);
  });

  it('reports swept entries through onExpire on the cleanup interval', () => {
    vi.useFakeTimers();
    const clock = makeClock();
    const onExpire = vi.fn();
    const cache = createMemoryCache<string>({ ttlMs: 400, cleanupIntervalMs: 1_000, clock: clock.now, onExpire });
    caches.push(cache);

    cache.set('one', 'x');
    clock.advance(500);

    vi.advanceTimersByTime(1_000);
    expect(onExpire).toHaveBeenCalledWith(1);
    expect(cache.keys()).toEqual([]);
  });

  it('clear and delete remove entries', () => {
    const clock = makeClock();
    const cache = createMemoryCache<string>({ clock: clock.now });
    caches.push(cache);

    cache.set('a', '1');
    cache.set('b', '2');
    expect(cache.delete('a')).toBe(true);
    expect(cache.delete('missing')).toBe(false);
    expect(cache.keys()).toEqual(['b']);

    cache.clear();
    expect(cache.size()).toBe(0);
  });
});
