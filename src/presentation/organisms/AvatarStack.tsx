/**
 * AvatarStack Component (Organism)
 * @description Overlapping avatar row built on the Avatar molecule with an overflow count badge
 */

import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils';
import { Avatar } from '../molecules/Avatar';
import type { BaseProps } from '../../domain/types';
import type { ExtendedSizes } from '../../infrastructure/constants';

export interface AvatarPerson {
  id: string;
  name: string;
}

export interface AvatarStackProps extends BaseProps {
  people: AvatarPerson[];
  /** Avatars shown before the +N badge (default 4). */
  max?: number;
  size?: ExtendedSizes;
}

export const AvatarStack = forwardRef<HTMLSpanElement, AvatarStackProps>(
  ({ className, people, max = 4, size = 'xs' }, ref) => {
    const shown = people.slice(0, max);
    const rest = people.length - shown.length;
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center -space-x-2', className)}
        title={people.map((p) => p.name).join(', ')}
      >
        {shown.map((p) => (
          <Avatar key={p.id} name={p.name} size={size} />
        ))}
        {rest > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-2 ring-background">
            +{rest}
          </span>
        )}
      </span>
    );
  }
);
AvatarStack.displayName = 'AvatarStack';
