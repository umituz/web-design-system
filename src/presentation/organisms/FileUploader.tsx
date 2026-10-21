/**
 * FileUploader Component (Organism)
 * @description Keyboard-accessible drag-and-drop file picker with a queued
 *   file preview list. Visual only — storage wiring belongs to the host.
 */

import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../infrastructure/utils';

export interface FileUploaderProps {
  /** Drop-zone headline. */
  label?: string;
  /** Secondary line under the headline. */
  hint?: string;
  accept?: string;
  multiple?: boolean;
  /** Called with the picked/dropped files. */
  onFiles?: (files: File[]) => void;
  /** How many queued names to list before stopping (visual cap only). */
  maxPreview?: number;
}

export function FileUploader({
  label = 'Drop files here or click to browse',
  hint,
  accept,
  multiple = true,
  onFiles,
  maxPreview = 6,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    setPicked((prev) => [...prev, ...arr.map((f) => f.name)].slice(0, maxPreview));
    onFiles?.(arr);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          drag ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/50',
        )}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <UploadCloud className="size-6 text-muted-foreground" aria-hidden />
        <div className="text-sm font-medium">{label}</div>
        {hint !== undefined && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {picked.length > 0 && (
        <ul className="mt-2 space-y-1">
          {picked.map((name, i) => (
            <li key={`${name}-${i}`} className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-mono">{name}</span>
              <span className="shrink-0 text-muted-foreground">queued</span>
            </li>
          ))}
          <li>
            <Button variant="ghost" size="xs" className="mt-1" onClick={() => setPicked([])}>
              Clear
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
}
