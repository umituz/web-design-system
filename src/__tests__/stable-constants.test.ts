import { describe, expect, it } from 'vitest';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../infrastructure/constants/component.constants';

describe('stable empty constants', () => {
  it('are frozen against mutation', () => {
    expect(Object.isFrozen(EMPTY_ARRAY)).toBe(true);
    expect(Object.isFrozen(EMPTY_OBJECT)).toBe(true);
  });

  it('hold no items', () => {
    expect(EMPTY_ARRAY).toHaveLength(0);
    expect(Object.keys(EMPTY_OBJECT)).toHaveLength(0);
  });

  it('default-prop shape: two reads are the same reference', () => {
    const a = EMPTY_ARRAY as readonly unknown[];
    const b = EMPTY_ARRAY as readonly unknown[];
    expect(a).toBe(b);
  });
});
