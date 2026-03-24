/**
 * Breadcrumb Component (Molecule)
 * @description Navigation breadcrumb with home icon
 */

// @ts-ignore - react-router-dom is a peer dependency, may not be available during package build
import { Link } from 'react-router-dom';
import type { BaseProps } from '../../domain/types';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends BaseProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center gap-2 text-sm mb-4 md:mb-6 ${className || ''}`} aria-label="Breadcrumb">
      {/* Home */}
      <Link
        to="/"
        className="flex items-center gap-1 text-text-secondary hover:text-primary-light transition-colors"
        aria-label="Home"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {item.href ? (
            <Link
              to={item.href}
              className="text-text-secondary hover:text-primary-light transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
