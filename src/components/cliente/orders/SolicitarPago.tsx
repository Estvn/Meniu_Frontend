import { X, CreditCard, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { solicitarPago, fetchOrderDetails } from "../fetch/orders.ts";

// Tipos para las órdenes del localStorage
interface LocalOrder {
  id_orden: number | null;
  id?: number;
  estado: string;
  fecha: string;
  hora_confirmacion: string;
  subtotal: number;
  impuestos: number;
  total: number;
  solicitud_pago: boolean;
  notas: string;
  restaurante: { id_restaurante: number; nombre: string };
  mesa: { id_mesa: number; numero_mesa: number };
  items: Array<{
    id_orden_item: number;
    id_producto: number;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    notas: string;
  }>;
  timestamp_creacion?: number;
  estimateTime?: number;
}

// Tipo para las órdenes del backend
interface BackendOrder {
  id_orden: number;
  estado: string;
  fecha: string;
  hora_confirmacion: string;
  subtotal: number;
  impuestos: number;
  total: number;
  solicitud_pago: boolean;
  notas: string;
  restaurante: { id_restaurante: number; nombre: string };
  mesa: { id_mesa: number; numero_mesa: number };
  items: Array<{
    id_orden_item: number;
    id_producto: number;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    notas: string;
  }>;
}

interface RequestBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasActiveOrders: boolean;
  hasOrdersWithCancelTime: boolean;
}

export function RequestBillModal({
  isOpen,
  onClose,
  hasActiveOrders,
  hasOrdersWithCancelTime,
}: RequestBillModalProps) {
  if (!isOpen) return null;

  // Check different scenarios
  const noOrders = !hasActiveOrders;
  const hasTimeToCancel = hasOrdersWithCancelTime;
  const canRequest = hasActiveOrders && !hasOrdersWithCancelTime;

  const handleRequestBill = async () => {
    if (noOrders) {
      toast.error("No tienes pedidos activos", {
        description:
          "Necesitas hacer al menos un pedido para solicitar el pago",
        duration: 4000,
      });
      onClose();
      return;
    }

    if (hasTimeToCancel) {
      toast.warning("Aún tienes tiempo para cancelar", {
        description:
          "Espera a que expire el tiempo de cancelación de tus pedidos",
        duration: 4000,
      });
      onClose();
      return;
    }

    // Obtener los ids de las órdenes de la mesa
    const mesaId = localStorage.getItem("id_mesa");
    let orderIds: number[] = [];
    if (mesaId) {
      const allOrders: LocalOrder[] = JSON.parse(localStorage.getItem(`orders_mesa_${mesaId}`) || "[]");
      orderIds = allOrders.map((o: LocalOrder) => o.id_orden || o.id || 0).filter(id => id !== 0);
    }

    console.log("IDs de las órdenes a consultar:", orderIds);

    // Consultar el backend para obtener el estado real de cada pedido
    const detalles = await Promise.all(orderIds.map((id: number) => fetchOrderDetails(id).catch(() => null)));
    detalles.forEach((order: BackendOrder | null) => {
      if (order) {
        console.log(`Orden ID: ${order.id_orden}, Estado: ${order.estado}`);
      }
    });
    const entregadas = detalles.filter(
      (order: BackendOrder | null) => order && order.estado === "ENTREGADA"
    ) as BackendOrder[];

    if (entregadas.length === 0) {
      toast.error("No hay pedidos entregados para solicitar pago");
      onClose();
      return;
    }

    try {
      await Promise.all(entregadas.map((order: BackendOrder) => solicitarPago(order.id_orden)));
      toast.success("¡Solicitud de pago enviada!", {
      description: "El mesero se dirigirá a tu mesa para procesar el pago",
      duration: 4000,
      style: {
        backgroundColor: "#10b981",
        color: "white",
        fontWeight: "500",
      },
    });
    } catch (error) {
      console.error("Error al solicitar el pago:", error);
      toast.error("Error al solicitar el pago");
    }
    onClose();
  };

  // Determine modal content based on state
  const getModalContent = () => {
    if (noOrders) {
      return {
        title: "Sin Pedidos Activos",
        description:
          "No tienes pedidos activos para solicitar el pago. Primero realiza un pedido desde el menú.",
        buttonText: "Entendido",
        buttonColor: "bg-gray-500 hover:bg-gray-600",
        iconColor: "text-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-700",
        icon: AlertTriangle,
      };
    }

    if (hasTimeToCancel) {
      return {
        title: "Pedidos en Tiempo de Cancelación",
        description:
          "Aún tienes pedidos que pueden ser cancelados. Espera a que expire el tiempo de cancelación para solicitar la cuenta.",
        buttonText: "Entendido",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        iconColor: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        icon: AlertTriangle,
      };
    }

    return {
      title: "Solicitar la Cuenta",
      description:
        "¿Deseas que el mesero venga a tu Mesa para procesar el pago?",
      buttonText: "Sí, Solicitar la Cuenta",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
      iconColor: "text-pink-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      icon: CreditCard,
    };
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 m-4 max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Dynamic icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 ${content.iconColor === "text-pink-500" ? "bg-pink-100" : content.iconColor === "text-orange-500" ? "bg-orange-100" : "bg-gray-100"} rounded-full flex items-center justify-center`}
          >
            <content.icon className={`w-8 h-8 ${content.iconColor}`} />
          </div>
        </div>

        {/* Title and description */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {content.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{content.description}</p>
        </div>

        {/* Information section - only show for success case */}
        {canRequest && (
          <div
            className={`${content.bgColor} border ${content.borderColor} rounded-lg p-4 mb-6`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Info className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">
                  Información
                </h3>
                <p className={`${content.textColor} text-sm leading-relaxed`}>
                  El mesero será notificado y se dirigirá a tu mesa para
                  procesar el pago de todos tus pedidos activos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRequestBill}
            className={`w-full py-4 ${content.buttonColor} text-white font-medium rounded-lg transition-colors text-lg`}
          >
            {content.buttonText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}