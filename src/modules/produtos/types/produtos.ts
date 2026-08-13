// Categoria DTOs
export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  dataCriacao: string;
}

export interface CategoriaRequest {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

// Produto DTOs
export interface ProdutoRequest {
  nome: string;
  descricao?: string;
  categoriaId?: number;
  precoVenda?: number;
  disponivelVenda?: boolean;
  imagem?: string;
}

export interface ProdutoResponse {
  id: number;
  codigo?: string;
  nome: string;
  descricao?: string;
  categoriaId?: number;
  categoria?: string;
  precoVenda?: number;
  disponivelVenda?: boolean;
  imagem?: string;
  ativo?: boolean;
}

// ProdutoCanal DTOs
export interface ProdutoCanalRequest {
  produtoId: number;
  canalVendaId: number;
  precoVenda?: number;
  ativo?: boolean;
}

export interface ProdutoCanalResponse {
  id: number;
  produtoId: number;
  produto?: string;
  canalVendaId: number;
  canalVenda?: string;
  precoVenda?: number;
  ativo: boolean;
}

// CanalVenda DTOs