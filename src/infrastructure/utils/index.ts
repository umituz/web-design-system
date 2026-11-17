
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
  sum,
  sumBy,
  percentOf,
  avg,
  round,
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
export { seededRandom, pick, randInt } from './random.util';

export { unique, groupBy, groupByRecord, moveItem, replaceWhere, sortBy } from './collections.util';

export { debounce } from './fn.util';

export { toCsv, downloadCsv } from './csv.util';
export type { CsvColumn } from './csv.util';

export { tzOffsetMs, zonedParts, zonedDayStartUtc, todayInTz } from './zoned.util';
export type { ZonedParts } from './zoned.util';

export { formatTimeRange, overlaps } from './interval.util';
export type { TimeRangeFormatOptions } from './interval.util';

export {
  createCachedValue,
  createMemoryCache,
  isCacheExpired,
  getRemainingTTL,
  getCacheAge,
  buildCacheKey,
} from './cache.util';
export type { CachedValue, MemoryCache, MemoryCacheOptions } from './cache.util';

export { initialsOf, nameHue, colorForName, NAME_COLOR_PALETTE, fullNameOf, mentionsAny } from './name.util';

export { timeAgo, formatCountdown, formatDuration, formatUntil, formatClock } from './time.util';
export type { TimeAgoOptions, FormatUntilOptions } from './time.util';

export {
  toDayKey,
  todayKey,
  dayKeyDaysAgo,
  dayKeyFromIso,
  parseDayKey,
  addDaysKey,
  addMonthsKey,
  daysUntilDayKey,
  daysBetweenKeys,
  weekStartKey,
  dateKeyParts,
  monthGridWeekKeys,
  isoDaysAgo,
  nowIso,
} from './day-key.util';
export type { DayKeyParts } from './day-key.util';

export {
  getStorageItem,
  setStorageItem,
  removeStorageItems,
  clearStorage,
  getStorageJson,
  setStorageJson,
} from './storage.util';

export { downloadTextFile } from './file.util';

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
export {
  formatFileSize,
  truncateText,
  toSlug,
  formatCompact,
  formatBadgeCount,
  formatDateRange,
  titleCase,
  humanize,
  pluralize,
  formatPercent,
  monthName,
  weekdayNames,
} from './format.util';
export type { PercentFormatOptions } from './format.util';
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
