export const debounce = <A extends unknown[]>(
  fn: (...args: A) => void,
  ms = 250,
): ((...args: A) => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, ms);
  };
};

export interface ParseNumberOptions {
  min?: number;
  max?: number;
  fallback?: number;
}

/** NaN/Infinity-safe numeric parse of raw input values, clamped to
 *  [min, max] — the fleet answer to "unguarded numeric parse of an input
 *  value" (empty/garbage input yields the fallback, never NaN). */
export const parseNumber = (
  value: string | number | null | undefined,
  options: ParseNumberOptions = {},
): number => {
  const { min, max, fallback = 0 } = options;
  const raw = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  let parsed = Number.isFinite(raw) ? raw : fallback;
  if (min !== undefined && parsed < min) parsed = min;
  if (max !== undefined && parsed > max) parsed = max;
  return parsed;
};
