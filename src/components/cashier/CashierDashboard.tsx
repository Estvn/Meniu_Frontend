"use client";
import { CashierNavBar } from "./CashierNavBar";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { OrdersList } from "./OrdersList";
import { useState, useEffect, useCallback } from "react";
import { useOrderWebSocket, type OrderCajero, mapBackendOrderToFrontend } from '../../hooks/useOrderWebSocket';
import { useOrders, useUpdateOrderStatusForCashier } from '../../endpoints/administration/orders';



export function CashierDashboard() {
  // Estado de pedidos en tiempo real
  const [orders, setOrders] = useState<OrderCajero[]>([]);
  
  // Cargar datos iniciales desde API
  const { data: initialOrders, isLoading, error } = useOrders();
  
  // Hook para actualizar el estado de las órdenes
  const updateOrderStatusMutation = useUpdateOrderStatusForCashier();

  // Cargar datos iniciales cuando lleguen del endpoint
  useEffect(() => {
    if (initialOrders) {
      const mappedOrders = initialOrders
        .map(mapBackendOrderToFrontend)
        .filter((order): order is OrderCajero => order !== null);
      setOrders(mappedOrders);
    }
  }, [initialOrders]);

  const [filteredOrders, setFilteredOrders] = useState<OrderCajero[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'preparing' | 'ready' | 'delivered' | 'paid'>('all');

  // Filtrar órdenes basado en búsqueda y filtros
  useEffect(() => {
    let filtered = orders;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.mesa_numero.toString().includes(searchTerm) ||
        order.items.some(item => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => {
        switch (activeFilter) {
          case 'preparing':
            return order.estado === 'preparando';
          case 'ready':
            return order.estado === 'listo';
          case 'delivered':
            return order.estado === 'entregado';
          case 'paid':
            return order.estado === 'pagado';
          default:
            return true;
        }
      });
    } else {
      // En la vista "Todos", excluir las órdenes pagadas por defecto
      filtered = filtered.filter(order => order.estado !== 'pagado');
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, activeFilter]);

  // Memoizar las funciones de callback para evitar reconexiones del WebSocket
  const handleNewOrder = useCallback((order: OrderCajero) => {
    setOrders((prev) => {
      // Si la orden ya existe, no la duplicamos
      if (prev.some(o => o.id === order.id)) return prev;
      return [...prev, order];
    });
  }, []);

  const handleOrderStatus = useCallback((order: OrderCajero) => {
    setOrders((prev) => prev.map(o => o.id === order.id ? order : o));
  }, []);

  const handleItemStatusChange = useCallback((orderId: number, _itemId: number, newStatus: string) => {
    // Cuando un item cambia a "listo", actualizar el estado de la orden completa
    if (newStatus === 'listo') {
      setOrders((prev) => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, estado: 'listo' as const }
            : order
        )
      );
    }
  }, []);

  // Integración websocket para actualizaciones en tiempo real
  useOrderWebSocket<OrderCajero>({
    role: 'cajero',
    onNewOrder: handleNewOrder,
    onOrderStatus: handleOrderStatus,
    onItemStatusChange: handleItemStatusChange,
  });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter: 'all' | 'preparing' | 'ready' | 'delivered' | 'paid') => {
    setActiveFilter(filter);
  };

  const handleOrderStatusChange = useCallback(async (orderId: number, newStatus: OrderCajero['estado']) => {
    try {
      // Encontrar la orden actual para obtener su estado
      const currentOrder = orders.find(order => order.id === orderId);
      
      if (!currentOrder) {
        return;
      }
      
      // Determinar la acción basándose en el estado actual
      let action: string;
      switch (currentOrder.estado) {
        case 'listo':
          action = 'entregar';
          break;
        case 'entregado':
          action = 'pagar';
          break;
        default:
          return;
      }
      
      // Actualizar el estado local INMEDIATAMENTE para feedback visual
      setOrders((prev) => {
        const updated = prev.map(order => 
          order.id === orderId 
            ? { ...order, estado: newStatus }
            : order
        );
        return updated;
      });
      
      // Intentar actualizar en el backend
      try {
        await updateOrderStatusMutation.mutateAsync({
          orderId,
          newStatus: action // Enviamos la acción, no el estado
        });
      } catch {
        // Silenciar errores del backend para mantener la UI actualizada
        // El cambio se mantiene solo en la UI local
      }
      
    } catch {
      // Silenciar errores generales
    }
  }, [updateOrderStatusMutation, orders]);

  // Calcular estadísticas
  const stats = {
    totalOrders: orders.length,
    preparingOrders: orders.filter(o => o.estado === 'preparando').length,
    readyOrders: orders.filter(o => o.estado === 'listo').length,
    deliveredOrders: orders.filter(o => o.estado === 'entregado').length,
    paidOrders: orders.filter(o => o.estado === 'pagado').length
  };

  // Mostrar loading mientras cargan los datos iniciales
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
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
      <CashierNavBar 
        title="Panel de Cajero" 
        subtitle="Gestión de pedidos y pagos"
      />
      
      <div className="pt-16 sm:pt-18 md:pt-20">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Cajero</h1>
          </div>
          <SearchSection 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
          
          <StatsCards stats={stats} />
          
          <OrdersList 
            orders={filteredOrders}
            onStatusChange={handleOrderStatusChange}
          />
        </div>
      </div>
    </div>
  );
} 