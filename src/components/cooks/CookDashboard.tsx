"use client";
import { CookNavBar } from "./CookNavBar";
import { OrdersList } from "./OrdersList";
import { useState, useEffect, useCallback } from "react";
import { useOrderWebSocket, type OrderCocinero, mapBackendOrderToCookFrontend } from '../../hooks/useOrderWebSocket';
import { usePendingOrders, useUpdateOrderStatus } from '../../endpoints/administration/orders';

export function CookDashboard() {
  // Estado de pedidos en tiempo real
  const [orders, setOrders] = useState<OrderCocinero[]>([]);
  
  // Cargar datos iniciales desde API
  const { data: initialOrders, isLoading, error } = usePendingOrders();
  
  // Hook para actualizar el estado de las órdenes
  const updateOrderStatusMutation = useUpdateOrderStatus();

  // Cargar datos iniciales cuando lleguen del endpoint
  useEffect(() => {
    if (initialOrders) {
      const mappedOrders = initialOrders
        .map(mapBackendOrderToCookFrontend)
        .filter((order): order is OrderCocinero => order !== null);
      setOrders(mappedOrders);
    }
  }, [initialOrders]);

  // Memoizar las funciones de callback para evitar reconexiones del WebSocket
  const handleNewOrder = useCallback((order: OrderCocinero) => {
    setOrders((prev) => {
      if (prev.some(o => o.id === order.id)) return prev;
      return [...prev, order];
    });
  }, []);

  const handleOrderStatus = useCallback((order: OrderCocinero) => {
    setOrders((prev) => prev.map(o => o.id === order.id ? order : o));
  }, []);

  const handleItemStatusChange = useCallback((orderId: number, itemId: number, newStatus: string) => {
    setOrders((prev) => 
      prev.map(order => 
        order.id === orderId 
          ? {
              ...order,
              items: order.items.map(item => 
                item.id === itemId 
                  ? { ...item, estado: newStatus as 'pendientes' | 'listos' }
                  : item
              )
            }
          : order
      )
    );
  }, []);

  // Integración websocket para actualizaciones en tiempo real
  useOrderWebSocket<OrderCocinero>({
    role: 'cocinero',
    onNewOrder: handleNewOrder,
    onOrderStatus: handleOrderStatus,
    onItemStatusChange: handleItemStatusChange,
  });

  const handleOrderStatusChange = useCallback(async (orderId: number, itemId: number) => {
    try {
      console.log('Marcando orden como lista:', orderId);
      
      // Verificar si el item ya está marcado como listo
      const currentOrder = orders.find(order => order.id === orderId);
      const currentItem = currentOrder?.items.find(item => item.id === itemId);
      
      if (!currentOrder || !currentItem) {
        console.log('Orden o item no encontrado, saltando actualización');
        return;
      }
      
      if (currentItem.estado === 'listos') {
        console.log('Item ya está marcado como listo, saltando actualización');
        return;
      }
      
      // Verificar si todos los items de la orden ya están marcados como listos
      const allItemsListos = currentOrder.items.every(item => item.estado === 'listos');
      if (allItemsListos) {
        console.log('Todos los items de la orden ya están marcados como listos, saltando actualización');
        return;
      }
      
      // Actualizar el estado local INMEDIATAMENTE para feedback visual
      setOrders((prev) => 
        prev.map(order => 
          order.id === orderId 
            ? {
                ...order,
                items: order.items.map(item => 
                  item.id === itemId 
                    ? { ...item, estado: 'listos' as const }
                    : item
                )
              }
            : order
        )
      );
      
      // Verificar si todos los items de la orden están listos después de la actualización
      const updatedOrder = orders.find(order => order.id === orderId);
      if (updatedOrder) {
        const allItemsListos = updatedOrder.items.every(item => 
          item.id === itemId ? true : item.estado === 'listos'
        );
        
        if (allItemsListos) {
          console.log('Todos los items de la orden están listos, actualizando estado de la orden completa');
          // Solo actualizar el backend cuando todos los items estén listos
          try {
            await updateOrderStatusMutation.mutateAsync({
              orderId
            });
            console.log('Orden marcada como lista en el backend');
          } catch (backendError) {
            console.error('Error al marcar la orden como lista en el backend:', backendError);
          }
        } else {
          console.log('No todos los items están listos, manteniendo solo actualización local');
        }
      }
      
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    }
  }, [updateOrderStatusMutation, orders]);

  // Mostrar loading mientras cargan los datos iniciales
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos pendientes...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si falla la carga
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error al cargar los pedidos</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CookNavBar />
      
      <div className="pt-16 sm:pt-18 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Pedidos pendientes de preparación
            </h2>
            <OrdersList 
              orders={orders}
              onStatusChange={handleOrderStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 