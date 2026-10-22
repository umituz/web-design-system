/**
 * ConfirmDialog Component (Organism)
 * @description Destructive/primary confirmation built on Modal: title, body and
 * Cancel + confirm actions; unmounts itself after confirming
 */

import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  title: ReactNode;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual weight of the confirm action; defaults to danger. */
  tone?: 'danger' | 'primary';
  /** Renders nothing when false; defaults to true (conditional mounting also works). */
  open?: boolean;
  /** While true the confirm action is locked and shows its loading state; the caller owns dismissal. */
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', open = true, busy = false, onConfirm, onClose }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <Modal
      open
      danger={tone === 'danger'}
      title={title}
      description={body}
      onClose={busy ? () => undefined : onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'default'}
            size="sm"
            loading={busy}
            disabled={busy}
            onClick={() => {
              if (busy) return;
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
