import { useState, useEffect, useCallback } from 'react';
import { classifyConnectionType, type ConnectionBucket } from '../calculation/connectionTypeClassifier';

export type ConnectionType = ConnectionBucket;

interface NetworkInformation {
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}

const getConnection = (): NetworkInformation | undefined => {
  if (typeof navigator === 'undefined') return undefined;
  const nav = navigator as unknown as {
    connection?: unknown;
    mozConnection?: unknown;
    webkitConnection?: unknown;
  };
  const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  if (conn && typeof conn === 'object' && 'effectiveType' in conn) {
    return conn as NetworkInformation;
  }
  return undefined;
};

export interface ProgressiveEnhancementApi {
  isOnline: boolean;
  connectionType: ConnectionType;
  shouldLoadHeavyContent: () => boolean;
  shouldPreloadContent: () => boolean;
}

export const useProgressiveEnhancement = (): ProgressiveEnhancementApi => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [connectionType, setConnectionType] = useState<ConnectionType>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = getConnection();

    if (connection) {
      const updateConnectionType = () => {
        setConnectionType(classifyConnectionType(connection.effectiveType));
      };

      updateConnectionType();
      connection.addEventListener?.('change', updateConnectionType);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener?.('change', updateConnectionType);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const shouldLoadHeavyContent = useCallback(
    () => isOnline && connectionType !== 'slow',
    [isOnline, connectionType]
  );

  const shouldPreloadContent = useCallback(
    () => isOnline && connectionType === 'fast',
    [isOnline, connectionType]
  );

  return {
    isOnline,
    connectionType,
    shouldLoadHeavyContent,
    shouldPreloadContent,
  };
};
