import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router';
import { Badge } from '../presentation/atoms/Badge';

afterEach(cleanup);

describe('Badge console chip (size xs, variant surface)', () => {
  it('applies the fixed-height xs chip metrics', () => {
    render(<Badge variant="surface" size="xs">12 workers</Badge>);
    const badge = screen.getByText('12 workers');
    expect(badge.className).toContain('h-6');
    expect(badge.className).toContain('px-[9px]');
    expect(badge.className).toContain('gap-[5px]');
    expect(badge.className).toContain('text-[11.5px]');
    expect(badge.className).toContain('whitespace-nowrap');
  });

  it('surface variant stays a quiet card-surface chip', () => {
    render(<Badge variant="surface" size="xs">RIV</Badge>);
    const badge = screen.getByText('RIV');
    expect(badge.className).toContain('bg-card');
    expect(badge.className).toContain('text-secondary-foreground');
    expect(badge.className).toContain('border-input');
    // must not pick up the loud filled defaults
    expect(badge.className).not.toContain('bg-primary');
  });

  it('keeps sm/md/lg sizes untouched', () => {
    render(<Badge variant="neutral">Default</Badge>);
    expect(screen.getByText('Default').className).toContain('text-sm');
    expect(screen.getByText('Default').className).not.toContain('h-6');
  });

  it('renders as its child element with asChild', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge asChild variant="surface" size="xs">
          <Link to="/projects">Harbor Point</Link>
        </Badge>
      </MemoryRouter>
    );
    expect(container.querySelector('div')).toBeNull();
    const link = screen.getByRole('link', { name: 'Harbor Point' }) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/projects');
    expect(link.className).toContain('h-6');
    expect(link.className).toContain('bg-card');
  });

  it('lets className override chip metrics for tighter variants', () => {
    render(
      <Badge variant="surface" size="xs" className="text-[11px] text-muted-foreground">
        v2.1
      </Badge>
    );
    const badge = screen.getByText('v2.1');
    expect(badge.className).toContain('text-[11px]');
    expect(badge.className).not.toContain('text-[11.5px]');
    expect(badge.className).toContain('text-muted-foreground');
  });
});
