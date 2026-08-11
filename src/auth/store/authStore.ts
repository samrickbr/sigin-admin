import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthMeResponse } from '../types/authMe';
import { login as loginApi, me as meApi, type LoginRequest } from '../services/authService';

interface AuthState {
  token: string | null;
  usuario: AuthMeResponse | null;
  loading: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  fetchMe: () => Promise<AuthMeResponse | null>;
  setAuth: (token: string, usuario: AuthMeResponse | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      loading: false,

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

      login: async (credentials) => {
        set({ loading: true });
        try {
          const response = await loginApi(credentials);
          set({ token: response.token });

          await get().fetchMe();
        } finally {
          set({ loading: false });
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) {
          get().clearAuth();
          return null;
        }

        try {
          const response = await meApi();
          set({ usuario: response });
          return response;
        } catch {
          get().clearAuth();
          return null;
        }
      },
    }),
    {
      name: 'sigin-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
