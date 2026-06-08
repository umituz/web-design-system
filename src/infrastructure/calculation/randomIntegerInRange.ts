/**
 * Random Integer In Range
 * @description Inclusive random integer generator for sampling and placeholder values
 */

import { clampToPositive } from './rangeClamper';

export const randomIntegerInRange = (min: number, max: number): number => {
  if (max < min) [min, max] = [max, min];
  const safeMin = Math.floor(min);
  const safeMax = Math.floor(max);
  const span = clampToPositive(safeMax - safeMin + 1);
  return Math.floor(Math.random() * span) + safeMin;
};
