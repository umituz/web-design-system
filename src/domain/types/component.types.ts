/**
 * Component Types
 * @description Common component prop types
 */

import type { ReactNode } from 'react';
export type { SizeVariant } from '../../infrastructure/constants/size-variant.constants';

export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
export type ColorScheme = 'light' | 'dark';

export interface BaseProps {
  className?: string;
  id?: string;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface PolymorphicProps {
  as?: React.ElementType;
}
