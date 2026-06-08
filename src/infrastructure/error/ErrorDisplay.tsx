import type { FC } from 'react';
import { AlertTriangle, AlertCircle, Info, RefreshCw, Home, Bug } from 'lucide-react';
import { cn } from '../utils';

export interface ErrorDisplayProps {
  error?: Error | string | null;
  title?: string;
  description?: string;
  variant?: 'default' | 'minimal' | 'card' | 'inline';
  severity?: 'error' | 'warning' | 'info';
  showDetails?: boolean;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  className?: string;
  errorId?: string;
}

const severityConfig = {
  error: {
    Icon: AlertCircle,
    iconClass: 'text-destructive',
    containerClass: 'bg-destructive/10',
  },
  warning: {
    Icon: AlertTriangle,
    iconClass: 'text-warning',
    containerClass: 'bg-warning/10',
  },
  info: {
    Icon: Info,
    iconClass: 'text-info',
    containerClass: 'bg-info/10',
  },
} as const;

const ErrorIcon: FC<{ severity: 'error' | 'warning' | 'info'; className?: string }> = ({
  severity,
  className,
}) => {
  const { Icon: IconComponent, iconClass } = severityConfig[severity];
  return <IconComponent className={cn(iconClass, className)} />;
};

export const ErrorDisplay: FC<ErrorDisplayProps> = ({
  error,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  variant = 'default',
  severity = 'error',
  showDetails = false,
  showRetry = true,
  showHome = false,
  onRetry,
  onHome,
  className,
  errorId,
}) => {
  const errorMessage = error instanceof Error ? error.message : (error || 'Unknown error');
  const errorStack = error instanceof Error ? error.stack : undefined;

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', severityConfig[severity].iconClass, className)}>
        <ErrorIcon severity={severity} className="h-4 w-4" />
        <span>{errorMessage}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3',
          className
        )}
      >
        <span className="mr-2"><ErrorIcon severity={severity} className="inline h-4 w-4" /></span>
        <span className="font-medium">{title}:</span> {errorMessage}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-lg border border-border bg-card shadow-lg', className)}>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  severityConfig[severity].containerClass
                )}
              >
                <ErrorIcon severity={severity} className="h-6 w-6" />
              </div>
              <div>
                <h3 className={cn('m-0 text-lg font-semibold', severityConfig[severity].iconClass)}>
                  {title}
                </h3>
                <p className="m-0 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            {errorId && (
              <span
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium text-white',
                  severity === 'error' ? 'bg-destructive' : 'bg-secondary'
                )}
              >
                ID: {errorId.slice(-8)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {showDetails && errorStack && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Bug className="h-4 w-4" />
                  Error Details
                </h4>
                <pre className="max-h-32 overflow-auto text-xs text-muted-foreground">
                  {errorStack}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {showRetry && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              )}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>
              {showHome && onHome && (
                <button
                  type="button"
                  onClick={onHome}
                  className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-card shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                severityConfig[severity].containerClass
              )}
            >
              <ErrorIcon severity={severity} className="h-5 w-5" />
            </div>
            <div>
              <h3 className={cn('m-0 text-base font-semibold', severityConfig[severity].iconClass)}>
                {title}
              </h3>
              <p className="m-0 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6 pb-6">
          <p className="m-0 text-sm text-muted-foreground">{errorMessage}</p>
          <div className="flex gap-2">
            {showRetry && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            )}
            {showHome && onHome && (
              <button
                type="button"
                onClick={onHome}
                className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <Home className="h-4 w-4" />
                Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NetworkError: FC<{ onRetry?: () => void; className?: string }> = ({
  onRetry,
  className,
}) => (
  <ErrorDisplay
    title="Network Error"
    description="Unable to connect to the server. Please check your internet connection."
    severity="warning"
    showRetry
    onRetry={onRetry}
    className={className}
  />
);

export const NotFoundError: FC<{ onHome?: () => void; className?: string }> = ({
  onHome,
  className,
}) => (
  <ErrorDisplay
    title="Page Not Found"
    description="The page you're looking for doesn't exist or has been moved."
    severity="info"
    showHome
    showRetry={false}
    onHome={onHome}
    className={className}
  />
);

export const PermissionError: FC<{ className?: string }> = ({ className }) => (
  <ErrorDisplay
    title="Access Denied"
    description="You don't have permission to access this resource."
    severity="error"
    showRetry={false}
    showHome
    className={className}
  />
);

export const ApiError: FC<{
  error?: Error | string;
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className }) => (
  <ErrorDisplay
    error={error}
    title="API Error"
    description="Failed to load data from the server."
    severity="error"
    showRetry
    onRetry={onRetry}
    className={className}
  />
);

export default ErrorDisplay;
