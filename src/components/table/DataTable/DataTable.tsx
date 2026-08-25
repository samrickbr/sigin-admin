import type { ReactNode } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import TableSortLabel from '@mui/material/TableSortLabel';

export interface Column<T extends object> {
  id: keyof T | string;
  label: string;
  field?: keyof T;
  width?: string;
  renderCell?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;

  page?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
}

export function DataTable<T extends object>({
  columns,
  rows,
  emptyMessage = 'Nenhum registro encontrado',
  page = 0,
  pageSize = 20,
  totalRows = 0,
  onPageChange,
  onPageSizeChange,
  sortField,
  sortDirection = 'asc',
  onSortChange,
}: DataTableProps<T>) {
  const paginationAtiva =
    totalRows > 0 && (onPageChange !== undefined || onPageSizeChange !== undefined);

  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    onPageChange?.(newPage);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const novoPageSize = Number(event.target.value);

    onPageSizeChange?.(novoPageSize);
    onPageChange?.(0);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 'none',
      }}
    >
      <Table
        sx={{
          width: '100%',
          tableLayout: 'fixed',
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.id)}
                sx={{
                  width: column.width,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {column.field ? (
                  <TableSortLabel
                    active={sortField === String(column.field)}
                    direction={sortField === String(column.field) ? sortDirection : 'asc'}
                    onClick={() => {
                      const field = String(column.field);

                      const nextDirection =
                        sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

                      onSortChange?.(field, nextDirection);
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const field = column.field ?? column.id;

                  return (
                    <TableCell
                      key={String(column.id)}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {column.renderCell
                        ? column.renderCell(row)
                        : field in row
                          ? String(row[field as keyof T] ?? '')
                          : ''}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {paginationAtiva && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          rowsPerPage={pageSize}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      )}
    </TableContainer>
  );
}
