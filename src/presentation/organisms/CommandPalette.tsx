import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import { cn } from '../../infrastructure/utils';

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  keywords?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandGroup {
  heading?: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups?: CommandGroup[];
  placeholder?: string;
  emptyLabel?: string;
  label?: string;
  onQueryChange?: (q: string) => void;
}

interface FlatEntry {
  group: CommandGroup;
  item: CommandItem;
}

const matches = (item: CommandItem, q: string): boolean => {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    item.label.toLowerCase().includes(needle) ||
    (item.keywords !== undefined && item.keywords.toLowerCase().includes(needle))
  );
};

export const CommandPalette = ({
  open,
  onOpenChange,
  groups = [],
  placeholder = 'Type a command or search…',
  emptyLabel = 'No results.',
  label = 'Command palette',
  onQueryChange,
}: CommandPaletteProps) => {
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listId = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);

  const flat = React.useMemo<FlatEntry[]>(
    () =>
      groups
        .map((group) => ({ group, items: group.items.filter((i) => matches(i, query) && !i.disabled) }))
        .filter((g) => g.items.length > 0)
        .flatMap((g) => g.items.map((item) => ({ group: g.group, item }))),
    [groups, query]
  );

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }

  const onQueryChangeRef = React.useRef(onQueryChange);
  React.useEffect(() => {
    onQueryChangeRef.current = onQueryChange;
  });
  React.useEffect(() => {
    if (open) {
      onQueryChangeRef.current?.('');
    }
  }, [open]);

  const [prevFlatLength, setPrevFlatLength] = React.useState(flat.length);
  if (flat.length !== prevFlatLength) {
    setPrevFlatLength(flat.length);
    setActiveIndex((i) => Math.min(i, Math.max(flat.length - 1, 0)));
  }

  React.useEffect(() => {
    const active = flat[activeIndex];
    if (!active) return;
    const el = document.getElementById(`cmd-opt-${active.item.id}`);
    if (typeof el?.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, flat]);

  const choose = (entry: FlatEntry) => {
    onOpenChange(false);
    entry.item.onSelect();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (flat.length === 0) return;
      setActiveIndex((i) =>
        e.key === 'ArrowDown' ? (i + 1) % flat.length : (i - 1 + flat.length) % flat.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const entry = flat[activeIndex];
      if (entry) choose(entry);
    }
  };

  const active = flat[activeIndex];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-label={label}
          className="fixed left-1/2 top-[12%] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={active ? `cmd-opt-${active.item.id}` : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
                onQueryChange?.(e.target.value);
              }}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[320px] overflow-y-auto p-1">
            {flat.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>
            )}
            {flat.map((entry, i) => {
              const showHeading = i === 0 || flat[i - 1]?.group !== entry.group;
              return (
                <React.Fragment key={entry.item.id}>
                  {showHeading && entry.group.heading && (
                    <p className="px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground">
                      {entry.group.heading}
                    </p>
                  )}
                  <div
                    id={`cmd-opt-${entry.item.id}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    tabIndex={-1}
                    onClick={() => choose(entry)}
                    onMouseMove={() => setActiveIndex(i)}
                    className={cn(
                      'flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none',
                      i === activeIndex && 'bg-accent text-accent-foreground',
                      entry.item.danger && 'text-destructive',
                      i === activeIndex && entry.item.danger && 'bg-destructive/10'
                    )}
                  >
                    {entry.item.icon}
                    <span className="flex-1 truncate">{entry.item.label}</span>
                    {entry.item.hint && (
                      <span className="text-xs text-muted-foreground">{entry.item.hint}</span>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

CommandPalette.displayName = 'CommandPalette';
