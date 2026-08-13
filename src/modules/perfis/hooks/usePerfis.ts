import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPerfil, getPerfilById, getPerfis, updatePerfil } from '../services/perfisService';

import type { PerfilRequest } from '../types/perfis';

export const PERFIS_QUERY_KEY = ['perfis'];

export function usePerfis() {
  return useQuery({
    queryKey: PERFIS_QUERY_KEY,
    queryFn: getPerfis,
  });
}

export function usePerfil(id?: number) {
  return useQuery({
    queryKey: [...PERFIS_QUERY_KEY, id],
    queryFn: () => getPerfilById(id!),
    enabled: !!id,
  });
}

export function useCreatePerfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PerfilRequest) => createPerfil(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PERFIS_QUERY_KEY,
      });
    },
  });
}

export function useUpdatePerfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PerfilRequest }) => updatePerfil(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERFIS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...PERFIS_QUERY_KEY, variables.id],
      });
    },
  });
}
