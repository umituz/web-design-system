export interface CountFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCount = (
  value: number,
  locale: string,
  options: CountFormatOptions = {},
): string => new Intl.NumberFormat(locale, options).format(value);
