import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '../auth/hooks/usePermission';

interface Props {
  permissao: string;
}

export function PermissionGuard({ permissao }: Props) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permissao)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
