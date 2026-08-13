export interface PermissaoResponse {
  id: number;
  codigo: string;
  descricao?: string;
  ativo: boolean;
}

export interface PermissaoRequest {
  codigo: string;
  descricao?: string;
  ativo: boolean;
}

export interface PerfilPermissaoResponse {
  id: number;
  perfilId: number;
  permissaoId: number;
}

export interface PerfilPermissaoRequest {
  perfilId: number;
  permissaoId: number;
}
