import api from '../../../services/api';

import type { PerfilResponse } from '../../perfis/types/perfis';

export async function getPerfisDoUsuario(usuarioId: number): Promise<PerfilResponse[]> {
  const response = await api.get<PerfilResponse[]>(`/usuarios/${usuarioId}/perfis`);

  return response.data;
}

export async function adicionarPerfilAoUsuario(usuarioId: number, perfilId: number): Promise<void> {
  await api.post(`/usuarios/${usuarioId}/perfis/${perfilId}`);
}

export async function removerPerfilDoUsuario(usuarioId: number, perfilId: number): Promise<void> {
  await api.delete(`/usuarios/${usuarioId}/perfis/${perfilId}`);
}
