import { Component, ErrorInfo, ReactNode, memo } from "react";
import { AlertTriangle, Home, RefreshCw, Bug } from "lucide-react";
import { cn } from "../utils";
import { generateErrorId } from "../calculation/errorIdGenerator";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'feature';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

const LEVEL_CONFIG = {
  page: {
    title: 'Page Error',
    description: 'This page encountered an unexpected error.',
    showHomeButton: true,
  },
  feature: {
    title: 'Feature Error',
    description: 'This feature is temporarily unavailable due to an error.',
    showHomeButton: false,
  },
  component: {
    title: 'Component Error',
    description: 'A component on this page encountered an error.',
    showHomeButton: false,
  },
} as const;

const ErrorDetails = memo(({
  error,
  errorInfo,
  showDetails,
}: {
  error: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
}) => {
  if (!showDetails || !import.meta.env.DEV) return null;

  return (
    <div className="mt-4 rounded-lg bg-muted p-4">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Bug className="h-4 w-4" />
        Error Details (Development)
      </h4>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Message:</p>
          <pre className="overflow-auto text-xs text-destructive">{error.message}</pre>
        </div>
        {error.stack && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Stack:</p>
            <pre className="max-h-32 overflow-auto text-xs text-muted-foreground">
              {error.stack}
            </pre>
          </div>
        )}
        {errorInfo?.componentStack && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Component Stack:</p>
            <pre className="max-h-32 overflow-auto text-xs text-muted-foreground">
              {errorInfo.componentStack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
});
ErrorDetails.displayName = 'ErrorDetails';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    if (import.meta.env.DEV) {
      console.group('ErrorBoundary caught an error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const config = LEVEL_CONFIG[this.props.level ?? 'component'];
      const { showDetails = false } = this.props;

      return (
        <div
          className={cn(
            'flex min-h-screen items-center justify-center bg-gradient-to-br from-destructive/5 to-warning/5 p-4'
          )}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-card shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="m-0 text-xl font-semibold text-destructive">
                      {config.title}
                    </h2>
                    <p className="m-0 text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
                {this.state.errorId && (
                  <span className="rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                    ID: {this.state.errorId.slice(-8)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 pb-6">
              {this.state.error && (
                <ErrorDetails
                  error={this.state.error}
                  errorInfo={this.state.errorInfo}
                  showDetails={showDetails}
                />
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Page
                </button>
                {config.showHomeButton && (
                  <button
                    type="button"
                    onClick={this.handleGoHome}
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

    return this.props.children;
  }
}

export default ErrorBoundary;
