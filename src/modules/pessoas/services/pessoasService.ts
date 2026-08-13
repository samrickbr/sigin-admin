import api from '../../../services/api';

import type {
  PessoaRequest,
  PessoaResponse,
  PessoaTipoRequest,
  PessoaUpdateRequest,
  TipoPessoaResponse,
} from '../types/pessoas';

export async function getPessoas(): Promise<PessoaResponse[]> {
  const response = await api.get<PessoaResponse[]>('/pessoas');

  return response.data;
}

export async function getPessoaById(id: number): Promise<PessoaResponse> {
  const response = await api.get<PessoaResponse>(`/pessoas/${id}`);

  return response.data;
}

export async function createPessoa(data: PessoaRequest): Promise<PessoaResponse> {
  const response = await api.post<PessoaResponse>('/pessoas', data);

  return response.data;
}

export async function updatePessoa(id: number, data: PessoaUpdateRequest): Promise<PessoaResponse> {
  const response = await api.put<PessoaResponse>(`/pessoas/${id}`, data);

  return response.data;
}

export async function deletePessoa(id: number): Promise<void> {
  await api.delete(`/pessoas/${id}`);
}

export async function getTiposPessoa(): Promise<TipoPessoaResponse[]> {
  const response = await api.get<TipoPessoaResponse[]>('/tipos-pessoa');

  return response.data;
}

export async function createTipoPessoa(
  data: Omit<TipoPessoaResponse, 'id'>,
): Promise<TipoPessoaResponse> {
  const response = await api.post<TipoPessoaResponse>('/tipos-pessoa', data);

  return response.data;
}

export async function adicionarTipoPessoa(
  pessoaId: number,
  data: PessoaTipoRequest,
): Promise<void> {
  await api.post(`/pessoas/${pessoaId}/tipos`, data);
}
