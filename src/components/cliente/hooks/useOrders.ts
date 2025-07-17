import { useState, useEffect } from "react";
import type { Order, OrderItem } from "../shared/order-types.ts";
import type { CartItem } from "../shared/restaurant-types.ts";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const generateOrderNumber = (): string => {
    return Math.floor(Math.random() * 900000 + 100000).toString();
  };

  const getCurrentTimestamp = (): string => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formatTime = (num: number) => num.toString().padStart(2, "0");

    return `${month}/${day} ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)} ${hours >= 12 ? "PM" : "AM"}`;
  };

  const addOrder = (
    cartItems: CartItem[],
    subtotal: number,
    isv: number,
    total: number,
  ): Order => {
    const orderItems: OrderItem[] = cartItems.map((item) => {
      let itemName = item.name;

      // Añadir complementos al nombre si existen
      if (item.complements && item.complements.length > 0) {
        const selectedComps = item.complements.filter((comp) => comp.selected);
        if (selectedComps.length > 0) {
          const complementNames = selectedComps.map((comp) => comp.name).join(", ");
          itemName += ` (${complementNames})`;
        }
      }

      return {
        id: item.id,
        name: itemName,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const now = Date.now();
    const newOrder: Order = {
      id: now.toString(),
      orderNumber: generateOrderNumber(),
      status: "pendiente",
      timestamp: getCurrentTimestamp(),
      createdAt: now,
      estimatedTime: "3:00",
      items: orderItems,
      subtotal,
      isv,
      total,
      description: "Tu pedido está siendo procesado",
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, "cancelado");
  };

  const getActiveOrders = () => {
    return orders.filter(
      (order) => order.status !== "cancelado" && order.status !== "listo"
    );
  };

  const getTotalActiveAmount = () => {
    return getActiveOrders().reduce((sum, order) => sum + order.total, 0);
  };

  return {
    orders,
    addOrder,
    updateOrderStatus,
    cancelOrder,
    getActiveOrders,
    getTotalActiveAmount,
  };
}
