import api from '../../../services/api';

import type { PerfilRequest, PerfilResponse } from '../types/perfis';

export async function getPerfis(): Promise<PerfilResponse[]> {
  const response = await api.get<PerfilResponse[]>('/perfis');

  return response.data;
}

export async function getPerfilById(id: number): Promise<PerfilResponse> {
  const response = await api.get<PerfilResponse>(`/perfis/${id}`);

  return response.data;
}

export async function createPerfil(data: PerfilRequest): Promise<PerfilResponse> {
  const response = await api.post<PerfilResponse>('/perfis', data);

  return response.data;
}

export async function updatePerfil(id: number, data: PerfilRequest): Promise<PerfilResponse> {
  const response = await api.put<PerfilResponse>(`/perfis/${id}`, data);

  return response.data;
}
