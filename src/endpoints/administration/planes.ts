import { useQuery } from '@tanstack/react-query';
import type { Plan } from '../../interfaces/Plan';
import ConstValues from '../../assets/scripts/values/constValues';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

const fetchPlanes = async (): Promise<Plan[]> => {
  const response = await fetch(`https://${BASE_URL}/planes/todos`);
  if (!response.ok) {
    throw new Error('Error al obtener los planes de pago');
  }
  return response.json();
};

export function usePlanes() {
  return useQuery<Plan[]>({
    queryKey: ['planes'],
    queryFn: fetchPlanes,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
} 