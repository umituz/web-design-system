import { describe, expect, it } from 'vitest';
import {
  addDaysKey,
  addMonthsKey,
  dayKeyDaysAgo,
  dayKeyFromIso,
  daysUntilDayKey,
  isoDaysAgo,
  nowIso,
  parseDayKey,
  toDayKey,
  todayKey,
} from '../infrastructure/utils/day-key.util';

describe('day-key util', () => {
  it('formats local calendar dates as zero-padded day keys', () => {
    expect(toDayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toDayKey(new Date(2026, 10, 17))).toBe('2026-11-17');
  });

  it('parses day keys back to local calendar dates', () => {
    const parsed = parseDayKey('2026-02-09');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(1);
    expect(parsed.getDate()).toBe(9);
  });

  it('rolls over month and year boundaries when adding days', () => {
    expect(addDaysKey('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDaysKey('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDaysKey('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDaysKey('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysKey('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('clamps to the last day of the target month when adding months', () => {
    expect(addMonthsKey('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonthsKey('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonthsKey('2026-01-15', -1)).toBe('2025-12-15');
    expect(addMonthsKey('2026-05-31', 12)).toBe('2027-05-31');
  });

  it('computes whole-day distances from today', () => {
    const today = todayKey();
    expect(daysUntilDayKey(today)).toBe(0);
    expect(daysUntilDayKey(addDaysKey(today, 3))).toBe(3);
    expect(daysUntilDayKey(addDaysKey(today, -2))).toBe(-2);
  });

  it('derives day keys from ISO timestamps in the same local day', () => {
    expect(dayKeyFromIso(isoDaysAgo(0, 12, 0))).toBe(dayKeyDaysAgo(0));
    expect(dayKeyFromIso(isoDaysAgo(4, 12, 0))).toBe(dayKeyDaysAgo(4));
  });

  it('produces valid ISO strings anchored to the requested local hour', () => {
    const stamp = new Date(isoDaysAgo(2, 9, 30));
    expect(stamp.getHours()).toBe(9);
    expect(stamp.getMinutes()).toBe(30);
    expect(new Date(nowIso()).toString()).not.toBe('Invalid Date');
  });

  it('walks backwards across month starts', () => {
    expect(dayKeyDaysAgo(0)).toBe(todayKey());
    const past = new Date();
    past.setDate(past.getDate() - 31);
    expect(dayKeyDaysAgo(31)).toBe(toDayKey(past));
  });
});
