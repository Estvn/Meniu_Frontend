import type { OrderStatus } from "../shared/order-types.ts";

interface OrderStatusBadgeProps {
  estado: OrderStatus;
}

export function OrderStatusBadge({estado}: OrderStatusBadgeProps) {
  const getStatusConfig = (estado: OrderStatus) => {
    switch (estado) {
      case "PENDIENTE":
        return {
          label: "Pendiente",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "PREPARANDO":
        return {
          label: "Preparando",
          className: "bg-orange-100 text-orange-800 border-orange-300",
        };
      case "LISTO":
        return {
          label: "Listo",
          className: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "ENTREGADA":
        return {
          label: "Entregada",
          className: "bg-green-100 text-green-800 border-green-300",
        };
      case "CANCELADA":
        return {
          label: "Cancelado",
          className: "bg-red-100 text-red-800 border-red-300",
        };
      case "PAGADA":
        return {
          label: "Pagado",
          className: "bg-blue-100 text-blue-800 border-blue-300",
        };
      default:
        return {
          label: "Desconocido",
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  const config = getStatusConfig(estado);

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
