import { describe, expect, it } from 'vitest';
import { uniqueId, randomUUID, isValidUUID } from '../infrastructure/utils';

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

describe('randomUUID', () => {
  it('returns RFC 4122 shaped ids', () => {
    expect(isValidUUID(randomUUID())).toBe(true);
  });

  it('never collides within a burst of calls', () => {
    const ids = new Set(Array.from({ length: 500 }, () => randomUUID()));
    expect(ids.size).toBe(500);
  });
});

describe('isValidUUID', () => {
  it('accepts valid v4 ids and rejects malformed input', () => {
    expect(isValidUUID('3f2504e0-4f89-41d3-9a0c-0305e82c3301')).toBe(true);
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID('3f2504e0-4f89-41d3-9a0c-0305e82c330')).toBe(false);
    expect(isValidUUID('3f2504e04f8941d39a0c0305e82c3301')).toBe(false);
  });
});

