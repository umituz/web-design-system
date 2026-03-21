/**
 * cn Utility
 * @description Conditional className utility (clsx + tailwind-merge alternative)
 */

export type ClassName = string | undefined | null | false | ClassName[];

export function cn(...classes: ClassName[]): string {
  return classes
    .flat(Infinity as any)
    .filter(Boolean)
    .join(' ');
}
