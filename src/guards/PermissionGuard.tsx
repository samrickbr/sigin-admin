import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../auth/store/authStore';

interface Props {
  permissao: string;
}

export function PermissionGuard({ permissao }: Props) {
  const usuario = useAuthStore((state) => state.usuario);

  const possuiPermissao =
    usuario &&
    'permissoes' in usuario &&
    Array.isArray((usuario as any).permissoes) &&
    (usuario as any).permissoes.includes(permissao);

  if (!possuiPermissao) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
