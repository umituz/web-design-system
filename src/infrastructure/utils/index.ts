
export {
  cn,
} from './cn.util';
export type { ClassValue } from './cn.util';

export { createStyles } from './styles.util';

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

export {
  createCachedValue,
  isCacheExpired,
  getRemainingTTL,
  getCacheAge,
  buildCacheKey,
} from './cache.util';
export type { CachedValue } from './cache.util';

export { initialsOf, nameHue } from './name.util';

export { timeAgo, formatCountdown, formatDuration } from './time.util';
export type { TimeAgoOptions } from './time.util';

export { formatDate, formatDateTime, parseDateInput } from './date.util';
export type { DateStyle, DateFormatOptions, DateTimeFormatOptions } from './date.util';

export { formatCount } from './format.util';
export type { CountFormatOptions } from './format.util';
export { formatFileSize, truncateText, toSlug } from './format.util';
export type { FileSizeFormatOptions } from './format.util';

export { uniqueId, randomUUID, isValidUUID } from './id.util';

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
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencyMinor,
  CURRENCY_LOCALES,
} from './money.utils';
export type {
  LineTotals,
  TotalsInputLine,
  MoneyValue,
  FormatCurrencyOptions,
  MinorCurrencyOptions,
} from './money.utils';
