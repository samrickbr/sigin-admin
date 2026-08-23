import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  alterarAtivoTipoPessoa,
  createTipoPessoa,
  getTipoPessoaById,
  getTiposPessoa,
  updateTipoPessoa,
} from '../services/tiposPessoaService';

import type { TipoPessoaRequest } from '../types/tiposPessoa';

export const TIPOS_PESSOA_QUERY_KEY = ['tipos-pessoa'];

export function useTiposPessoa() {
  return useQuery({
    queryKey: TIPOS_PESSOA_QUERY_KEY,
    queryFn: getTiposPessoa,
  });
}

export function useTipoPessoa(id?: number) {
  return useQuery({
    queryKey: [...TIPOS_PESSOA_QUERY_KEY, id],
    queryFn: () => getTipoPessoaById(id!),
    enabled: !!id,
  });
}

export function useCreateTipoPessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TipoPessoaRequest) => createTipoPessoa(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TIPOS_PESSOA_QUERY_KEY,
      });
    },
  });
}

export function useUpdateTipoPessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TipoPessoaRequest }) =>
      updateTipoPessoa(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TIPOS_PESSOA_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...TIPOS_PESSOA_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useAlterarAtivoTipoPessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) =>
      alterarAtivoTipoPessoa(id, ativo),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TIPOS_PESSOA_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...TIPOS_PESSOA_QUERY_KEY, variables.id],
      });
    },
  });
}
