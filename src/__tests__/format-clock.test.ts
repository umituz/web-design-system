import { describe, expect, it } from 'vitest';
import { formatClock } from '../infrastructure/utils/time.util';

describe('formatClock', () => {
  it('formats seconds as m:ss with padded seconds', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(9)).toBe('0:09');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(600)).toBe('10:00');
    expect(formatClock(3661)).toBe('61:01');
  });

  it('zero-pads minutes when padMinutes is set', () => {
    expect(formatClock(0, true)).toBe('00:00');
    expect(formatClock(65, true)).toBe('01:05');
    expect(formatClock(600, true)).toBe('10:00');
  });

  it('clamps invalid and negative input to a zero clock', () => {
    expect(formatClock(-5)).toBe('0:00');
    expect(formatClock(Number.NaN)).toBe('0:00');
    expect(formatClock(Number.POSITIVE_INFINITY)).toBe('0:00');
    expect(formatClock(-1, true)).toBe('00:00');
  });
});
