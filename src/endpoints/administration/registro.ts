import { useMutation } from '@tanstack/react-query';
import ConstValues from '../../assets/scripts/values/constValues';

const constValues = new ConstValues();
const BASE_URL = constValues.app_server;

export interface RegistroClienteRequest {
  cvv: string;
  mes_expiracion: string;
  nombre_propietario_tarjeta: string;
  email_restaurante?: string;
  nombre: string;
  numero_tarjeta: string;
  anio_expiracion: string;
  descripcion: string;
  id_plan: string;
  direccion: string;
  nombre_restaurante: string;
  telefono: string;
  apellidos: string;
  password: string;
  email: string;
  logoUrl?: string;
}

export interface RegistroClienteResponse {
  success: boolean;
  message: string;
  data?: {
    restauranteId: number;
    usuarioId: number;
  };
}

const postRegistroCliente = async (data: RegistroClienteRequest): Promise<RegistroClienteResponse> => {
  // Filtrar campos undefined/null
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
  );

  const response = await fetch(`https://${BASE_URL}/registro-clientes/registro-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error al registrar el cliente: ${response.status}`);
  }
  
  return response.json();
};

export function useRegistroCliente() {
  return useMutation<RegistroClienteResponse, Error, RegistroClienteRequest>({
    mutationFn: postRegistroCliente,
  });
} 