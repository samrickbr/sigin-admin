import { useQuery } from '@tanstack/react-query';
import { pedidosService } from '../services/pedidosService';

export function usePedidos() {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosService.listar,
  });
}

export function usePedido(id: number | undefined) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: () => pedidosService.buscarPorId(id!),
    enabled: !!id,
  });
}

export function usePedidoItens(pedidoId: number | undefined) {
  return useQuery({
    queryKey: ['pedido-itens', pedidoId],
    queryFn: () => pedidosService.listarItens(pedidoId!),
    enabled: !!pedidoId,
  });
}
