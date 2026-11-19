import type { DateStyle } from './date.util';
import { formatDate } from './date.util';

export interface CountFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCount = (
  value: number,
  locale: string,
  options: CountFormatOptions = {},
): string => new Intl.NumberFormat(locale, options).format(value);

export interface FileSizeFormatOptions {
  decimals?: number;
  locale?: string;
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
const FILE_SIZE_BASE = 1024;

export const formatFileSize = (
  bytes: number,
  options: FileSizeFormatOptions = {},
): string => {
  const { decimals = 1, locale = 'en-US' } = options;
  if (!Number.isFinite(bytes) || bytes <= 0) return `0 ${FILE_SIZE_UNITS[0]}`;

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(FILE_SIZE_BASE)),
    FILE_SIZE_UNITS.length - 1,
  );
  const size = bytes / Math.pow(FILE_SIZE_BASE, exponent);
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: exponent === 0 ? 0 : decimals,
  }).format(size)} ${FILE_SIZE_UNITS[exponent]}`;
};

export const truncateText = (text: string, maxLength: number, suffix = '…'): string => {
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;
  const suffixLength = suffix.length;
  if (maxLength <= suffixLength) return text.slice(0, maxLength);
  return `${text.slice(0, maxLength - suffixLength)}${suffix}`;
};

export const toSlug = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const FOLD_SPECIALS: Record<string, string> = {
  ı: 'i',
  ø: 'o',
  đ: 'd',
  ł: 'l',
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  þ: 'th',
};

const ARABIC_HARAKAT = /[\u064B-\u065F\u0670]/g;
const ARABIC_ALEFS = /[إأآٱ]/g;

export const foldForSearch = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[ıøđłßæœþ]/g, (ch) => FOLD_SPECIALS[ch] ?? ch)
    .replace(ARABIC_HARAKAT, '')
    .replace(ARABIC_ALEFS, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .normalize('NFC');

const COMPACT_SUFFIXES = ['K', 'M', 'B'] as const;

export const formatCompact = (value: number): string => {
  if (value < 1000) return String(value);
  let tier = value >= 1_000_000_000 ? 2 : value >= 1_000_000 ? 1 : 0;
  const scaled = value / 1000 ** (tier + 1);
  let rounded = scaled >= 100 ? Math.round(scaled) : Number(scaled.toFixed(1));
  if (rounded >= 1000 && tier < 2) {
    rounded = rounded >= 10_000 ? Math.round(rounded / 1000) : Number((rounded / 1000).toFixed(1));
    tier += 1;
  }
  return `${rounded}${COMPACT_SUFFIXES[tier]}`;
};

export const titleCase = (value: string): string =>
  value
    .split(/[-\s_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const humanize = (value: string): string => {
  const spaced = value.replace(/[-_]+/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const pluralize = (count: number, one: string, many = `${one}s`): string =>
  `${count} ${count === 1 ? one : many}`;

export interface PercentFormatOptions {
  fractionDigits?: number;
}

export const formatPercent = (
  value: number,
  locale: string,
  options: PercentFormatOptions = {},
): string =>
  new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: options.fractionDigits ?? 0,
    maximumFractionDigits: options.fractionDigits ?? 0,
  }).format(value);

export const monthName = (
  month1: number,
  locale = 'en-US',
  style: 'long' | 'short' = 'long',
): string =>
  new Intl.DateTimeFormat(locale, { month: style, timeZone: 'UTC' }).format(
    new Date(Date.UTC(2024, month1 - 1, 15)),
  );

export const weekdayNames = (locale = 'en-US', startMonday = true): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const names = Array.from({ length: 7 }, (_, i) => formatter.format(new Date(Date.UTC(2024, 0, 7 + i))));
  if (!startMonday) return names;
  const [sunday = ''] = names;
  return [...names.slice(1), sunday];
};

export const formatDateRange = (
  start: string | Date,
  end: string | Date,
  locale = 'en',
  style: DateStyle = 'medium',
): string => `${formatDate(start, style, { locale })} – ${formatDate(end, style, { locale })}`;

export const formatBadgeCount = (count: number, cap = 9): string =>
  count > cap ? `${cap}+` : String(count);

