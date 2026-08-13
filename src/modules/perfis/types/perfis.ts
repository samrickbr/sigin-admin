export interface PerfilResponse {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface PerfilRequest {
  nome: string;
  descricao?: string;
  ativo: boolean;
}
