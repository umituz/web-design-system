
export const DEFAULT_SIZE = 'md' as const;
export const DEFAULT_VARIANT = 'primary' as const;
export const DEFAULT_COLOR_SCHEME = 'light' as const;
export const DEFAULT_ORIENTATION = 'vertical' as const;
export const DEFAULT_DELAY_MS = 200;

/* Stable empty references for default props — a fresh `[]`/`{}` literal in
 * a prop default breaks memo/deps on every render. Type the prop readonly
 * and point its default here. */
export const EMPTY_ARRAY: readonly never[] = Object.freeze([]);
export const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({});
