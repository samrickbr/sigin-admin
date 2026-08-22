import api from '../../../services/api';

import type {
  ProdutoRequest,
  ProdutoResponse,
  ProdutoCanalRequest,
  ProdutoCanalResponse,
  ProdutoVendaRequest,
  ProdutoVendaResponse,
} from '../types/produtos';

// --- PRODUTOS ---

export async function getProdutos(): Promise<ProdutoResponse[]> {
  const response = await api.get<ProdutoResponse[]>('/produtos');

  return response.data;
}

export async function getProdutoById(id: number): Promise<ProdutoResponse> {
  const response = await api.get<ProdutoResponse>(`/produtos/${id}`);

  return response.data;
}

export async function createProduto(data: ProdutoRequest): Promise<ProdutoResponse> {
  const response = await api.post<ProdutoResponse>('/produtos', data);

  return response.data;
}

export async function updateProduto(id: number, data: ProdutoRequest): Promise<ProdutoResponse> {
  const response = await api.put<ProdutoResponse>(`/produtos/${id}`, data);

  return response.data;
}

export async function deleteProduto(id: number): Promise<void> {
  await api.delete(`/produtos/${id}`);
}

export async function getProdutosInativos(): Promise<ProdutoResponse[]> {
  const response = await api.get<ProdutoResponse[]>('/produtos/inativos');

  return response.data;
}

// --- PRODUTO CANAL ---

export async function getProdutosCanais(): Promise<ProdutoCanalResponse[]> {
  const response = await api.get<ProdutoCanalResponse[]>('/api/produtos-canais');

  return response.data;
}

export async function createProdutoCanal(data: ProdutoCanalRequest): Promise<ProdutoCanalResponse> {
  const response = await api.post<ProdutoCanalResponse>('/api/produtos-canais', data);

  return response.data;
}

export async function updateProdutoCanal(
  id: number,
  data: ProdutoCanalRequest,
): Promise<ProdutoCanalResponse> {
  const response = await api.put<ProdutoCanalResponse>(`/api/produtos-canais/${id}`, data);

  return response.data;
}

export async function deleteProdutoCanal(id: number): Promise<void> {
  await api.delete(`/api/produtos-canais/${id}`);
}

// --- PRODUTO VENDA ---

export async function getProdutosVendas(): Promise<ProdutoVendaResponse[]> {
  const response = await api.get<ProdutoVendaResponse[]>('/api/produtos-vendas');

  return response.data;
}

export async function createProdutoVenda(data: ProdutoVendaRequest): Promise<ProdutoVendaResponse> {
  const response = await api.post<ProdutoVendaResponse>('/api/produtos-vendas', data);

  return response.data;
}

export async function updateProdutoVenda(
  id: number,
  data: ProdutoVendaRequest,
): Promise<ProdutoVendaResponse> {
  const response = await api.put<ProdutoVendaResponse>(`/api/produtos-vendas/${id}`, data);

  return response.data;
}

export async function deleteProdutoVenda(id: number): Promise<void> {
  await api.delete(`/api/produtos-vendas/${id}`);
}
