export interface PedidoResponse {
  id: number;
  numero: string;
  clienteId?: number;
  cliente?: string;
  canalVendaId?: number;
  canalVenda?: string;
  dataPedido: string;
  valorTotal: number;
  status: string;
  formaPagamentoId?: number;
  formaPagamento?: string;
  ativo: boolean;
  observacao?: string;
}

export interface PedidoItemResponse {
  id: number;
  produtoId: number;
  produto?: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}
