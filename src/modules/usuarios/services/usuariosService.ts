import api from '../../../services/api';

import type { UsuarioRequest, UsuarioResponse } from '../types/usuarios';

export async function getUsuarios(): Promise<UsuarioResponse[]> {
  const response = await api.get<UsuarioResponse[]>('/usuarios');
  return response.data;
}

export async function getUsuarioById(id: number): Promise<UsuarioResponse> {
  const response = await api.get<UsuarioResponse>(`/usuarios/${id}`);

  return response.data;
}

export async function createUsuario(data: UsuarioRequest): Promise<UsuarioResponse> {
  const response = await api.post<UsuarioResponse>('/usuarios', data);

  return response.data;
}

export async function updateUsuario(id: number, data: UsuarioRequest): Promise<UsuarioResponse> {
  const response = await api.put<UsuarioResponse>(`/usuarios/${id}`, data);

  return response.data;
}

export async function deleteUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
