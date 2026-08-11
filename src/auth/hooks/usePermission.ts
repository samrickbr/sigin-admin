import { useAuthStore } from '../store/authStore';

export function usePermission() {
  const usuario = useAuthStore((state) => state.usuario);

  function hasPermission(permissaoCodigo: string): boolean {
    if (!usuario || !usuario.permissoes) {
      return false;
    }

    return usuario.permissoes.some((p) => p.codigo === permissaoCodigo && p.ativo);
  }

  return {
    hasPermission,
  };
}
