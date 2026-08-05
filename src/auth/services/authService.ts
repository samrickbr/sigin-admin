import api from "../../services/api";

interface LoginRequest {
  login: string;
  senha: string;
}

interface LoginResponse {
  tipo: string;
  token: string;
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
}