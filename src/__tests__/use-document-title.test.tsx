import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useDocumentTitle } from '../presentation/hooks/useDocumentTitle';

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('composes title with the suffix', () => {
    renderHook(() => useDocumentTitle('Home', { suffix: '· Test App', fallback: 'Test App' }));
    expect(document.title).toBe('Home · Test App');
  });

  it('falls back when no title is given', () => {
    renderHook(() => useDocumentTitle(undefined, { suffix: '· Test App', fallback: 'Test App' }));
    expect(document.title).toBe('Test App');
  });

  it('renders a bare title without a suffix', () => {
    renderHook(() => useDocumentTitle('Solo', { fallback: 'Test App' }));
    expect(document.title).toBe('Solo');
  });

  it('restores the fallback on unmount and follows title changes', () => {
    const { rerender, unmount } = renderHook(
      ({ title }: { title?: string }) => useDocumentTitle(title, { suffix: '· Test App', fallback: 'Test App' }),
      { initialProps: { title: 'One' } },
    );
    expect(document.title).toBe('One · Test App');
    rerender({ title: 'Two' });
    expect(document.title).toBe('Two · Test App');
    act(() => unmount());
    expect(document.title).toBe('Test App');
  });
});
