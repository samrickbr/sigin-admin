import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCanalVenda,
  deleteCanalVenda,
  getCanalVendaById,
  getCanaisVenda,
  updateCanalVenda,
} from '../services/canaisVendaService';

import type { CanalVendaRequest } from '../types/canaisVenda';

export const CANAIS_VENDA_QUERY_KEY = ['canais-venda'];

export function useCanaisVenda() {
  return useQuery({
    queryKey: CANAIS_VENDA_QUERY_KEY,
    queryFn: getCanaisVenda,
  });
}

export function useCanalVenda(id?: number) {
  return useQuery({
    queryKey: [...CANAIS_VENDA_QUERY_KEY, id],
    queryFn: () => getCanalVendaById(id!),
    enabled: !!id,
  });
}

export function useCreateCanalVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CanalVendaRequest) => createCanalVenda(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CANAIS_VENDA_QUERY_KEY,
      });
    },
  });
}

export function useUpdateCanalVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CanalVendaRequest }) =>
      updateCanalVenda(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CANAIS_VENDA_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...CANAIS_VENDA_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteCanalVenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCanalVenda(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CANAIS_VENDA_QUERY_KEY,
      });
    },
  });
}
