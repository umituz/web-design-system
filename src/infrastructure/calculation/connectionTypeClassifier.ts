/**
 * Connection Type Classifier
 * @description Maps Network Information API effectiveType strings to coarse buckets
 */

export type ConnectionBucket = 'slow' | 'fast' | 'unknown';

const SLOW_TYPES: ReadonlySet<string> = new Set(['slow-2g', '2g']);
const FAST_TYPES: ReadonlySet<string> = new Set(['3g', '4g']);

export const classifyConnectionType = (effectiveType: string | undefined): ConnectionBucket => {
  if (!effectiveType) return 'unknown';
  if (SLOW_TYPES.has(effectiveType)) return 'slow';
  if (FAST_TYPES.has(effectiveType)) return 'fast';
  return 'unknown';
};
