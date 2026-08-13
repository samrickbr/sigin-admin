import api from '../../../services/api';

import type { PermissaoRequest, PermissaoResponse } from '../types/perfilPermissoes';

export async function getPermissoes(): Promise<PermissaoResponse[]> {
  const response = await api.get<PermissaoResponse[]>('/permissoes');

  return response.data;
}

export async function getPermissaoById(id: number): Promise<PermissaoResponse> {
  const response = await api.get<PermissaoResponse>(`/permissoes/${id}`);

  return response.data;
}

export async function createPermissao(data: PermissaoRequest): Promise<PermissaoResponse> {
  const response = await api.post<PermissaoResponse>('/permissoes', data);

  return response.data;
}

export async function updatePermissao(
  id: number,
  data: PermissaoRequest,
): Promise<PermissaoResponse> {
  const response = await api.put<PermissaoResponse>(`/permissoes/${id}`, data);

  return response.data;
}
