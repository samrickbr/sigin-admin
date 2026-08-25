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

export type Setor = 'COZINHA' | 'PIZZARIA' | 'BALCAO';

// Produto DTOs

export interface ProdutosFiltro {
  page: number;
  size: number;
  busca?: string;
  categoriaId?: number;
  semCategoria?: boolean;
  setor?: Setor;
  semSetor?: boolean;
  disponivelVenda?: boolean;
  ativo?: boolean;
}
export interface ProdutosPage {
  content: ProdutoResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export interface ProdutoRequest {
  nome: string;
  descricao?: string;
  categoriaId?: number;
  precoVenda?: number;
  disponivelVenda?: boolean;
  imagem?: string;
  setor?: Setor;
}

export interface ProdutoResponse {
  id: number;
  codigo?: string;
  nome: string;
  descricao?: string;
  categoriaId?: number;
  categoria?: string;
  setor?: string;
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

// ProdutoVenda DTOs
export interface ProdutoVendaRequest {
  produtoId: number;
  canalVendaId: number;
  precoVenda?: number;
  imagem?: string;
  disponivelVenda?: boolean;
}

export interface ProdutoVendaResponse {
  id: number;
  produtoId: number;
  produto?: string;
  canalVendaId: number;
  canalVenda?: string;
  precoVenda?: number;
  imagem?: string;
  disponivelVenda?: boolean;
}

// CanalVenda DTOs
