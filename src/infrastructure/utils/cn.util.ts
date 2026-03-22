/**
 * cn Utility
 * @description Conditional className utility using clsx + tailwind-merge for proper Tailwind class merging
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
