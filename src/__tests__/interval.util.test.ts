import { describe, expect, it } from 'vitest';
import { formatTimeRange, overlaps } from '../infrastructure/utils/interval.util';
import { dateKeyParts, monthGridWeekKeys } from '../infrastructure/utils/day-key.util';
import { monthName, weekdayNames } from '../infrastructure/utils/format.util';

describe('formatTimeRange', () => {
  it('renders only times when both ends fall on the same zone day', () => {
    expect(formatTimeRange('2026-03-10T14:00:00Z', '2026-03-10T15:30:00Z', { timeZone: 'UTC' })).toBe(
      '2:00 PM – 3:30 PM',
    );
  });

  it('renders day-time on both ends when the range crosses a zone day', () => {
    expect(formatTimeRange('2026-03-10T22:00:00Z', '2026-03-11T08:00:00Z', { timeZone: 'UTC' })).toBe(
      'Mar 10, 10:00 PM – Mar 11, 8:00 AM',
    );
  });

  it('honors the time zone for the same-day decision', () => {
    expect(
      formatTimeRange('2026-03-10T21:30:00Z', '2026-03-10T23:30:00Z', { timeZone: 'Europe/Istanbul' }),
    ).toBe('12:30 AM – 2:30 AM');
    expect(
      formatTimeRange('2026-03-10T20:30:00Z', '2026-03-10T21:30:00Z', { timeZone: 'Europe/Istanbul' }),
    ).toBe('Mar 10, 11:30 PM – Mar 11, 12:30 AM');
  });
});

describe('overlaps', () => {
  it('detects partial and full overlap', () => {
    expect(overlaps('2026-03-10T10:00:00Z', '2026-03-10T12:00:00Z', '2026-03-10T11:00:00Z', '2026-03-10T13:00:00Z')).toBe(true);
    expect(overlaps('2026-03-10T10:00:00Z', '2026-03-10T11:00:00Z', '2026-03-10T10:00:00Z', '2026-03-10T11:00:00Z')).toBe(true);
  });

  it('is false for touching and disjoint ranges', () => {
    expect(overlaps('2026-03-10T10:00:00Z', '2026-03-10T11:00:00Z', '2026-03-10T11:00:00Z', '2026-03-10T12:00:00Z')).toBe(false);
    expect(overlaps('2026-03-10T10:00:00Z', '2026-03-10T11:00:00Z', '2026-03-10T13:00:00Z', '2026-03-10T14:00:00Z')).toBe(false);
  });

  it('accepts Date inputs', () => {
    expect(
      overlaps(
        new Date('2026-03-10T10:00:00Z'),
        new Date('2026-03-10T12:00:00Z'),
        new Date('2026-03-10T09:00:00Z'),
        new Date('2026-03-10T10:30:00Z'),
      ),
    ).toBe(true);
  });
});

describe('dateKeyParts', () => {
  it('splits a day key into calendar numbers', () => {
    expect(dateKeyParts('2026-03-08')).toEqual({ year: 2026, month: 3, day: 8 });
  });
});

describe('monthGridWeekKeys', () => {
  it('builds monday-start weeks overlapping the month', () => {
    const weeks = monthGridWeekKeys(2026, 3);
    expect(weeks[0]?.[0]).toBe('2026-02-23');
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks.some((week) => week.includes('2026-03-15'))).toBe(true);
  });

  it('wraps january grids across the year boundary', () => {
    const weeks = monthGridWeekKeys(2026, 1);
    expect(weeks[0]?.[0]).toBe('2025-12-29');
    expect(weeks.length).toBeGreaterThanOrEqual(5);
    expect(weeks.length).toBeLessThanOrEqual(6);
  });
});

describe('monthName and weekdayNames', () => {
  it('renders month names in long and short styles', () => {
    expect(monthName(3)).toBe('March');
    expect(monthName(3, 'en-US', 'short')).toBe('Mar');
    expect(monthName(4, 'de')).toBe('April');
  });

  it('lists weekday names starting monday or sunday', () => {
    expect(weekdayNames()).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(weekdayNames('en-US', false)[0]).toBe('Sun');
  });
});
