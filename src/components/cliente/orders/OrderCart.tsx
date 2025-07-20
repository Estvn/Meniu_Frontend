import type { Order } from "../shared/order-types.ts";
import { OrderStatusBadge } from "./OrderStatusBadge.tsx";
import { useCountdown } from "../hooks/useCountdown.ts";

interface OrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: number) => void;
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  // Convertir "03:00" → 180 segundos
  const estimatedTime = "03:00";
  
  const totalSeconds = estimatedTime
  ? parseInt(estimatedTime.split(":")[0]) * 60 +
    parseInt(estimatedTime.split(":")[1])
  : 0;


  const createdDate = new Date(order.fecha);
  const timeLeft = useCountdown(createdDate, totalSeconds);

  const getStatusMessage = () => {
    switch (order.estado) {
      case "PENDIENTE":
        return "Tu pedido está siendo procesado";
      case "PREPARANDO":
        return "El chef está preparando tu pedido";
      case "LISTO":
        return "¡Tu pedido está listo!";
      case "CANCELADO":
        return "Este pedido fue cancelado";
      default:
        return "";
    }
  };

  const showCancelButton =
    order.estado === "PENDIENTE" &&
    totalSeconds > 0 &&
    timeLeft !== "00:00";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <OrderStatusBadge estado={order.estado } />
          <h3 className="font-semibold text-gray-900 mt-2">
            Pedido #{order.id_orden}
          </h3>
          <p className="text-sm text-gray-500">
            Mesa {order.mesa?.numero_mesa ?? "?"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(order.fecha).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            L{order.total.toFixed(2)}
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
            {item.notas && (
              <div className="text-gray-600 text-xs ml-4">{item.notas}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>ISV (15%)</span>
        <span>L{order.impuestos.toFixed(2)}</span>
      </div>

      {/* Pedido listo */}
      {order.estado === "LISTO" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <p className="text-green-800 font-medium text-sm">
            ¡Tu pedido está listo!
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
            onClick={() => onCancelOrder?.(order.id_orden)}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Tiempo expirado */}
      {order.estado === "PENDIENTE" && totalSeconds > 0 && timeLeft === "00:00" && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600 text-sm">
            El tiempo para cancelar este pedido terminó.
          </p>
        </div>
      )}
    </div>
  );
}
