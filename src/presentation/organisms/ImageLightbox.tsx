/**
 * ImageLightbox Component (Organism)
 * @description Full-screen image gallery with zoom, navigation, and thumbnails
 */

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { useScrollLock } from '../hooks/useScrollLock';
import { clampToRange } from '../../infrastructure/calculation/rangeClamper';
import type { BaseProps } from '../../domain/types';

export interface ImageLightboxImage {
  src: string;
  alt: string;
  title?: string;
}

export interface ImageLightboxProps extends BaseProps {
  images: ImageLightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const ZOOM_TOGGLE_KEYS = new Set(['+', '=']);

export const ImageLightbox = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  className,
}: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!images || images.length === 0) return 0;
    return clampToRange(initialIndex, 0, images.length - 1);
  });
  const [isZoomed, setIsZoomed] = useState(false);

  useScrollLock(isOpen);

  const safeIndex = images && images.length > 0
    ? clampToRange(currentIndex, 0, images.length - 1)
    : 0;
  const currentImage = images?.[safeIndex];

  const goToNext = useCallback(() => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const goToPrevious = useCallback(() => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  const toggleZoom = useCallback(() => setIsZoomed((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          if (ZOOM_TOGGLE_KEYS.has(event.key)) toggleZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext, toggleZoom]);

  if (!isOpen || !images || images.length === 0 || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.title ?? 'Image lightbox'}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4',
        className
      )}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <div
        className="relative max-h-[90vh] w-full max-w-5xl"
        onClick={(e) => {
          e.stopPropagation();
          toggleZoom();
        }}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className={cn(
            'max-h-[90vh] w-full object-contain transition-transform',
            isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
          )}
        />

        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            className="rounded-full p-1 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {isZoomed ? (
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {currentImage.title && (
        <div className="absolute bottom-4 left-1/2 max-w-md -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-center text-sm text-white">
          {currentImage.title}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 flex max-w-xl -translate-x-1/2 gap-2 overflow-x-auto">
          {images.map((image, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                aria-label={`Show image ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-white',
                  isActive
                    ? 'scale-110 border-white'
                    : 'border-transparent opacity-50 hover:opacity-100'
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

ImageLightbox.displayName = 'ImageLightbox';
