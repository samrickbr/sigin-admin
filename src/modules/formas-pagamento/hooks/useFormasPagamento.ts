import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createFormaPagamento,
  deleteFormaPagamento,
  getFormaPagamentoById,
  getFormasPagamento,
  updateFormaPagamento,
  updateFormaPagamentoAtivo,
} from '../services/formasPagamentoService';

import type { FormaPagamentoRequest } from '../types/formasPagamento';

export const FORMAS_PAGAMENTO_QUERY_KEY = ['formas-pagamento'];

export function useFormasPagamento() {
  return useQuery({
    queryKey: FORMAS_PAGAMENTO_QUERY_KEY,
    queryFn: getFormasPagamento,
  });
}

export function useFormaPagamento(id?: number) {
  return useQuery({
    queryKey: [...FORMAS_PAGAMENTO_QUERY_KEY, id],
    queryFn: () => getFormaPagamentoById(id!),
    enabled: !!id,
  });
}

export function useCreateFormaPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormaPagamentoRequest) => createFormaPagamento(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FORMAS_PAGAMENTO_QUERY_KEY,
      });
    },
  });
}

export function useUpdateFormaPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormaPagamentoRequest }) =>
      updateFormaPagamento(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: FORMAS_PAGAMENTO_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...FORMAS_PAGAMENTO_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useUpdateFormaPagamentoAtivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) =>
      updateFormaPagamentoAtivo(id, ativo),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: FORMAS_PAGAMENTO_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...FORMAS_PAGAMENTO_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteFormaPagamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFormaPagamento(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FORMAS_PAGAMENTO_QUERY_KEY,
      });
    },
  });
}
