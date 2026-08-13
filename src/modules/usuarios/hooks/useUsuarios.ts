import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  getUsuarios,
  updateUsuario,
} from '../services/usuariosService';

import type { UsuarioRequest } from '../types/usuarios';

export const USUARIOS_QUERY_KEY = ['usuarios'];

export function useUsuarios() {
  return useQuery({
    queryKey: USUARIOS_QUERY_KEY,
    queryFn: getUsuarios,
  });
}

export function useUsuario(id?: number) {
  return useQuery({
    queryKey: [...USUARIOS_QUERY_KEY, id],
    queryFn: () => getUsuarioById(id!),
    enabled: !!id,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UsuarioRequest) => createUsuario(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USUARIOS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UsuarioRequest }) => updateUsuario(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: USUARIOS_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...USUARIOS_QUERY_KEY, variables.id],
      });
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUsuario(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USUARIOS_QUERY_KEY,
      });
    },
  });
}
