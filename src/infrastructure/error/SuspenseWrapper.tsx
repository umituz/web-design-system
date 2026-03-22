import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingText?: string;
  variant?: 'default' | 'minimal' | 'card';
  className?: string;
  style?: React.CSSProperties;
  showErrorBoundary?: boolean;
  errorBoundaryLevel?: 'page' | 'component' | 'feature';
}

const DefaultLoadingSpinner: React.FC<{ text?: string; className?: string }> = ({ text, className }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '32px',
    ...({ className } as any)
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    {text && <p style={{ fontSize: '14px', color: '#666' }}>{text}</p>}
  </div>
);

export const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  errorFallback,
  loadingText = 'Loading...',
  variant = 'default',
  className = '',
  style,
  showErrorBoundary = true,
  errorBoundaryLevel = 'component'
}) => {
  const defaultFallback = (
    <DefaultLoadingSpinner
      text={variant === 'card' ? loadingText : undefined}
      className={className}
    />
  );

  const suspenseContent = (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );

  const content = showErrorBoundary ? (
    <ErrorBoundary
      level={errorBoundaryLevel}
      fallback={errorFallback}
    >
      {suspenseContent}
    </ErrorBoundary>
  ) : suspenseContent;

  // Wrap in div if className or style is provided
  if (className || style) {
    return <div className={className} style={style}>{content}</div>;
  }

  return content;
};

// Specialized Suspense wrappers
export const PageSuspense: React.FC<{
  children: React.ReactNode;
  loadingText?: string
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

export const ComponentSuspense: React.FC<{
  children: React.ReactNode;
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

export const FeatureSuspense: React.FC<{
  children: React.ReactNode;
  loadingText?: string
}> = ({ children, loadingText = 'Loading feature...' }) => (
  <SuspenseWrapper
    variant="card"
    loadingText={loadingText}
    errorBoundaryLevel="feature"
    style={{ padding: '24px' }}
  >
    {children}
  </SuspenseWrapper>
);

export const InlineSuspense: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <SuspenseWrapper
    variant="minimal"
    showErrorBoundary={false}
  >
    {children}
  </SuspenseWrapper>
);

export default SuspenseWrapper;
