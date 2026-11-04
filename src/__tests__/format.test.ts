import { describe, expect, it } from 'vitest';
import { formatCount } from '../infrastructure/utils';

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
