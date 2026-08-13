import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createLocal,
  deleteLocal,
  getLocalById,
  getLocais,
  updateLocal,
} from '../services/locaisService';

import type { LocalRequest, LocalUpdateRequest } from '../types/locais';

export const LOCAIS_QUERY_KEY = ['locais'];

export function useLocais() {
  return useQuery({
    queryKey: LOCAIS_QUERY_KEY,
    queryFn: getLocais,
  });
}

export function useLocal(id?: number) {
  return useQuery({
    queryKey: [...LOCAIS_QUERY_KEY, id],
    queryFn: () => getLocalById(id!),
    enabled: !!id,
  });
}

export function useCreateLocal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LocalRequest) => createLocal(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LOCAIS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateLocal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LocalUpdateRequest }) => updateLocal(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: LOCAIS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...LOCAIS_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteLocal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLocal(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LOCAIS_QUERY_KEY,
      });
    },
  });
}
