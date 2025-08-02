import type { Order } from "../shared/order-types.ts";
import { OrderStatusBadge } from "./OrderStatusBadge.tsx";
import { useCountdown } from "../hooks/useCountdown.ts";
import type { OrderStatus } from "../shared/order-types.ts";
import { useState } from "react";
import { Modal } from "../../administration/forms/Modal";

interface OrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: number) => void;
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  // Calcular tiempo restante real para pedidos pendientes
  const totalSeconds = order.timestamp_creacion && order.estimateTime
    ? Math.floor((order.estimateTime - order.timestamp_creacion) / 1000)
  : 0;
  const createdDate = new Date(order.timestamp_creacion || Date.now());
  const timeLeft = useCountdown(createdDate, totalSeconds);

  const showCancelButton =
    order.estado === "PENDIENTE" &&
    order.timestamp_creacion &&
    order.estimateTime &&
    timeLeft !== "00:00";

  const getStatusMessage = () => {
    switch (order.estado) {
      case "PENDIENTE":
        return "Tu pedido está siendo procesado";
      case "PREPARANDO":
        return "El chef está preparando tu pedido";
      case "LISTO":
        return "¡Tu pedido está listo!";
      case "ENTREGADA":
        return "¡Tu pedido fue entregado!";
      case "CANCELADA":
        return "Este pedido fue cancelado";
      case "PAGADA":
        return "Este pedido fue pagado";
      default:
        return "";
    }
  };


  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCancelOrder = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    const cancelId = order.id_orden !== null && order.id_orden !== undefined
      ? order.id_orden
      : (order.timestamp_creacion !== undefined ? order.timestamp_creacion : undefined);
    if (typeof cancelId === 'number') {
      onCancelOrder?.(cancelId);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <OrderStatusBadge estado={order.estado as OrderStatus} />
          <h3 className="font-semibold text-gray-900 mt-2">
            Pedido #{order.id_orden}
          </h3>
          <p className="text-sm text-gray-500">
            Mesa {localStorage.getItem("num_mesa")}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {(() => {
              // Manejar diferentes formatos de fecha
              let fechaFormateada = order.fecha;
              
              // Si la fecha contiene 'T', es formato ISO completo
              if (order.fecha && order.fecha.includes('T')) {
                const fecha = new Date(order.fecha);
                fechaFormateada = fecha.toLocaleDateString('es-ES');
              } else if (order.fecha) {
                // Si es solo fecha (YYYY-MM-DD), formatear
                const [year, month, day] = order.fecha.split('-');
                fechaFormateada = `${day}/${month}/${year}`;
              }
              
              return `${fechaFormateada}, ${order.hora_confirmacion}`;
            })()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            L{(Number(order.total) || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{getStatusMessage()}</p>

      <div className="space-y-2 mb-3">
        {order.items.map((item) => (
          <div key={item.id_orden_item} className="text-sm">
            <div className="flex justify-between">
              <span className="font-medium">
                {item.cantidad}x {item.nombre_producto}
                
              </span>
              <span>
                L{(item.precio_unitario * item.cantidad).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>


      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>ISV (15%)</span>
        <span>L{(Number(order.impuestos) || 0).toFixed(2)}</span>
      </div>

      {order.notas && (
        <div className="mb-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          <span className="font-semibold">Notas:</span> {order.notas}
        </div>
      )}

      {/* Pedido entregado */}
      {order.estado === "ENTREGADA" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <p className="text-green-800 font-medium text-sm">
            ¡Tu pedido ha sido entregado!
          </p>
        </div>
      )}

      {/* Botón cancelar */}
      {showCancelButton && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-orange-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
            Tiempo para cancelar: {timeLeft}
          </div>
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      {showConfirmModal && (
        <Modal onClose={handleCloseModal}>
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-lg font-bold text-gray-900">¿Cancelar pedido?</h2>
            <p className="text-gray-700">¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.</p>
            <div className="flex gap-2 justify-end w-full pt-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                type="button"
              >
                No, volver
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                type="button"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Tiempo expirado */}
      {order.estado === "PENDIENTE" && order.timestamp_creacion && order.estimateTime && timeLeft === "00:00" && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600 text-sm">
            El tiempo para cancelar este pedido terminó.
          </p>
        </div>
      )}
    </div>
  );
}
