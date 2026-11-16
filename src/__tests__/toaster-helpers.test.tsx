import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ToastProvider, useToast } from '../presentation/organisms/Toaster';

function Probe() {
  const toast = useToast();
  return (
    <div>
      <button type="button" onClick={() => toast.success('Saved', 'Profile updated')}>success</button>
      <button type="button" onClick={() => toast.error('Failed')}>error</button>
      <button type="button" onClick={() => toast.info('FYI')}>info</button>
      <button type="button" onClick={() => toast.toast({ kind: 'warning', title: 'Careful' })}>raw</button>
    </div>
  );
}

afterEach(cleanup);

describe('toast shorthand helpers', () => {
  it('fires kind-tagged toasts from the helpers', async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );

    await act(async () => {
      screen.getByText('success').click();
    });
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Profile updated')).toBeTruthy();

    await act(async () => {
      screen.getByText('error').click();
    });
    expect(screen.getByText('Failed')).toBeTruthy();

    await act(async () => {
      screen.getByText('info').click();
    });
    expect(screen.getByText('FYI')).toBeTruthy();
  });

  it('still exposes the raw toast call', async () => {
    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );
    await act(async () => {
      screen.getByText('raw').click();
    });
    expect(screen.getByText('Careful')).toBeTruthy();
  });
});
