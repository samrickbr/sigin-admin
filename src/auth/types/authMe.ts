export interface PessoaResponse {
  id: number;
  nome: string;
  tipoDocumento: string;
  documento: string;
  telefone?: string;
  email?: string;
  observacao?: string;
  ativo: boolean;
  dataCriacao?: string;
  tipos: string[];
}

export interface PerfilResponse {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface PermissaoResponse {
  id: number;
  codigo: string;
  descricao?: string;
  ativo: boolean;
}

export interface AuthMeResponse {
  id: number;
  login: string;
  ativo: boolean;
  pessoa: PessoaResponse;
  perfis: PerfilResponse[];
  permissoes: PermissaoResponse[];
}
