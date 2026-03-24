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
        className={cn('bg-bg-primary border-t border-border mt-20 transition-theme', className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brand */}
            {brand && (
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{brand.name}</h3>
                {brand.description && (
                  <p className="text-text-secondary text-sm">{brand.description}</p>
                )}
              </div>
            )}

            {/* Sections */}
            {sections?.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-text-primary mb-3">{section.title}</h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-primary-light transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social */}
            {social && (
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Connect</h4>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {social.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-primary-light transition-colors"
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
            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-secondary">
              <p>{copyright}</p>
            </div>
          )}
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
