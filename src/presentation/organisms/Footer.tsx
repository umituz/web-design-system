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
        className={cn('relative mt-20 transition-theme', className)}
        {...props}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-card via-bg-card to-bg-secondary opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Brand Section - Prominent */}
            {brand && (
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-bold text-text-primary mb-4 tracking-tight">{brand.name}</h3>
                {brand.description && (
                  <p className="text-text-secondary text-base leading-relaxed mb-6">{brand.description}</p>
                )}
                {/* Social Icons in Brand Section */}
                {social && social.length > 0 && (
                  <div className="flex items-center gap-3">
                    {social.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-bg-secondary text-text-secondary hover:bg-primary-gradient hover:text-text-primary border border-border hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/20"
                        aria-label={item.name}
                        title={item.name}
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Links Sections */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {sections?.map((section, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-text-secondary text-base hover:text-primary-light transition-colors duration-200 inline-flex items-center gap-2 group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          {copyright && (
            <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-secondary">{copyright}</p>
              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <a href="#" className="hover:text-primary-light transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary-light transition-colors">Terms</a>
              </div>
            </div>
          )}
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
