import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

export type LabelOverrides<T> = {
  [K in keyof T]?: T[K] extends object ? LabelOverrides<T[K]> : T[K];
};

export function formatTemplate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mergeLabels<T extends object>(defaults: T, overrides?: LabelOverrides<T>): T {
  if (!overrides) return defaults;
  const merged = { ...(defaults as unknown as Record<string, unknown>) };
  const source = overrides as unknown as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const override = source[key];
    if (override === undefined) continue;
    const base = (defaults as unknown as Record<string, unknown>)[key];
    merged[key] =
      isPlainObject(base) && isPlainObject(override) ? mergeLabels(base, override) : override;
  }
  return merged as T;
}

export interface ConsoleFormLabels {
  cancel: string;
  save: string;
  selectOption: string;
  required: string;
  number: string;
  minValue: string;
  maxValue: string;
  minLength: string;
  invalidEmail: string;
  invalidDate: string;
}

export interface ConsoleLabels {
  form: ConsoleFormLabels;
  toolbar: { search: string };
  noResults: { title: string; description: string; clear: string };
  errorState: { title: string; description: string; retry: string; back: string };
}

export const DEFAULT_CONSOLE_LABELS: Readonly<ConsoleLabels> = Object.freeze({
  form: Object.freeze({
    cancel: 'Cancel',
    save: 'Save',
    selectOption: 'Select an option',
    required: 'This field is required',
    number: 'Enter a valid number',
    minValue: 'Must be at least {min}',
    maxValue: 'Must be at most {max}',
    minLength: 'At least {n} characters',
    invalidEmail: 'Enter a valid email',
    invalidDate: 'Enter a valid date',
  }),
  toolbar: Object.freeze({ search: 'Search' }),
  noResults: Object.freeze({
    title: 'No matching records',
    description: 'Try changing the search or filters.',
    clear: 'Clear filters',
  }),
  errorState: Object.freeze({
    title: 'Something went wrong',
    description: 'The data could not be loaded.',
    retry: 'Retry',
    back: 'Go back',
  }),
});

const ConsoleLabelsContext = createContext<ConsoleLabels>(
  DEFAULT_CONSOLE_LABELS as ConsoleLabels,
);

export function ConsoleLabelsProvider({
  labels,
  children,
}: {
  labels?: LabelOverrides<ConsoleLabels>;
  children: ReactNode;
}) {
  const value = useMemo(() => mergeLabels(DEFAULT_CONSOLE_LABELS, labels), [labels]);
  return <ConsoleLabelsContext.Provider value={value}>{children}</ConsoleLabelsContext.Provider>;
}

export function useConsoleLabels(): ConsoleLabels {
  return useContext(ConsoleLabelsContext);
}
