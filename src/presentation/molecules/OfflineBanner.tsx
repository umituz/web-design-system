import { WifiOff } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { useOffline } from '../hooks/useOffline';

export interface OfflineBannerProps {
  message?: string;
  className?: string;
}

export function OfflineBanner({
  message = 'You are offline — some actions may not work until the connection returns.',
  className,
}: OfflineBannerProps) {
  const { isOffline, lastOfflineAt } = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 border-t border-warning/50 bg-warning/10 px-4 py-2 text-sm text-warning',
        className
      )}
    >
      <WifiOff size={15} aria-hidden="true" />
      <span>{message}</span>
      {lastOfflineAt !== null && (
        <span className="text-xs opacity-70">
          since {new Date(lastOfflineAt).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
