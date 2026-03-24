/**
 * Responsive System Type Definitions
 * @description Centralized breakpoint types for responsive design
 */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ScreenSize = Breakpoint;

export interface BreakpointValue {
  min: number;
  max?: number;
}

export interface ResponsiveProps {
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  '2xl'?: boolean;
}

export interface ShowProps {
  above?: Breakpoint;  // Show on larger screens (min-width)
  below?: Breakpoint;  // Show on smaller screens (max-width)
  at?: Breakpoint;     // Show only at this breakpoint
}

export interface HideProps {
  above?: Breakpoint;  // Hide on larger screens
  below?: Breakpoint;  // Hide on smaller screens
  at?: Breakpoint;     // Hide only at this breakpoint
}

export interface BreakpointState {
  currentBreakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  isMobile: boolean;    // xs, sm
  isTablet: boolean;    // md, lg
  isDesktop: boolean;   // xl, 2xl
}

export interface UseBreakpointReturn extends BreakpointState {
  matches: (breakpoint: Breakpoint | Breakpoint[]) => boolean;
  isGreaterThan: (breakpoint: Breakpoint) => boolean;
  isLessThan: (breakpoint: Breakpoint) => boolean;
}
