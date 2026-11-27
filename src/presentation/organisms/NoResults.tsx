import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '../atoms/Button';
import { EmptyState } from './EmptyState';
import { useConsoleLabels } from '../page-kit/console-labels';

export interface NoResultsProps {
  icon?: ReactNode;
  onClear?: () => void;
}

export function NoResults({ icon, onClear }: NoResultsProps): React.ReactNode {
  const labels = useConsoleLabels();
  return (
    <EmptyState
      icon={icon ?? <SearchX size={20} />}
      title={labels.noResults.title}
      description={labels.noResults.description}
      action={onClear ? (
        <Button size="sm" onClick={onClear}>{labels.noResults.clear}</Button>
      ) : undefined}
    />
  );
}
