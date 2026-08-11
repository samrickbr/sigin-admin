import api from '../../services/api';
import type { AuthMeResponse } from '../types/authMe';

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  tipo: string;
  token: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function me(): Promise<AuthMeResponse> {
  const response = await api.get<AuthMeResponse>('/auth/me');
  return response.data;
}
