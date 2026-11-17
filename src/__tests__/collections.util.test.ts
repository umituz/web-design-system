import { describe, expect, it } from 'vitest';
import { groupBy, groupByRecord, moveItem, replaceWhere, sortBy, unique } from '../infrastructure/utils/collections.util';

describe('unique', () => {
  it('removes duplicate primitives', () => {
    expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });

  it('keeps object identity', () => {
    const a = { id: 1 };
    const b = { id: 1 };
    expect(unique([a, b, a])).toEqual([a, b]);
  });

  it('returns a new array', () => {
    const input = [1, 1];
    const output = unique(input);
    expect(output).not.toBe(input);
  });
});

describe('groupBy', () => {
  it('buckets items into a Map preserving order', () => {
    const items = [
      { type: 'a', n: 1 },
      { type: 'b', n: 2 },
      { type: 'a', n: 3 },
    ];
    const grouped = groupBy(items, (item) => item.type);
    expect([...grouped.keys()]).toEqual(['a', 'b']);
    expect(grouped.get('a')).toEqual([
      { type: 'a', n: 1 },
      { type: 'a', n: 3 },
    ]);
    expect(grouped.get('b')).toEqual([{ type: 'b', n: 2 }]);
  });

  it('does not mutate the input', () => {
    const items = [{ k: 1 }];
    groupBy(items, (item) => item.k);
    expect(items).toEqual([{ k: 1 }]);
  });
});

describe('groupByRecord', () => {
  it('builds a record keyed by string', () => {
    const grouped = groupByRecord(
      ['apple', 'avocado', 'banana'],
      (fruit) => fruit.charAt(0),
    );
    expect(grouped).toEqual({ a: ['apple', 'avocado'], b: ['banana'] });
  });
});

describe('moveItem', () => {
  it('moves an item forward', () => {
    expect(moveItem(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('moves an item backward', () => {
    expect(moveItem(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('returns a copy for out-of-range or no-op moves', () => {
    const input = ['a', 'b'];
    expect(moveItem(input, -1, 0)).toEqual(['a', 'b']);
    expect(moveItem(input, 0, 0)).toEqual(['a', 'b']);
    expect(moveItem(input, 0, 5)).toEqual(['a', 'b']);
    expect(moveItem(input, 0, 1)).not.toBe(input);
  });
});

describe('replaceWhere', () => {
  it('replaces only matching items', () => {
    expect(
      replaceWhere(
        [1, 2, 3, 4],
        (n) => n % 2 === 0,
        (n) => n * 10,
      ),
    ).toEqual([1, 20, 3, 40]);
  });
});

describe('sortBy', () => {
  it('sorts by numeric key in both directions without mutating the input', () => {
    const input = [{ n: 3 }, { n: 1 }, { n: 2 }];
    expect(sortBy(input, (item) => item.n).map((item) => item.n)).toEqual([1, 2, 3]);
    expect(sortBy(input, (item) => item.n, 'desc').map((item) => item.n)).toEqual([3, 2, 1]);
    expect(input.map((item) => item.n)).toEqual([3, 1, 2]);
  });

  it('compares string keys with localeCompare', () => {
    expect(sortBy(['b', 'a', 'c'], (item) => item)).toEqual(['a', 'b', 'c']);
  });
});
