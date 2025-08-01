import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getStoredUserData } from '../assets/scripts/values/constValues';
import type { OrderResponse } from '../endpoints/administration/orders';

// Tipos específicos para los items de cada rol
export interface OrderItemCajero {
  id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface OrderCajero {
  id: number;
  mesa_numero: number;
  estado: 'preparando' | 'listo' | 'entregado' | 'pagado';
  total: number;
  items: OrderItemCajero[];
  fecha_creacion: string;
}

export interface OrderItemCocinero {
  id: number;
  nombre: string;
  estado: 'pendientes' | 'listos';
  categoria: string;
  cantidad: number;
}

export interface OrderCocinero {
  id: number;
  mesa_numero: number;
  items: OrderItemCocinero[];
  fecha_creacion: string;
}

interface UseOrderWebSocketProps<T> {
  role: 'cajero' | 'cocinero';
  onNewOrder?: (order: T) => void;
  onOrderStatus?: (order: T) => void;
  onItemStatusChange?: (orderId: number, itemId: number, newStatus: string) => void;
}

// Función para mapear datos del backend al formato del frontend para cajero
export const mapBackendOrderToFrontend = (backendOrder: OrderResponse): OrderCajero | null => {
  // Validar que restaurante y mesa existan
  if (!backendOrder.restaurante || !backendOrder.mesa) {
    return null;
  }

  // Mapear el estado correctamente
  let estado: 'preparando' | 'listo' | 'entregado' | 'pagado';
  switch (backendOrder.estado.toLowerCase()) {
    case 'preparando':
    case 'preparación':
      estado = 'preparando';
      break;
    case 'listo':
    case 'lista':
      estado = 'listo';
      break;
    case 'entregado':
    case 'entregada':
      estado = 'entregado';
      break;
    case 'pagado':
    case 'pagada':
      estado = 'pagado';
      break;
    default:
      estado = 'preparando';
  }

  return {
    id: backendOrder.id_orden,
    mesa_numero: backendOrder.mesa.numero_mesa,
    estado: estado,
    total: Number(backendOrder.total) || 0,
    items: backendOrder.items.map(item => ({
      id: item.id_orden_item,
      nombre: item.nombre_producto,
      cantidad: Number(item.cantidad) || 0,
      precio_unitario: Number(item.precio_unitario) || 0,
      subtotal: Number(item.precio_unitario) * Number(item.cantidad) || 0
    })),
    fecha_creacion: backendOrder.fecha
  };
};

// Función para mapear datos del backend al formato del frontend para cocinero
export const mapBackendOrderToCookFrontend = (backendOrder: OrderResponse): OrderCocinero | null => {
  // Validar que restaurante y mesa existan
  if (!backendOrder.restaurante || !backendOrder.mesa) {
    return null;
  }

  return {
    id: backendOrder.id_orden,
    mesa_numero: backendOrder.mesa.numero_mesa,
    items: backendOrder.items.map(item => ({
      id: item.id_orden_item,
      nombre: item.nombre_producto,
      estado: (item.estado || 'pendientes') as 'pendientes' | 'listos', // Usar el estado real del backend
      categoria: 'Platos Principales', // Por defecto, se puede ajustar según la lógica del backend
      cantidad: Number(item.cantidad) || 0
    })),
    fecha_creacion: backendOrder.fecha
  };
};

export function useOrderWebSocket<T = unknown>({ role, onNewOrder, onOrderStatus, onItemStatusChange }: UseOrderWebSocketProps<T>) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const userData = getStoredUserData();
    
    if (!userData?.restaurante_id) {
      return;
    }

    const socket = io('https://api-meniuapp-dev.azurewebsites.net', {
      query: {
        role,
        restauranteId: userData.restaurante_id,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });
    socketRef.current = socket;

    // Manejo de eventos de conexión
    socket.on('connect', () => {
      // Conexión exitosa
    });

    socket.on('connect_error', () => {
      // Error de conexión silenciado
    });

    socket.on('disconnect', () => {
      // Desconexión silenciada
    });

    socket.on('joined', () => {
      // Unido a sala silenciado
    });

    // Configurar listeners de eventos
    if (onNewOrder) {
      socket.on('nueva_orden', (data: T) => {
        onNewOrder(data);
      });
    }
    
    if (onOrderStatus) {
      socket.on('estado_orden', (data: T) => {
        onOrderStatus(data);
      });
    }

    // Nuevo evento para cambios de estado de items específicos
    if (onItemStatusChange) {
      socket.on('estado_item', (data: { orderId: number; itemId: number; newStatus: string }) => {
        onItemStatusChange(data.orderId, data.itemId, data.newStatus);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [role, onNewOrder, onOrderStatus, onItemStatusChange]);

  return {
    disconnect: () => {
      socketRef.current?.disconnect();
    },
  };
} 