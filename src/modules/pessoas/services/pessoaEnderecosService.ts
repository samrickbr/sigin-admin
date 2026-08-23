import api from '../../../services/api';

import type {
  CepResponse,
  EstadoResponse,
  PessoaEnderecoRequest,
  PessoaEnderecoResponse,
} from '../types/pessoaEndereco';

export async function getPessoaEnderecos(pessoaId: number): Promise<PessoaEnderecoResponse[]> {
  const response = await api.get<PessoaEnderecoResponse[]>(`/pessoas/${pessoaId}/enderecos`);

  return response.data;
}

export async function getPessoaEnderecoById(
  pessoaId: number,
  enderecoId: number,
): Promise<PessoaEnderecoResponse> {
  const response = await api.get<PessoaEnderecoResponse>(
    `/pessoas/${pessoaId}/enderecos/${enderecoId}`,
  );

  return response.data;
}

export async function createPessoaEndereco(
  pessoaId: number,
  data: PessoaEnderecoRequest,
): Promise<PessoaEnderecoResponse> {
  const response = await api.post<PessoaEnderecoResponse>(`/pessoas/${pessoaId}/enderecos`, data);

  return response.data;
}

export async function updatePessoaEndereco(
  pessoaId: number,
  enderecoId: number,
  data: PessoaEnderecoRequest,
): Promise<PessoaEnderecoResponse> {
  const response = await api.put<PessoaEnderecoResponse>(
    `/pessoas/${pessoaId}/enderecos/${enderecoId}`,
    data,
  );

  return response.data;
}

export async function definirPessoaEnderecoPrincipal(
  pessoaId: number,
  enderecoId: number,
): Promise<PessoaEnderecoResponse> {
  const response = await api.put<PessoaEnderecoResponse>(
    `/pessoas/${pessoaId}/enderecos/${enderecoId}/principal`,
  );

  return response.data;
}

export async function deletePessoaEndereco(pessoaId: number, enderecoId: number): Promise<void> {
  await api.delete(`/pessoas/${pessoaId}/enderecos/${enderecoId}`);
}

export async function getCep(cep: string): Promise<CepResponse> {
  const response = await api.get<CepResponse>(`/ceps/${cep}`);

  return response.data;
}

export async function getEstados(): Promise<EstadoResponse[]> {
  const response = await api.get<EstadoResponse[]>('/estados');

  return response.data;
}
