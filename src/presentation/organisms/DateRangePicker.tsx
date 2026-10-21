/**
 * DateRangePicker Component (Organism)
 * @description Compact preset-driven date range picker with custom date
 *   inputs, built on the DropdownMenu + Input atoms.
 */

import { useState } from 'react';
import { CalendarRange } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

export interface DateRange {
  from: string;
  to: string;
  /** preset id when the range was chosen from the preset list */
  preset?: RangePreset;
}

export type RangePreset = '7d' | '30d' | '90d' | 'month' | 'quarter' | 'year' | 'custom';

export interface RangePresetOption {
  id: RangePreset;
  label: string;
}

export const DEFAULT_RANGE_PRESETS: readonly RangePresetOption[] = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'month', label: 'This month' },
  { id: 'quarter', label: 'Last 3 months' },
  { id: 'year', label: 'This year' },
];

function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function shiftMonths(iso: string, months: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/** Resolve a preset id into a concrete range around `today` (ISO date). */
export function presetRange(preset: RangePreset, today: string = isoToday()): DateRange {
  switch (preset) {
    case '7d':
      return { from: shiftDays(today, -6), to: today, preset };
    case '30d':
      return { from: shiftDays(today, -29), to: today, preset };
    case '90d':
      return { from: shiftDays(today, -89), to: today, preset };
    case 'month':
      return { from: `${today.slice(0, 8)}01`, to: today, preset };
    case 'quarter':
      return { from: shiftMonths(today, -3), to: today, preset };
    case 'year':
      return { from: `${today.slice(0, 4)}-01-01`, to: today, preset };
    case 'custom':
      return { from: shiftDays(today, -29), to: today, preset };
  }
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Preset list shown above the custom inputs; defaults to DEFAULT_RANGE_PRESETS. */
  presets?: readonly RangePresetOption[];
  /** Day formatter for the trigger label; defaults to the raw ISO date. */
  formatDay?: (iso: string) => string;
  'aria-label'?: string;
}

export function DateRangePicker({
  value,
  onChange,
  presets = DEFAULT_RANGE_PRESETS,
  formatDay = (iso) => iso,
  'aria-label': ariaLabel,
}: DateRangePickerProps) {
  const [customFrom, setCustomFrom] = useState(value.from);
  const [customTo, setCustomTo] = useState(value.to);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" icon={<CalendarRange size={15} />} aria-label={ariaLabel}>
          <span className="tabular-nums">
            {formatDay(value.from)} – {formatDay(value.to)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Period</DropdownMenuLabel>
        {presets.map((preset) => (
          <DropdownMenuItem key={preset.id} onSelect={() => onChange(presetRange(preset.id))}>
            {preset.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Custom</DropdownMenuLabel>
        <div className="flex flex-col gap-2 px-2 pb-2">
          <Input
            type="date"
            aria-label="From date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
          />
          <Input
            type="date"
            aria-label="To date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
          />
        </div>
        <DropdownMenuItem
          onSelect={() => {
            if (customFrom && customTo) onChange({ from: customFrom, to: customTo, preset: 'custom' });
          }}
        >
          Apply custom range
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
