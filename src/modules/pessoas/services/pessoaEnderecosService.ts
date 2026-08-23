import api from '../../../services/api';

import type {
  PessoaEnderecoRequest,
  PessoaEnderecoResponse,
} from '../types/pessoaEndereco';

export async function getPessoaEnderecos(
  pessoaId: number,
): Promise<PessoaEnderecoResponse[]> {
  const response = await api.get<PessoaEnderecoResponse[]>(
    `/pessoas/${pessoaId}/enderecos`,
  );

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
  const response = await api.post<PessoaEnderecoResponse>(
    `/pessoas/${pessoaId}/enderecos`,
    data,
  );

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

export async function deletePessoaEndereco(
  pessoaId: number,
  enderecoId: number,
): Promise<void> {
  await api.delete(`/pessoas/${pessoaId}/enderecos/${enderecoId}`);
}