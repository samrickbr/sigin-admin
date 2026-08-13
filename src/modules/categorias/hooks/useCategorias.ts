import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCategoria,
  getCategoriaById,
  getCategorias,
  updateCategoria,
} from '../services/categoriasService';

import type { CategoriaRequest } from '../types/categorias';

export const CATEGORIAS_QUERY_KEY = ['categorias'];

export function useCategorias() {
  return useQuery({
    queryKey: CATEGORIAS_QUERY_KEY,
    queryFn: getCategorias,
  });
}

export function useCategoria(id?: number) {
  return useQuery({
    queryKey: [...CATEGORIAS_QUERY_KEY, id],
    queryFn: () => getCategoriaById(id!),
    enabled: !!id,
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoriaRequest) => createCategoria(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORIAS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaRequest }) => updateCategoria(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORIAS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...CATEGORIAS_QUERY_KEY, variables.id],
      });
    },
  });
}
