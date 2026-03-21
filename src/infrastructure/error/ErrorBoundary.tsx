import React, { Component, ErrorInfo, ReactNode, memo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'feature';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

const ErrorDetails = memo(({ error, errorInfo, showDetails }: {
  error: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
}) => {
  if (!showDetails || !import.meta.env.DEV) return null;

  return (
    <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px', marginTop: '16px' }}>
      <h4 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
        🐛 Error Details (Development)
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>Message:</p>
          <pre style={{ fontSize: '12px', color: '#dc2626', overflow: 'auto' }}>{error.message}</pre>
        </div>
        {error.stack && (
          <div>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>Stack:</p>
            <pre style={{ fontSize: '12px', color: '#666', overflow: 'auto', maxHeight: '128px' }}>
              {error.stack}
            </pre>
          </div>
        )}
        {errorInfo?.componentStack && (
          <div>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>Component Stack:</p>
            <pre style={{ fontSize: '12px', color: '#666', overflow: 'auto', maxHeight: '128px' }}>
              {errorInfo.componentStack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
});

ErrorDetails.displayName = 'ErrorDetails';

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    this.props.onError?.(error, errorInfo);

    if (import.meta.env.DEV) {
      console.group('🚨 ErrorBoundary caught an error');
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

  private getLevelConfig = () => {
    const { level = 'component' } = this.props;

    switch (level) {
      case 'page':
        return {
          title: 'Page Error',
          description: 'This page encountered an unexpected error.',
          showHomeButton: true,
        };
      case 'feature':
        return {
          title: 'Feature Error',
          description: 'This feature is temporarily unavailable due to an error.',
          showHomeButton: false,
        };
      default:
        return {
          title: 'Component Error',
          description: 'A component on this page encountered an error.',
          showHomeButton: false,
        };
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const config = this.getLevelConfig();
      const { showDetails = false } = this.props;

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'linear-gradient(to bottom right, #fef2f2, #fff7ed)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '672px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#fecaca',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                  </div>
                  <div>
                    <h2 style={{ color: '#dc2626', margin: 0, fontSize: '20px', fontWeight: 600 }}>
                      {config.title}
                    </h2>
                    <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                      {config.description}
                    </p>
                  </div>
                </div>
                {this.state.errorId && (
                  <span style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    ID: {this.state.errorId.slice(-8)}
                  </span>
                )}
              </div>
            </div>

            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {this.state.error && (
                <ErrorDetails
                  error={this.state.error}
                  errorInfo={this.state.errorInfo}
                  showDetails={showDetails}
                />
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={this.handleReset}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🔄 Refresh Page
                </button>
                {config.showHomeButton && (
                  <button
                    onClick={this.handleGoHome}
                    style={{
                      padding: '8px 16px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    🏠 Go Home
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
