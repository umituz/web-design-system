
import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatCurrencyMinor,
  formatCount,
  timeAgo,
} from '../infrastructure/utils';

describe('formatCurrency symbol composition', () => {
  it('forces the symbol to the front regardless of locale order', () => {
    expect(formatCurrency(1234.56, 'EUR', { locale: 'de-DE', symbolPosition: 'prefix' })).toBe('€1.234,56');
    expect(formatCurrency(1234.5, 'USD', { locale: 'en-US', symbolPosition: 'prefix' })).toBe('$1,234.50');
  });

  it('forces the symbol to the end with a single space', () => {
    expect(formatCurrency(1234.5, 'USD', { locale: 'en-US', symbolPosition: 'suffix' })).toBe('1,234.50 $');
  });

  it('moves the sign between symbol and digits on demand', () => {
    expect(
      formatCurrency(-50.25, 'EUR', {
        locale: 'en-US',
        currencyDisplay: 'narrowSymbol',
        symbolPosition: 'prefix',
        signPosition: 'afterSymbol',
      }),
    ).toBe('€-50.25');
    expect(formatCurrency(-5, 'USD', { locale: 'en-US', signPosition: 'afterSymbol' })).toBe('$-5.00');
  });

  it('drops the symbol entirely for symbol-less composites', () => {
    expect(formatCurrency(1500, 'USD', { cents: false, currencyDisplay: 'none' })).toBe('1,500');
    expect(formatCurrency(1500, 'USD', { cents: false, currencyDisplay: 'none', showCode: true })).toBe(
      '1,500 USD',
    );
    expect(formatCurrency(-42.25, 'USD', { currencyDisplay: 'none' })).toBe('-42.25');
  });

  it('applies SI suffix casing to compact output', () => {
    expect(
      formatCurrency(1500, 'USD', { compact: true, maximumFractionDigits: 1, compactSuffixCase: 'si' }),
    ).toBe('$1.5k');
    expect(
      formatCurrency(12500000, 'USD', {
        compact: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        compactSuffixCase: 'si',
      }),
    ).toBe('$12.50M');
    expect(
      formatCurrency(1500000, 'GBP', { locale: 'en-GB', compact: true, maximumFractionDigits: 1, compactSuffixCase: 'si' }),
    ).toBe('£1.5M');
  });

  it('composes without contaminating the plain formatter cache', () => {
    expect(formatCurrency(5, 'USD')).toBe('$5.00');
    expect(formatCurrency(5, 'USD', { symbolPosition: 'suffix' })).toBe('5.00 $');
    expect(formatCurrency(5, 'USD')).toBe('$5.00');
  });
});

describe('formatCurrencyMinor', () => {
  it('divides minor units by the currency digits', () => {
    expect(formatCurrencyMinor(123456, 'USD')).toBe('$1,234.56');
    expect(formatCurrencyMinor(1500, 'JPY')).toBe('¥1,500');
  });

  it('honors an explicit minor digit override', () => {
    expect(formatCurrencyMinor(1500, 'JPY', { minorDigits: 2 })).toBe('¥15.00');
    expect(formatCurrencyMinor(1500, 'JPY', { minorDigits: 2, maximumFractionDigits: 0 })).toBe('¥15');
  });

  it('passes the full option surface through', () => {
    expect(formatCurrencyMinor(12500000, 'USD', { compact: true })).toBe('$125.0K');
    expect(formatCurrencyMinor(12500000, 'USD', { compact: true, maximumFractionDigits: 0 })).toBe('$125K');
  });
});

describe('formatCount digit options', () => {
  it('keeps the plain default untouched', () => {
    expect(formatCount(1234.567, 'en-US')).toBe('1,234.567');
  });

  it('applies explicit fraction digits', () => {
    expect(formatCount(1234.567, 'en-US', { maximumFractionDigits: 2 })).toBe('1,234.57');
    expect(formatCount(1234.5, 'de-DE', { minimumFractionDigits: 2 })).toBe('1.234,50');
    expect(formatCount(1234, 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })).toBe('1,234');
  });
});

describe('timeAgo invalid date handling', () => {
  it('returns the fallback instead of throwing when requested', () => {
    expect(timeAgo('not-a-date', { invalidDateOutput: '—' })).toBe('—');
  });

  it('still throws on invalid dates by default', () => {
    expect(() => timeAgo('not-a-date')).toThrow();
  });
});
