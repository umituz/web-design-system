/**
 * DataTable Component (Organism)
 * @description Enhanced table component for displaying data with sorting and pagination
 */

import { useState, useMemo } from 'react';
import { cn } from '../../infrastructure/utils/cn';
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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { BaseProps, SizeVariant, ColorVariant } from '../../domain/types';

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> extends BaseProps {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  size?: Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
  variant?: ColorVariant;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  emptyState?: {
    title: string;
    description?: string;
  };
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  className,
  data,
  columns,
  caption,
  size = 'md',
  variant = 'primary',
  sortable = false,
  paginated = false,
  pageSize = 10,
  emptyState,
  onRowClick,
  ...props
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (columnId: string) => {
    if (!sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortable) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((col) => col.id === sortColumn);
      if (!column) return 0;

      const aValue = typeof column.accessor === 'function' ? column.accessor(a) : a[column.accessor];
      const bValue = typeof column.accessor === 'function' ? column.accessor(b) : b[column.accessor];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, columns, sortable]);

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, paginated, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }

    const value = typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor];
    return value as React.ReactNode;
  };

  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const paddingStyles = {
    sm: 'px-2 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

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
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  sizeStyles[size],
                  paddingStyles[size],
                  column.sortable && sortable && 'cursor-pointer hover:bg-muted/50',
                  column.className
                )}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sortable && sortColumn === column.id && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={cn(paddingStyles[size], column.className)}
                >
                  {renderCell(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {paginated && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex items-center justify-between">
                  <p className={cn('text-muted-foreground', sizeStyles[size])}>
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className={cn('text-sm font-medium', sizeStyles[size])}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
