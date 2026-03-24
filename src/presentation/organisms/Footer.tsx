/**
 * Footer Organism Component
 * @description Footer with brand info, links, and social icons
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface FooterProps extends HTMLAttributes<HTMLElement>, BaseProps {
  brand?: {
    name: string;
    description?: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  social?: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
  copyright?: string;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ className, brand, sections, social, copyright = '© 2026 UmitUZ. All rights reserved.', ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn('bg-bg-card border-t border-border mt-20 transition-theme', className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            {brand && (
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-text-primary mb-4">{brand.name}</h3>
                {brand.description && (
                  <p className="text-text-secondary text-sm leading-relaxed">{brand.description}</p>
                )}
              </div>
            )}

            {/* Sections */}
            {sections?.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-200 hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social */}
            {social && social.length > 0 && (
              <div>
                <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">Connect</h4>
                <div className="flex flex-wrap gap-3">
                  {social.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-secondary text-text-secondary hover:bg-primary-gradient hover:text-text-primary border border-border hover:border-transparent transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      aria-label={item.name}
                      title={item.name}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          {copyright && (
            <div className="border-t border-border mt-10 pt-8 text-center">
              <p className="text-sm text-text-secondary">{copyright}</p>
            </div>
          )}
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
