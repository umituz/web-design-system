import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Countdown } from '../presentation/molecules/Countdown';
import { formatCountdown } from '../infrastructure/utils/time.util';

describe('formatCountdown', () => {
  it('formats remaining ms to compact string', () => {
    expect(formatCountdown(0)).toBe('0:00');
    expect(formatCountdown(-100)).toBe('0:00');
    expect(formatCountdown(45 * 1000)).toBe('0:45');
    expect(formatCountdown(125 * 1000)).toBe('2:05');
    expect(formatCountdown(3665 * 1000)).toBe('1:01:05');
    expect(formatCountdown((86400 * 2 + 3600 * 4) * 1000)).toBe('2d 4h');
  });
});

describe('Countdown molecule', () => {
  it('renders countdown and updates when time changes', () => {
    const target = Date.now() + 5000;
    render(<Countdown target={target} />);
    expect(screen.getByText(/0:0[45]/)).toBeTruthy();
  });

  it('renders closed label when ended', () => {
    const target = Date.now() - 5000;
    render(<Countdown target={target} endedLabel="Sale ended" />);
    expect(screen.getByText('Sale ended')).toBeTruthy();
  });
});
