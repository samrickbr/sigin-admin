import api from '../../../services/api';

import type { CanalVendaRequest, CanalVendaResponse } from '../types/canaisVenda';

export async function getCanaisVenda(): Promise<CanalVendaResponse[]> {
  const response = await api.get<CanalVendaResponse[]>('/api/canais-venda');

  return response.data;
}

export async function getCanalVendaById(id: number): Promise<CanalVendaResponse> {
  const response = await api.get<CanalVendaResponse>(`/api/canais-venda/${id}`);

  return response.data;
}

export async function createCanalVenda(data: CanalVendaRequest): Promise<CanalVendaResponse> {
  const response = await api.post<CanalVendaResponse>('/api/canais-venda', data);

  return response.data;
}

export async function updateCanalVenda(
  id: number,
  data: CanalVendaRequest,
): Promise<CanalVendaResponse> {
  const response = await api.put<CanalVendaResponse>(`/api/canais-venda/${id}`, data);

  return response.data;
}

export async function deleteCanalVenda(id: number): Promise<void> {
  await api.delete(`/api/canais-venda/${id}`);
}
