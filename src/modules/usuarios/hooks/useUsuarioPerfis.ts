import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adicionarPerfilAoUsuario,
  getPerfisDoUsuario,
  removerPerfilDoUsuario,
} from '../services/usuarioPerfisService';

export const usuarioPerfisQueryKey = (usuarioId: number) => ['usuarios', usuarioId, 'perfis'] as const;

export function useUsuarioPerfis(usuarioId?: number) {
  return useQuery({
    queryKey: usuarioPerfisQueryKey(usuarioId ?? 0),
    queryFn: () => getPerfisDoUsuario(usuarioId!),
    enabled: !!usuarioId,
  });
}

export function useAdicionarPerfilAoUsuario(usuarioId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (perfilId: number) => adicionarPerfilAoUsuario(usuarioId, perfilId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuarioPerfisQueryKey(usuarioId) });
    },
  });
}

export function useRemoverPerfilDoUsuario(usuarioId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (perfilId: number) => removerPerfilDoUsuario(usuarioId, perfilId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuarioPerfisQueryKey(usuarioId) });
    },
  });
}
