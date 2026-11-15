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

