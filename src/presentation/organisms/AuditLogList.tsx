import * as React from 'react';
import { ScrollText } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  at: string;
}

export interface AuditLogListProps extends BaseProps {
  entries: AuditEntry[];
  emptyLabel?: string;
  formatAt?: (iso: string) => string;
}

const defaultFormatAt = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toISOString().slice(0, 16).replace('T', ' ');
};

export const AuditLogList: React.FC<AuditLogListProps> = ({
  entries,
  emptyLabel = 'Henüz denetim kaydı bulunmuyor.',
  formatAt = defaultFormatAt,
  className,
}) => {
  if (entries.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 text-center text-muted-foreground', className)}>
        <ScrollText className="size-8 opacity-40 mb-2" aria-hidden="true" />
        <p className="text-xs sm:text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <ul className={cn('divide-y divide-border border border-border rounded-xl overflow-hidden bg-card text-xs', className)}>
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-wrap items-center gap-3 p-3 hover:bg-muted/40 transition-colors">
          <span className="font-mono text-muted-foreground shrink-0">{formatAt(entry.at)}</span>
          <span className="font-semibold text-foreground">{entry.actor}</span>
          <span className="text-muted-foreground">{entry.action}</span>
          {entry.target && (
            <span className="font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">
              {entry.target}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

AuditLogList.displayName = 'AuditLogList';
