import { useState, useMemo } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Columns3,
} from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';
import { Button } from '../atoms/Button';
import { Skeleton } from '../atoms/Skeleton';
import { Checkbox } from '../atoms/Checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from './DropdownMenu';
import {
  computeTotalPages,
  clampPageNumber,
  computePageBounds,
} from '../../infrastructure/utils/calculation.utils';
import type { BaseProps } from '../../domain/types';
import type { MediumSizes } from '../../infrastructure/constants';

export type ColumnAlign = 'left' | 'right' | 'center';
export type ColumnHideBelow = 'sm' | 'md' | 'lg' | 'xl';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  id: string;
  dir: SortDirection;
}

export interface Column<T> {
  id: string;
  header: ReactNode;
  /** Data source; optional when the column renders through `cell` only. */
  accessor?: keyof T | ((row: T) => ReactNode);
  cell?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  sortable?: boolean;
  align?: ColumnAlign;
  hideBelow?: ColumnHideBelow;
  /** Pixels when numeric. */
  width?: string | number;
  className?: string;
  /** Hidden until the reader enables it from the built-in columns menu. */
  optional?: boolean;
}

export interface TablePaginationProps extends BaseProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  label?: ReactNode;
  hideWhenSingle?: boolean;
}

export interface DataTableProps<T> extends BaseProps {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  size?: MediumSizes;
  sortable?: boolean;
  sort?: SortState | null;
  initialSort?: SortState | null;
  onSortChange?: (id: string) => void;
  rowKey?: (row: T) => string;
  selectedId?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  bulkBar?: (selection: { ids: string[]; clear: () => void }) => ReactNode;
  toolbar?: ReactNode;
  dense?: boolean;
  loading?: boolean;
  empty?: ReactNode;
  sticky?: boolean;
  stackable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  emptyState?: {
    title: string;
    description?: string;
  };
  onRowClick?: (row: T) => void;
  rowLabel?: (row: T) => string;
  /** Row-level class, e.g. a tone accent for overdue rows. */
  rowClass?: (row: T) => string | undefined;
}

const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, label';

function rowClickAllowed(event: ReactMouseEvent<HTMLTableRowElement>): boolean {
  if (event.target === event.currentTarget) return true;
  return !(event.target as HTMLElement).closest(INTERACTIVE_SELECTOR);
}

function stackLabel<T>(column: Column<T>): string {
  return typeof column.header === 'string' ? column.header : column.id;
}

const alignStyles: Record<ColumnAlign, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

const hideBelowStyles: Record<ColumnHideBelow, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
};

function displayValue<T>(column: Column<T>, row: T): ReactNode {
  if (column.cell) return column.cell(row);
  if (column.accessor === undefined) return null;
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row[column.accessor] as ReactNode);
}

function sortValueOf<T>(column: Column<T>, row: T): string | number | null {
  if (column.sortValue) return column.sortValue(row);
  if (column.accessor === undefined) return null;
  const value =
    typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor];
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string') return value;
  return null;
}

function compareValues(a: string | number | null, b: string | number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

export function TablePagination({ className, page, totalPages, onPage, label, hideWhenSingle = false }: TablePaginationProps) {
  const safeTotalPages = Number.isFinite(totalPages) ? Math.max(Math.floor(totalPages), 1) : 1;
  const safePage = Number.isFinite(page) ? Math.min(Math.max(Math.floor(page), 1), safeTotalPages) : 1;

  const slots = useMemo(() => {
    type Slot = number | 'ellipsis-start' | 'ellipsis-end';
    const out: Slot[] = [1];
    const start = Math.max(safePage - 1, 2);
    const end = Math.min(safePage + 1, safeTotalPages - 1);
    if (start > 2) out.push('ellipsis-start');
    for (let p = start; p <= end; p += 1) out.push(p);
    if (end < safeTotalPages - 1) out.push('ellipsis-end');
    if (safeTotalPages > 1) out.push(safeTotalPages);
    return out;
  }, [safePage, safeTotalPages]);

  if (safeTotalPages <= 1 && hideWhenSingle) {
    if (!label) return null;
    return <div className={cn('text-sm text-muted-foreground', className)}>{label}</div>;
  }

  return (
    <nav className={cn('flex items-center justify-between gap-2', className)} aria-label="Pagination">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPage(1)}
          disabled={safePage <= 1}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPage(safePage - 1)}
          disabled={safePage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {slots.map((slot) =>
          typeof slot === 'number' ? (
            <Button
              key={slot}
              size="sm"
              variant="outline"
              className={cn(
                'min-w-9',
                slot === safePage && 'pointer-events-none bg-primary text-primary-foreground'
              )}
              onClick={() => onPage(slot)}
              aria-current={slot === safePage ? 'page' : undefined}
            >
              {slot}
            </Button>
          ) : (
            <span key={slot} className="px-1 text-muted-foreground" aria-hidden="true">
              …
            </span>
          )
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPage(safePage + 1)}
          disabled={safePage >= safeTotalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPage(safeTotalPages)}
          disabled={safePage >= safeTotalPages}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

export function DataTable<T>({
  className,
  data,
  columns,
  caption,
  size = 'md',
  sortable = false,
  sort,
  initialSort,
  onSortChange,
  rowKey,
  selectedId,
  selectable = false,
  selectedIds,
  onSelectionChange,
  bulkBar,
  toolbar,
  dense = false,
  loading = false,
  empty,
  sticky = false,
  stackable = false,
  paginated = false,
  pageSize = 10,
  emptyState,
  onRowClick,
  rowLabel,
  rowClass,
  ...props
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<SortState | null>(initialSort ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelection, setInternalSelection] = useState<string[]>([]);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>(() =>
    columns.filter((column) => column.optional).map((column) => column.id),
  );

  const activeSort = sort !== undefined ? sort : internalSort;
  const controlled = sort !== undefined;

  const selectionEnabled = selectable && rowKey !== undefined;
  const selectionControlled = selectedIds !== undefined;
  const selection = selectionControlled ? selectedIds : internalSelection;
  const selectionSet = useMemo(() => new Set(selection), [selection]);

  const commitSelection = (next: string[]) => {
    if (!selectionControlled) setInternalSelection(next);
    onSelectionChange?.(next);
  };

  const toggleRowSelection = (key: string) => {
    commitSelection(selectionSet.has(key) ? selection.filter((id) => id !== key) : [...selection, key]);
  };

  const handleSort = (id: string) => {
    if (!sortable) return;
    if (controlled) {
      onSortChange?.(id);
      return;
    }
    setInternalSort((prev) =>
      prev && prev.id === id
        ? { id, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { id, dir: 'asc' }
    );
  };

  const sortedData = useMemo(() => {
    if (!activeSort || !sortable) return data;
    const column = columns.find((col) => col.id === activeSort.id);
    if (!column) return data;
    const factor = activeSort.dir === 'asc' ? 1 : -1;
    return [...data].sort(
      (a, b) => factor * compareValues(sortValueOf(column, a), sortValueOf(column, b))
    );
  }, [data, activeSort, columns, sortable]);

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, paginated, pageSize]);

  const totalPages = computeTotalPages(data.length, pageSize);
  const safePage = clampPageNumber(currentPage, totalPages);
  const pageBounds = computePageBounds(currentPage, pageSize, data.length);

  const knownColumnIds = useMemo(() => new Set(columns.map((column) => column.id)), [columns]);
  const effectiveHiddenColumnIds = useMemo(
    () => hiddenColumnIds.filter((id) => knownColumnIds.has(id)),
    [hiddenColumnIds, knownColumnIds],
  );
  const hasOptionalColumns = useMemo(() => columns.some((column) => column.optional), [columns]);
  const visibleColumns = useMemo(
    () => columns.filter((column) => !effectiveHiddenColumnIds.includes(column.id)),
    [columns, effectiveHiddenColumnIds],
  );

  const pageKeys = selectionEnabled ? paginatedData.map((row) => rowKey!(row)) : [];
  const allPageSelected = pageKeys.length > 0 && pageKeys.every((key) => selectionSet.has(key));
  const somePageSelected = pageKeys.some((key) => selectionSet.has(key));
  const togglePageSelection = () => {
    if (!selectionEnabled || pageKeys.length === 0) return;
    commitSelection(
      allPageSelected
        ? selection.filter((id) => !pageKeys.includes(id))
        : [...new Set([...selection, ...pageKeys])],
    );
  };

  const sizeStyles: Record<MediumSizes, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const pxStyles: Record<MediumSizes, string> = {
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
  };

  const pyStyles: Record<MediumSizes, string> = dense
    ? { sm: 'py-1', md: 'py-1.5', lg: 'py-2' }
    : { sm: 'py-2', md: 'py-3', lg: 'py-4' };

  if (loading) {
    const skeletonRows = dense ? 8 : 6;
    const skeletonCols = Math.min(columns.length, 6);
    return (
      <div className={cn('space-y-3 p-2', className)} {...props}>
        {Array.from({ length: skeletonRows }).map((_, row) => (
          <div key={row} className="flex items-center gap-4" style={{ opacity: 1 - row * 0.08 }}>
            {Array.from({ length: skeletonCols }).map((_, col) => (
              <Skeleton key={col} variant="text" className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0 && empty !== undefined) {
    return <>{empty}</>;
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <p className="font-semibold text-foreground">{emptyState.title}</p>
        {emptyState.description && (
          <p className="text-sm text-muted-foreground mt-1">{emptyState.description}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', stackable && 'ds-datatable-stack', className)} {...props}>
      {(toolbar !== undefined || hasOptionalColumns) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {toolbar !== undefined && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
          {hasOptionalColumns && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 className="h-4 w-4" aria-hidden="true" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={!effectiveHiddenColumnIds.includes(column.id)}
                    disabled={!column.optional}
                    onCheckedChange={(checked) =>
                      setHiddenColumnIds((prev) =>
                        checked
                          ? prev.filter((id) => id !== column.id)
                          : prev.includes(column.id)
                            ? prev
                            : [...prev, column.id],
                      )
                    }
                    onSelect={(event) => event.preventDefault()}
                  >
                    {typeof column.header === 'string' ? column.header : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      {selectionEnabled && bulkBar && selection.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          {bulkBar({ ids: selection, clear: () => commitSelection([]) })}
        </div>
      )}
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead
                className={cn(
                  'w-10',
                  pxStyles[size],
                  pyStyles[size],
                  sticky && 'sticky top-0 z-[1] bg-background/95 backdrop-blur',
                )}
              >
                <Checkbox
                  size="sm"
                  checked={allPageSelected}
                  indeterminate={!allPageSelected && somePageSelected}
                  onCheckedChange={togglePageSelection}
                  disabled={pageKeys.length === 0}
                  aria-label="Select all rows on this page"
                />
              </TableHead>
            )}
            {visibleColumns.map((column) => {
              const isActiveSort = activeSort?.id === column.id;
              return (
                <TableHead
                  key={column.id}
                  style={column.width ? { width: typeof column.width === 'number' ? `${column.width}px` : column.width } : undefined}
                  className={cn(
                    sizeStyles[size],
                    pxStyles[size],
                    pyStyles[size],
                    sticky && 'sticky top-0 z-[1] bg-background/95 backdrop-blur',
                    column.align && column.align !== 'left' && alignStyles[column.align],
                    column.hideBelow && hideBelowStyles[column.hideBelow],
                    column.sortable && sortable && 'cursor-pointer select-none hover:bg-muted/50',
                    column.className
                  )}
                  onClick={() => {
                    if (column.sortable && sortable) handleSort(column.id);
                  }}
                  aria-sort={
                    isActiveSort
                      ? activeSort?.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable && sortable
                        ? 'none'
                        : undefined
                  }
                >
                  <div
                    className={cn(
                      'flex items-center gap-2',
                      column.align === 'right' && 'flex-row-reverse'
                    )}
                  >
                    {column.header}
                    {column.sortable && sortable && (
                      <span className="text-xs">
                        {isActiveSort ? (
                          activeSort?.dir === 'asc' ? (
                            <ArrowUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="h-3 w-3" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => {
            const key = rowKey ? rowKey(row) : index;
            const selected = rowKey !== undefined && selectedId !== undefined && rowKey(row) === selectedId;
            const rowSelected = selectionEnabled && typeof key === 'string' && selectionSet.has(key);
            const handleRowKeyDown = (event: ReactKeyboardEvent<HTMLTableRowElement>) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onRowClick?.(row);
              }
            };
            return (
              <TableRow
                key={key}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick && rowLabel ? rowLabel(row) : undefined}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  (selected || rowSelected) && 'bg-muted/60',
                  rowClass?.(row)
                )}
                onClick={
                  onRowClick
                    ? (event) => {
                        if (rowClickAllowed(event)) onRowClick(row);
                      }
                    : undefined
                }
                onKeyDown={onRowClick ? handleRowKeyDown : undefined}
              >
                {selectionEnabled && typeof key === 'string' && (
                  <TableCell className={cn('w-10', pxStyles[size], pyStyles[size])}>
                    <Checkbox
                      size="sm"
                      checked={rowSelected}
                      onCheckedChange={() => toggleRowSelection(key)}
                      aria-label={rowLabel ? `Select ${rowLabel(row)}` : 'Select row'}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    data-label={stackable ? stackLabel(column) : undefined}
                    className={cn(
                      pxStyles[size],
                      pyStyles[size],
                      column.align && column.align !== 'left' && alignStyles[column.align],
                      column.hideBelow && hideBelowStyles[column.hideBelow],
                      column.className
                    )}
                  >
                    {displayValue(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        {paginated && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={visibleColumns.length + (selectionEnabled ? 1 : 0)}>
                <div className="flex items-center justify-between gap-2">
                  <p className={cn('text-muted-foreground', sizeStyles[size])}>
                    Showing {pageBounds.startIndex} to {pageBounds.endIndex} of {data.length} results
                  </p>
                  <TablePagination
                    page={safePage}
                    totalPages={totalPages}
                    onPage={(p) => setCurrentPage(clampPageNumber(p, totalPages))}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
