import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Avatar } from '../presentation/molecules/Avatar';
import { LiveBadge } from '../presentation/atoms/LiveBadge';
import { ViewerCount } from '../presentation/atoms/ViewerCount';
import { CountBadge } from '../presentation/atoms/CountBadge';
import { SkeletonCardGrid } from '../presentation/organisms/SkeletonCardGrid';

afterEach(cleanup);

describe('Avatar verified/live affordances', () => {
  it('renders initials from the name', () => {
    render(<Avatar name="Kemal Sunal" />);
    expect(screen.getByText('KS')).toBeTruthy();
  });

  it('shows the verified badge only when requested', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);
    expect(document.querySelector('svg')).toBeNull();
    rerender(<Avatar name="Ada Lovelace" verified />);
    expect(document.querySelector('svg')).not.toBeNull();
  });

  it('applies the live ring class only when live', () => {
    const { container, rerender } = render(<Avatar name="Ada Lovelace" />);
    const first = container.firstElementChild as HTMLElement;
    expect(first.className).not.toContain('ring-2');
    rerender(<Avatar name="Ada Lovelace" live />);
    const live = container.firstElementChild as HTMLElement;
    expect(live.className).toContain('ring-2');
  });
});

describe('LiveBadge', () => {
  it('renders the default label', () => {
    render(<LiveBadge />);
    expect(screen.getByText('Live')).toBeTruthy();
  });

  it('accepts a custom label', () => {
    render(<LiveBadge label="Aktif" />);
    expect(screen.getByText('Aktif')).toBeTruthy();
  });
});

describe('ViewerCount', () => {
  it('renders the compact count with a full-count label', () => {
    render(<ViewerCount count={5400} />);
    expect(screen.getByText('5.4K')).toBeTruthy();
    expect(screen.getByLabelText('5,400 watching')).toBeTruthy();
  });
});

describe('CountBadge', () => {
  it('renders nothing for zero', () => {
    const { container } = render(<CountBadge count={0} />);
    expect(container.firstElementChild).toBeNull();
  });

  it('caps the count', () => {
    render(<CountBadge count={42} />);
    expect(screen.getByText('9+')).toBeTruthy();
    expect(screen.getByLabelText('42 unread')).toBeTruthy();
  });

  it('supports a custom cap', () => {
    render(<CountBadge count={150} cap={99} />);
    expect(screen.getByText('99+')).toBeTruthy();
  });
});

describe('SkeletonCardGrid', () => {
  it('renders the requested number of card skeletons', () => {
    const { container } = render(<SkeletonCardGrid count={3} />);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('minmax(260px, 1fr)');
    expect(grid.children).toHaveLength(3);
  });
});
