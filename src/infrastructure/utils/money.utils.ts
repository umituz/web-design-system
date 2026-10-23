/**
 * Money Utils
 * @description Minor-unit money math and locale-aware formatting (ISO 4217)
 */

/** Currencies that don't use 2 decimal places. Everything else defaults to 2. */
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

/** Parses user input like '12.50' into minor units for the currency. Null when invalid. */
export function parseAmountToMinor(input: string, currency: string): number | null {
  const digits = currencyFractionDigits(currency);
  const trimmed = input.trim().replace(',', '.');
  const decimals = digits === 0 ? '' : `(\\.\\d{1,${digits}})?`;
  const pattern = new RegExp(`^\\d+${decimals}$`);
  if (!pattern.test(trimmed)) return null;
  const minor = Math.round(Number.parseFloat(trimmed) * 10 ** digits);
  return Number.isSafeInteger(minor) ? minor : null;
}

/** Percentage of an amount, rounded half-up to whole minor units. */
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
