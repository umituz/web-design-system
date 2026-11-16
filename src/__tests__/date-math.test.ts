import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isToday,
  isValidDate,
  isTomorrow,
  isYesterday,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from '../infrastructure/utils/date-math.util';

const D = (y: number, m: number, d: number, h = 0, min = 0, s = 0) => new Date(y, m - 1, d, h, min, s);

describe('validity', () => {
  it('accepts dates and parseable strings, rejects garbage', () => {
    expect(isValidDate(D(2026, 11, 10))).toBe(true);
    expect(isValidDate('2026-11-10')).toBe(true);
    expect(isValidDate(new Date('nope'))).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });
});

describe('immutability', () => {
  it('never mutates the input date', () => {
    const input = D(2026, 11, 10, 14, 30);
    const snapshot = input.getTime();
    startOfDay(input);
    endOfWeek(input);
    addDays(input, 5);
    subMonths(input, 2);
    setHours(input, 3);
    setMinutes(input, 1);
    expect(input.getTime()).toBe(snapshot);
  });
});

describe('day boundaries', () => {
  it('startOfDay and endOfDay bracket the day', () => {
    const date = D(2026, 11, 10, 14, 30);
    expect(startOfDay(date).getHours()).toBe(0);
    expect(startOfDay(date).getMinutes()).toBe(0);
    expect(endOfDay(date).getHours()).toBe(23);
    expect(endOfDay(date).getMilliseconds()).toBe(999);
  });
});

describe('week boundaries', () => {
  it('startOfWeek anchors on Sunday by default', () => {
    expect(startOfWeek(D(2026, 11, 11)).getDate()).toBe(8);
    expect(startOfWeek(D(2026, 11, 11)).getDay()).toBe(0);
  });

  it('startOfWeek honors Monday start', () => {
    expect(startOfWeek(D(2026, 11, 11), 1).getDate()).toBe(9);
    expect(startOfWeek(D(2026, 11, 11), 1).getDay()).toBe(1);
  });

  it('endOfWeek spans six days after the start', () => {
    const end = endOfWeek(D(2026, 11, 11));
    expect(end.getDay()).toBe(6);
    expect(end.getHours()).toBe(23);
  });
});

describe('month boundaries', () => {
  it('startOfMonth lands on the first', () => {
    const start = startOfMonth(D(2026, 11, 10));
    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(10);
  });

  it('endOfMonth lands on the last day', () => {
    expect(endOfMonth(D(2026, 11, 10)).getDate()).toBe(30);
    expect(endOfMonth(D(2028, 2, 10)).getDate()).toBe(29);
    expect(endOfMonth(D(2027, 2, 10)).getDate()).toBe(28);
  });
});

describe('arithmetic', () => {
  it('addDays and subDays cross month edges', () => {
    expect(addDays(D(2026, 11, 30), 1).getDate()).toBe(1);
    expect(subDays(D(2026, 11, 1), 1).getDate()).toBe(31);
  });

  it('addMinutes carries into the next hour', () => {
    expect(addMinutes(D(2026, 11, 10, 14, 45), 30).getHours()).toBe(15);
  });

  it('subMonths clamps to the target month length', () => {
    const out = subMonths(D(2026, 3, 31), 1);
    expect(out.getMonth()).toBe(1);
    expect(out.getDate()).toBe(28);
  });
});

describe('setters', () => {
  it('setHours and setMinutes keep the rest of the date', () => {
    const out = setMinutes(setHours(D(2026, 11, 10, 14, 30), 9), 5);
    expect(out.getHours()).toBe(9);
    expect(out.getMinutes()).toBe(5);
    expect(out.getDate()).toBe(10);
  });
});

describe('comparison', () => {
  it('isSameDay ignores the clock', () => {
    expect(isSameDay(D(2026, 11, 10, 1, 0), D(2026, 11, 10, 23, 0))).toBe(true);
    expect(isSameDay(D(2026, 11, 10), D(2026, 11, 11))).toBe(false);
  });

  it('isToday, isTomorrow, isYesterday resolve against the clock', () => {
    const now = new Date();
    expect(isToday(now)).toBe(true);
    expect(isTomorrow(addDays(now, 1))).toBe(true);
    expect(isYesterday(subDays(now, 1))).toBe(true);
    expect(isTomorrow(now)).toBe(false);
  });

  it('differenceInMinutes floors partial minutes', () => {
    expect(differenceInMinutes(D(2026, 11, 10, 15, 0), D(2026, 11, 10, 14, 0))).toBe(60);
    expect(differenceInMinutes(D(2026, 11, 10, 14, 0, 30), D(2026, 11, 10, 14, 0))).toBe(0);
    expect(differenceInMinutes(D(2026, 11, 10, 14, 0), D(2026, 11, 10, 15, 0))).toBe(-60);
  });
});

describe('eachDayOfInterval', () => {
  it('walks inclusive day boundaries', () => {
    const days = eachDayOfInterval({ start: D(2026, 11, 10, 18, 0), end: D(2026, 11, 13, 9, 0) });
    expect(days.map((d) => d.getDate())).toEqual([10, 11, 12, 13]);
    expect(days.every((d) => d.getHours() === 0)).toBe(true);
  });

  it('returns an empty list for a reversed interval', () => {
    expect(eachDayOfInterval({ start: D(2026, 11, 13), end: D(2026, 11, 10) })).toEqual([]);
  });
});
