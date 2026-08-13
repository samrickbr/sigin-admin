import api from '../../../services/api';

import type { CategoriaRequest, CategoriaResponse } from '../types/categorias';

export async function getCategorias(): Promise<CategoriaResponse[]> {
  const response = await api.get<CategoriaResponse[]>('/categorias');

  return response.data;
}

export async function getCategoriaById(id: number): Promise<CategoriaResponse> {
  const response = await api.get<CategoriaResponse>(`/categorias/${id}`);

  return response.data;
}

export async function createCategoria(data: CategoriaRequest): Promise<CategoriaResponse> {
  const response = await api.post<CategoriaResponse>('/categorias', data);

  return response.data;
}

export async function updateCategoria(
  id: number,
  data: CategoriaRequest,
): Promise<CategoriaResponse> {
  const response = await api.put<CategoriaResponse>(`/categorias/${id}`, data);

  return response.data;
}
