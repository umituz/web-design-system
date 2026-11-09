import { describe, expect, it } from 'vitest';
import { timeAgo } from '../infrastructure/utils';

const now = new Date('2026-11-09T12:00:00Z');
const at = (offsetSeconds: number) => new Date(now.getTime() + offsetSeconds * 1000);

describe('timeAgo', () => {
  it('returns now inside the 45s window', () => {
    expect(timeAgo(at(-20), { now })).toBe('now');
    expect(timeAgo(at(10), { now })).toBe('now');
  });

  it('formats past minutes and hours', () => {
    expect(timeAgo(at(-5 * 60), { now })).toBe('5 minutes ago');
    expect(timeAgo(at(-3 * 3600), { now })).toBe('3 hours ago');
  });

  it('uses auto numerics for single units', () => {
    expect(timeAgo(at(-86400), { now })).toBe('yesterday');
    expect(timeAgo(at(86400), { now })).toBe('tomorrow');
  });

  it('formats days and weeks', () => {
    expect(timeAgo(at(-4 * 86400), { now })).toBe('4 days ago');
    expect(timeAgo(at(-14 * 86400), { now })).toBe('2 weeks ago');
  });

  it('caps into months and years', () => {
    expect(timeAgo(at(-70 * 86400), { now })).toBe('2 months ago');
    expect(timeAgo(at(-800 * 86400), { now })).toBe('2 years ago');
  });

  it('compacts with narrow style', () => {
    expect(timeAgo(at(-3 * 3600), { now, compact: true })).toBe('3h ago');
  });

  it('accepts iso strings and timestamps', () => {
    expect(timeAgo('2026-11-09T11:00:00Z', { now })).toBe('1 hour ago');
    expect(timeAgo(now.getTime() - 7200_000, { now })).toBe('2 hours ago');
  });
});
