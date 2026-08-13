import api from '../../../services/api';

import type { MaterialRequest, MaterialResponse, MaterialUpdateRequest } from '../types/materiais';

export async function getMateriais(): Promise<MaterialResponse[]> {
  const response = await api.get<MaterialResponse[]>('/materiais');

  return response.data;
}

export async function getMaterialById(id: number): Promise<MaterialResponse> {
  const response = await api.get<MaterialResponse>(`/materiais/${id}`);

  return response.data;
}

export async function createMaterial(data: MaterialRequest): Promise<MaterialResponse> {
  const response = await api.post<MaterialResponse>('/materiais', data);

  return response.data;
}

export async function updateMaterial(
  id: number,
  data: MaterialUpdateRequest,
): Promise<MaterialResponse> {
  const response = await api.put<MaterialResponse>(`/materiais/${id}`, data);

  return response.data;
}

export async function deleteMaterial(id: number): Promise<void> {
  await api.delete(`/materiais/${id}`);
}
