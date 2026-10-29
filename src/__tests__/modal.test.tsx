import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Modal } from '../presentation/organisms/Modal';
import type { ModalSize } from '../presentation/organisms/Modal';

afterEach(cleanup);

const sizeWidths: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
};

describe('Modal sizes', () => {
  it.each(Object.entries(sizeWidths))('size %s maps to %s', (size, width) => {
    render(<Modal open onClose={() => {}} size={size as ModalSize} title="T" />);
    expect(screen.getByRole('dialog').className).toContain(width);
  });
});

describe('Modal scrollable body', () => {
  it('caps the dialog height and wraps children in a scroll region', () => {
    render(
      <Modal open onClose={() => {}} title="Long" scrollable footer={<button type="button">Save</button>}>
        <p>Body copy</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('max-h-[92vh]');
    expect(dialog.className).toContain('overflow-hidden');
    expect(dialog.className).toContain('flex');
    const body = screen.getByText('Body copy').parentElement;
    expect(body?.className).toContain('overflow-y-auto');
    expect(body?.className).toContain('flex-1');
    expect(screen.getByRole('button', { name: 'Save' }).parentElement?.className).not.toContain('overflow-y-auto');
  });

  it('keeps children unwrapped by default', () => {
    render(<Modal open onClose={() => {}} title="Plain"><p>Body copy</p></Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).not.toContain('max-h-[92vh]');
    expect(screen.getByText('Body copy').parentElement).toBe(dialog);
  });
});
