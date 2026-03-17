import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTablePagination } from './DataTablePagination';

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string;
  direction: SortDirection;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  pageSize?: number;
  getRowKey: (row: T) => string;
}

function sortData<T>(
  data: T[],
  sort: SortState,
  columns: ColumnDef<T>[],
): T[] {
  if (!sort.direction) return data;
  const col = columns.find((c) => c.key === sort.key);
  if (!col) return data;

  return [...data].sort((a, b) => {
    // Use the raw value from the row via key access
    const aVal = (a as Record<string, unknown>)[sort.key];
    const bVal = (b as Record<string, unknown>)[sort.key];
    const aStr = String(aVal ?? '').toLowerCase();
    const bStr = String(bVal ?? '').toLowerCase();
    const cmp = aStr.localeCompare(bStr, 'vi');
    return sort.direction === 'asc' ? cmp : -cmp;
  });
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  pageSize = 10,
  getRowKey,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: '', direction: null });
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      if (prev.direction === 'desc') return { key: '', direction: null };
      return { key, direction: 'asc' };
    });
    setPage(1);
  };

  const sortedData = sortData(data, sort, columns);
  const totalRows = sortedData.length;
  const pagedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sort.key !== colKey || !sort.direction)
      return <ChevronsUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
    if (sort.direction === 'asc')
      return <ChevronUp className="w-3 h-3 ml-1 inline" />;
    return <ChevronDown className="w-3 h-3 ml-1 inline" />;
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.className}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                style={col.sortable ? { cursor: 'pointer', userSelect: 'none' } : undefined}
              >
                {col.header}
                {col.sortable && <SortIcon colKey={col.key} />}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : pagedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-gray-500"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            pagedData.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && (
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
