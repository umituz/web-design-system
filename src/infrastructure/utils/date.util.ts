export type DateStyle = 'medium' | 'long' | 'short' | 'monthYear' | 'numeric';

export interface DateFormatOptions {
  locale?: string;
  order?: 'dmy' | 'mdy' | 'ymd';
  separator?: string;
  invalidOutput?: string;
  weekday?: 'short' | 'long' | 'none';
  month?: 'short' | 'long';
}

export interface DateTimeFormatOptions extends DateFormatOptions {
  timeSeparator?: string;
}

const DEFAULT_LOCALE = 'en';
const DEFAULT_INVALID_OUTPUT = '—';
const DEFAULT_SEPARATOR = '.';

const PRESET_OPTIONS: Record<Exclude<DateStyle, 'numeric'>, Intl.DateTimeFormatOptions> = {
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  short: { day: 'numeric', month: 'short' },
  monthYear: { month: 'short', year: 'numeric' },
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const cachedFormatter = (locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
};

const resolveOptions = (style: Exclude<DateStyle, 'numeric'>, options: DateFormatOptions): Intl.DateTimeFormatOptions => {
  const resolved: Intl.DateTimeFormatOptions = { ...PRESET_OPTIONS[style] };
  if (options.weekday === 'none') {
    delete resolved.weekday;
  } else if (options.weekday !== undefined) {
    resolved.weekday = options.weekday;
  }
  if (options.month !== undefined) {
    resolved.month = options.month;
  }
  return resolved;
};

export const parseDateInput = (input: string | Date): Date | null => {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }
  if (typeof input !== 'string' || input.trim() === '') {
    return null;
  }
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (dateOnly) {
    const local = new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
    );
    return Number.isNaN(local.getTime()) ? null : local;
  }
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatNumeric = (date: Date, locale: string, order: NonNullable<DateFormatOptions['order']>, separator: string): string => {
  const parts = cachedFormatter(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(date);
  const valueOf = (type: string): string => parts.find((part) => part.type === type)?.value ?? '';
  const day = valueOf('day');
  const month = valueOf('month');
  const year = valueOf('year');
  if (order === 'mdy') return `${month}${separator}${day}${separator}${year}`;
  if (order === 'ymd') return `${year}${separator}${month}${separator}${day}`;
  return `${day}${separator}${month}${separator}${year}`;
};

export const formatDate = (
  input: string | Date | null | undefined,
  style: DateStyle = 'medium',
  options: DateFormatOptions = {},
): string => {
  if (input === null || input === undefined) {
    return options.invalidOutput ?? DEFAULT_INVALID_OUTPUT;
  }
  const date = parseDateInput(input);
  if (!date) {
    return options.invalidOutput ?? DEFAULT_INVALID_OUTPUT;
  }
  const locale = options.locale ?? DEFAULT_LOCALE;
  if (style === 'numeric') {
    return formatNumeric(date, locale, options.order ?? 'dmy', options.separator ?? DEFAULT_SEPARATOR);
  }
  return cachedFormatter(locale, resolveOptions(style, options)).format(date);
};

export const formatDateTime = (
  input: string | Date | null | undefined,
  options: DateTimeFormatOptions = {},
): string => {
  if (input === null || input === undefined) {
    return options.invalidOutput ?? DEFAULT_INVALID_OUTPUT;
  }
  const date = parseDateInput(input);
  if (!date) {
    return options.invalidOutput ?? DEFAULT_INVALID_OUTPUT;
  }
  const locale = options.locale ?? DEFAULT_LOCALE;
  const clock = cachedFormatter(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  return `${formatDate(date, 'medium', { locale })}${options.timeSeparator ?? ', '}${clock}`;
};
