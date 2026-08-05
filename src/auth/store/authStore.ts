import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UsuarioAutenticado {
  nome: string;
  email: string;
  perfil: string;
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;

  setAuth: (token: string, usuario: UsuarioAutenticado) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,

      setAuth: (token, usuario) =>
        set({
          token,
          usuario,
        }),

      clearAuth: () =>
        set({
          token: null,
          usuario: null,
        }),
    }),
    {
      name: 'sigin-auth',
    },
  ),
);
