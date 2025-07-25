// Pagina del carrito

import { useState } from "react";
import { useNavigate} from "react-router-dom";
import type { CartItem } from "../../components/cliente/shared/restaurant-types.ts";
import { OrderConfirmationModal } from "../../components/cliente/cart/OrderConfirmation.tsx";
import { CartHeader } from "../../components/cliente/cart/CartHeader.tsx";
import { EmptyCart } from "../../components/cliente/cart/EmptyCart.tsx";
import { CartItemsList } from "../../components/cliente/cart/CartItemList.tsx";
import { ClearCartButton } from "../../components/cliente/cart/ClearCartButton.tsx";
import { CartSummary } from "../../components/cliente/cart/CartSummary.tsx";
import { CartActions } from "../../components/cliente/cart/CartActions.tsx";
import { toast } from "sonner";

// cart contiene los productos del carrito
// totalPrice es el precio total del carrito
// onUpdateQuantity es una función para actualizar la cantidad de un producto
// onRemoveItem es una función para eliminar un producto del carrito
// onClearCart es una función para vaciar el carrito


interface CartPageProps {
  cart: CartItem[];
  subtotal: number;
  isv: number;
  totalPrice: number;
  onUpdateQuantity: (uid: string, newQuantity: number) => void;
  onRemoveItem: (uid: string) => void;
  onClearCart: () => void;
}

export default function CartPage({
  cart,
  subtotal,
  isv,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartPageProps) {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const restauranteId = Number(localStorage.getItem("id_restaurante") );
  const mesaId = Number(localStorage.getItem("id_mesa") );
  const numMesa = localStorage.getItem("num_mesa");

  const handlePlaceOrder = () => {
  
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    // Validar IDs
    if (!Number.isFinite(mesaId) || !Number.isFinite(restauranteId) || mesaId <= 0 || restauranteId <= 0) {
      toast.error("Error: Restaurante o mesa no válidos. No se puede crear la orden.", {
        style: {
          backgroundColor: "#ef4444",
          color: "white",
          fontWeight: "500",
        },
      });
      return;
    }
    // Crear pedido pendiente local
    const timestamp_creacion = Date.now();
    const estimateTime = timestamp_creacion + 3 * 60 * 1000; // 3 minutos en ms
    // Construir items para el pedido
    const items: Array<{
      id_orden_item: number;
      id_producto: number;
      nombre_producto: string;
      cantidad: number;
      precio_unitario: number;
      notas: string;
    }> = [];
    let idx = 1;
    cart.forEach((item) => {
      // Producto principal
      items.push({
        id_orden_item: idx++,
        id_producto: item.id,
        nombre_producto: item.name,
        cantidad: item.quantity,
        precio_unitario: item.price,
        notas: item.instructions || ""
      });
      // Complementos seleccionados
      if (item.complements && item.complements.length > 0) {
        item.complements.filter(c => c.selected).forEach((comp) => {
          items.push({
            id_orden_item: idx++,
            id_producto: comp.id,
            nombre_producto: comp.name,
            cantidad: 1,
            precio_unitario: comp.price,
            notas: ''
          });
        });
      }
    });
    // Concatenar todas las instrucciones especiales
    const notas = cart
      .map((item) => item.instructions?.trim())
      .filter((txt) => !!txt)
      .join(" | ");
    // Construir pedido pendiente
    const pedidoPendiente = {
      id_orden: null, // aún no existe en backend
      estado: "PENDIENTE",
      fecha: new Date(timestamp_creacion).toISOString().split('T')[0],
      hora_confirmacion: new Date(timestamp_creacion).toLocaleTimeString(),
      subtotal,
      impuestos: isv,
      total: totalPrice,
      solicitud_pago: false,
      notas,
      restaurante: { id_restaurante: restauranteId, nombre: "" }, // nombre se puede actualizar luego
      mesa: { id_mesa: mesaId, numero_mesa: mesaId },
      items,
      timestamp_creacion,
      estimateTime
    };
      // Guardar en localStorage por mesa
      const key = `orders_mesa_${mesaId}`;
      const existingOrders = JSON.parse(localStorage.getItem(key) || "[]");
    const updatedOrders = [pedidoPendiente, ...existingOrders];
      localStorage.setItem(key, JSON.stringify(updatedOrders));
    toast.success("¡Pedido agregado a Mis pedidos!", {
      description: `Tienes 3 minutos para cancelar antes de enviar a cocina.`,
        duration: 3000,
        style: {
          backgroundColor: "#10b981",
          color: "white",
          fontWeight: "500",
        },
      });
      onClearCart();
      setShowConfirmation(false);
    navigate(`/cliente?id_restaurante=${restauranteId}&id_mesa=${mesaId}&num_mesa=${numMesa}`); // Redirigir a la ruta original
  };


  const handleClearCart = () => {
    onClearCart();
    toast("Carrito vaciado", {
      duration: 2000,
    });
  };

  const handleBackToMenu = () => {
    const restauranteId = localStorage.getItem("id_restaurante");
    const mesaId = localStorage.getItem("id_mesa");
    const numMesa = localStorage.getItem("num_mesa");
    navigate(`/cliente?id_restaurante=${restauranteId}&id_mesa=${mesaId}&num_mesa=${numMesa}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <CartHeader onBack={handleBackToMenu} />

      {cart.length === 0 ? (
        <EmptyCart onViewMenu={handleBackToMenu} />
      ) : (
        <div className="p-4 pb-32">
          <CartItemsList
            items={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />

          <ClearCartButton onClearCart={handleClearCart} />

          <CartSummary
            itemCount={cart.length}
            subtotal={subtotal}
            isv={isv}
            total={totalPrice}
          />

          <CartActions onPlaceOrder={handlePlaceOrder} />
        </div>
      )}

      <OrderConfirmationModal
        isOpen={showConfirmation}
        cart={cart}
        totalPrice={totalPrice}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
}