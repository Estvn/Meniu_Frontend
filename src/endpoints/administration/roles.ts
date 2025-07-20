import { useQuery } from '@tanstack/react-query';
import ConstValues from '../../assets/scripts/values/constValues';
import { getStoredToken } from '../../assets/scripts/values/constValues';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

export interface Role {
  id_rol: number;
  nombreRol: string;
}

const getRoles = async (): Promise<Role[]> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  console.log('Fetching roles with token:', token.substring(0, 20) + '...');

  const response = await fetch(`http://${BASE_URL}/roles`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('Roles API response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Roles API error:', errorData);
    throw new Error(errorData.message || 'Error al obtener roles');
  }

  const roles = await response.json();
  console.log('Roles received:', roles);
  return roles;
};

export function useRoles() {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
} 