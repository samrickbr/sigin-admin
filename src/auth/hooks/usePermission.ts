import { useAuthStore } from '../store/authStore';

export function usePermission() {
  const token = useAuthStore((state) => state.token);

  function hasPermission(_permissao: string) {
    return !!token;
  }

  return {
    hasPermission,
  };
}
