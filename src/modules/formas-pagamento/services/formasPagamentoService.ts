import api from '../../../services/api';

import type { FormaPagamentoRequest, FormaPagamentoResponse } from '../types/formasPagamento';

const ENDPOINT = '/financeiro/formas-pagamento';

export async function getFormasPagamento(): Promise<FormaPagamentoResponse[]> {
  const response = await api.get<FormaPagamentoResponse[]>(ENDPOINT);

  return response.data;
}

export async function getFormaPagamentoById(id: number): Promise<FormaPagamentoResponse> {
  const formasPagamento = await getFormasPagamento();

  const formaPagamento = formasPagamento.find((item) => item.id === id);

  if (!formaPagamento) {
    throw new Error('Forma de pagamento não encontrada.');
  }

  return formaPagamento;
}

export async function createFormaPagamento(
  data: FormaPagamentoRequest,
): Promise<FormaPagamentoResponse> {
  const response = await api.post<FormaPagamentoResponse>(ENDPOINT, data);

  return response.data;
}

export async function updateFormaPagamento(
  id: number,
  data: FormaPagamentoRequest,
): Promise<FormaPagamentoResponse> {
  const response = await api.put<FormaPagamentoResponse>(`${ENDPOINT}/${id}`, data);

  return response.data;
}

export async function updateFormaPagamentoAtivo(
  id: number,
  ativo: boolean,
): Promise<FormaPagamentoResponse> {
  const response = await api.patch<FormaPagamentoResponse>(`${ENDPOINT}/${id}/ativo`, ativo);

  return response.data;
}

export async function deleteFormaPagamento(id: number): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
