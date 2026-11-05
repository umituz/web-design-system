
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
  above?: Breakpoint;
  below?: Breakpoint;
  at?: Breakpoint;
}

export interface HideProps {
  above?: Breakpoint;
  below?: Breakpoint;
  at?: Breakpoint;
}

export interface BreakpointState {
  currentBreakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface UseBreakpointReturn extends BreakpointState {
  matches: (breakpoint: Breakpoint | Breakpoint[]) => boolean;
  isGreaterThan: (breakpoint: Breakpoint) => boolean;
  isLessThan: (breakpoint: Breakpoint) => boolean;
}
