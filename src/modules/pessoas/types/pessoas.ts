export interface PessoaRequest {
  nome: string;
  tipoDocumento: string;
  documento: string;
  telefone?: string;
  email?: string;
  observacao?: string;
}

export interface PessoaUpdateRequest {
  nome: string;
  tipoDocumento: string;
  documento: string;
  telefone?: string;
  email?: string;
  observacao?: string;
  ativo: boolean;
}

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

export interface TipoPessoaResponse {
  id: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface PessoaTipoRequest {
  tipoPessoaId: number;
}
