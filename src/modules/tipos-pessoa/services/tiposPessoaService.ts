import api from '../../../services/api';

import type { TipoPessoaRequest, TipoPessoaResponse } from '../types/tiposPessoa';

export async function getTiposPessoa(): Promise<TipoPessoaResponse[]> {
  const response = await api.get<TipoPessoaResponse[]>('/tipos-pessoa');

  return response.data;
}

export async function getTipoPessoaById(id: number): Promise<TipoPessoaResponse> {
  const response = await api.get<TipoPessoaResponse>(`/tipos-pessoa/${id}`);

  return response.data;
}

export async function createTipoPessoa(data: TipoPessoaRequest): Promise<TipoPessoaResponse> {
  const response = await api.post<TipoPessoaResponse>('/tipos-pessoa', data);

  return response.data;
}

export async function updateTipoPessoa(
  id: number,
  data: TipoPessoaRequest,
): Promise<TipoPessoaResponse> {
  const response = await api.put<TipoPessoaResponse>(`/tipos-pessoa/${id}`, data);

  return response.data;
}

export async function alterarAtivoTipoPessoa(
  id: number,
  ativo: boolean,
): Promise<TipoPessoaResponse> {
  const response = await api.patch<TipoPessoaResponse>(`/tipos-pessoa/${id}/ativo`, undefined, {
    params: {
      ativo,
    },
  });

  return response.data;
}
