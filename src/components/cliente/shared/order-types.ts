export type OrderStatus = "pendiente" | "preparando" | "listo" | "cancelado";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  complements?: string; // Store complements as string for display
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  isv: number;
  total: number;
  timestamp: string;
  createdAt: number; // Unix timestamp for precise timing
  estimatedTime?: string;
  description?: string;
}
