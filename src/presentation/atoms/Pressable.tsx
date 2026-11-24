import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { BaseProps } from '../../domain/types';

export interface PressableProps extends BaseProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const isActivationKey = (key: string) => key === 'Enter' || key === ' ';

/** A non-`<button>` clickable surface (cards, rows, tiles) that stays keyboard
 *  operable: role="button" + tabIndex with BOTH activation keys forwarded to
 *  onClick, so consumers never hand-roll an Enter-only onKeyDown again. */
export const Pressable = ({ children, className, onClick, disabled = false, onKeyDown, ...rest }: PressableProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented) return;
    /* IME composition (CJK input): Enter/Space are committing text, not
     * activating the surface. */
    if (event.nativeEvent.isComposing) return;
    /* Focus sitting on an inner interactive element (button, link) means that
     * element owns its activation keys — triggering ours would both navigate
     * twice and preventDefault away the inner element's native click. */
    if (event.target !== event.currentTarget) return;
    if (isActivationKey(event.key)) {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      className={className}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
};

Pressable.displayName = 'Pressable';
