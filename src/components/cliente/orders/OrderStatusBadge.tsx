import type { OrderStatus } from "../shared/order-types.ts";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "pendiente":
        return {
          label: "Pendiente",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "preparando":
        return {
          label: "Preparando",
          className: "bg-orange-100 text-orange-800 border-orange-300",
        };
      case "listo":
        return {
          label: "Listo",
          className: "bg-green-100 text-green-800 border-green-300",
        };
      case "cancelado":
        return {
          label: "Cancelado",
          className: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          label: "Desconocido",
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
