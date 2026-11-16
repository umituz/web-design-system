import { describe, expect, it } from 'vitest';
import { formatUntil } from '../infrastructure/utils';

const now = new Date('2026-11-16T12:00:00Z');
const at = (offsetSeconds: number) => new Date(now.getTime() + offsetSeconds * 1000).toISOString();

describe('formatUntil', () => {
  it('renders the shared 60s window as just now', () => {
    expect(formatUntil(at(30), { now })).toBe('just now');
    expect(formatUntil(at(-30), { now })).toBe('just now');
  });

  it('renders upcoming minutes, hours and days', () => {
    expect(formatUntil(at(5 * 60), { now })).toBe('in 5m');
    expect(formatUntil(at(3 * 3600), { now })).toBe('in 3h');
    expect(formatUntil(at(2 * 86400), { now })).toBe('in 2d');
  });

  it('falls back to a month-day stamp beyond a week out', () => {
    expect(formatUntil('2026-12-25T12:00:00Z', { now, locale: 'en-US' })).toBe('Dec 25');
  });

  it('delegates the past to compact timeAgo', () => {
    expect(formatUntil(at(-5 * 60), { now })).toBe('5m ago');
    expect(formatUntil(at(-3 * 3600), { now })).toBe('3h ago');
  });
});
