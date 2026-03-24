/**
 * Footer Organism Component
 * @description Minimal footer with brand and social icons - optimized for performance
 */

import { forwardRef, type HTMLAttributes, type ReactNode, memo } from 'react';
import React from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface FooterProps extends HTMLAttributes<HTMLElement>, BaseProps {
  brand?: {
    name: string;
  };
  social?: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
  copyright?: string;
}

// Memoize social icon component to prevent unnecessary re-renders
const SocialIcon = memo<{
  item: FooterProps['social'][number];
}>(({ item }) => (
  <a
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-secondary/50 text-text-secondary hover:bg-primary-gradient hover:text-white transition-all duration-200"
    aria-label={item.name}
    title={item.name}
  >
    <span className="relative">{item.icon}</span>
  </a>
));

SocialIcon.displayName = 'SocialIcon';

export const Footer = memo(forwardRef<HTMLElement, FooterProps>(
  ({ className, brand, social, copyright = '© 2026 UmitUZ. All rights reserved.', ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn('relative mt-8 transition-theme', className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            {brand && (
              <div className="text-xl font-bold text-text-primary">
                {brand.name}
              </div>
            )}

            {/* Social Icons */}
            {social && social.length > 0 && (
              <div className="flex items-center gap-3">
                {social.map((item, index) => (
                  <SocialIcon key={`${item.name}-${index}`} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Copyright */}
          {copyright && (
            <div className="text-center mt-6 pt-6 border-t border-border/20">
              <p className="text-sm text-text-secondary/60">{copyright}</p>
            </div>
          )}
        </div>
      </footer>
    );
  }
));

Footer.displayName = 'Footer';
