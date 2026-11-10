import { forwardRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../infrastructure/utils';

export interface EntityRowProps {
  icon: ReactNode;
  title: ReactNode;
  meta?: ReactNode[];
  badge?: ReactNode;
  aside?: ReactNode;
  to?: string;
  highlight?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export const EntityRow = forwardRef<HTMLLIElement, EntityRowProps>(
  (
    {
      icon,
      title,
      meta,
      badge,
      aside,
      to,
      highlight = false,
      className,
      onClick,
      children,
    },
    ref
  ) => {
    const content = (
      <>
        <span className="entity-row-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="entity-row-main">
          <span className={cn('entity-row-title', highlight && 'highlight')}>
            {title}
            {highlight && <span className="entity-row-dot" role="img" aria-label="Unread" />}
          </span>
          {meta?.map((line, index) => (
            <span key={index} className="entity-row-meta">
              {line}
            </span>
          ))}
          {children}
        </span>
        {badge && <span className="entity-row-badge">{badge}</span>}
        {aside && <span className="entity-row-aside">{aside}</span>}
      </>
    );

    const rowClasses = cn('entity-row', highlight && 'highlight', className);

    if (to) {
      return (
        <li ref={ref} className="list-none">
          <Link to={to} className={rowClasses} onClick={onClick}>
            {content}
          </Link>
        </li>
      );
    }

    return (
      <li ref={ref} className={rowClasses} onClick={onClick}>
        {content}
      </li>
    );
  }
);

EntityRow.displayName = 'EntityRow';
