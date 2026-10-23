/**
 * Money utils + Money atom — minor-unit contract (ISO 4217 digits, parsing, totals).
 */

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import {
  currencyFractionDigits,
  formatMoney,
  formatMoneyCompact,
  toMinor,
  parseAmountToMinor,
  pctOfMinor,
  lineTotals,
  sumTotals,
  sumMinor,
} from '../infrastructure/utils';
import { Money } from '../presentation/atoms/Money';

afterEach(cleanup);

describe('currencyFractionDigits', () => {
  it('defaults to 2 and matches ISO 4217 exceptions case-insensitively', () => {
    expect(currencyFractionDigits('USD')).toBe(2);
    expect(currencyFractionDigits('jpy')).toBe(0);
    expect(currencyFractionDigits('KWD')).toBe(3);
  });
});

describe('formatMoney', () => {
  it('formats minor units with the currency fraction digits', () => {
    expect(formatMoney(1250, 'USD')).toBe('$12.50');
    expect(formatMoney(1250, 'JPY')).toBe('¥1,250');
    expect(formatMoney(1250, 'KWD')).toContain('1.250');
  });

  it('honors the locale argument', () => {
    expect(formatMoney(1250, 'EUR', 'de-DE')).toContain('12,50 €');
  });
});

describe('formatMoneyCompact', () => {
  it('compacts large amounts to one fraction digit', () => {
    expect(formatMoneyCompact(1_250_000, 'USD')).toBe('$12.5K');
  });
});

describe('toMinor', () => {
  it('converts a major amount with rounding and currency digits', () => {
    expect(toMinor(12.5, 'USD')).toBe(1250);
    expect(toMinor(12.5, 'JPY')).toBe(13);
  });
});

describe('parseAmountToMinor', () => {
  it('parses valid input including comma decimals', () => {
    expect(parseAmountToMinor('12.5', 'USD')).toBe(1250);
    expect(parseAmountToMinor('12,50', 'EUR')).toBe(1250);
    expect(parseAmountToMinor('12', 'JPY')).toBe(12);
  });

  it('returns null for invalid or over-precise input', () => {
    expect(parseAmountToMinor('12.500', 'USD')).toBeNull();
    expect(parseAmountToMinor('12.5', 'JPY')).toBeNull();
    expect(parseAmountToMinor('-5', 'USD')).toBeNull();
    expect(parseAmountToMinor('abc', 'USD')).toBeNull();
    expect(parseAmountToMinor('', 'USD')).toBeNull();
  });
});

describe('totals math', () => {
  it('computes line totals with half-up tax rounding', () => {
    expect(lineTotals(3, 499, 10)).toEqual({ subtotalMinor: 1497, taxMinor: 150, totalMinor: 1647 });
    expect(pctOfMinor(1495, 10)).toBe(150);
  });

  it('sums lines into invoice totals', () => {
    const totals = sumTotals([
      { qty: 2, unitPriceMinor: 1000, taxRatePct: 10 },
      { qty: 1, unitPriceMinor: 500, taxRatePct: 0 },
    ]);
    expect(totals).toEqual({ subtotalMinor: 2500, taxMinor: 200, totalMinor: 2700 });
    expect(sumMinor([2500, 200])).toBe(2700);
  });
});

describe('Money atom', () => {
  it('renders the formatted amount', () => {
    render(<Money amountMinor={1250} currency="USD" />);
    expect(screen.getByText('$12.50')).toBeTruthy();
  });

  it('keeps the tabular-nums class alongside custom classes', () => {
    render(<Money amountMinor={9} currency="JPY" className="text-lg" />);
    const el = screen.getByText('¥9');
    expect(el.className).toContain('tabular-nums');
    expect(el.className).toContain('text-lg');
  });
});
