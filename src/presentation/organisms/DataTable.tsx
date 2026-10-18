import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
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
  accessor: keyof T | ((row: T) => ReactNode);
  cell?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  sortable?: boolean;
  align?: ColumnAlign;
  hideBelow?: ColumnHideBelow;
  className?: string;
}

export interface TablePaginationProps extends BaseProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}

export interface DataTableProps<T> extends BaseProps {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  size?: MediumSizes;
  sortable?: boolean;
  sort?: SortState;
  onSortChange?: (id: string) => void;
  rowKey?: (row: T) => string;
  selectedId?: string;
  dense?: boolean;
  loading?: boolean;
  empty?: ReactNode;
  sticky?: boolean;
  paginated?: boolean;
  pageSize?: number;
  emptyState?: {
    title: string;
    description?: string;
  };
  onRowClick?: (row: T) => void;
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
  return typeof column.accessor === 'function'
    ? column.accessor(row)
    : (row[column.accessor] as ReactNode);
}

function sortValueOf<T>(column: Column<T>, row: T): string | number | null {
  if (column.sortValue) return column.sortValue(row);
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

export function TablePagination({ className, page, totalPages, onPage }: TablePaginationProps) {
  const windowPages = useMemo(() => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const out: number[] = [];
    for (let p = start; p < start + 5 && p <= totalPages; p += 1) out.push(p);
    return out;
  }, [page, totalPages]);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(1)}
        disabled={page <= 1}
        aria-label="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {windowPages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant="outline"
          className={cn(
            'min-w-9',
            p === page && 'pointer-events-none bg-primary text-primary-foreground'
          )}
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </Button>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(totalPages)}
        disabled={page >= totalPages}
        aria-label="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
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
  onSortChange,
  rowKey,
  selectedId,
  dense = false,
  loading = false,
  empty,
  sticky = false,
  paginated = false,
  pageSize = 10,
  emptyState,
  onRowClick,
  ...props
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<SortState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const activeSort = sort ?? internalSort;
  const controlled = sort !== undefined;

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
    <div className={cn('space-y-4', className)} {...props}>
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const isActiveSort = activeSort?.id === column.id;
              return (
                <TableHead
                  key={column.id}
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
            return (
              <TableRow
                key={key}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  selected && 'bg-muted/60'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
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
              <TableCell colSpan={columns.length}>
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
