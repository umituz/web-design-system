import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '../atoms/Input';
import { cn } from '../../infrastructure/utils';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    const toggleVisibility = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setVisible((prev) => !prev);
    };

    return (
      <div className={cn('relative flex items-center w-full', className)}>
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className="pr-10"
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors p-1"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
