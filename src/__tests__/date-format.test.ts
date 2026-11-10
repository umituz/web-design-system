import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, parseDateInput } from '../infrastructure/utils/date.util';

const D = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe('parseDateInput', () => {
  it('parses date-only ISO as local midnight, not UTC', () => {
    expect(parseDateInput('2026-11-10')?.getTime()).toBe(D(2026, 11, 10).getTime());
  });

  it('passes Date instances through and rejects invalid ones', () => {
    const date = D(2026, 1, 5);
    expect(parseDateInput(date)).toBe(date);
    expect(parseDateInput(new Date('nope'))).toBeNull();
  });

  it('rejects empty and whitespace strings', () => {
    expect(parseDateInput('')).toBeNull();
    expect(parseDateInput('   ')).toBeNull();
  });

  it('falls back to the standard parser for full ISO strings', () => {
    expect(parseDateInput('2026-11-10T09:30:00')?.getFullYear()).toBe(2026);
  });
});

describe('formatDate presets', () => {
  it('medium renders Mon D, YYYY', () => {
    expect(formatDate('2026-11-10')).toBe('Nov 10, 2026');
  });

  it('long renders weekday, Month D, YYYY', () => {
    expect(formatDate('2026-11-10', 'long')).toBe('Tuesday, November 10, 2026');
  });

  it('short renders Mon D without the year', () => {
    expect(formatDate('2026-11-10', 'short')).toBe('Nov 10');
  });

  it('monthYear renders Mon YYYY', () => {
    expect(formatDate('2026-11-10', 'monthYear')).toBe('Nov 2026');
  });

  it('honors a non-default locale', () => {
    const out = formatDate('2026-11-10', 'medium', { locale: 'de-DE' });
    expect(out.replace(new RegExp(String.fromCharCode(160), 'g'), ' ')).toBe('10. Nov. 2026');
  });
});

describe('formatDate numeric style', () => {
  it('renders dmy with the default dot separator', () => {
    expect(formatDate('2026-11-10', 'numeric')).toBe('10.11.2026');
  });

  it('renders slash-separated dmy, mdy, and ymd orders', () => {
    expect(formatDate('2026-11-10', 'numeric', { order: 'dmy', separator: '/' })).toBe('10/11/2026');
    expect(formatDate('2026-11-10', 'numeric', { order: 'mdy', separator: '/' })).toBe('11/10/2026');
    expect(formatDate('2026-11-10', 'numeric', { order: 'ymd', separator: '-' })).toBe('2026-11-10');
  });

  it('pads single-digit day and month to two digits', () => {
    expect(formatDate('2026-01-05', 'numeric')).toBe('05.01.2026');
  });
});

describe('formatDate invalid inputs', () => {
  it('renders the em dash for null, undefined, and garbage', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
    expect(formatDate('not-a-date')).toBe('—');
    expect(formatDate('', 'numeric')).toBe('—');
  });

  it('supports a custom invalidOutput', () => {
    expect(formatDate(null, 'medium', { invalidOutput: 'n/a' })).toBe('n/a');
  });
});

describe('formatDateTime', () => {
  it('composes the medium date with a 24h clock', () => {
    expect(formatDateTime('2026-11-10T09:30:00')).toBe('Nov 10, 2026, 09:30');
  });

  it('supports a custom time separator and locale clock', () => {
    const out = formatDateTime('2026-11-10T14:05:00', { timeSeparator: ' · ', locale: 'en-GB' });
    expect(out).toBe('10 Nov 2026 · 14:05');
  });

  it('renders the placeholder for invalid input', () => {
    expect(formatDateTime('nope')).toBe('—');
    expect(formatDateTime(null, { invalidOutput: '—' })).toBe('—');
  });
});

describe('formatter cache', () => {
  it('does not contaminate across locales for the same instant', () => {
    const en = formatDate('2026-11-10');
    formatDate('2026-11-10', 'medium', { locale: 'de-DE' });
    expect(formatDate('2026-11-10')).toBe(en);
  });
});
