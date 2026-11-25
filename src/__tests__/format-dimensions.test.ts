import { describe, expect, it } from 'vitest';
import { formatDimensions } from '../infrastructure/utils/format.util';

describe('formatDimensions', () => {
  it('formats 3 dimensions with unit', () => {
    expect(formatDimensions({ height: 120, width: 80, depth: 15, unit: 'cm' })).toBe('120 × 80 × 15 cm');
  });

  it('formats 2 dimensions with unit', () => {
    expect(formatDimensions({ height: 100, width: 70, unit: 'cm' })).toBe('100 × 70 cm');
  });

  it('filters out null or undefined dimensions', () => {
    expect(formatDimensions({ height: 50, width: null, depth: 25, unit: 'in' })).toBe('50 × 25 in');
  });

  it('returns empty string when all dimensions are missing', () => {
    expect(formatDimensions({ unit: 'cm' })).toBe('');
    expect(formatDimensions({})).toBe('');
  });

  it('formats without unit if unit omitted', () => {
    expect(formatDimensions({ height: 10, width: 20 })).toBe('10 × 20');
  });
});
