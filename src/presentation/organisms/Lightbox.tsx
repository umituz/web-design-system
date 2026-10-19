/**
 * Lightbox Component (Organism)
 * @description Media overlay on the Dialog primitives — click to zoom,
 *   caption below, close button in the corner.
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import { Dialog, DialogContent, DialogTitle } from './Dialog';

export interface LightboxProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the media being shown. */
  alt: string;
  caption?: ReactNode;
  /** Toggle zoom on media click; default true. */
  zoomable?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Lightbox({ open, onClose, alt, caption, zoomable = true, children, className }: LightboxProps) {
  const [zoom, setZoom] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
          setZoom(false);
        }
      }}
    >
      <DialogContent className={cn('max-w-3xl gap-2 border-none bg-transparent p-0 shadow-none', className)}>
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div
          onClick={zoomable ? () => setZoom((z) => !z) : undefined}
          className={cn(zoomable && (zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'))}
          style={{ transform: zoom ? 'scale(1.6)' : undefined, transition: 'transform 0.2s' }}
        >
          {children}
        </div>
        {caption !== undefined && (
          <p className="text-center text-sm text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">{caption}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
