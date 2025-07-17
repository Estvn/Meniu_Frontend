import { useMutation } from '@tanstack/react-query';
import ConstValues from '../../assets/scripts/values/constValues';
import { getStoredToken } from '../../assets/scripts/values/constValues';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

export interface CreateUserRequest {
  nombre: string;
  apellidos: string;
  email: string;
  id_rol: number;
  id_restaurante: number;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
  };
}

const createUser = async (data: CreateUserRequest): Promise<CreateUserResponse> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  console.log('Creating user with data:', data);

  const response = await fetch(`http://${BASE_URL}/personas/registrar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  console.log('Create user response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Create user API error:', errorData);
    throw new Error(errorData.message || 'Error al crear usuario');
  }

  const responseData = await response.json();
  console.log('Create user response:', responseData);
  return responseData;
};

export function useCreateUser() {
  return useMutation<CreateUserResponse, Error, CreateUserRequest>({
    mutationFn: createUser,
  });
} 