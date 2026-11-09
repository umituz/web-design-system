
export {
  cn,
} from './cn.util';
export type { ClassValue } from './cn.util';

export {
  getSpacing,
  getIconSize,
  getContainerSize,
  getTextSize,
  getGap,
  getSpaceY,
  getResponsiveStyles,
} from './responsive.utils';

export {
  clampToRange,
  clampToNonNegative,
  clampToPositive,
  percentOfMax,
  formatTrendMagnitude,
  computeTotalPages,
  clampPageNumber,
  computePageBounds,
} from './calculation.utils';
export type { PageBounds } from './calculation.utils';

export { hashSeed } from './hash.util';

export { initialsOf, nameHue } from './name.util';

export { timeAgo } from './time.util';
export type { TimeAgoOptions } from './time.util';

export { formatCount } from './format.util';

export { uniqueId } from './id.util';

export {
  currencyFractionDigits,
  formatMoney,
  formatMoneyCompact,
  toMinor,
  parseAmountToMinor,
  pctOfMinor,
  lineTotals,
  sumTotals,
  sumMinor,
} from './money.utils';
export type { LineTotals, TotalsInputLine } from './money.utils';
