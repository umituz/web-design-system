import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatTime, getUserTimeZone, parseDateInput } from '../infrastructure/utils/date.util';

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

describe('preset overrides', () => {
  it('drops the weekday from the long style', () => {
    expect(formatDate('2026-11-10', 'long', { weekday: 'none' })).toBe('November 10, 2026');
  });

  it('shortens the weekday of the long style', () => {
    expect(formatDate('2026-11-10', 'long', { weekday: 'short' })).toBe('Tue, November 10, 2026');
  });

  it('lengthens the month of the monthYear style', () => {
    expect(formatDate('2026-01-15', 'monthYear', { month: 'long' })).toBe('January 2026');
  });

  it('lengthens the month of the medium style', () => {
    expect(formatDate('2026-01-15', 'medium', { month: 'long' })).toBe('January 15, 2026');
  });

  it('does not leak overrides into other calls through the cache', () => {
    expect(formatDate('2026-11-10', 'monthYear', { month: 'long' })).toBe('November 2026');
    expect(formatDate('2026-11-10', 'monthYear')).toBe('Nov 2026');
    expect(formatDate('2026-11-10', 'long', { weekday: 'none' })).toBe('November 10, 2026');
    expect(formatDate('2026-11-10', 'long')).toBe('Tuesday, November 10, 2026');
  });
});

describe('day, year, and month granularity overrides', () => {
  it('pads the day to two digits on the medium style', () => {
    expect(formatDate('2026-01-05', 'medium', { day: '2-digit' })).toBe('Jan 05, 2026');
  });

  it('pads the day of the yearless short style', () => {
    expect(formatDate('2026-01-05', 'short', { day: '2-digit', locale: 'en-GB' })).toBe('05 Jan');
  });

  it('drops the year from the medium style', () => {
    expect(formatDate('2026-11-10', 'medium', { year: 'none', locale: 'en-GB' })).toBe('10 Nov');
  });

  it('shortens the year of the monthYear style', () => {
    expect(formatDate('2026-11-10', 'monthYear', { year: '2-digit' })).toBe('Nov 26');
  });

  it('renders weekday and day without the month', () => {
    expect(formatDate('2026-11-10', 'short', { weekday: 'short', month: 'none', locale: 'en-GB' })).toBe('Tue 10');
  });

  it('keeps numeric style unaffected by granularity overrides', () => {
    expect(formatDate('2026-11-10', 'numeric', { day: '2-digit' })).toBe('10.11.2026');
  });
});

describe('formatDateTime year and clock options', () => {
  it('renders a yearless datetime', () => {
    expect(formatDateTime('2026-11-10T14:05:00', { locale: 'en-GB', year: 'none', timeSeparator: ' · ' })).toBe('10 Nov · 14:05');
  });

  it('renders a 2-digit year datetime', () => {
    expect(formatDateTime('2026-11-10T14:05:00', { locale: 'en-GB', year: '2-digit', timeSeparator: ' · ' })).toBe('10 Nov 26 · 14:05');
  });

  it('renders a 12h clock when requested', () => {
    expect(formatDateTime('2026-11-10T14:05:00', { hour12: true })).toBe('Nov 10, 2026, 02:05 PM');
  });
});

describe('formatTime', () => {
  it('renders a 24h clock by default', () => {
    expect(formatTime('2026-11-10T14:05:00')).toBe('14:05');
  });

  it('renders a 12h clock when requested', () => {
    expect(formatTime('2026-11-10T14:05:00', { hour12: true })).toBe('02:05 PM');
  });

  it('includes seconds when requested', () => {
    expect(formatTime('2026-11-10T14:05:09', { withSeconds: true })).toBe('14:05:09');
  });

  it('renders the placeholder for invalid input', () => {
    expect(formatTime('nope')).toBe('—');
    expect(formatTime(null, { invalidOutput: 'n/a' })).toBe('n/a');
  });
});

describe('formatter cache', () => {
  it('does not contaminate across locales for the same instant', () => {
    const en = formatDate('2026-11-10');
    formatDate('2026-11-10', 'medium', { locale: 'de-DE' });
    expect(formatDate('2026-11-10')).toBe(en);
  });
});

describe('time zone formatting', () => {
  it('renders the same instant on different days per time zone', () => {
    const instant = '2026-11-10T23:30:00Z';

    expect(formatDate(instant, 'medium', { timeZone: 'Europe/Istanbul' })).toBe(
      'Nov 11, 2026'
    );
    expect(formatDate(instant, 'medium', { timeZone: 'America/New_York' })).toBe(
      'Nov 10, 2026'
    );
  });

  it('shifts the clock of formatDateTime by the given zone', () => {
    const instant = '2026-11-10T23:30:00Z';

    expect(formatDateTime(instant, { timeZone: 'Europe/Istanbul' })).toBe(
      'Nov 11, 2026, 02:30'
    );
    expect(formatDateTime(instant, { timeZone: 'America/New_York' })).toBe(
      'Nov 10, 2026, 18:30'
    );
  });

  it('applies the zone to numeric style as well', () => {
    const instant = '2026-11-10T23:30:00Z';

    expect(formatDate(instant, 'numeric', { timeZone: 'Europe/Istanbul' })).toBe(
      '11.11.2026'
    );
  });

  it('resolves the user time zone as a non-empty identifier', () => {
    const zone = getUserTimeZone();
    expect(typeof zone).toBe('string');
    expect(zone.length).toBeGreaterThan(0);
  });
});
