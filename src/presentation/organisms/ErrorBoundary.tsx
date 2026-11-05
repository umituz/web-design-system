
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  kicker?: string;
  title?: string;
  description?: ReactNode;
  resetLabel?: string;
  action?: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (this.props.onError) this.props.onError(error, info);
    else console.error('ErrorBoundary:', error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    const { kicker, title = 'This screen failed to load', description, resetLabel = 'Try again', action } = this.props;

    return (
      <div
        role="alert"
        className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
      >
        <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
        {kicker && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kicker}</p>}
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description ?? error.message}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button type="button" onClick={this.reset}>
            {resetLabel}
          </Button>
          {action}
        </div>
      </div>
    );
  }
}
