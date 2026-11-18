
import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatMoney,
  safeCurrencyCode,
  CURRENCY_LOCALES,
} from '../infrastructure/utils';

describe('formatCurrency', () => {
  it('formats major-unit amounts with currency fraction digits', () => {
    expect(formatCurrency(1234.5, 'USD')).toBe('$1,234.50');
    expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
    expect(formatCurrency(1.234, 'KWD')).toContain('1.234');
  });

  it('maps currencies to their canonical locale', () => {
    expect(formatCurrency(1234.5, 'TRY')).toContain('1.234,50');
    expect(formatCurrency(1234.5, 'EUR')).toContain('1.234,50');
    expect(formatCurrency(1234.5, 'GBP')).toBe('£1,234.50');
  });

  it('honors an explicit locale over the currency map', () => {
    expect(formatCurrency(1234.5, 'USD', { locale: 'de-DE' })).toContain('1.234,50');
  });

  it('drops cents on demand', () => {
    expect(formatCurrency(1234.56, 'USD', { cents: false })).toBe('$1,235');
  });

  it('applies explicit decimals', () => {
    expect(formatCurrency(1234.5, 'USD', { decimals: 0 })).toBe('$1,235');
    expect(formatCurrency(1234.5, 'USD', { decimals: 2 })).toBe('$1,234.50');
  });

  it('applies the smart-fraction heuristic', () => {
    expect(formatCurrency(1500, 'USD', { smartFractions: true })).toBe('$1,500');
    expect(formatCurrency(12.34, 'USD', { smartFractions: true })).toBe('$12.34');
  });

  it('respects currency digits when smart fractions keep cents', () => {
    expect(formatCurrency(12.5, 'JPY', { smartFractions: true })).toBe('¥13');
  });

  it('compacts large amounts', () => {
    expect(formatCurrency(1_500_000, 'USD', { compact: true })).toBe('$1.5M');
  });

  it('keeps explicit fraction digits under compact', () => {
    expect(formatCurrency(1_500_000, 'USD', { compact: true, maximumFractionDigits: 2 })).toBe(
      '$1.50M',
    );
  });

  it('signs and appends the code on demand', () => {
    expect(formatCurrency(12.5, 'USD', { signed: true })).toBe('+$12.50');
    expect(formatCurrency(12.5, 'USD', { showCode: true })).toBe('$12.50 USD');
  });

  it('passes currencyDisplay through', () => {
    expect(formatCurrency(12.5, 'USD', { currencyDisplay: 'code' })).toBe('USD 12.50');
  });

  it('formats exact decimal strings without float artifacts', () => {
    expect(formatCurrency('1234.565', 'USD', { maximumFractionDigits: 2 })).toBe('$1,234.57');
    expect(formatCurrency('0.1', 'USD')).toBe('$0.10');
  });

  it('caches formatters without cross-contaminating options', () => {
    expect(formatCurrency(5, 'USD')).toBe('$5.00');
    expect(formatCurrency(5, 'USD', { cents: false })).toBe('$5');
    expect(formatCurrency(5, 'USD')).toBe('$5.00');
  });
});

describe('formatCurrencyCompact', () => {
  it('compacts with the full option surface', () => {
    expect(formatCurrencyCompact(1_250_000, 'USD')).toBe('$1.3M');
    expect(formatCurrencyCompact(95_000, 'EUR', { maximumFractionDigits: 2 })).toContain('95');
  });
});

describe('CURRENCY_LOCALES', () => {
  it('covers the fleet currency set', () => {
    expect(CURRENCY_LOCALES.USD).toBe('en-US');
    expect(CURRENCY_LOCALES.TRY).toBe('tr-TR');
    expect(CURRENCY_LOCALES.AED).toBe('en-AE');
  });
});

describe('invalid-currency fallback (6.39.0)', () => {
  it('coerces malformed codes to ISO 4217 XXX, never throws', () => {
    // A bad code in domain data must not crash the render tree.
    expect(() => formatCurrency(5, '')).not.toThrow();
    expect(() => formatCurrency(5, 'TR')).not.toThrow();
    expect(() => formatCurrency(5, 'TOOLONG')).not.toThrow();
    expect(() => formatCurrency(5, 'US$')).not.toThrow();
    expect(() => formatMoney(500, '   ')).not.toThrow();
    // XXX defaults to code display ("XXX 5.00", NBSP-separated) instead of
    // Intl's opaque ¤ sign.
    expect(formatCurrency(5, 'TR')).toBe('XXX 5.00');
    expect(formatMoney(500, 'TR')).toBe('XXX 5.00');
  });

  it('normalizes case and surrounding whitespace instead of falling back', () => {
    // 'try'/' try ' are well-formed TRY — repairing FORM is safe; guessing
    // currency IDENTITY from a malformed code is not (that stays XXX).
    expect(safeCurrencyCode(' try ')).toBe('TRY');
    expect(formatCurrency(1234.5, 'try')).toContain('1.234,50');
  });

  it('renders well-formed unknown three-letter codes verbatim (no fallback)', () => {
    expect(safeCurrencyCode('XYZ')).toBe('XYZ');
    expect(formatCurrency(5, 'XYZ')).toBe('XYZ 5.00');
  });

  it('keeps showCode consistent with the coerced code', () => {
    expect(formatCurrency(5, 'TR', { showCode: true })).toBe('XXX 5.00 XXX');
  });
});
