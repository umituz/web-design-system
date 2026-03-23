/**
 * RadioGroup Component (Molecule)
 * @description Group of radio buttons
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps } from '../../domain/types';
import { Radio } from '../atoms/Radio';
import { Text } from '../atoms/Text';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>, BaseProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
}

const orientationStyles: Record<'vertical' | 'horizontal', string> = {
  vertical: 'flex-col gap-3',
  horizontal: 'flex-row gap-6',
};

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, name, options, value, onChange, orientation = 'vertical', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn('flex', orientationStyles[orientation], className)}
        {...props}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Radio
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => !option.disabled && onChange?.(option.value)}
              disabled={option.disabled}
            />
            <Text size="sm">{option.label}</Text>
          </label>
        ))}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
