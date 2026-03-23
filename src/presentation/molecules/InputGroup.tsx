/**
 * InputGroup Component (Molecule)
 * @description Input with prefix/suffix elements
 */

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps, ChildrenProps } from '../../domain/types';
import { Input } from '../atoms/Input';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, leftElement, rightElement, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="relative"
        {...props}
      >
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftElement}
          </div>
        )}
        {children}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

InputGroup.displayName = 'InputGroup';

export const GroupedInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input> & {
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}>(
  ({ className, leftElement, rightElement, ...props }, ref) => {
    return (
      <InputGroup>
        {leftElement}
        <Input
          ref={ref}
          className={cn(
            leftElement && 'pl-10',
            rightElement && 'pr-10',
            className
          )}
          {...props}
        />
        {rightElement}
      </InputGroup>
    );
  }
);

GroupedInput.displayName = 'GroupedInput';
