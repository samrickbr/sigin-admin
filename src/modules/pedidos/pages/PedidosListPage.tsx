import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import type { Column } from '../../../components/table/DataTable/DataTable';
import { EmptyState, Loading } from '../../../components/common';
import { usePedidos } from '../hooks/usePedidos';
import type { PedidoResponse } from '../types/pedidos';

const columns: Column<PedidoResponse>[] = [
  {
    id: 'numero',
    label: 'Número',
    field: 'numero',
    width: '12%',
  },
  {
    id: 'cliente',
    label: 'Cliente',
    field: 'cliente',
    width: '18%',
  },
  {
    id: 'canalVenda',
    label: 'Canal',
    field: 'canalVenda',
    width: '15%',
  },
  {
    id: 'dataPedido',
    label: 'Data',
    field: 'dataPedido',
    width: '15%',
    renderCell: (row) => new Date(row.dataPedido).toLocaleString('pt-BR'),
  },
  {
    id: 'valorTotal',
    label: 'Valor',
    field: 'valorTotal',
    width: '12%',
    renderCell: (row) =>
      row.valorTotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    id: 'formaPagamento',
    label: 'Pagamento',
    field: 'formaPagamento',
    width: '14%',
  },
  {
    id: 'status',
    label: 'Status',
    field: 'status',
    width: '14%',
  },
];

export function PedidosListPage() {
  const navigate = useNavigate();
  const { data: pedidos = [], isLoading, isError } = usePedidos();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <EmptyState message="Não foi possível carregar os pedidos." />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">Pedidos</Typography>
      </Box>

      {pedidos.length === 0 ? (
        <EmptyState message="Nenhum pedido encontrado." />
      ) : (
        <DataTable
          columns={[
            ...columns,
            {
              id: 'acoes',
              label: 'Ações',
              width: '10%',
              renderCell: (row) => (
                <Button size="small" onClick={() => navigate(`/pedidos/${row.id}`)}>
                  Visualizar
                </Button>
              ),
            },
          ]}
          rows={pedidos}
        />
      )}
    </Box>
  );
}
