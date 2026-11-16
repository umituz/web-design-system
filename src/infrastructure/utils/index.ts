
export {
  cn,
} from './cn.util';
export type { ClassValue } from './cn.util';

export { createStyles, cssVars } from './styles.util';

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
  createMemoryCache,
  isCacheExpired,
  getRemainingTTL,
  getCacheAge,
  buildCacheKey,
} from './cache.util';
export type { CachedValue, MemoryCache, MemoryCacheOptions } from './cache.util';

export { initialsOf, nameHue, colorForName, NAME_COLOR_PALETTE } from './name.util';

export { timeAgo, formatCountdown, formatDuration, formatUntil } from './time.util';
export type { TimeAgoOptions, FormatUntilOptions } from './time.util';

export { formatDate, formatDateTime, formatTime, parseDateInput } from './date.util';
export type { DateStyle, DateFormatOptions, DateTimeFormatOptions, TimeFormatOptions } from './date.util';

export {
  addDays,
  addMinutes,
  byNewest,
  byOldest,
  differenceInMinutes,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isToday,
  isValidDate,
  isTomorrow,
  isYesterday,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from './date-math.util';
export type { WeekStartsOn, DateInterval, Timestamped } from './date-math.util';

export { formatCount } from './format.util';
export type { CountFormatOptions } from './format.util';
export { formatFileSize, truncateText, toSlug, formatCompact, formatBadgeCount } from './format.util';
export type { FileSizeFormatOptions } from './format.util';

export { getErrorMessage } from './error.util';

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
