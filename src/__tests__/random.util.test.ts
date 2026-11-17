import { describe, expect, it } from 'vitest';
import { hashSeed } from '../infrastructure/utils/hash.util';
import { pick, pickWeighted, randInt, seededRandom } from '../infrastructure/utils/random.util';
import { sum, sumBy } from '../infrastructure/utils/calculation.utils';
import { percentOf } from '../infrastructure/utils/calculation.utils';
import { daysBetweenKeys } from '../infrastructure/utils/day-key.util';
import { formatDate, formatDateRange, formatPercent, fullNameOf, humanize, pluralize, titleCase } from '../infrastructure/utils';
import { avg, round, weekStartKey } from '../infrastructure/utils';

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

describe('randInt', () => {
  it('stays within the inclusive range', () => {
    const rng = seededRandom('rand-int');
    for (let i = 0; i < 50; i += 1) {
      const value = randInt(rng, 2, 5);
      expect(value).toBeGreaterThanOrEqual(2);
      expect(value).toBeLessThanOrEqual(5);
    }
  });

  it('is deterministic for a seed', () => {
    expect(randInt(seededRandom('r'), 0, 100)).toBe(randInt(seededRandom('r'), 0, 100));
  });

  it('covers the whole range', () => {
    const rng = seededRandom('cover');
    const seen = new Set<number>();
    for (let i = 0; i < 200; i += 1) seen.add(randInt(rng, 1, 3));
    expect(seen).toEqual(new Set([1, 2, 3]));
  });
});

describe('pickWeighted', () => {
  it('returns a key of the weights record', () => {
    const rng = seededRandom('weighted');
    for (let i = 0; i < 30; i += 1) {
      expect(['a', 'b', 'c']).toContain(pickWeighted(rng, { a: 2, b: 3, c: 5 }));
    }
  });

  it('is deterministic for a seed', () => {
    expect(pickWeighted(seededRandom('w'), { a: 1, b: 9 })).toBe(pickWeighted(seededRandom('w'), { a: 1, b: 9 }));
  });

  it('scales with weight', () => {
    const rng = seededRandom('skew');
    let heavy = 0;
    for (let i = 0; i < 400; i += 1) {
      if (pickWeighted(rng, { light: 1, heavy: 9 }) === 'heavy') heavy += 1;
    }
    expect(heavy).toBeGreaterThan(280);
  });
});

describe('titleCase and humanize', () => {
  it('capitalizes every dash-, space- or underscore-separated word', () => {
    expect(titleCase('story-boards')).toBe('Story Boards');
    expect(titleCase('  draft   notes ')).toBe('Draft Notes');
    expect(titleCase('lesson_plan')).toBe('Lesson Plan');
  });

  it('humanize capitalizes only the first letter of a slug', () => {
    expect(humanize('chapter-notes')).toBe('Chapter notes');
    expect(humanize('draft_notes')).toBe('Draft notes');
    expect(humanize('single')).toBe('Single');
  });
});

describe('pluralize, formatPercent, avg, round, weekStartKey', () => {
  it('pluralizes count words', () => {
    expect(pluralize(1, 'seat')).toBe('1 seat');
    expect(pluralize(3, 'seat')).toBe('3 seats');
    expect(pluralize(0, 'person', 'people')).toBe('0 people');
  });

  it('formats percent with fraction digits', () => {
    expect(formatPercent(0.25, 'en-US')).toBe('25%');
    expect(formatPercent(0.2553, 'en-US', { fractionDigits: 1 })).toBe('25.5%');
  });

  it('averages and guards empty input', () => {
    expect(avg([2, 4, 6])).toBe(4);
    expect(avg([])).toBe(0);
  });

  it('rounds to decimals', () => {
    expect(round(2.567, 2)).toBe(2.57);
    expect(round(2.567)).toBe(3);
  });

  it('returns the monday of the week', () => {
    expect(weekStartKey('2026-03-11')).toBe('2026-03-09');
    expect(weekStartKey('2026-03-09')).toBe('2026-03-09');
    expect(weekStartKey('2026-03-15')).toBe('2026-03-09');
  });
});

describe('fullNameOf', () => {
  it('joins first and last name', () => {
    expect(fullNameOf({ firstName: 'Ada', lastName: 'Lovelace' })).toBe('Ada Lovelace');
  });

  it('falls back to the first name when last is missing or empty', () => {
    expect(fullNameOf({ firstName: 'Ada' })).toBe('Ada');
    expect(fullNameOf({ firstName: 'Ada', lastName: undefined })).toBe('Ada');
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

describe('percentOf and daysBetweenKeys', () => {
  it('rounds the ratio and guards zero whole', () => {
    expect(percentOf(1, 4)).toBe(25);
    expect(percentOf(2, 3)).toBe(67);
    expect(percentOf(0, 0)).toBe(0);
  });

  it('counts signed days between two day keys', () => {
    expect(daysBetweenKeys('2026-03-01', '2026-03-08')).toBe(7);
    expect(daysBetweenKeys('2026-03-08', '2026-03-01')).toBe(-7);
    expect(daysBetweenKeys('2026-02-28', '2026-03-01')).toBe(1);
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
