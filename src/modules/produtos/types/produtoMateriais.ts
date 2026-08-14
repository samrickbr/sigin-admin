export interface ProdutoMaterialResponse {
  id: number;
  produtoId: number;
  produto: string;
  materialId: number;
  material: string;
  quantidade: number;
  ativo: boolean;
  dataCriacao: string;
}

export interface ProdutoMaterialRequest {
  produtoId: number;
  materialId: number;
  quantidade: number;
}

export interface ProdutoMaterialUpdateRequest {
  quantidade?: number;
  ativo?: boolean;
}
