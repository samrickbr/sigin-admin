export interface MaterialResponse {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  unidadeMedida: string;
  estoqueMinimo: number;
  ativo: boolean;
  dataCriacao: string;
}

export interface MaterialRequest {
  codigo: string;
  nome: string;
  descricao?: string;
  unidadeMedida: string;
  estoqueMinimo: number;
}

export interface MaterialUpdateRequest {
  nome: string;
  descricao?: string;
  unidadeMedida: string;
  estoqueMinimo: number;
  ativo: boolean;
}
