import { useMutation } from '@tanstack/react-query';
import ConstValues from '../../assets/scripts/values/constValues';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

export interface LoginRequest {
  nombre_usuario: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  // Additional fields that might be in the response
  sub?: number;
  username?: string;
  rol?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  restaurante_id?: number;
  restaurante_nombre?: string;
  iat?: number;
  exp?: number;
}

const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const url = `https://${BASE_URL}/auth/login`;
  console.log('Making API call to:', url);
  console.log('With data:', data);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }
  
  const responseData = await response.json();
  console.log('API Response:', responseData);
  return responseData;
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: postLogin,
  });
} 