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
import { createOrder } from "../../components/cliente/fetch/orders.ts";

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

  const handlePlaceOrder = () => {
  
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
  try {
    const nuevaOrden = await createOrder(cart, mesaId, restauranteId, "");

    // Guardar en localStorage por mesa
    const key = `orders_mesa_${mesaId}`;
    const existingOrders = JSON.parse(localStorage.getItem(key) || "[]");
    const updatedOrders = [nuevaOrden, ...existingOrders];
    localStorage.setItem(key, JSON.stringify(updatedOrders));

    toast.success("¡Pedido enviado a la cocina!", {
      description: `Mesa ${mesaId} - ${cart.length} productos`,
      duration: 3000,
      style: {
        backgroundColor: "#10b981",
        color: "white",
        fontWeight: "500",
      },
    });

    onClearCart();
    setShowConfirmation(false);
    navigate(`/cliente?id_restaurante=${restauranteId}&id_mesa=${mesaId}`);
  } catch (error) {
    toast.error("Error al enviar el pedido");
    console.error(error);
  }
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
    navigate(`/cliente?id_restaurante=${restauranteId}&id_mesa=${mesaId}`);
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