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
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Modal
      open
      danger={tone === 'danger'}
      title={title}
      description={body}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'default'} size="sm" onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
