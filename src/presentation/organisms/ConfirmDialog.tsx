
import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  title: ReactNode;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary' | 'success';
  open?: boolean;
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
            className={tone === 'success' ? 'bg-success text-success-foreground hover:bg-success/90' : undefined}
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
