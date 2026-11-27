import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { useClipboard } from '../hooks/useClipboard';
import type { BaseProps } from '../../domain/types';

/* The one external-share surface (Faz 50, 1965): every link a user
 * carries out of the app — a report share, a media kit, an invite, a
 * bio — gets the same contract in one place:
 *
 *   1. the URL row (monospace, selectable, copy with a settled state)
 *   2. the QR tile (lazy SVG — same bytes a phone camera reads)
 *   3. the preview face (how unfurlers will draw the card: image,
 *      title, description, domain)
 *
 * The preview is honest by construction: the caller passes the same
 * og values the served document carries, so what the user previews is
 * what the recipient's feed will render. No fetch, no iframe — the
 * component is a pure function of its props. */

export interface ShareLinkProps extends BaseProps {
  /** The absolute URL being shared. */
  url: string;
  /** og:title — the card's headline. */
  title: string;
  /** og:description — the card's body line. */
  description?: string;
  /** Absolute og:image URL for the preview face (optional: links
   *  without a card image show the text face alone). */
  imageUrl?: string;
  /** Render the QR tile (default true). */
  qr?: boolean;
  /** Render the unfurl preview face (default true). */
  preview?: boolean;
  /** Compact layout for dense rows: QR + URL inline, preview hidden
   *  unless explicitly enabled. */
  compact?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  openLabel?: string;
  /** Fired once the URL actually lands on the clipboard. */
  onCopied?: (url: string) => void;
}

export const ShareLink = ({
  url,
  title,
  description,
  imageUrl,
  qr = true,
  preview = true,
  compact = false,
  copyLabel = 'Copy link',
  copiedLabel = 'Copied',
  openLabel = 'Open',
  onCopied,
  className,
}: ShareLinkProps) => {
  const { copied, copy } = useClipboard();
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [qrFailed, setQrFailed] = useState(false);

  useEffect(() => {
    if (!qr || compact) return;
    let alive = true;
    QRCode.toString(url, { type: 'svg', margin: 1, width: 168 })
      .then((svg) => { if (alive) setQrSvg(svg); })
      .catch(() => { if (alive) setQrFailed(true); });
    return () => { alive = false; };
  }, [url, qr, compact]);

  const handleCopy = async () => {
    const success = await copy(url);
    if (success) onCopied?.(url);
  };

  let host = '';
  try { host = new URL(url).host; } catch { host = ''; }

  const showPreview = preview && !compact;

  return (
    <div className={cn('share-link', 'flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <code className="share-link__url min-w-0 flex-1 truncate rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-foreground" title={url}>
          {url}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? copiedLabel : copyLabel}
          title={copied ? copiedLabel : copyLabel}
          className={cn(
            'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            copied && 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          )}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span>{copied ? copiedLabel : copyLabel}</span>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={openLabel}
          title={openLabel}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {qr && !compact && (
        <div className="share-link__qr flex items-start gap-3">
          <div
            className="share-link__qr-tile size-[168px] shrink-0 overflow-hidden rounded-lg border border-border bg-white p-1.5 [&>svg]:size-full"
            aria-hidden="true"
          >
            {qrSvg && !qrFailed ? (
              <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
            ) : (
              <div className="flex size-full items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">QR</div>
            )}
          </div>
          {showPreview && (
            <div className="share-link__preview flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
              {imageUrl ? (
                <div className="share-link__preview-image h-28 w-full shrink-0 border-b border-border bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
              ) : null}
              <div className="flex min-h-0 flex-1 flex-col gap-1 p-3">
                <p className="share-link__preview-title line-clamp-2 text-sm font-semibold leading-snug text-foreground">{title}</p>
                {description ? (
                  <p className="share-link__preview-description line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
                ) : null}
                {host ? <p className="share-link__preview-host mt-auto pt-1 text-[11px] font-medium text-muted-foreground/80">{host}</p> : null}
              </div>
            </div>
          )}
        </div>
      )}

      {qr && compact && (
        <p className="share-link__qr-note text-[11px] text-muted-foreground">
          <a href={url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-foreground">{host || url}</a>
        </p>
      )}
    </div>
  );
};
