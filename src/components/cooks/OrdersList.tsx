"use client";
import { useState } from "react";

interface OrderItem {
  id: number;
  nombre: string;
  estado: 'pendientes' | 'listos';
  categoria: string;
  cantidad: number;
}

interface Order {
  id: number;
  mesa_numero: number;
  items: OrderItem[];
  fecha_creacion: string;
}

interface OrdersListProps {
  orders: Order[];
  onStatusChange: (orderId: number, itemId: number) => void;
}

export function OrdersList({ orders, onStatusChange }: OrdersListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const getStatusLabel = (status: OrderItem['estado']) => {
    switch (status) {
      case 'pendientes':
        return 'Pendientes';
      case 'listos':
        return 'Listos';
      default:
        return status;
    }
  };

  const getNextStatus = (currentStatus: OrderItem['estado']): OrderItem['estado'] | null => {
    switch (currentStatus) {
      case 'pendientes':
        return 'listos';
      default:
        return null;
    }
  };

  // Obtener todos los items de todas las órdenes (solo pendientes)
  const allItems = orders.flatMap(order => 
    order.items
      .filter(item => item.estado === 'pendientes') // Solo mostrar items pendientes
      .map(item => ({ ...item, orderId: order.id }))
  );

  // Calcular paginación
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (allItems.length === 0) {
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
        <p className="mt-1 text-sm text-gray-500">No se encontraron pedidos para preparar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <div
            key={`${item.orderId}-${item.id}`}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            {/* Nombre del item */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {item.nombre}
            </h3>
            
            {/* Estado */}
            <p className="text-sm text-gray-600 mb-2">
              Estado: {getStatusLabel(item.estado)}
            </p>
            
            {/* Categoría */}
            <div className="mb-3">
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                {item.categoria}
              </span>
            </div>
            
            {/* Cantidad */}
            <p className="text-sm text-gray-600 mb-3">
              Unidades: {item.cantidad}
            </p>
            
            {/* Botón de acción */}
            <div className="flex gap-2">
              {getNextStatus(item.estado) && item.estado === 'pendientes' && (
                <button
                  key={`next-${item.orderId}-${item.id}`}
                  onClick={() => onStatusChange(item.orderId, item.id)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  Marcar Listo
                </button>
              )}
              
              {item.estado === 'listos' && (
                <button
                  key={`completed-${item.orderId}-${item.id}`}
                  className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm font-medium cursor-not-allowed"
                  disabled
                >
                  Completado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
} 