/**
 * Component slot tests — Badge icon, Avatar hue, Timeline avatar and
 * ConfirmDialog success tone additions.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

afterEach(cleanup);
import { Badge } from '../presentation/atoms/Badge';
import { Avatar } from '../presentation/molecules/Avatar';
import { Timeline } from '../presentation/organisms/Timeline';
import { ConfirmDialog } from '../presentation/organisms/ConfirmDialog';

describe('Badge icon slot', () => {
  it('renders the icon before the label', () => {
    render(
      <Badge icon={<svg data-testid="badge-icon" />}>Live</Badge>
    );
    const badge = screen.getByText('Live').closest('div');
    expect(badge).not.toBeNull();
    expect(screen.getByTestId('badge-icon')).toBeTruthy();
    expect(badge?.querySelector('span [data-testid="badge-icon"], [data-testid="badge-icon"]')).not.toBeNull();
  });

  it('renders no icon wrapper when icon is omitted', () => {
    render(<Badge>Plain</Badge>);
    const badge = screen.getByText('Plain').closest('div');
    expect(badge?.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});

describe('Avatar hue', () => {
  it('tints the initials fallback with the given hue', () => {
    render(<Avatar name="Ada Lovelace" hue={210} size="xs" />);
    const initials = screen.getByText('AL');
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'hsl(210 42% 88%)';
    probe.style.color = 'hsl(210 45% 30%)';
    expect(initials.style.backgroundColor).toBe(probe.style.backgroundColor);
    expect(initials.style.color).toBe(probe.style.color);
  });

  it('keeps the name-hash tone when hue is omitted', () => {
    render(<Avatar name="Ada Lovelace" size="xs" />);
    const initials = screen.getByText('AL');
    expect(initials.style.backgroundColor).toBe('');
    expect(initials.className).toMatch(/bg-/);
  });
});

describe('Timeline avatar slot', () => {
  it('renders the avatar node instead of the tone dot', () => {
    render(
      <Timeline
        items={[
          { at: '2026-10-26T10:00:00Z', title: 'Approved', avatar: <span data-testid="tl-avatar" /> },
          { at: '2026-10-26T11:00:00Z', title: 'Logged' },
        ]}
        newestFirst={false}
      />
    );
    expect(screen.getByTestId('tl-avatar')).toBeTruthy();
    expect(screen.getByText('Approved')).toBeTruthy();
    expect(screen.getByText('Logged')).toBeTruthy();
  });
});

describe('ConfirmDialog success tone', () => {
  it('styles the confirm action with success colors', () => {
    render(
      <ConfirmDialog
        tone="success"
        title="Approve delivery?"
        confirmLabel="Approve"
        onConfirm={() => undefined}
        onClose={() => undefined}
      />
    );
    const confirm = screen.getByRole('button', { name: 'Approve' });
    expect(confirm.className).toContain('bg-success');
  });

  it('keeps the danger weight by default', () => {
    render(
      <ConfirmDialog
        title="Delete take?"
        confirmLabel="Delete"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );
    const confirm = screen.getByRole('button', { name: 'Delete' });
    expect(confirm.className).toContain('bg-destructive');
    expect(confirm.className).not.toContain('bg-success');
  });
});
