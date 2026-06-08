import type { CSSProperties, FC, ReactNode } from 'react';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { cn } from '../utils';

export interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingText?: string;
  variant?: 'default' | 'minimal' | 'card';
  className?: string;
  style?: CSSProperties;
  showErrorBoundary?: boolean;
  errorBoundaryLevel?: 'page' | 'component' | 'feature';
}

const DefaultLoadingSpinner: FC<{ text?: string; className?: string }> = ({
  text,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-4 p-8',
      className
    )}
  >
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    {text && <p className="text-sm text-muted-foreground">{text}</p>}
  </div>
);

export const SuspenseWrapper: FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  loadingText = 'Loading...',
  variant = 'default',
  className = '',
  style,
  showErrorBoundary = true,
  errorBoundaryLevel = 'component',
}) => {
  const defaultFallback = (
    <DefaultLoadingSpinner
      text={variant === 'card' ? loadingText : undefined}
      className={className}
    />
  );

  const suspenseContent = (
    <Suspense fallback={fallback ?? defaultFallback}>{children}</Suspense>
  );

  const content = showErrorBoundary ? (
    <ErrorBoundary level={errorBoundaryLevel} fallback={errorFallback}>
      {suspenseContent}
    </ErrorBoundary>
  ) : (
    suspenseContent
  );

  if (className || style) {
    return (
      <div className={className} style={style}>
        {content}
      </div>
    );
  }

  return content;
};

export const PageSuspense: FC<{
  children: ReactNode;
  loadingText?: string;
}> = ({ children, loadingText = 'Loading page...' }) => (
  <SuspenseWrapper
    variant="card"
    loadingText={loadingText}
    errorBoundaryLevel="page"
    className="min-h-[400px]"
  >
    {children}
  </SuspenseWrapper>
);

export const ComponentSuspense: FC<{
  children: ReactNode;
  loadingText?: string;
  className?: string;
}> = ({ children, loadingText = 'Loading component...', className }) => (
  <SuspenseWrapper
    variant="default"
    loadingText={loadingText}
    errorBoundaryLevel="component"
    className={className}
  >
    {children}
  </SuspenseWrapper>
);

export const FeatureSuspense: FC<{
  children: ReactNode;
  loadingText?: string;
}> = ({ children, loadingText = 'Loading feature...' }) => (
  <SuspenseWrapper
    variant="card"
    loadingText={loadingText}
    errorBoundaryLevel="feature"
    className="p-6"
  >
    {children}
  </SuspenseWrapper>
);

export const InlineSuspense: FC<{ children: ReactNode }> = ({ children }) => (
  <SuspenseWrapper variant="minimal" showErrorBoundary={false}>
    {children}
  </SuspenseWrapper>
);

export default SuspenseWrapper;
