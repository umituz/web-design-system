
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 128) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

const classNameCache = new LRUCache<string, string>(256);

function generateCacheKey(inputs: ClassValue[]): string {
  try {
    const normalized = inputs.map((input) => {
      if (input === null || input === undefined) {
        return 'null';
      }
      if (typeof input === 'function') {
        return 'function';
      }
      if (typeof input === 'object') {
        return JSON.stringify(
          Object.entries(input)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .sort()
        );
      }
      return String(input);
    });

    return normalized.join('|');
  } catch {
    return inputs.join('|');
  }
}

export function cn(...inputs: ClassValue[]): string {
  const hasFunction = inputs.some((input) => typeof input === 'function');

  if (!hasFunction) {
    const cacheKey = generateCacheKey(inputs);
    const cached = classNameCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = twMerge(clsx(inputs));
    classNameCache.set(cacheKey, result);

    return result;
  }

  return twMerge(clsx(inputs));
}

export { classNameCache };
