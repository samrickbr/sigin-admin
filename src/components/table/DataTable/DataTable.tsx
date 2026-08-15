import type { ReactNode } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
}

export function DataTable<T extends object>({
  columns,
  rows,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
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
                {column.label}
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
    </TableContainer>
  );
}
