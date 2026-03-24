/**
 * ImageLightbox Component (Organism)
 * @description Full-screen image gallery with zoom, navigation, and thumbnails
 */

import { useState, useCallback, useEffect } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Icon } from '../atoms/Icon';

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

export const ImageLightbox = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  className,
}: ImageLightboxProps) => {
  // Early return if closed
  if (!isOpen) return null;

  // Early return if no images
  if (!images || images.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ensure initialIndex is within bounds
  const safeIndex = Math.min(Math.max(initialIndex, 0), images.length - 1);
  const currentImage = images[safeIndex];

  // Use useCallback to memoize navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleImageClick = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          setIsZoomed(!isZoomed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevious, goToNext, isZoomed]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
        aria-label="Close lightbox"
      >
        <Icon className="text-white">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </Icon>
      </button>

      {/* Navigation - Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
          aria-label="Previous image"
        >
          <Icon className="text-white" size="lg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </Icon>
        </button>
      )}

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
          aria-label="Next image"
        >
          <Icon className="text-white" size="lg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </Icon>
        </button>
      )}

      {/* Main Image */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={handleImageClick}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className={cn(
            'w-full h-full object-contain',
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          )}
          style={{
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
        />

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-2 rounded-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="p-1 hover:bg-black/70 rounded-full transition-all text-white"
            aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          >
            {isZoomed ? (
              <Icon className="text-white" size="sm">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </Icon>
            ) : (
              <Icon className="text-white" size="sm">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </Icon>
            )}
          </button>
        </div>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Image Title */}
      {currentImage.title && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm max-w-md text-center">
          {currentImage.title}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-xl overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                index === currentIndex
                  ? 'border-white scale-110'
                  : 'border-transparent opacity-50 hover:opacity-100'
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ImageLightbox.displayName = 'ImageLightbox';
