import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPermissao,
  getPermissaoById,
  getPermissoes,
  updatePermissao,
} from '../services/permissoesService';

import type { PermissaoRequest } from '../types/perfilPermissoes';

export const PERMISSOES_QUERY_KEY = ['permissoes'];

export function usePermissoes() {
  return useQuery({
    queryKey: PERMISSOES_QUERY_KEY,
    queryFn: getPermissoes,
  });
}

export function usePermissao(id?: number) {
  return useQuery({
    queryKey: [...PERMISSOES_QUERY_KEY, id],
    queryFn: () => getPermissaoById(id!),
    enabled: !!id,
  });
}

export function useCreatePermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissaoRequest) => createPermissao(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PERMISSOES_QUERY_KEY,
      });
    },
  });
}

export function useUpdatePermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PermissaoRequest }) => updatePermissao(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PERMISSOES_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...PERMISSOES_QUERY_KEY, variables.id],
      });
    },
  });
}
