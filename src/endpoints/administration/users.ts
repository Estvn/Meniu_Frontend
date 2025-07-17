import { useQuery } from '@tanstack/react-query';
import ConstValues from '../../assets/scripts/values/constValues';
import { getStoredToken } from '../../assets/scripts/values/constValues';
import type { User } from '../../types/User';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

const getUsers = async (): Promise<User[]> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  console.log('Fetching users with token:', token.substring(0, 20) + '...');

  const response = await fetch(`http://${BASE_URL}/usuarios/todos`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('Users API response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Users API error:', errorData);
    throw new Error(errorData.message || 'Error al obtener usuarios');
  }

  const users = await response.json();
  console.log('Users received:', users);
  return users;
};

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
} 