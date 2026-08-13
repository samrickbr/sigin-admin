export interface UsuarioRequest {
  pessoaId: number;
  login: string;
  senha: string;
  ativo: boolean;
}

export interface UsuarioResponse {
  id: number;
  pessoaId: number;
  login: string;
  ativo: boolean;
  ultimoLogin?: string;
  dataCriacao?: string;
}
