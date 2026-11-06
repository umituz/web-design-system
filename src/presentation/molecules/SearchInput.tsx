import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input, type InputProps } from '../atoms/Input';
import { Spinner } from '../atoms/Spinner';
import { cn } from '../../infrastructure/utils';

export interface SearchInputProps extends Omit<InputProps, 'onChange' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  loading?: boolean;
  clearable?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSearch,
      onClear,
      debounceMs = 0,
      loading = false,
      clearable = true,
      placeholder = 'Ara...',
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextVal = e.target.value;
      if (!isControlled) {
        setInternalValue(nextVal);
      }
      onChange?.(nextVal);

      if (debounceMs > 0 && onSearch) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          onSearch(nextVal);
        }, debounceMs);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        onSearch?.(currentValue);
      }
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('');
      onClear?.();
      onSearch?.('');
    };

    return (
      <div className={cn('relative flex items-center w-full', className)}>
        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none shrink-0" />
        <Input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-9"
          {...props}
        />
        <div className="absolute right-2.5 flex items-center">
          {loading ? (
            <Spinner size="sm" />
          ) : clearable && currentValue ? (
            <button
              type="button"
              aria-label="Aramayı temizle"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
