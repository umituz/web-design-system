/**
 * Calculation Re-exports
 * @description Single entry point for all calculation utilities
 */

export { clampToRange, clampToNonNegative, clampToPositive } from './rangeClamper';
export { percentOfMax } from './percentOfMax';
export {
  computeVisibleItemRange,
  totalScrollHeight,
  type VisibleRange,
  type VisibleRangeInput,
} from './visibleItemRange';
export {
  computeTotalPages,
  clampPageNumber,
  computePageBounds,
  type PageBounds,
} from './pageBoundsCalculator';
export { generateErrorId } from './errorIdGenerator';
export { formatTrendMagnitude } from './trendMagnitudeFormatter';
export { randomIntegerInRange } from './randomIntegerInRange';
export { measureScrollbarWidth } from './scrollbarWidthMeasurer';
export {
  classifyConnectionType,
  type ConnectionBucket,
} from './connectionTypeClassifier';
