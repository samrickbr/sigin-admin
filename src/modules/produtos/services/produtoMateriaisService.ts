import api from '../../../services/api';

import type {
  ProdutoMaterialRequest,
  ProdutoMaterialResponse,
  ProdutoMaterialUpdateRequest,
} from '../types/produtoMateriais';

export async function getProdutoMateriais(produtoId: number): Promise<ProdutoMaterialResponse[]> {
  const response = await api.get<ProdutoMaterialResponse[]>(
    `/produto-materiais/produto/${produtoId}`,
  );

  return response.data;
}

export async function createProdutoMaterial(
  data: ProdutoMaterialRequest,
): Promise<ProdutoMaterialResponse> {
  const response = await api.post<ProdutoMaterialResponse>('/produto-materiais', data);

  return response.data;
}

export async function updateProdutoMaterial(
  id: number,
  data: ProdutoMaterialUpdateRequest,
): Promise<ProdutoMaterialResponse> {
  const response = await api.put<ProdutoMaterialResponse>(`/produto-materiais/${id}`, data);

  return response.data;
}

export async function deleteProdutoMaterial(id: number): Promise<void> {
  await api.delete(`/produto-materiais/${id}`);
}
