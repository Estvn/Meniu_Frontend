//Pagina del carrito

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  totalPrice: number;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartPageProps) {
  const navigate = useNavigate();

  // showConfirmation es un estado para manejar la visibilidad del modal de confirmación de pedido
  const [showConfirmation, setShowConfirmation] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const isv = subtotal * 0.15;
  const calculatedTotal = subtotal + isv;

  //Muestra el modal de confirmación de pedido
  const handlePlaceOrder = () => {
    setShowConfirmation(true);
  };


  //Envia el pedido a la cocina y muestra un mensaje de éxito
  const handleConfirmOrder = () => {

    toast("Pedido enviado a la cocina!", {
        description: `Mesa 1 - ${cart.length} productos`,
        duration: 3000,
        style: {
          backgroundColor: "#fb3260",
          color: "white",
          fontWeight: "500",
        },
      });

    onClearCart();
    setShowConfirmation(false);
    navigate("/cliente");
  };

  const handleClearCart = () => {
    onClearCart();
    toast("Carrito vaciado", {
      duration: 2000,
    });
  };

  const handleBackToMenu = () => {
    navigate("/cliente");
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
            total={calculatedTotal}
          />

          <CartActions onPlaceOrder={handlePlaceOrder} />
        </div>
      )}

      <OrderConfirmationModal
        isOpen={showConfirmation}
        cart={cart}
        totalPrice={calculatedTotal}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
}
