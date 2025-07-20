// components/cliente/fetch/api/orders.ts

import type { CartItem } from "../shared/restaurant-types.ts";
const API_URL = import.meta.env.VITE_API_URL;

interface CreateOrderPayload {
  id_mesa: number;
  id_restaurante: number;
  notas: string;
  items: {
    id_producto: number;
    cantidad: number;
  }[];
}

export async function createOrder(
  cart: CartItem[],
  idMesa: number,
  idRestaurante: number,
  notas: string
) {
  const payload: CreateOrderPayload = {
    id_mesa: idMesa,
    id_restaurante: idRestaurante,
    notas,
    items: cart.map((item) => ({
      id_producto: Number(item.id),
      cantidad: item.quantity,
    })),
  };

  const response = await fetch(`${API_URL}/orders/Crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

console.log("Payload que se enviará:", payload);
  if (!response.ok) {
    throw new Error("Error al crear el pedido");
  }

  return await response.json();
}
