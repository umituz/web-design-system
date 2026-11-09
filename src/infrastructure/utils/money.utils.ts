
const FRACTION_DIGITS: Record<string, number> = {
  BHD: 3,
  IQD: 3,
  JOD: 3,
  KWD: 3,
  LYD: 3,
  OMR: 3,
  TND: 3,
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  ISK: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

export function currencyFractionDigits(currency: string): number {
  return FRACTION_DIGITS[currency.toUpperCase()] ?? 2;
}

export function formatMoney(amountMinor: number, currency: string, locale = 'en-US'): string {
  const digits = currencyFractionDigits(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amountMinor / 10 ** digits);
}

export function formatMoneyCompact(amountMinor: number, currency: string, locale = 'en-US'): string {
  const digits = currencyFractionDigits(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amountMinor / 10 ** digits);
}

export function toMinor(amount: number, currency: string): number {
  return Math.round(amount * 10 ** currencyFractionDigits(currency));
}

export function parseAmountToMinor(input: string, currency: string): number | null {
  const digits = currencyFractionDigits(currency);
  const trimmed = input.trim().replace(',', '.');
  const decimals = digits === 0 ? '' : `(\\.\\d{1,${digits}})?`;
  const pattern = new RegExp(`^\\d+${decimals}$`);
  if (!pattern.test(trimmed)) return null;
  const minor = Math.round(Number.parseFloat(trimmed) * 10 ** digits);
  return Number.isSafeInteger(minor) ? minor : null;
}

export function pctOfMinor(amountMinor: number, pct: number): number {
  return Math.round((amountMinor * pct) / 100);
}

export interface LineTotals {
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
}

export function lineTotals(qty: number, unitPriceMinor: number, taxRatePct: number): LineTotals {
  const subtotalMinor = Math.round(qty * unitPriceMinor);
  const taxMinor = pctOfMinor(subtotalMinor, taxRatePct);
  return { subtotalMinor, taxMinor, totalMinor: subtotalMinor + taxMinor };
}

export interface TotalsInputLine {
  qty: number;
  unitPriceMinor: number;
  taxRatePct: number;
}

export function sumTotals(lines: readonly TotalsInputLine[]): LineTotals {
  let subtotalMinor = 0;
  let taxMinor = 0;
  for (const line of lines) {
    const totals = lineTotals(line.qty, line.unitPriceMinor, line.taxRatePct);
    subtotalMinor += totals.subtotalMinor;
    taxMinor += totals.taxMinor;
  }
  return { subtotalMinor, taxMinor, totalMinor: subtotalMinor + taxMinor };
}

export function sumMinor(amounts: readonly number[]): number {
  return amounts.reduce((acc, value) => acc + value, 0);
}

export type MoneyValue = number | string;

export const CURRENCY_LOCALES: Readonly<Record<string, string>> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  TRY: 'tr-TR',
  AED: 'en-AE',
};

export interface FormatCurrencyOptions {
  locale?: string;
  compact?: boolean;
  signed?: boolean;
  showCode?: boolean;
  cents?: boolean;
  decimals?: 0 | 2;
  smartFractions?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currencyDisplay?: Intl.NumberFormatOptions['currencyDisplay'] | 'none';
  symbolPosition?: 'auto' | 'prefix' | 'suffix';
  signPosition?: 'auto' | 'afterSymbol';
  compactSuffixCase?: 'auto' | 'si';
}

interface FractionRange {
  min: number;
  max: number;
}

function resolveFractionRange(amount: MoneyValue, currency: string, options: FormatCurrencyOptions): FractionRange {
  const digits = currencyFractionDigits(currency);
  let min = digits;
  let max = digits;
  if (options.smartFractions) {
    const numeric = typeof amount === 'number' ? amount : Number.parseFloat(amount);
    const dropFractions = Math.abs(numeric) >= 1000 || Number.isInteger(numeric);
    min = dropFractions ? 0 : digits;
    max = dropFractions ? 0 : digits;
  }
  if (options.decimals !== undefined) {
    min = options.decimals;
    max = options.decimals;
  }
  if (options.cents === false) {
    min = 0;
    max = 0;
  }
  if (options.minimumFractionDigits !== undefined) min = options.minimumFractionDigits;
  if (options.maximumFractionDigits !== undefined) max = options.maximumFractionDigits;
  if (options.compact && options.maximumFractionDigits === undefined) max = Math.min(max, 1);
  if (min > max) min = max;
  return { min, max };
}

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

const SIGN_PART_TYPES = new Set(['minusSign', 'plusSign']);

function composeCurrencyParts(parts: Intl.NumberFormatPart[], options: FormatCurrencyOptions): string {
  const mapped =
    options.compactSuffixCase === 'si'
      ? parts.map((part) =>
          part.type === 'compact'
            ? { ...part, value: part.value.toLowerCase() === 'k' ? 'k' : part.value.toUpperCase() }
            : part,
        )
      : parts;
  const dropSymbol = options.currencyDisplay === 'none';
  const position = options.symbolPosition ?? 'auto';
  const reposition = dropSymbol || position === 'prefix' || position === 'suffix';
  if (!reposition && options.signPosition !== 'afterSymbol') {
    return mapped.map((part) => part.value).join('');
  }
  if (!reposition) {
    const signs = mapped.filter((part) => SIGN_PART_TYPES.has(part.type)).map((part) => part.value).join('');
    const chunks: string[] = [];
    let signsEmitted = false;
    for (const part of mapped) {
      if (SIGN_PART_TYPES.has(part.type)) continue;
      chunks.push(part.value);
      if (!signsEmitted && part.type === 'currency') {
        chunks.push(signs);
        signsEmitted = true;
      }
    }
    if (!signsEmitted) chunks.push(signs);
    return chunks.join('');
  }
  const currencyIndexes: number[] = [];
  mapped.forEach((part, index) => {
    if (part.type === 'currency') currencyIndexes.push(index);
  });
  const removed = new Set<number>(currencyIndexes);
  for (const index of currencyIndexes) {
    const next = mapped[index + 1];
    const prev = mapped[index - 1];
    if (next && next.type === 'literal' && next.value.trim() === '') removed.add(index + 1);
    else if (prev && prev.type === 'literal' && prev.value.trim() === '') removed.add(index - 1);
  }
  const symbol = mapped
    .filter((_, index) => currencyIndexes.includes(index))
    .map((part) => part.value)
    .join('');
  const keep = mapped.filter((_, index) => !removed.has(index));
  if (dropSymbol) return keep.map((part) => part.value).join('');
  if (position === 'prefix') {
    const signs = keep.filter((part) => SIGN_PART_TYPES.has(part.type)).map((part) => part.value).join('');
    const body = keep.filter((part) => !SIGN_PART_TYPES.has(part.type)).map((part) => part.value).join('');
    return options.signPosition === 'afterSymbol' ? `${symbol}${signs}${body}` : `${symbol}${body}`;
  }
  return `${keep.map((part) => part.value).join('')} ${symbol}`;
}

export function formatCurrency(
  amount: MoneyValue,
  currency: string,
  options: FormatCurrencyOptions = {},
): string {
  const upper = currency.toUpperCase();
  const locale = options.locale ?? CURRENCY_LOCALES[upper] ?? 'en-US';
  const { min, max } = resolveFractionRange(amount, upper, options);
  const key = `${locale}|${upper}|${options.compact ? 'compact' : 'standard'}|${options.signed ? 'signed' : 'auto'}|${options.currencyDisplay ?? 'default'}|${min}|${max}`;
  let formatter = currencyFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: upper,
      notation: options.compact ? 'compact' : 'standard',
      minimumFractionDigits: min,
      maximumFractionDigits: max,
      signDisplay: options.signed ? 'always' : 'auto',
      ...(options.currencyDisplay && options.currencyDisplay !== 'none'
        ? { currencyDisplay: options.currencyDisplay }
        : {}),
    });
    currencyFormatterCache.set(key, formatter);
  }
  const value =
    typeof amount === 'number'
      ? amount
      : (amount as unknown as Parameters<Intl.NumberFormat['format']>[0]);
  const needsComposition =
    options.currencyDisplay === 'none' ||
    (options.symbolPosition !== undefined && options.symbolPosition !== 'auto') ||
    options.signPosition === 'afterSymbol' ||
    options.compactSuffixCase === 'si';
  const formatted = needsComposition
    ? composeCurrencyParts(formatter.formatToParts(value), options)
    : formatter.format(value);
  return options.showCode ? `${formatted} ${upper}` : formatted;
}

export interface MinorCurrencyOptions extends FormatCurrencyOptions {
  minorDigits?: number;
}

export function formatCurrencyMinor(
  amountMinor: number,
  currency: string,
  options: MinorCurrencyOptions = {},
): string {
  const { minorDigits, ...rest } = options;
  const digits = minorDigits ?? currencyFractionDigits(currency);
  if (minorDigits !== undefined) {
    rest.minimumFractionDigits = rest.minimumFractionDigits ?? minorDigits;
    rest.maximumFractionDigits = rest.maximumFractionDigits ?? minorDigits;
  }
  return formatCurrency(amountMinor / 10 ** digits, currency, rest);
}

export function formatCurrencyCompact(
  amount: MoneyValue,
  currency: string,
  options: Omit<FormatCurrencyOptions, 'compact'> = {},
): string {
  return formatCurrency(amount, currency, { ...options, compact: true });
}
