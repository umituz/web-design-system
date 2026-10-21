/**
 * MapPreview Component (Organism)
 * @description Static map stand-in drawn with a contour motif — a neutral
 *   placeholder for locations until a real GIS integration exists. Colors
 *   come from the semantic tokens, so it adapts to every host theme.
 */

import { MapPin } from 'lucide-react';

export interface MapPreviewProps {
  /** Location caption, e.g. "Torba, Bodrum". */
  label: string;
  coordinates?: { lat: number; lng: number };
  height?: number;
  /** Secondary caption line, e.g. an integration note. */
  hint?: string;
  /** Degrees formatting for the coordinate readout; defaults to 4 decimals. */
  formatCoordinate?: (value: number) => string;
}

export function MapPreview({
  label,
  coordinates,
  height = 220,
  hint,
  formatCoordinate = (v) => v.toFixed(4),
}: MapPreviewProps) {
  return (
    <figure
      className="relative overflow-hidden rounded-lg border border-border bg-muted"
      style={{ height }}
      role="img"
      aria-label={`Map preview — ${label}`}
    >
      <svg
        className="absolute inset-0 h-full w-full text-primary/25"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M-20 170 C 60 150 90 100 170 90 S 300 60 420 30" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
        <path d="M-20 185 C 70 160 110 115 190 102 S 310 75 420 45" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
        <path d="M-20 200 C 80 172 130 130 210 115 S 320 90 420 60" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.1" />
      </svg>
      <svg
        className="absolute inset-0 h-full w-full text-accent-foreground/20"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M-20 60 C 40 70 120 40 200 55 S 340 30 420 55" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.3" />
        <path d="M-20 40 C 50 52 130 22 210 38 S 350 14 420 40" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.1" />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <MapPin size={16} strokeWidth={2.1} />
        </span>
      </div>
      <figcaption className="absolute bottom-2 left-2 right-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-md bg-background/85 px-3 py-1.5 text-xs backdrop-blur-sm">
        <span className="font-medium">{label}</span>
        {coordinates !== undefined && (
          <span className="tabular-nums text-muted-foreground">
            {formatCoordinate(coordinates.lat)}° N · {formatCoordinate(coordinates.lng)}° E
          </span>
        )}
        {hint !== undefined && <span className="text-muted-foreground">{hint}</span>}
      </figcaption>
    </figure>
  );
}
