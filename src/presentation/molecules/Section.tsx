import type { ReactNode } from 'react';

export function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}): React.ReactNode {
  return (
    <div className="section-head">
      <div>
        <h3 className="section-title">{title}</h3>
        {subtitle ? (
          <div style={{ fontSize: 12.5, color: 'var(--ink-500, var(--ink-600))', marginTop: 2 }}>{subtitle}</div>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function DetailItem({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}): React.ReactNode {
  return (
    <div className="detail-item">
      <div className="d-label">{label}</div>
      <div className="d-value">{children}</div>
    </div>
  );
}

export function DetailGrid({
  children,
  columns,
}: {
  children: ReactNode;
  columns?: number;
}): React.ReactNode {
  return (
    <div
      className="detail-grid"
      style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
    >
      {children}
    </div>
  );
}
