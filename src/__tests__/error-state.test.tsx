import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ErrorState } from '../presentation/organisms/ErrorState';

afterEach(cleanup);

describe('ErrorState', () => {
  it('renders an alert with title, description and the default icon', () => {
    const { container } = render(<ErrorState title="Could not load" description="Try again in a moment." />);
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Could not load')).toBeDefined();
    expect(screen.getByText('Try again in a moment.')).toBeDefined();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('fires the retry and back actions', () => {
    const onRetry = vi.fn();
    const onBack = vi.fn();
    render(<ErrorState title="Failed" onRetry={onRetry} onBack={onBack} backLabel="Return" />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    fireEvent.click(screen.getByRole('button', { name: 'Return' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders no buttons when no action is wired', () => {
    render(<ErrorState title="Failed" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
