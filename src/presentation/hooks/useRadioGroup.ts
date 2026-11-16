import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';

export function useRadioGroup<T>(
  value: T,
  values: readonly T[],
  onChange: (next: T) => void,
) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const current = values.indexOf(value);
      let next: number;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          next = (current + 1) % values.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          next = (current - 1 + values.length) % values.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = values.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      const options = event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]');
      options[next]?.focus();
      const nextValue = values[next];
      if (nextValue !== undefined && nextValue !== value) onChange(nextValue);
    },
    [value, values, onChange],
  );

  const optionProps = useCallback(
    (optionValue: T) => ({
      role: 'radio' as const,
      'aria-checked': optionValue === value,
      tabIndex: optionValue === value ? 0 : -1,
    }),
    [value],
  );

  return { groupProps: { role: 'radiogroup' as const, onKeyDown }, optionProps };
}
