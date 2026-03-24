/**
 * Comments Component (Organism)
 * @description Giscus-based GitHub Discussions comment widget
 */

import { useEffect, useRef } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category?: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'custom';
  term?: string;
  strict?: '0' | '1';
  reactionsEnabled?: '0' | '1';
  emitMetadata?: '0' | '1';
  inputPosition?: 'top' | 'bottom';
  theme?: 'light' | 'dark' | 'dark_dimmed' | 'transparent_dark' | 'preferred_color_scheme';
  lang?: string;
}

export interface CommentsProps extends BaseProps {
  slug: string;
  config?: Partial<GiscusConfig>;
  title?: string;
  description?: string;
}

declare global {
  interface Window {
    giscus?: {
      render: (element: HTMLElement, config: Record<string, unknown>) => void;
    };
  }
}

export const Comments = ({
  slug,
  config,
  title = 'Comments',
  description = 'Join the discussion! Share your thoughts and questions below.',
  className,
}: CommentsProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Giscus script dynamically
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.addEventListener('load', () => {
      if (window.giscus && rootRef.current) {
        const defaultConfig: GiscusConfig = {
          repo: 'umituz/umituz-apps',
          repoId: 'R_kgDONJ7RJw',
          category: 'Announcements',
          mapping: 'pathname',
          term: slug,
          strict: '0',
          reactionsEnabled: '1',
          emitMetadata: '0',
          inputPosition: 'top',
          theme: 'dark',
          lang: 'en',
          ...config,
        };

        window.giscus.render(rootRef.current, defaultConfig as unknown as Record<string, unknown>);
      }
    });

    document.head.appendChild(script);

    return () => {
      // Only remove if script exists and is in DOM
      if (script.parentNode === document.head) {
        document.head.removeChild(script);
      }
    };
  }, [slug, config]);

  return (
    <div className={cn('mt-8', className)}>
      <div className="bg-bg-card rounded-xl p-6 border border-border transition-theme">
        <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3>
        <p className="text-text-secondary text-sm mb-4">
          {description}
        </p>
        <div
          ref={rootRef}
          id="giscus-comments"
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
};

Comments.displayName = 'Comments';
