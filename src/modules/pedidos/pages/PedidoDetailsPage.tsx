import { useParams } from 'react-router-dom';
import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { EmptyState, Loading } from '../../../components/common';
import { usePedido, usePedidoItens } from '../hooks/usePedidos';

export function PedidoDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const pedidoId = id ? Number(id) : undefined;

  const pedidoQuery = usePedido(pedidoId);
  const itensQuery = usePedidoItens(pedidoId);

  if (pedidoQuery.isLoading) {
    return <Loading />;
  }

  if (!pedidoQuery.data || pedidoQuery.isError) {
    return <EmptyState message="Pedido não encontrado." />;
  }

  const pedido = pedidoQuery.data;
  const itens = itensQuery.data ?? [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Pedido #{pedido.numero}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dados do pedido
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Cliente
            </Typography>
            <Typography>{pedido.cliente || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Canal de venda
            </Typography>
            <Typography>{pedido.canalVenda || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Data
            </Typography>
            <Typography>{new Date(pedido.dataPedido).toLocaleString('pt-BR')}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Forma de pagamento
            </Typography>
            <Typography>{pedido.formaPagamento || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography>{pedido.status}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Valor total
            </Typography>
            <Typography>
              {pedido.valorTotal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
          </Box>
        </Box>

        {pedido.observacao && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              Observação
            </Typography>
            <Typography>{pedido.observacao}</Typography>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Itens
        </Typography>

        {itensQuery.isLoading ? (
          <Loading />
        ) : itens.length === 0 ? (
          <EmptyState message="Nenhum item encontrado." />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="right">Valor unitário</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.produto || '-'}</TableCell>
                  <TableCell align="right">{item.quantidade}</TableCell>
                  <TableCell align="right">
                    {item.valorUnitario.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell align="right">
                    {item.valorTotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
