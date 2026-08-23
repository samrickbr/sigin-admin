import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPessoaEndereco,
  deletePessoaEndereco,
  definirPessoaEnderecoPrincipal,
  getPessoaEnderecoById,
  getPessoaEnderecos,
  updatePessoaEndereco,
} from '../services/pessoaEnderecosService';

import type { PessoaEnderecoRequest } from '../types/pessoaEndereco';

export const PESSOA_ENDERECOS_QUERY_KEY = ['pessoa-enderecos'];

export function usePessoaEnderecos(pessoaId?: number) {
  return useQuery({
    queryKey: [...PESSOA_ENDERECOS_QUERY_KEY, pessoaId],
    queryFn: () => getPessoaEnderecos(pessoaId!),
    enabled: !!pessoaId,
  });
}

export function usePessoaEndereco(pessoaId?: number, enderecoId?: number) {
  return useQuery({
    queryKey: [...PESSOA_ENDERECOS_QUERY_KEY, pessoaId, enderecoId],
    queryFn: () => getPessoaEnderecoById(pessoaId!, enderecoId!),
    enabled: !!pessoaId && !!enderecoId,
  });
}

export function useCreatePessoaEndereco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pessoaId, data }: { pessoaId: number; data: PessoaEnderecoRequest }) =>
      createPessoaEndereco(pessoaId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PESSOA_ENDERECOS_QUERY_KEY, variables.pessoaId],
      });
    },
  });
}

export function useUpdatePessoaEndereco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pessoaId,
      enderecoId,
      data,
    }: {
      pessoaId: number;
      enderecoId: number;
      data: PessoaEnderecoRequest;
    }) => updatePessoaEndereco(pessoaId, enderecoId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PESSOA_ENDERECOS_QUERY_KEY, variables.pessoaId],
      });
    },
  });
}

export function useDefinirPessoaEnderecoPrincipal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pessoaId, enderecoId }: { pessoaId: number; enderecoId: number }) =>
      definirPessoaEnderecoPrincipal(pessoaId, enderecoId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PESSOA_ENDERECOS_QUERY_KEY, variables.pessoaId],
      });
    },
  });
}

export function useDeletePessoaEndereco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pessoaId, enderecoId }: { pessoaId: number; enderecoId: number }) =>
      deletePessoaEndereco(pessoaId, enderecoId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PESSOA_ENDERECOS_QUERY_KEY, variables.pessoaId],
      });
    },
  });
}
