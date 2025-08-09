//// components/cliente/fetch/api/orders.ts

import type { CartItem } from "../shared/restaurant-types.ts";
const API_URL ="https://api-meniuapp-dev.azurewebsites.net";
//const API_URL = "http://localhost:3000";

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
    id_mesa: Number(idMesa),
    id_restaurante: Number(idRestaurante),
    notas,
    items: cart.map((item) => ({
      id_producto: Number(item.id),
      cantidad: item.quantity,
    })),
  };

  // Crear un AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout

  try {
    const response = await fetch(`${API_URL}/orders/Crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("Payload que se enviará:", payload);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Respuesta del backend:", errorText);
      throw new Error(`Error al crear el pedido: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Tiempo de espera agotado. Por favor, intenta de nuevo.");
      }
      throw error;
    }
    
    throw new Error("Error inesperado al crear el pedido");
  }
}

export async function fetchOrderDetails(id_orden: number) {
  const response = await fetch(`${API_URL}/orders/detalles-orden/${id_orden}`);
  if (!response.ok) {
    throw new Error("Error al obtener los detalles de la orden");
  }
  return await response.json();
}

export async function solicitarPago(id_orden: number) {
  const response = await fetch(`${API_URL}/orders/${id_orden}/solicitar-pago`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Error al solicitar el pago");
  }
  return await response.json();
}

export async function cancelarPedido(id_orden: number) {
  const response = await fetch(`${API_URL}/orders/${id_orden}/cancelar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Error al cancelar el pedido");
  }
  return await response.json();
}
