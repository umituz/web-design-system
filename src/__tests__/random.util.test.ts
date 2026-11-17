import { describe, expect, it } from 'vitest';
import { hashSeed } from '../infrastructure/utils/hash.util';
import { pick, seededRandom } from '../infrastructure/utils/random.util';
import { sum, sumBy } from '../infrastructure/utils/calculation.utils';
import { formatDate, formatDateRange } from '../infrastructure/utils';

describe('seededRandom', () => {
  it('returns the same sequence for the same seed', () => {
    const first = seededRandom('palette-7');
    const second = seededRandom('palette-7');
    const a = [first(), first(), first()];
    const b = [second(), second(), second()];
    expect(a).toEqual(b);
  });

  it('differs across seeds and stays in [0, 1)', () => {
    const a = seededRandom('one');
    const b = seededRandom('two');
    expect(a()).not.toBe(b());
    for (let i = 0; i < 50; i += 1) {
      const value = a();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('derives from the shared hash seed', () => {
    expect(hashSeed('stable')).toBe(hashSeed('stable'));
    expect(hashSeed('stable')).not.toBe(hashSeed('unstable'));
  });
});

describe('pick', () => {
  it('returns a member of the items', () => {
    const rng = seededRandom('pick-seed');
    const items = ['a', 'b', 'c', 'd'] as const;
    for (let i = 0; i < 20; i += 1) {
      expect(items).toContain(pick(rng, items));
    }
  });

  it('picks deterministically for a seed', () => {
    expect(pick(seededRandom('s'), [10, 20, 30])).toBe(pick(seededRandom('s'), [10, 20, 30]));
  });
});

describe('sum and sumBy', () => {
  it('adds plain numbers', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(sum([])).toBe(0);
  });

  it('adds by selector', () => {
    expect(sumBy([{ v: 2 }, { v: 3 }], (item) => item.v)).toBe(5);
    expect(sumBy([] as Array<{ v: number }>, (item) => item.v)).toBe(0);
  });
});

describe('formatDateRange', () => {
  it('joins two medium dates with an en dash', () => {
    expect(formatDateRange('2026-03-01', '2026-03-08')).toBe('Mar 1, 2026 – Mar 8, 2026');
  });

  it('honors locale and style', () => {
    expect(formatDateRange('2026-03-01', '2026-03-08', 'de')).toContain('März');
    expect(formatDateRange('2026-03-01', '2026-03-08', 'en', 'monthYear')).toBe('Mar 2026 – Mar 2026');
  });

  it('supports day-none granularity for weekday-only labels', () => {
    expect(formatDate('2026-03-10', 'long', { day: 'none', month: 'none', year: 'none' })).toBe(
      'Tuesday',
    );
    expect(formatDate('2026-03-10', 'short', { weekday: 'short', month: 'none', year: 'none', day: 'none' })).toBe(
      'Tue',
    );
  });
});
