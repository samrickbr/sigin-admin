import api from '../../../services/api';
import type { PedidoItemResponse, PedidoResponse } from '../types/pedidos';

async function listar(): Promise<PedidoResponse[]> {
  const response = await api.get<PedidoResponse[]>('/pedidos');
  return response.data;
}

async function buscarPorId(id: number): Promise<PedidoResponse> {
  const response = await api.get<PedidoResponse>(`/pedidos/${id}`);
  return response.data;
}

async function listarItens(pedidoId: number): Promise<PedidoItemResponse[]> {
  const response = await api.get<PedidoItemResponse[]>(`/pedidos/${pedidoId}/itens`);
  return response.data;
}

export const pedidosService = {
  listar,
  buscarPorId,
  listarItens,
};
