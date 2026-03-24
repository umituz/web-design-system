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
        className={cn('relative mt-20 transition-theme overflow-hidden', className)}
        {...props}
      >
        <style>{`
          @keyframes gradient-shift {
            0%, 100% { opacity: 0.3; transform: scale(1) translate(0, 0); }
            50% { opacity: 0.5; transform: scale(1.1) translate(-10px, -10px); }
          }
          .animate-gradient-shift {
            animation: gradient-shift 8s ease-in-out infinite;
          }
        `}</style>

        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-card via-bg-secondary/30 to-bg-card"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-gradient-shift"></div>

        {/* Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Brand Section - Prominent */}
            {brand && (
              <div className="lg:col-span-1 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-text-primary tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="text-text-secondary text-base leading-relaxed">{brand.description}</p>
                  )}
                </div>

                {/* Social Icons - Enhanced */}
                {social && social.length > 0 && (
                  <div className="flex items-center gap-4">
                    {social.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-bg-secondary/50 text-text-secondary hover:bg-primary-gradient hover:text-white border border-border/50 hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
                        aria-label={item.name}
                        title={item.name}
                      >
                        {/* Glow effect */}
                        <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {/* Icon */}
                        <span className="relative">{item.icon}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Links Sections */}
            <div className="md:col-span-1 lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                {sections?.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className="font-bold text-text-primary text-sm uppercase tracking-widest">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-text-secondary text-base hover:text-primary-light transition-all duration-200 inline-flex items-center gap-2 group"
                          >
                            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 text-primary-light">→</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright Bar - Clean */}
          {copyright && (
            <div className="border-t border-border/30 mt-16 pt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                <p className="text-sm text-text-secondary/80">{copyright}</p>
              </div>
            </div>
          )}
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
