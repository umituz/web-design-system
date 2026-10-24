import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { BookmarkButton } from '../presentation/molecules/BookmarkButton';
import { IconButton } from '../presentation/atoms/IconButton';

afterEach(cleanup);

describe('BookmarkButton (Molecule)', () => {
  it('renders pill variant by default with label and icon', () => {
    render(<BookmarkButton label="Save Item" activeLabel="Saved Item" />);
    const btn = screen.getByRole('button', { name: 'Save Item' });
    expect(btn).toBeDefined();
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.textContent).toContain('Save Item');
  });

  it('renders active pill variant with activeLabel and tone styling', () => {
    render(<BookmarkButton active label="Save Item" activeLabel="Saved Item" tone="warning" />);
    const btn = screen.getByRole('button', { name: 'Saved Item' });
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.textContent).toContain('Saved Item');
    expect(btn.className).toContain('text-amber-600');
  });

  it('toggles when clicked and calls onToggle with inverted boolean', () => {
    const handleToggle = vi.fn();
    const handleClick = vi.fn();
    render(<BookmarkButton active={false} onToggle={handleToggle} onClick={handleClick} label="Bookmark" />);
    const btn = screen.getByRole('button', { name: 'Bookmark' });
    fireEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(true);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle(false) when currently active', () => {
    const handleToggle = vi.fn();
    render(<BookmarkButton active onToggle={handleToggle} label="Bookmark" />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledWith(false);
  });

  it('renders icon variant with accessible aria-label and title', () => {
    render(<BookmarkButton variant="icon" active label="Save Phrase" activeLabel="Phrase Saved" tone="primary" />);
    const btn = screen.getByRole('button', { name: 'Phrase Saved' });
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('title')).toBe('Phrase Saved');
    expect(btn.className).toContain('text-primary');
  });

  it('does not fire onToggle when disabled or loading', () => {
    const handleToggle = vi.fn();
    const { rerender } = render(<BookmarkButton disabled onToggle={handleToggle} label="Save" />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleToggle).not.toHaveBeenCalled();

    rerender(<BookmarkButton loading onToggle={handleToggle} label="Save" />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('renders custom icons for inactive and active states', () => {
    render(
      <BookmarkButton
        active
        icon={<span data-testid="custom-inactive">In</span>}
        activeIcon={<span data-testid="custom-active">Ac</span>}
        label="Custom"
      />
    );
    expect(screen.getByTestId('custom-active')).toBeDefined();
    expect(screen.queryByTestId('custom-inactive')).toBeNull();
  });
});

describe('IconButton (Atom) active state', () => {
  it('supports active boolean with aria-pressed and data-state', () => {
    render(<IconButton icon={<span>X</span>} label="Close" active variant="ghost" />);
    const btn = screen.getByRole('button', { name: 'Close' });
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('data-state')).toBe('on');
    expect(btn.className).toContain('bg-accent');
  });
});
