import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutosInativos,
  getProdutosCanais,
  createProdutoCanal,
  updateProdutoCanal,
  deleteProdutoCanal,
  getProdutosVendas,
  createProdutoVenda,
  updateProdutoVenda,
  deleteProdutoVenda,
} from '../services/produtosService';

import type { ProdutoRequest, ProdutoCanalRequest, ProdutoVendaRequest } from '../types/produtos';

export const PRODUTOS_QUERY_KEY = ['produtos'];

export const PRODUTOS_CANAIS_QUERY_KEY = ['produtos-canais'];

export const PRODUTOS_VENDAS_QUERY_KEY = ['produtos-vendas'];

export const CANAIS_VENDA_QUERY_KEY = ['canais-venda'];

// --- PRODUTOS ---

export function useProdutos() {
  return useQuery({
    queryKey: PRODUTOS_QUERY_KEY,
    queryFn: getProdutos,
  });
}

export function useProduto(id?: number) {
  return useQuery({
    queryKey: [...PRODUTOS_QUERY_KEY, id],
    queryFn: () => getProdutoById(id!),
    enabled: !!id,
  });
}

export function useProdutosInativos() {
  return useQuery({
    queryKey: [...PRODUTOS_QUERY_KEY, 'inativos'],
    queryFn: getProdutosInativos,
  });
}

export function useCreateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdutoRequest) => createProduto(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdutoRequest }) => updateProduto(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduto(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_QUERY_KEY,
      });
    },
  });
}

// --- PRODUTO CANAL ---

export function useProdutosCanais() {
  return useQuery({
    queryKey: PRODUTOS_CANAIS_QUERY_KEY,
    queryFn: getProdutosCanais,
  });
}

export function useCreateProdutoCanal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdutoCanalRequest) => createProdutoCanal(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_CANAIS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateProdutoCanal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdutoCanalRequest }) =>
      updateProdutoCanal(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_CANAIS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteProdutoCanal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProdutoCanal(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_CANAIS_QUERY_KEY,
      });
    },
  });
}

// --- PRODUTO VENDA ---

export function useProdutosVendas() {
  return useQuery({
    queryKey: PRODUTOS_VENDAS_QUERY_KEY,
    queryFn: getProdutosVendas,
  });
}

export function useCreateProdutoVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProdutoVendaRequest) => createProdutoVenda(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_VENDAS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateProdutoVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProdutoVendaRequest }) =>
      updateProdutoVenda(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_VENDAS_QUERY_KEY,
      });
    },
  });
}

export function useDeleteProdutoVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProdutoVenda(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUTOS_VENDAS_QUERY_KEY,
      });
    },
  });
}

// --- CANAIS DE VENDA ---
