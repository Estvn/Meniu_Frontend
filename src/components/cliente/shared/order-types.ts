import type {Restaurante} from "./restaurant-types.ts";

export type OrderStatus = "PENDIENTE" | "PREPARANDO" | "LISTO" | "CANCELADO";

export interface OrderItem {
  id_orden_item: number;
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  notas?: string;
}

export interface Mesa {
  id_mesa: number;
  numero_mesa: number;
  qr_code?: string;
  estado_mesa?: string;
}



export interface Order {
  id_orden: number;
  estado: OrderStatus;
  fecha: string;
  hora_confirmacion: string;
  hora_lista?: string | null;
  hora_entregada?: string | null;
  subtotal: number;
  impuestos: number;
  total: number;
  solicitud_pago: boolean;
  notas: string;

  restaurante: Restaurante;
  mesa: Mesa;

  items: OrderItem[];
}
