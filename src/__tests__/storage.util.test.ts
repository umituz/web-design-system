import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearStorage,
  getStorageItem,
  getStorageJson,
  removeStorageItems,
  setStorageItem,
  setStorageJson,
} from '../infrastructure/utils/storage.util';

describe('storage util', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('round-trips string items through localStorage', () => {
    setStorageItem('k', 'v');
    expect(getStorageItem('k')).toBe('v');
    expect(getStorageItem('missing')).toBeNull();
  });

  it('removes requested keys and clears the store', () => {
    setStorageItem('a', '1');
    setStorageItem('b', '2');
    removeStorageItems('a');
    expect(getStorageItem('a')).toBeNull();
    expect(getStorageItem('b')).toBe('2');
    clearStorage();
    expect(getStorageItem('b')).toBeNull();
  });

  it('round-trips JSON values with fallbacks', () => {
    setStorageJson('json', { n: 3 });
    expect(getStorageJson<{ n: number }>('json', { n: 0 })).toEqual({ n: 3 });
    expect(getStorageJson('missing', 'fb')).toBe('fb');
    setStorageItem('broken', '{nope');
    expect(getStorageJson('broken', 42)).toBe(42);
    setStorageItem('nulled', 'null');
    expect(getStorageJson('nulled', 'fb')).toBe('fb');
  });

  it('falls back to in-memory storage when localStorage is unavailable', () => {
    const original = globalThis.localStorage;
    vi.stubGlobal('localStorage', undefined);
    try {
      setStorageItem('mem', 'yes');
      expect(getStorageItem('mem')).toBe('yes');
      expect(getStorageJson('memjson', { ok: false })).toEqual({ ok: false });
      setStorageJson('memjson', { ok: true });
      expect(getStorageJson('memjson', { ok: false })).toEqual({ ok: true });
      removeStorageItems('mem');
      expect(getStorageItem('mem')).toBeNull();
    } finally {
      vi.unstubAllGlobals();
      void original;
    }
  });

  it('falls back to in-memory storage when localStorage throws', () => {
    const throwing = {
      getItem: (): string => {
        throw new Error('denied');
      },
      setItem: (): void => {
        throw new Error('denied');
      },
      removeItem: (): void => {
        throw new Error('denied');
      },
      clear: (): void => {
        throw new Error('denied');
      },
    };
    vi.stubGlobal('localStorage', throwing);
    try {
      setStorageItem('mem2', 'val');
      expect(getStorageItem('mem2')).toBe('val');
      removeStorageItems('mem2');
      clearStorage();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
