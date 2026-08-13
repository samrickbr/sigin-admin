import api from '../../../services/api';

import type {
  ProdutoRequest,
  ProdutoResponse,
  ProdutoCanalRequest,
  ProdutoCanalResponse
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

// --- CANAIS DE VENDA ---
