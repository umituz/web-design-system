/**
 * Percent Of Max
 * @description Computes percentage of a max value with safe division
 */

import { clampToRange } from './rangeClamper';

const PERCENT_MIN = 0;
const PERCENT_MAX = 100;

export const percentOfMax = (value: number, max: number): number => {
  if (max <= 0) return PERCENT_MIN;
  return clampToRange((value / max) * PERCENT_MAX, PERCENT_MIN, PERCENT_MAX);
};
