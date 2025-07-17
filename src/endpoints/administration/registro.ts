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
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(`http://${BASE_URL}/registro-clientes/registro`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Error al registrar el cliente');
  }
  return response.json();
};

export function useRegistroCliente() {
  return useMutation<RegistroClienteResponse, Error, RegistroClienteRequest>({
    mutationFn: postRegistroCliente,
  });
} 