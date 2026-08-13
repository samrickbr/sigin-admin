export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string;
}

export interface CategoriaRequest {
  nome: string;
  descricao?: string;
  ativo: boolean;
}
