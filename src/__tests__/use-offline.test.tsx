import { describe, expect, it, afterEach } from 'vitest';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { useOffline } from '../presentation/hooks/useOffline';
import { OfflineBanner } from '../presentation/molecules/OfflineBanner';

const setOnline = (value: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true });
  window.dispatchEvent(new Event(value ? 'online' : 'offline'));
};

afterEach(() => {
  cleanup();
  setOnline(true);
});

describe('useOffline', () => {
  it('starts online in jsdom', () => {
    const { result } = renderHook(() => useOffline());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('tracks transitions with timestamps', () => {
    const { result } = renderHook(() => useOffline());

    act(() => setOnline(false));
    expect(result.current.isOffline).toBe(true);
    expect(result.current.lastOfflineAt).toBeTypeOf('number');

    act(() => setOnline(true));
    expect(result.current.isOnline).toBe(true);
    expect(result.current.lastOnlineAt).toBeGreaterThanOrEqual(
      result.current.lastOfflineAt ?? 0,
    );
  });
});

describe('OfflineBanner', () => {
  it('renders nothing while online', () => {
    const { container } = render(<OfflineBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a live status message while offline', () => {
    act(() => setOnline(false));
    render(<OfflineBanner />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/offline/i)).toBeTruthy();
  });

  it('accepts a custom message', () => {
    act(() => setOnline(false));
    render(<OfflineBanner message="Bağlantı yok" />);
    expect(screen.getByText('Bağlantı yok')).toBeTruthy();
  });
});
