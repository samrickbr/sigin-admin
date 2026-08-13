import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  getMateriais,
  updateMaterial,
} from '../services/materiaisService';

import type { MaterialRequest, MaterialUpdateRequest } from '../types/materiais';

export const MATERIAIS_QUERY_KEY = ['materiais'];

export function useMateriais() {
  return useQuery({
    queryKey: MATERIAIS_QUERY_KEY,
    queryFn: getMateriais,
  });
}

export function useMaterial(id?: number) {
  return useQuery({
    queryKey: [...MATERIAIS_QUERY_KEY, id],
    queryFn: () => getMaterialById(id!),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaterialRequest) => createMaterial(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MATERIAIS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MaterialUpdateRequest }) =>
      updateMaterial(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: MATERIAIS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...MATERIAIS_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMaterial(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MATERIAIS_QUERY_KEY,
      });
    },
  });
}
