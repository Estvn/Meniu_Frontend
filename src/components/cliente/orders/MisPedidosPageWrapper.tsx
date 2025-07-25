import { useEffect, useState } from "react";
import MisPedidosPage from "../../../pages/cliente/MisPedidosPage.tsx";
import type { Order } from "../shared/order-types.ts";
//import type { CartItem } from "../shared/restaurant-types.ts";
import { fetchOrderDetails } from "../fetch/orders.ts";
import { createOrder } from "../fetch/orders.ts";
import { useCart } from "../hooks/useCart";

export default function MisPedidosPageWrapper() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mesaId, setMesaId] = useState<number | null>(null);
  const { totalItems } = useCart();

  // Función para cargar y actualizar las órdenes desde el backend y localStorage
  const loadOrders = async (ids: number[], localOrders: any[] = []) => {
    try {
      const detalles = await Promise.all(
        ids.map((id) => fetchOrderDetails(id).catch(() => null))
      );
      // Filtrar las que no fallaron
      const validOrders = detalles.filter(Boolean).map((order: any) => ({
        ...order,
        estado: order.estado as import("../shared/order-types").OrderStatus,
        impuestos: Number(order.impuestos) || 0,
        subtotal: Number(order.subtotal) || 0,
        total: Number(order.total) || 0,
        mesa: order.mesa || { numero_mesa: "?" },
        items: (order.items || []).map((item: any) => ({
          ...item,
          nombre_producto: item.nombre_producto || item.producto?.nombre || "Producto sin nombre",
          precio_unitario: Number(item.precio_unitario) || Number(item.producto?.precio) || 0,
        })),
      }));
      // Agregar los pedidos pendientes locales (que no tienen id_orden)
      const pendientesLocales = localOrders.filter((o) => !o.id_orden);
      setOrders([...pendientesLocales, ...validOrders]);
    } catch (error) {
      // Si hay error, no actualizamos las órdenes
      console.error("Error al cargar detalles de las órdenes", error);
    }
  };

  // Cargar ids y datos iniciales
  useEffect(() => {
    const storedMesaId = localStorage.getItem("id_mesa");
    //const storedCart = localStorage.getItem("cart");

    if (storedMesaId) {
      const id = Number(storedMesaId);
      setMesaId(id);
      const orderObjs = JSON.parse(localStorage.getItem(`orders_mesa_${id}`) || "[]");
      if (Array.isArray(orderObjs) && orderObjs.length > 0) {
        // ids de pedidos ya enviados
        const getCurrentOrders = () => JSON.parse(localStorage.getItem(`orders_mesa_${id}`) || "[]");
        const getCurrentIds = () => getCurrentOrders().filter((o: any) => o.id_orden).map((o: any) => o.id_orden);
        loadOrders(getCurrentIds(), getCurrentOrders());
        // Polling cada 10 segundos
        const interval = setInterval(() => loadOrders(getCurrentIds(), getCurrentOrders()), 10000);
        return () => clearInterval(interval);
      } else {
        setOrders([]);
      }
    }
  }, []);

  // Lógica para enviar pedidos pendientes cuando expire estimateTime
  useEffect(() => {
    if (!mesaId) return;
    const key = `orders_mesa_${mesaId}`;
    const localOrders = JSON.parse(localStorage.getItem(key) || "[]");
    const now = Date.now();
    localOrders.forEach(async (order: any, idx: number) => {
      if (!order.id_orden && order.estado === "PENDIENTE" && order.estimateTime <= now) {
        // Preparar cart para createOrder
        const cart = order.items.map((item: any) => ({
          id: item.id_producto,
          name: item.nombre_producto,
          price: item.precio_unitario,
          quantity: item.cantidad,
        }));
        try {
          const nuevaOrden = await createOrder(
            cart,
            order.mesa.id_mesa,
            order.restaurante.id_restaurante,
            order.notas || ""
          );
          // Actualizar el pedido local con id_orden y estado PENDIENTE
          localOrders[idx] = {
            ...order,
            ...nuevaOrden,
            estado: "PENDIENTE",
            id_orden: nuevaOrden.id_orden,
          };
          localStorage.setItem(key, JSON.stringify(localOrders));
          setOrders([...localOrders]);
        } catch (error) {
          // Puedes mostrar un toast de error aquí si lo deseas
          console.error("Error al enviar el pedido pendiente", error);
        }
      }
    });
  }, [orders, mesaId]);

  // Limpieza de localStorage al cerrar la app si todos los pedidos están pagados o cancelados
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (mesaId !== null) {
        const key = `orders_mesa_${mesaId}`;
        const localOrders = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(localOrders) && localOrders.length > 0) {
          const allPaidOrCancelled = localOrders.every(
            (order: any) => order.estado === "PAGADA" || order.estado === "CANCELADA"
          );
          if (allPaidOrCancelled) {
            localStorage.removeItem(key);
            // También limpiar el carrito
            const restauranteId = localStorage.getItem("id_restaurante");
            if (restauranteId) {
              const cartKey = `cart_${restauranteId}_${mesaId}`;
              localStorage.removeItem(cartKey);
            }
          }
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [mesaId, orders]);

  // Cancelar una orden (solo local)
  const handleCancelOrder = (orderId: number | undefined) => {
    let updatedOrders;
    if (mesaId !== null) {
      // Eliminar el pedido pendiente (sin id_orden) completamente
      updatedOrders = orders.filter((order) => {
        if (order.id_orden === null && order.timestamp_creacion === orderId) {
          return false; // eliminar
        }
        if (order.id_orden !== null && order.id_orden === orderId) {
          // Para pedidos ya enviados, solo marcar como cancelada
          order.estado = "CANCELADA";
        }
        return true;
      });
      setOrders(updatedOrders);
      localStorage.setItem(`orders_mesa_${mesaId}`, JSON.stringify(updatedOrders));
    }
  };

  // Filtrar órdenes activas (no canceladas ni pagadas)
  const activeOrders = orders.filter(
    (order) => order.estado !== "CANCELADA" && order.estado !== "PAGADA"
  );

  const totalActiveAmount = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrdersCount = activeOrders.length;

  return (
    <MisPedidosPage
      orders={orders}
      onCancelOrder={handleCancelOrder}
      totalActiveAmount={totalActiveAmount}
      activeOrdersCount={activeOrdersCount}
      totalCartItems={totalItems}
    />
  );
}
