import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../auth/store/authStore';

export function AuthGuard() {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [loadingSession, setLoadingSession] = useState(!usuario && !!token);

  useEffect(() => {
    async function restoreSession() {
      if (token && !usuario) {
        await fetchMe();
      }
      setLoadingSession(false);
    }

    restoreSession();
  }, [token, usuario, fetchMe]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loadingSession) {
    return null; // Opcional: Ou um componente de Loading central do SIGIN
  }

  return <Outlet />;
}
