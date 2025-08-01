import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConstValues from '../../assets/scripts/values/constValues';
import { getStoredToken } from '../../assets/scripts/values/constValues';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

export interface UpdateUserRequest {
  password?: string;
  activo: number;
  nombre: string;
  apellidos: string;
  email: string;
  id_rol: number;
}

export interface DeleteUserRequest {
  activo: number;
  id_rol: number;
}

export interface UpdateUserResponse {
  message: string;
}

const updateUser = async (userId: number, data: UpdateUserRequest | DeleteUserRequest): Promise<UpdateUserResponse> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  console.log('Updating user with data:', { userId, data });

  const response = await fetch(`https://${BASE_URL}/usuarios/actualizar/${userId}`, {
    method: 'PUT',
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  console.log('Update user response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Update user API error:', errorData);
    throw new Error(errorData.message || 'Error al actualizar usuario');
  }

  const responseData = await response.json();
  console.log('Update user response:', responseData);
  return responseData;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation<UpdateUserResponse, Error, { userId: number; data: UpdateUserRequest | DeleteUserRequest }>({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
    onSuccess: () => {
      // Invalidar y recargar la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
} 