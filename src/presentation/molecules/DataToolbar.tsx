import type { ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import { NativeSelect } from '../atoms/NativeSelect';
import { SearchInput } from './SearchInput';
import { useConsoleLabels } from '../page-kit/console-labels';

export interface DataToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  count: number;
  className?: string;
}

export function DataToolbar({
  search,
  onSearch,
  searchPlaceholder,
  children,
  count,
  className,
}: DataToolbarProps): React.ReactNode {
  const labels = useConsoleLabels();
  const placeholder = searchPlaceholder ?? labels.toolbar.search;
  return (
    <div className={cn('data-toolbar', className)}>
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-56"
      />
      {children}
      <span className="result-count tabular-nums">{count}</span>
    </div>
  );
}

export function ToolbarSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}): React.ReactNode {
  return (
    <NativeSelect
      aria-label={label}
      title={label}
      value={value}
      onValueChange={onChange}
      options={options}
      fullWidth={false}
      className="h-8 w-auto min-w-[130px] text-[13px]"
    />
  );
}
