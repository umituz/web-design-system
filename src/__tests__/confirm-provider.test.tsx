import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfirmProvider, useConfirm } from '../presentation/organisms/ConfirmProvider';

afterEach(cleanup);

function Probe({ onResult }: { onResult: (value: boolean) => void }) {
  const confirm = useConfirm();
  return (
    <button
      type="button"
      onClick={() => {
        void confirm({ title: 'Delete item?', body: 'This cannot be undone.' }).then(onResult);
      }}
    >
      ask
    </button>
  );
}

describe('ConfirmProvider', () => {
  it('resolves true when confirmed and closes the dialog', async () => {
    let result: boolean | undefined;
    render(
      <ConfirmProvider>
        <Probe onResult={(v) => { result = v; }} />
      </ConfirmProvider>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'ask' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('This cannot be undone.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(result).toBe(true));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('resolves false when cancelled', async () => {
    let result: boolean | undefined;
    render(
      <ConfirmProvider>
        <Probe onResult={(v) => { result = v; }} />
      </ConfirmProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'ask' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(result).toBe(false));
  });

  it('honors custom labels and tone', () => {
    function LabelledProbe() {
      const confirm = useConfirm();
      return (
        <button
          type="button"
          onClick={() => {
            void confirm({ title: 'Leave page?', tone: 'danger', confirmLabel: 'Leave', cancelLabel: 'Stay' });
          }}
        >
          go
        </button>
      );
    }
    render(
      <ConfirmProvider>
        <LabelledProbe />
      </ConfirmProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(screen.getByRole('button', { name: 'Leave' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Stay' })).toBeTruthy();
  });

  it('throws when used outside the provider', () => {
    expect(() => render(<Probe onResult={() => undefined} />)).toThrow(/ConfirmProvider/);
  });
});
