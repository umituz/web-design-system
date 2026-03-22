/**
 * CheckboxGroup Component (Molecule)
 * @description Group of checkboxes
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Checkbox } from '../atoms/Checkbox';
import { Text } from '../atoms/Text';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>, BaseProps {
  options: CheckboxOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
}

const orientationStyles: Record<'vertical' | 'horizontal', string> = {
  vertical: 'flex-col gap-3',
  horizontal: 'flex-row gap-6',
};

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, options, value = [], onChange, orientation = 'vertical', ...props }, ref) => {
    const handleCheckedChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        onChange?.([...value, optionValue]);
      } else {
        onChange?.(value.filter((v) => v !== optionValue));
      }
    };

    return (
      <div
        ref={ref}
        role="group"
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
            <Checkbox
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => handleCheckedChange(option.value, checked)}
              disabled={option.disabled}
            />
            <Text size="sm">{option.label}</Text>
          </label>
        ))}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
