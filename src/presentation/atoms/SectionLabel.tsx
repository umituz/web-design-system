import type { ReactNode } from 'react';

export interface SectionLabelProps {
  no?: string | number;
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ no, children, className }: SectionLabelProps) {
  return (
    <div className={`udb-section-label section-label${className ? ` ${className}` : ''}`}>
      {no != null && <span className="udb-section-label__no section-label__no">{String(no).padStart(2, '0')}</span>}
      <span>{children}</span>
    </div>
  );
}
