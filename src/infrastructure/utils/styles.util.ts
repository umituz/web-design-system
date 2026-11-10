export function createStyles(prefix: string): Record<string, string> {
  return new Proxy({} as Record<string, string>, {
    get: (_, prop: string | symbol) => (typeof prop === 'string' ? `${prefix}__${prop}` : ''),
  });
}
