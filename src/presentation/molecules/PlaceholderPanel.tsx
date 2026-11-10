import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export interface PlaceholderPanelProps {
  step: string;
  title: string;
  description: string;
  capabilities: string[];
  children?: ReactNode;
  className?: string;
}

export function PlaceholderPanel({
  step,
  title,
  description,
  capabilities,
  children,
  className,
}: PlaceholderPanelProps) {
  return (
    <section className={cn('placeholder-panel', className)} aria-label={title}>
      <div>
        <span className="placeholder-panel-step">Roadmap · {step}</span>
        <h2 className="placeholder-panel-title">{title}</h2>
        <p className="placeholder-panel-desc">{description}</p>
      </div>
      <ul className="placeholder-panel-caps">
        {capabilities.map((capability) => (
          <li key={capability} className="placeholder-panel-cap">
            <Check size={15} className="placeholder-panel-check" aria-hidden="true" />
            {capability}
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}
