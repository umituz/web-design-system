import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { StreakBadge } from '../presentation/atoms/StreakBadge';

afterEach(cleanup);

describe('StreakBadge', () => {
  it('renders days count and default title when active', () => {
    render(<StreakBadge days={5} />);
    const badge = screen.getByTitle('5 day streak');
    expect(badge).toBeDefined();
    expect(badge.textContent).toContain('5');
    expect(badge.className).toContain('text-amber-700');
  });

  it('renders inactive styling when count is 0', () => {
    render(<StreakBadge days={0} />);
    const badge = screen.getByTitle('No streak');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('text-muted-foreground');
  });

  it('supports custom label', () => {
    render(<StreakBadge days={7} label="days streak" />);
    expect(screen.getByText('7 days streak')).toBeDefined();
  });

  it('supports size variants', () => {
    render(<StreakBadge days={3} size="sm" data-testid="small-badge" />);
    const badge = screen.getByTestId('small-badge');
    expect(badge.className).toContain('h-6');
  });

  it('allows hiding the icon', () => {
    const { container } = render(<StreakBadge days={4} showIcon={false} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});
