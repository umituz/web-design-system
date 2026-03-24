/**
 * cn Utility
 * @description Conditional className utility using clsx + tailwind-merge for proper Tailwind class merging with LRU cache for performance
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

// Simple LRU Cache implementation for className caching
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
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    // Remove existing entry to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Remove oldest entry if at capacity
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Create cache instance
const classNameCache = new LRUCache<string, string>(256);

// Cache key generator
function generateCacheKey(inputs: ClassValue[]): string {
  return JSON.stringify(inputs);
}

export function cn(...inputs: ClassValue[]): string {
  const cacheKey = generateCacheKey(inputs);
  const cached = classNameCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const result = twMerge(clsx(inputs));
  classNameCache.set(cacheKey, result);

  return result;
}

// Export cache for manual clearing if needed
export { classNameCache };
