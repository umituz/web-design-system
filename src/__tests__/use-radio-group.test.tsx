import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { useRadioGroup } from '../presentation/hooks/useRadioGroup';

afterEach(cleanup);

const MODES = ['off', 'dark', 'light'] as const;

function ModePicker({ onChangeSpy }: { onChangeSpy?: (next: string) => void }) {
  const [value, setValue] = useState<string>('off');
  const { groupProps, optionProps } = useRadioGroup(value, MODES, (next) => {
    setValue(next);
    onChangeSpy?.(next);
  });

  return (
    <div {...groupProps}>
      {MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => setValue(mode)}
          aria-label={mode}
          {...optionProps(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

function setup(onChangeSpy?: (next: string) => void) {
  render(<ModePicker onChangeSpy={onChangeSpy} />);
  return userEvent.setup();
}

describe('useRadioGroup', () => {
  it('exposes exactly one tabbable option — the checked one', () => {
    setup();

    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(3);
    const tabbable = options.filter((option) => option.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]?.getAttribute('aria-checked')).toBe('true');
  });

  it('moves selection and focus with arrow keys', async () => {
    const user = setup();

    const off = screen.getByRole('radio', { name: 'off' });
    const dark = screen.getByRole('radio', { name: 'dark' });
    off.focus();

    await user.keyboard('{ArrowRight}');
    expect(dark.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(dark);

    await user.keyboard('{ArrowLeft}');
    expect(off.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(off);
  });

  it('supports Home and End jumps and wraps at the edges', async () => {
    const user = setup();

    const off = screen.getByRole('radio', { name: 'off' });
    const light = screen.getByRole('radio', { name: 'light' });
    off.focus();

    await user.keyboard('{End}');
    expect(light.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(light);

    await user.keyboard('{ArrowDown}');
    expect(off.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(off);
  });

  it('reports selection through onChange', async () => {
    const onChangeSpy = vi.fn();
    const user = setup(onChangeSpy);

    screen.getByRole('radio', { name: 'off' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onChangeSpy).toHaveBeenCalledWith('dark');
  });

  it('leaves unrelated keys untouched', async () => {
    const user = setup();

    const off = screen.getByRole('radio', { name: 'off' });
    off.focus();
    await user.keyboard('{Enter}');
    expect(off.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(off);
  });
});
