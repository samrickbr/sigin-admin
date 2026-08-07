import { useQuery } from '@tanstack/react-query';
import { getDashboardIndicators } from '../services/dashboardService';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-indicators'],
    queryFn: getDashboardIndicators,
  });
}
