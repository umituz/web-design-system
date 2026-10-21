/**
 * PhotoGallery Component (Organism)
 * @description Placeholder photo gallery — renders tinted tiles with a
 *   caption bar for photos that have no storage backend yet. When a host
 *   wires real image URLs it can render them inside the same tile frame.
 */

import { Image as ImageIcon, ImageOff } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export interface PhotoTile {
  id: string;
  /** Primary caption, e.g. the photo title. */
  label?: string;
  /** Secondary caption line, e.g. a kind tag or a date. */
  meta?: string;
  /** Optional image URL — rendered in place of the placeholder mark. */
  src?: string;
}

export interface PhotoGalleryProps {
  photos: PhotoTile[];
  columns?: number;
  emptyLabel?: string;
  className?: string;
}

export function PhotoGallery({ photos, columns = 3, emptyLabel = 'No photos yet', className }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div
        className={cn(
          'flex aspect-auto flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-muted-foreground',
          className,
        )}
      >
        <ImageOff className="size-6" aria-hidden />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div
      className={cn('grid gap-2.5', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {photos.map((photo) => (
        <figure key={photo.id} className="relative overflow-hidden rounded-lg border border-border bg-muted" title={photo.label}>
          <div className="flex aspect-[4/3] items-center justify-center">
            {photo.src !== undefined ? (
              <img src={photo.src} alt={photo.label ?? photo.id} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="size-10 text-primary/30" strokeWidth={1.2} aria-hidden />
            )}
          </div>
          {photo.label !== undefined && (
            <figcaption className="flex items-baseline gap-1.5 bg-background/85 px-2.5 py-1.5 text-xs backdrop-blur-sm">
              <span className="truncate font-medium">{photo.label}</span>
              {photo.meta !== undefined && <span className="shrink-0 text-muted-foreground">· {photo.meta}</span>}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
