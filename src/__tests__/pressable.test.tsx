import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { Pressable } from '../presentation/atoms/Pressable';

afterEach(cleanup);

describe('Pressable', () => {
  it('renders a div with role=button and keyboard focus', () => {
    const { container } = render(<Pressable onClick={() => {}}>Card</Pressable>);
    const element = container.firstElementChild as HTMLElement;
    expect(element.tagName).toBe('DIV');
    expect(element.getAttribute('role')).toBe('button');
    expect(element.getAttribute('tabIndex')).toBe('0');
  });

  it('fires onClick from Enter', () => {
    const onClick = vi.fn();
    const { container } = render(<Pressable onClick={onClick}>Card</Pressable>);
    fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick from Space and prevents the page-scroll default', () => {
    const onClick = vi.fn();
    const seen: boolean[] = [];
    const listener = (e: Event) => seen.push(e.defaultPrevented);
    document.addEventListener('keydown', listener);
    const { container } = render(<Pressable onClick={onClick}>Card</Pressable>);
    fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: ' ' });
    document.removeEventListener('keydown', listener);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(seen[0]).toBe(true);
  });

  it('fires onClick on plain click', () => {
    const onClick = vi.fn();
    const { container } = render(<Pressable onClick={onClick}>Card</Pressable>);
    fireEvent.click(container.firstElementChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores activation keys when disabled and drops out of tab order', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Pressable onClick={onClick} disabled>
        Card
      </Pressable>,
    );
    const element = container.firstElementChild as HTMLElement;
    expect(element.getAttribute('tabIndex')).toBe('-1');
    expect(element.getAttribute('aria-disabled')).toBe('true');
    fireEvent.keyDown(element, { key: 'Enter' });
    fireEvent.click(element);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not swallow a consumer key the consumer already handled', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Pressable onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
        Card
      </Pressable>,
    );
    fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps className and forwards arbitrary attributes like title', () => {
    const { container } = render(
      <Pressable onClick={() => {}} className="card" title="Open">
        Card
      </Pressable>,
    );
    const element = container.firstElementChild as HTMLElement;
    expect(element.className).toBe('card');
    expect(element.getAttribute('title')).toBe('Open');
  });

  it('lets an inner interactive element keep its own activation keys', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Pressable onClick={onClick}>
        Card <button type="button">Inner</button>
      </Pressable>,
    );
    const inner = container.querySelector('button') as HTMLElement;
    fireEvent.keyDown(inner, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
  });
});
