import { describe, expect, it } from 'vitest';
import { uniqueId } from '../infrastructure/utils';

describe('uniqueId', () => {
  it('prefixes every id', () => {
    expect(uniqueId('note').startsWith('note-')).toBe(true);
  });

  it('never collides within a burst of calls', () => {
    const ids = new Set(Array.from({ length: 500 }, () => uniqueId('x')));
    expect(ids.size).toBe(500);
  });

  it('keeps the base36 shape', () => {
    expect(uniqueId('a')).toMatch(/^a-[0-9a-z]+-[0-9a-z]{2,7}$/);
  });
});
