export interface DashboardIndicator {
  title: string;
  value: string;
}

const mockIndicators: DashboardIndicator[] = [
  {
    title: 'Pedidos Hoje',
    value: '0',
  },
  {
    title: 'Faturamento',
    value: 'R$ 0,00',
  },
  {
    title: 'Produtos',
    value: '0',
  },
  {
    title: 'Clientes',
    value: '0',
  },
];

export async function getDashboardIndicators(): Promise<DashboardIndicator[]> {
  return Promise.resolve(mockIndicators);
}
