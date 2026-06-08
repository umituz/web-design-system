/**
 * Range Clamper
 * @description Clamps a numeric value to a [min, max] range with safe boundaries
 */

export const clampToRange = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  if (min > max) [min, max] = [max, min];
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const clampToNonNegative = (value: number): number =>
  value < 0 || Number.isNaN(value) ? 0 : value;

export const clampToPositive = (value: number, fallback: number = 1): number =>
  value <= 0 || Number.isNaN(value) ? fallback : value;
