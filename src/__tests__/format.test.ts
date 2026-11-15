import { describe, expect, it } from 'vitest';
import { formatCount, formatFileSize, truncateText, toSlug, formatDuration } from '../infrastructure/utils';

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

