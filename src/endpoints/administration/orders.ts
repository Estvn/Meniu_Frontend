import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredToken, getStoredUserData } from '../../assets/scripts/values/constValues';

const API_BASE_URL = "http://localhost:3000";

// Tipos para las órdenes del backend
export interface OrderItemResponse {
  id_orden_item: number;
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  estado?: string; // Estado del item (pendiente, listo, etc.)
}

export interface OrderResponse {
  id_orden: number;
  restaurante: {
    id_restaurante: number;
    nombre: string;
  };
  mesa: {
    id_mesa: number;
    numero_mesa: number;
  };
  estado: string;
  fecha: string;
  hora_confirmacion: string;
  hora_lista?: string;
  hora_entregada?: string;
  subtotal: number;
  impuestos: number;
  total: number;
  solicitud_pago: boolean;
  notas?: string;
  items: OrderItemResponse[];
}

const fetchOrders = async (): Promise<OrderResponse[]> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/orders/todas`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener órdenes');
  }

  return response.json();
};

const fetchPendingOrders = async (): Promise<OrderResponse[]> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/orders/pendientes`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener órdenes pendientes');
  }

  return response.json();
};

// Función para actualizar el estado de una orden a "listo"
const updateOrderStatus = async ({ 
  orderId
}: { 
  orderId: number; 
}): Promise<void> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  // Verificar que el token sea válido
  const userData = getStoredUserData();
  if (!userData) {
    throw new Error('Token inválido o expirado');
  }

  // Verificar que el usuario sea cocinero
  if (userData.rol !== 'Cocinero') {
    throw new Error('Solo los cocineros pueden marcar órdenes como listas');
  }

  console.log(`Intentando marcar orden ${orderId} como lista...`);
  console.log(`URL: ${API_BASE_URL}/orders/${orderId}/listo`);
  console.log(`Usuario: ${userData.username} (${userData.rol})`);
  console.log(`Restaurante: ${userData.restaurante_id}`);

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/listo`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      restaurante_id: userData.restaurante_id,
      usuario_id: userData.sub
    }),
  });

  console.log(`Response status: ${response.status}`);
  console.log(`Response ok: ${response.ok}`);

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorText = await response.text();
      console.error(`Error response body: ${errorText}`);
      
      // Intentar parsear como JSON
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.detail || errorMessage;
      } catch {
        // Si no es JSON, usar el texto como está
        errorMessage = errorText || errorMessage;
      }
    } catch (e) {
      console.error(`No se pudo leer el body del error:`, e);
    }
    
    throw new Error(`Error al actualizar el estado de la orden: ${errorMessage}`);
  }

  console.log(`Orden ${orderId} marcada como lista exitosamente`);
};

// Función para actualizar el estado de un item de orden
const updateOrderItemStatus = async ({ 
  orderId, 
  itemId, 
  newStatus 
}: { 
  orderId: number; 
  itemId: number; 
  newStatus: string; 
}): Promise<void> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/items/${itemId}/status`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar el estado del item');
  }
};

// Hook para actualizar el estado de un item
export function useUpdateOrderItemStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrderItemStatus,
    onSuccess: () => {
      // Invalidar las queries para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
    },
  });
}

// Hook para actualizar el estado de una orden
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // Invalidar las queries para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
    },
  });
}

// Función para actualizar el estado de una orden (para cajero)
const updateOrderStatusForCashier = async ({ 
  orderId, 
  newStatus 
}: { 
  orderId: number; 
  newStatus: string; // Acción: 'entregar', 'pagar', 'cancelar'
}): Promise<void> => {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const userData = getStoredUserData();
  if (!userData) {
    throw new Error('Token inválido o expirado');
  }

  // Verificar que el usuario sea cajero
  if (userData.rol !== 'Cajero') {
    throw new Error('Solo los cajeros pueden actualizar el estado de las órdenes');
  }

  // newStatus ahora es la acción directamente
  const backendAction = newStatus;
  
  console.log('🔄 Usando endpoint de cajero...');
  console.log(`Acción: ${backendAction}`);
  console.log(`URL: ${API_BASE_URL}/orders/${orderId}/cocina-estado`);
  console.log(`Body: ${JSON.stringify({ action: backendAction })}`);
  
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cocina-estado`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: backendAction
    }),
  });

  console.log(`Response status: ${response.status}`);
  console.log(`Response ok: ${response.ok}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Error ${response.status}: ${errorText}`);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  console.log(`✅ Orden ${orderId} actualizada exitosamente con acción: ${backendAction}`);
};

// Hook para actualizar el estado de una orden (para cajero)
export function useUpdateOrderStatusForCashier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrderStatusForCashier,
    onSuccess: () => {
      // Invalidar las queries para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    refetchInterval: false, // No refetch automático, solo websocket
  });
}

export function usePendingOrders() {
  return useQuery({
    queryKey: ['pending-orders'],
    queryFn: fetchPendingOrders,
    refetchInterval: false, // No refetch automático, solo websocket
  });
} 

// Función temporal para mostrar el token (solo para desarrollo)
export const showCurrentToken = () => {
  const token = getStoredToken();
  if (token) {
    console.log('🔑 Token actual:', token);
    console.log('🔑 Formato para Swagger:', `Bearer ${token}`);
  } else {
    console.log('❌ No hay token almacenado');
  }
}; 