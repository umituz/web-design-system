export const unique = <T>(items: readonly T[]): T[] => Array.from(new Set(items));

export const groupBy = <T, K extends string | number>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Map<K, T[]> => {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return map;
};

export const groupByRecord = <T, K extends string>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Record<K, T[]> => {
  const record = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keyOf(item);
    (record[key] ??= []).push(item);
  }
  return record;
};

export const moveItem = <T>(items: readonly T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return [...items];
  }
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
};

export const replaceWhere = <T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
  updater: (item: T) => T,
): T[] => items.map((item) => (predicate(item) ? updater(item) : item));
