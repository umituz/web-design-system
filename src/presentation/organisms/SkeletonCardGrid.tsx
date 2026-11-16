import { cn } from '../../infrastructure/utils';
import { Skeleton } from '../atoms/Skeleton';
import type { BaseProps } from '../../domain/types';

export interface SkeletonCardGridProps extends BaseProps {
  count?: number;
}

export function SkeletonCardGrid({ count = 8, className }: SkeletonCardGridProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(className)}
      style={{ display: 'grid', gap: 'var(--space-5)', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <Skeleton variant="rectangular" style={{ height: 150 }} />
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Skeleton variant="circular" />
            <div style={{ display: 'grid', gap: 'var(--space-2)', flex: 1 }}>
              <Skeleton variant="text" style={{ width: '85%' }} />
              <Skeleton variant="text" style={{ width: '55%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
