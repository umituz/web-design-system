import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '../infrastructure/utils';

describe('getErrorMessage', () => {
  it('returns the message of an Error instance', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('stringifies non-Error throws', () => {
    expect(getErrorMessage('nope')).toBe('nope');
    expect(getErrorMessage(42)).toBe('42');
  });

  it('handles null and undefined without throwing', () => {
    expect(getErrorMessage(null)).toBe('null');
    expect(getErrorMessage(undefined)).toBe('undefined');
  });
});
