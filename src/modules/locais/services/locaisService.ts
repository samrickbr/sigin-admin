import api from '../../../services/api';

import type { LocalRequest, LocalResponse, LocalUpdateRequest } from '../types/locais';

export async function getLocais(): Promise<LocalResponse[]> {
  const response = await api.get<LocalResponse[]>('/locais');

  return response.data;
}

export async function getLocalById(id: number): Promise<LocalResponse> {
  const response = await api.get<LocalResponse>(`/locais/${id}`);

  return response.data;
}

export async function createLocal(data: LocalRequest): Promise<LocalResponse> {
  const response = await api.post<LocalResponse>('/locais', data);

  return response.data;
}

export async function updateLocal(id: number, data: LocalUpdateRequest): Promise<LocalResponse> {
  const response = await api.put<LocalResponse>(`/locais/${id}`, data);

  return response.data;
}

export async function deleteLocal(id: number): Promise<void> {
  await api.delete(`/locais/${id}`);
}
