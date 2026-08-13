export interface LocalResponse {
  id: number;
  nome: string;
  ativo: boolean;
  dataCriacao: string;
}

export interface LocalRequest {
  nome: string;
}

export interface LocalUpdateRequest {
  nome: string;
  ativo: boolean;
}
