import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Banner } from '../presentation/molecules/Banner';

afterEach(cleanup);

describe('Banner', () => {
  it('renders title and message with default tone', () => {
    render(<Banner title="Heads up!">System update scheduled.</Banner>);
    expect(screen.getByText('Heads up!')).toBeDefined();
    expect(screen.getByText('System update scheduled.')).toBeDefined();
  });

  it('applies tone-specific styling', () => {
    render(
      <Banner tone="warning" data-testid="warning-banner">
        Watch out
      </Banner>
    );
    const banner = screen.getByTestId('warning-banner');
    expect(banner.className).toContain('border-warning/20');
  });

  it('handles dismissible behavior and onDismiss callback', () => {
    const onDismiss = vi.fn();
    render(
      <Banner dismissible onDismiss={onDismiss}>
        Dismissible notice
      </Banner>
    );
    const closeBtn = screen.getByLabelText('Dismiss banner');
    fireEvent.click(closeBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Dismissible notice')).toBeNull();
  });

  it('renders action button and handles clicks', () => {
    const onClick = vi.fn();
    render(
      <Banner action={{ label: 'Learn More', onClick }}>
        New features available.
      </Banner>
    );
    const actionBtn = screen.getByRole('button', { name: 'Learn More' });
    fireEvent.click(actionBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders action link when href is provided', () => {
    render(
      <Banner action={{ label: 'View Docs', href: '/docs' }}>
        Check documentation
      </Banner>
    );
    const link = screen.getByRole('link', { name: 'View Docs' });
    expect(link.getAttribute('href')).toBe('/docs');
  });
});
