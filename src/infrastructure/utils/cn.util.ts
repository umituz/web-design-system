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
      // FIX: Check if firstKey exists before deleting
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

// Create cache instance
const classNameCache = new LRUCache<string, string>(256);

// FIX: Better cache key generator that handles functions and undefined
function generateCacheKey(inputs: ClassValue[]): string {
  try {
    // Convert inputs to a cacheable string representation
    const normalized = inputs.map((input) => {
      if (input === null || input === undefined) {
        return 'null';
      }
      if (typeof input === 'function') {
        // For functions, use a placeholder since functions can't be reliably serialized
        return 'function';
      }
      if (typeof input === 'object') {
        // Handle objects (like conditional objects in clsx)
        return JSON.stringify(
          Object.entries(input)
            .filter(([_, value]) => Boolean(value))
            .map(([key]) => key)
            .sort()
        );
      }
      return String(input);
    });

    return normalized.join('|');
  } catch {
    // Fallback if anything goes wrong with serialization
    return inputs.join('|');
  }
}

export function cn(...inputs: ClassValue[]): string {
  // Skip cache for dynamic inputs that might contain functions
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

  // For inputs with functions, skip cache and compute directly
  return twMerge(clsx(inputs));
}

// Export cache for manual clearing if needed
export { classNameCache };
