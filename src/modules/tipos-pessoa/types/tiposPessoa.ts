export interface TipoPessoaResponse {
  id: number;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  dataCriacao: string;
}

export interface TipoPessoaRequest {
  nome: string;
  descricao?: string | null;
}
