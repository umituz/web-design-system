import { describe, expect, it } from 'vitest';
import {
  buildCacheKey,
  createCachedValue,
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
