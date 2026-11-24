import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce, parseNumber } from '../infrastructure/utils/fn.util';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays the call until the wait elapses', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced('x');
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('x');
  });

  it('collapses rapid calls into the last one', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced(1);
    vi.advanceTimersByTime(50);
    debounced(2);
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it('defaults to 250ms', () => {
    const fn = vi.fn();
    const debounced = debounce(fn);
    debounced();
    vi.advanceTimersByTime(249);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('parseNumber', () => {
  it('parses numeric strings and passes numbers through', () => {
    expect(parseNumber('42')).toBe(42);
    expect(parseNumber(' 7.5 ')).toBe(7.5);
    expect(parseNumber(-3)).toBe(-3);
  });

  it('falls back instead of returning NaN for empty or garbage input', () => {
    expect(parseNumber('')).toBe(0);
    expect(parseNumber('abc')).toBe(0);
    expect(parseNumber(null)).toBe(0);
    expect(parseNumber(undefined)).toBe(0);
    expect(parseNumber('x', { fallback: 5 })).toBe(5);
  });

  it('clamps into [min, max] when given', () => {
    expect(parseNumber('15', { min: 0, max: 10 })).toBe(10);
    expect(parseNumber('-4', { min: 0, max: 10 })).toBe(0);
    expect(parseNumber('5', { min: 0, max: 10 })).toBe(5);
    expect(parseNumber('', { min: 1, fallback: 0 })).toBe(1);
  });
});
