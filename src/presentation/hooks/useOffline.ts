import { useEffect, useState } from 'react';

export interface UseOfflineReturn {
  readonly isOnline: boolean;
  readonly isOffline: boolean;
  readonly lastOnlineAt: number | null;
  readonly lastOfflineAt: number | null;
}

const initialOnlineState = (): boolean =>
  typeof navigator === 'undefined' ? true : navigator.onLine;

export function useOffline(): UseOfflineReturn {
  const [isOnline, setIsOnline] = useState<boolean>(initialOnlineState);
  const [lastOnlineAt, setLastOnlineAt] = useState<number | null>(null);
  const [lastOfflineAt, setLastOfflineAt] = useState<number | null>(null);

  useEffect(() => {
    const markOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(Date.now());
    };
    const markOffline = () => {
      setIsOnline(false);
      setLastOfflineAt(Date.now());
    };

    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    return () => {
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnlineAt,
    lastOfflineAt,
  };
}
