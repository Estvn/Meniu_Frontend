import { useEffect, useState } from "react";
import MisPedidosPage from "../../../pages/cliente/MisPedidosPage.tsx";
import type { Order } from "../shared/order-types.ts";
import type { CartItem } from "../shared/restaurant-types.ts";


export default function MisPedidosPageWrapper() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [mesaId, setMesaId] = useState<number | null>(null);

  // Cargar órdenes y datos iniciales
  useEffect(() => {
    const storedMesaId = localStorage.getItem("id_mesa");
    const storedCart = localStorage.getItem("cart");

    if (storedMesaId) {
      const id = Number(storedMesaId);
      setMesaId(id);
      const savedOrders = JSON.parse(localStorage.getItem(`orders_mesa_${id}`) || "[]");
      setOrders(savedOrders);
    }

    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      const totalItems = (cartItems as CartItem[]).reduce(
  (sum, item) => sum + item.quantity,
  0
);
      setTotalCartItems(totalItems);
    }
  }, []);

  // Cancelar una orden
  const handleCancelOrder = (orderId: number) => {
    const updatedOrders = orders.map((order) =>
      order.id_orden === orderId ? { ...order, estado: "CANCELADO" } : order
    );
    setOrders(updatedOrders);

    if (mesaId !== null) {
      localStorage.setItem(`orders_mesa_${mesaId}`, JSON.stringify(updatedOrders));
    }
  };

  // Filtrar órdenes activas (no canceladas ni listas)
  const activeOrders = orders.filter(
    (order) => order.estado !== "CANCELADO" && order.estado !== "LISTO"
  );

  const totalActiveAmount = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrdersCount = activeOrders.length;

  return (
    <MisPedidosPage
      orders={orders}
      onCancelOrder={handleCancelOrder}
      totalActiveAmount={totalActiveAmount}
      activeOrdersCount={activeOrdersCount}
      totalCartItems={totalCartItems}
    />
  );
}
