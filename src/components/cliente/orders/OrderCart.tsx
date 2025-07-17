import type { Order } from "../shared/order-types.ts";
import { OrderStatusBadge } from "./OrderStatusBadge.tsx";
import { useCountdown } from "../hooks/useCountdown.ts";

interface OrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: string) => void;
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  const totalSeconds = order.estimatedTime
    ? parseInt(order.estimatedTime.split(":")[0]) * 60 +
      parseInt(order.estimatedTime.split(":")[1])
    : 0;

  const timeLeft = useCountdown(new Date(order.createdAt), totalSeconds);

  const getStatusMessage = () => {
    switch (order.status) {
      case "pendiente":
        return "Tu pedido está siendo procesado";
      case "preparando":
        return "El chef está preparando tu pedido";
      case "listo":
        return "¡Tu pedido está listo!";
      case "cancelado":
        return "Este pedido fue cancelado";
      default:
        return "";
    }
  };

  // Mostrar botón solo si el pedido está pendiente y aún hay tiempo
  const showCancelButton =
    order.status === "pendiente" && totalSeconds > 0 && timeLeft !== "00:00";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      {/* Header con status y precio */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <OrderStatusBadge status={order.status} />
          <h3 className="font-semibold text-gray-900 mt-2">
            Pedido #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500">{order.timestamp}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            L{order.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Mensaje de estado */}
      <p className="text-sm text-gray-600 mb-3">{getStatusMessage()}</p>

      {/* Productos */}
      <div className="space-y-2 mb-3">
        {order.items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="text-sm">
            <div className="flex justify-between">
              <span className="font-medium">
                {item.quantity}x {item.name.split(" (")[0]}
              </span>
              <span>L{(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {item.name.includes("(") && (
              <div className="text-gray-600 text-xs ml-4">
                {item.name.match(/\((.*)\)/)?.[1]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ISV */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>ISV (15%)</span>
        <span>L{order.isv.toFixed(2)}</span>
      </div>

      {/* Mensaje si está listo */}
      {order.status === "listo" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <p className="text-green-800 font-medium text-sm">
            ¡Tu pedido está listo!
          </p>
        </div>
      )}

      {/* Botón para cancelar */}
      {showCancelButton && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-orange-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            Tiempo para cancelar: {timeLeft}
          </div>
          <button
            onClick={() => onCancelOrder?.(order.id)}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Tiempo expirado */}
      {order.status === "pendiente" && totalSeconds > 0 && timeLeft === "00:00" && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600 text-sm">
            El tiempo para cancelar este pedido terminó.
          </p>
        </div>
      )}
    </div>
  );
}
