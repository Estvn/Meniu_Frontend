import { useState, useEffect } from "react";

interface LocalOrder {
  id_orden: number | null;
  estado: string;
  timestamp_creacion?: number;
  estimateTime?: number;
}

export function useActiveOrders() {
  const [hasActiveOrders, setHasActiveOrders] = useState(false);
  const [hasOrdersWithCancelTime, setHasOrdersWithCancelTime] = useState(false);

  useEffect(() => {
    const checkActiveOrders = () => {
      const mesaId = localStorage.getItem("id_mesa");
      if (!mesaId) {
        setHasActiveOrders(false);
        setHasOrdersWithCancelTime(false);
        return;
      }

      try {
        const localOrders: LocalOrder[] = JSON.parse(
          localStorage.getItem(`orders_mesa_${mesaId}`) || "[]"
        );

        const now = Date.now();
        
        // Verificar pedidos activos (PENDIENTE, PREPARANDO, LISTO, ENTREGADA)
        const activeOrders = localOrders.some((order) => 
          order.estado === "PENDIENTE" || 
          order.estado === "PREPARANDO" || 
          order.estado === "LISTO" || 
          order.estado === "ENTREGADA"
        );

        // Verificar pedidos con tiempo de cancelación
        const ordersWithCancelTime = localOrders.some((order) => 
          order.estado === "PENDIENTE" && 
          order.timestamp_creacion && 
          order.estimateTime && 
          order.estimateTime > now
        );

        setHasActiveOrders(activeOrders);
        setHasOrdersWithCancelTime(ordersWithCancelTime);
      } catch (error) {
        console.error("Error al verificar pedidos activos:", error);
        setHasActiveOrders(false);
        setHasOrdersWithCancelTime(false);
      }
    };

    // Verificar inmediatamente
    checkActiveOrders();

    // Verificar cada 5 segundos para mantener sincronizado
    const interval = setInterval(checkActiveOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  return { hasActiveOrders, hasOrdersWithCancelTime };
} 