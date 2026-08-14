import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProdutoMaterial,
  deleteProdutoMaterial,
  getProdutoMateriais,
  updateProdutoMaterial,
} from '../services/produtoMateriaisService';

import type {
  ProdutoMaterialRequest,
  ProdutoMaterialUpdateRequest,
} from '../types/produtoMateriais';

export const PRODUTO_MATERIAIS_QUERY_KEY = ['produto-materiais'];

export function useProdutoMateriais(produtoId?: number) {
  return useQuery({
    queryKey: [...PRODUTO_MATERIAIS_QUERY_KEY, produtoId],
    queryFn: () => getProdutoMateriais(produtoId!),
    enabled: !!produtoId,
  });
}

export function useCreateProdutoMaterial(produtoId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdutoMaterialRequest) => createProdutoMaterial(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUTO_MATERIAIS_QUERY_KEY, produtoId],
      });
    },
  });
}

export function useUpdateProdutoMaterial(produtoId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdutoMaterialUpdateRequest }) =>
      updateProdutoMaterial(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUTO_MATERIAIS_QUERY_KEY, produtoId],
      });
    },
  });
}

export function useDeleteProdutoMaterial(produtoId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProdutoMaterial(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PRODUTO_MATERIAIS_QUERY_KEY, produtoId],
      });
    },
  });
}
