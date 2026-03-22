import React from 'react';

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
    icon: '❌',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca'
  },
  warning: {
    icon: '⚠️',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a'
  },
  info: {
    icon: 'ℹ️',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe'
  }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
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
  className = '',
  errorId
}) => {
  const config = severityConfig[severity];

  const errorMessage = error instanceof Error ? error.message : (error || 'Unknown error');
  const errorStack = error instanceof Error ? error.stack : undefined;

  if (variant === 'minimal') {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: config.color }}>
        <span>{config.icon}</span>
        <span>{errorMessage}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={className} style={{
        padding: '12px 16px',
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '6px'
      }}>
        <span style={{ marginRight: '8px' }}>{config.icon}</span>
        <span style={{ fontWeight: 500 }}>{title}:</span> {errorMessage}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={className} style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: 'none'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: config.bgColor,
                fontSize: '24px'
              }}>
                {config.icon}
              </div>
              <div>
                <h3 style={{ color: config.color, margin: 0, fontSize: '18px', fontWeight: 600 }}>
                  {title}
                </h3>
                <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                  {description}
                </p>
              </div>
            </div>
            {errorId && (
              <span style={{
                background: severity === 'error' ? '#dc2626' : '#6b7280',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                ID: {errorId.slice(-8)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {showDetails && errorStack && (
              <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🐛 Error Details
                </h4>
                <pre style={{ fontSize: '12px', color: '#666', overflow: 'auto', maxHeight: '128px' }}>
                  {errorStack}
                </pre>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
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
              )}
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
              {showHome && onHome && (
                <button
                  onClick={onHome}
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

  // Default variant
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{
        width: '100%',
        maxWidth: '448px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: config.bgColor,
              fontSize: '20px'
            }}>
              {config.icon}
            </div>
            <div>
              <h3 style={{ color: config.color, margin: 0, fontSize: '16px', fontWeight: 600 }}>
                {title}
              </h3>
              <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                {description}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{errorMessage}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {showRetry && onRetry && (
              <button
                onClick={onRetry}
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
                🔄 Retry
              </button>
            )}
            {showHome && onHome && (
              <button
                onClick={onHome}
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
                🏠 Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Specialized error components
export const NetworkError: React.FC<{ onRetry?: () => void; className?: string }> = ({
  onRetry,
  className
}) => (
  <ErrorDisplay
    title="Network Error"
    description="Unable to connect to the server. Please check your internet connection."
    severity="warning"
    showRetry={true}
    onRetry={onRetry}
    className={className}
  />
);

export const NotFoundError: React.FC<{ onHome?: () => void; className?: string }> = ({
  onHome,
  className
}) => (
  <ErrorDisplay
    title="Page Not Found"
    description="The page you're looking for doesn't exist or has been moved."
    severity="info"
    showHome={true}
    showRetry={false}
    onHome={onHome}
    className={className}
  />
);

export const PermissionError: React.FC<{ className?: string }> = ({ className }) => (
  <ErrorDisplay
    title="Access Denied"
    description="You don't have permission to access this resource."
    severity="error"
    showRetry={false}
    showHome={true}
    className={className}
  />
);

export const ApiError: React.FC<{
  error?: Error | string;
  onRetry?: () => void;
  className?: string
}> = ({ error, onRetry, className }) => (
  <ErrorDisplay
    error={error}
    title="API Error"
    description="Failed to load data from the server."
    severity="error"
    showRetry={true}
    onRetry={onRetry}
    className={className}
  />
);

export default ErrorDisplay;
