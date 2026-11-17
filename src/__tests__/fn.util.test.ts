import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from '../infrastructure/utils/fn.util';

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
