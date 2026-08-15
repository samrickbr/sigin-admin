import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPessoa,
  createTipoPessoa,
  deletePessoa,
  getPessoaById,
  getPessoas,
  getTiposPessoa,
  adicionarTipoPessoa,
  updatePessoa,
} from '../services/pessoasService';

import type { PessoaRequest, PessoaTipoRequest, PessoaUpdateRequest } from '../types/pessoas';

export const PESSOAS_QUERY_KEY = ['pessoas'];

export const TIPOS_PESSOA_QUERY_KEY = ['tipos-pessoa'];

export function usePessoas(enabled = true) {
  return useQuery({
    queryKey: PESSOAS_QUERY_KEY,
    queryFn: getPessoas,
    enabled,
  });
}

export function usePessoa(id?: number) {
  return useQuery({
    queryKey: [...PESSOAS_QUERY_KEY, id],
    queryFn: () => getPessoaById(id!),
    enabled: !!id,
  });
}

export function useCreatePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PessoaRequest) => createPessoa(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PESSOAS_QUERY_KEY,
      });
    },
  });
}

export function useUpdatePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PessoaUpdateRequest }) => updatePessoa(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PESSOAS_QUERY_KEY,
      });
    },
  });
}

export function useDeletePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePessoa(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PESSOAS_QUERY_KEY,
      });
    },
  });
}

export function useTiposPessoa() {
  return useQuery({
    queryKey: TIPOS_PESSOA_QUERY_KEY,
    queryFn: getTiposPessoa,
  });
}

export function useCreateTipoPessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createTipoPessoa>[0]) => createTipoPessoa(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TIPOS_PESSOA_QUERY_KEY,
      });
    },
  });
}

export function useAdicionarTipoPessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pessoaId, data }: { pessoaId: number; data: PessoaTipoRequest }) =>
      adicionarTipoPessoa(pessoaId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PESSOAS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...PESSOAS_QUERY_KEY, variables.pessoaId],
      });
    },
  });
}
