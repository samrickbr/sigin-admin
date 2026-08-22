export interface FormaPagamentoResponse {
  id: number;
  descricao: string;
  ativo: boolean;
  baixaAutomatica: boolean;
}

export interface FormaPagamentoRequest {
  descricao: string;
  baixaAutomatica: boolean;
}
