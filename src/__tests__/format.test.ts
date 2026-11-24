import { describe, expect, it } from 'vitest';
import {
  formatCount,
  formatFileSize,
  truncateText,
  toSlug,
  formatDuration,
  formatCompact,
  formatBadgeCount,
  getNumberFormatter,
  getDateTimeFormatter,
} from '../infrastructure/utils';

describe('formatCount', () => {
  it('formats with grouping separators for the locale', () => {
    expect(formatCount(1234567, 'en-US')).toBe('1,234,567');
  });

  it('honours locale-specific separators', () => {
    expect(formatCount(1234, 'tr-TR')).toBe('1.234');
    expect(formatCount(1234, 'de-DE')).toBe('1.234');
  });

  it('keeps zero and negative values readable', () => {
    expect(formatCount(0, 'en-US')).toBe('0');
    expect(formatCount(-42, 'en-US')).toBe('-42');
  });
});

describe('formatFileSize', () => {
  it('formats bytes without fractions', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('scales through the binary units', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatFileSize(2 * 1024 ** 3)).toBe('2 GB');
  });

  it('treats negative input as zero', () => {
    expect(formatFileSize(-10)).toBe('0 B');
  });
});

describe('truncateText', () => {
  it('returns short text untouched', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('appends the suffix within the limit', () => {
    expect(truncateText('hello world', 8)).toBe('hello w…');
  });

  it('supports a custom suffix', () => {
    expect(truncateText('hello world', 9, '!!')).toBe('hello w!!');
  });
});

describe('toSlug', () => {
  it('lowercases and joins words with dashes', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
  });

  it('strips diacritics before slugifying', () => {
    expect(toSlug('Déjà Vu — Ünleme!')).toBe('deja-vu-unleme');
  });

  it('trims leading and trailing dashes', () => {
    expect(toSlug('  -- spaced out --  ')).toBe('spaced-out');
  });
});

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(42)).toBe('42s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2m 5s');
  });

  it('formats hours with all parts', () => {
    expect(formatDuration(3661)).toBe('1h 1m 1s');
  });

  it('collapses to 0s for zero and invalid input', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(-5)).toBe('0s');
    expect(formatDuration(Number.NaN)).toBe('0s');
  });
});

describe('formatCompact', () => {
  it('passes small values through as-is', () => {
    expect(formatCompact(0)).toBe('0');
    expect(formatCompact(999)).toBe('999');
  });

  it('scales into K with one decimal below 100', () => {
    expect(formatCompact(1000)).toBe('1K');
    expect(formatCompact(1200)).toBe('1.2K');
    expect(formatCompact(9500)).toBe('9.5K');
  });

  it('rounds whole numbers above 100 in the tier', () => {
    expect(formatCompact(123_000)).toBe('123K');
  });

  it('scales into M and B', () => {
    expect(formatCompact(1_000_000)).toBe('1M');
    expect(formatCompact(3_400_000)).toBe('3.4M');
    expect(formatCompact(2_000_000_000)).toBe('2B');
  });

  it('carries rounding across the unit boundary', () => {
    expect(formatCompact(999_999)).toBe('1M');
    expect(formatCompact(999_999_999)).toBe('1B');
  });
});

describe('formatBadgeCount', () => {
  it('renders counts up to the cap verbatim', () => {
    expect(formatBadgeCount(0)).toBe('0');
    expect(formatBadgeCount(9)).toBe('9');
  });

  it('caps larger counts', () => {
    expect(formatBadgeCount(10)).toBe('9+');
    expect(formatBadgeCount(99)).toBe('9+');
  });

  it('supports a custom cap', () => {
    expect(formatBadgeCount(100, 99)).toBe('99+');
    expect(formatBadgeCount(99, 99)).toBe('99');
  });
});

describe('formatter caches', () => {
  it('returns the same Intl.NumberFormat instance for an identical locale+options pair', () => {
    const a = getNumberFormatter('tr-TR', { maximumFractionDigits: 0 });
    const b = getNumberFormatter('tr-TR', { maximumFractionDigits: 0 });
    expect(b).toBe(a);
  });

  it('builds a fresh formatter when locale or options differ', () => {
    const base = getNumberFormatter('en-US', { maximumFractionDigits: 0 });
    expect(getNumberFormatter('de-DE', { maximumFractionDigits: 0 })).not.toBe(base);
    expect(getNumberFormatter('en-US', { maximumFractionDigits: 2 })).not.toBe(base);
  });

  it('caches Intl.DateTimeFormat the same way', () => {
    const a = getDateTimeFormatter('tr-TR', { weekday: 'short' });
    const b = getDateTimeFormatter('tr-TR', { weekday: 'short' });
    expect(b).toBe(a);
    expect(getDateTimeFormatter('tr-TR', { month: 'short' })).not.toBe(a);
  });
});

