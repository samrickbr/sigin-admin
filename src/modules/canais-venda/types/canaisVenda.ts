export interface CanalVendaResponse {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface CanalVendaRequest {
  nome: string;
  descricao?: string;
  ativo: boolean;
}
