/**
 * cn utility — class merging contract (clsx + tailwind-merge).
 */

import { describe, expect, it } from 'vitest';
import { cn } from '../infrastructure/utils';

describe('cn', () => {
  it('joins truthy classes and skips falsy values', () => {
    expect(cn('a', false, undefined, 'b', null)).toBe('a b');
  });

  it('merges conflicting Tailwind utilities (last wins)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('resolves conflicting semantic color utilities', () => {
    expect(cn('bg-primary', 'bg-destructive')).toBe('bg-destructive');
  });

  it('supports conditional objects and arrays', () => {
    expect(cn(['mt-2'], { hidden: false, 'font-bold': true })).toBe('mt-2 font-bold');
  });
});
