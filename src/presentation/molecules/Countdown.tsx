import { cn } from '../../infrastructure/utils/cn.util';
import { formatCountdown } from '../../infrastructure/utils/time.util';
import { useNow } from '../hooks/useNow';

export interface CountdownProps {
  target: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  endedLabel?: string;
}

export function Countdown({
  target,
  size = 'sm',
  className,
  endedLabel = 'Closed',
}: CountdownProps) {
  const now = useNow(size === 'lg' ? 250 : 1000);
  const left = target - now;
  const urgent = left > 0 && left < 60_000;
  const warn = left > 0 && left < 10 * 60_000;
  const ended = left <= 0;

  return (
    <span
      className={cn(
        'countdown mono',
        `countdown--${size}`,
        ended ? 'countdown--ended' : urgent ? 'countdown--urgent' : warn ? 'countdown--warn' : 'countdown--live',
        className
      )}
    >
      {!ended && (urgent || warn) && <span className="countdown__pulse" aria-hidden />}
      {ended ? endedLabel : formatCountdown(left)}
    </span>
  );
}
