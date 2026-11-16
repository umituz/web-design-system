const inMemoryStore = new Map<string, string>();

const fromMemory = (key: string): string | null => inMemoryStore.get(key) ?? null;

export const getStorageItem = (key: string): string | null => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    return fromMemory(key);
  }
  return fromMemory(key);
};

export const setStorageItem = (key: string, value: string): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    inMemoryStore.set(key, value);
    return;
  }
  inMemoryStore.set(key, value);
};

export const removeStorageItems = (...keys: string[]): void => {
  for (const key of keys) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch {
      inMemoryStore.delete(key);
    }
    inMemoryStore.delete(key);
  }
};

export const clearStorage = (): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  } catch {
    inMemoryStore.clear();
  }
  inMemoryStore.clear();
};

export const getStorageJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = getStorageItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed !== undefined && parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const setStorageJson = <T>(key: string, value: T): void => {
  try {
    setStorageItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};
