import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LoadingOverlay } from '../molecules/LoadingOverlay';
import type { RegularSizes } from '../../infrastructure/constants';

export interface LoadingProviderProps {
  children: ReactNode;
  defaultMessage?: string;
  spinnerSize?: RegularSizes;
  minDisplayTime?: number;
}

interface LoadingContextValue {
  isLoading: boolean;
  message: string | undefined;
  show: (message?: string) => void;
  hide: () => void;
  reset: () => void;
}

export const LoadingContext = createContext<LoadingContextValue | null>(null);

const DEFAULT_MIN_DISPLAY_TIME = 0;

export const LoadingProvider = ({
  children,
  defaultMessage,
  spinnerSize = 'lg',
  minDisplayTime = DEFAULT_MIN_DISPLAY_TIME,
}: LoadingProviderProps) => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const countRef = useRef(0);
  const shownAtRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDisplayTimeRef = useRef(minDisplayTime);

  useEffect(() => {
    minDisplayTimeRef.current = minDisplayTime;
  }, [minDisplayTime]);

  const clearPendingHide = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const settleHidden = useCallback(() => {
    if (countRef.current === 0) {
      setOverlayVisible(false);
      setMessage(undefined);
    }
  }, []);

  const show = useCallback(
    (nextMessage?: string) => {
      clearPendingHide();
      if (countRef.current === 0) {
        shownAtRef.current = Date.now();
      }
      countRef.current += 1;
      setCount(countRef.current);
      if (nextMessage !== undefined) {
        setMessage(nextMessage);
      }
      setOverlayVisible(true);
    },
    [clearPendingHide]
  );

  const hide = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setCount(countRef.current);
    if (countRef.current > 0) {
      return;
    }

    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, minDisplayTimeRef.current - elapsed);
    if (remaining === 0) {
      settleHidden();
      return;
    }

    hideTimeoutRef.current = setTimeout(() => {
      hideTimeoutRef.current = null;
      settleHidden();
    }, remaining);
  }, [settleHidden]);

  const reset = useCallback(() => {
    clearPendingHide();
    countRef.current = 0;
    setCount(0);
    setOverlayVisible(false);
    setMessage(undefined);
  }, [clearPendingHide]);

  useEffect(
    () => () => {
      clearPendingHide();
    },
    [clearPendingHide]
  );

  return (
    <LoadingContext.Provider value={{ isLoading: count > 0, message, show, hide, reset }}>
      {children}
      <LoadingOverlay
        visible={overlayVisible}
        message={message ?? defaultMessage}
        spinnerSize={spinnerSize}
      />
    </LoadingContext.Provider>
  );
};
