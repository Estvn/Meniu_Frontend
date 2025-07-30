"use client";
import { useState } from "react";
import type { OrderCajero } from "../../hooks/useOrderWebSocket";

interface OrdersListProps {
  orders: OrderCajero[];
  onStatusChange: (orderId: number, newStatus: OrderCajero['estado']) => void;
}

export function OrdersList({ orders, onStatusChange }: OrdersListProps) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const getStatusColor = (status: OrderCajero['estado']) => {
    switch (status) {
      case 'preparando':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'listo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'entregado':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pagado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: OrderCajero['estado']) => {
    switch (status) {
      case 'preparando':
        return 'Preparando';
      case 'listo':
        return 'Listo';
      case 'entregado':
        return 'Entregado';
      case 'pagado':
        return 'Pagado';
      default:
        return status;
    }
  };

  const getNextStatus = (currentStatus: OrderCajero['estado']): OrderCajero['estado'] | null => {
    switch (currentStatus) {
      case 'preparando':
        return 'listo';
      case 'listo':
        return 'entregado';
      case 'entregado':
        return 'pagado';
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleExpanded = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontraron pedidos con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Header de la orden */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Mesa {order.mesa_numero}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.estado)}`}>
                {getStatusLabel(order.estado)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Orden #{order.id}</span>
              <span>{formatTime(order.fecha_creacion)}</span>
            </div>
          </div>

          {/* Items de la orden */}
          <div className="p-4">
            <div className="space-y-2 mb-4">
              {order.items.slice(0, expandedOrder === order.id ? order.items.length : 2).map((item) => (
                <div key={`${order.id}-${item.id}`} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{item.nombre}</span>
                    <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${(Number(item.subtotal) || 0).toFixed(2)}
                  </span>
                </div>
              ))}
              
              {order.items.length > 2 && expandedOrder !== order.id && (
                <button
                  onClick={() => toggleExpanded(order.id)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  +{order.items.length - 2} más items
                </button>
              )}
              
              {expandedOrder === order.id && order.items.length > 2 && (
                <button
                  onClick={() => toggleExpanded(order.id)}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Ver menos
                </button>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${(Number(order.total) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="p-4 pt-0">
            <div className="flex gap-2">
              {getNextStatus(order.estado) && (
                <button
                  onClick={() => onStatusChange(order.id, getNextStatus(order.estado)!)}
                  className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200"
                >
                  {order.estado === 'listo' ? 'Entregar' : 
                   order.estado === 'entregado' ? 'Cobrar' : 
                   'Siguiente'}
                </button>
              )}
              
              {order.estado === 'pagado' && (
                <button
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                  disabled
                >
                  Completado
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 