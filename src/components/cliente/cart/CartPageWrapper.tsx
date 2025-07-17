// src/routes/CartPageWrapper.tsx

import CartPage from "../../../pages/cliente/CartPage.tsx";
import { useCart } from "../hooks/useCart.ts";

export default function CartPageWrapper() {
  const {
    cart,
    subtotal,
    isv,
    totalPrice,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <CartPage
      cart={cart}
      subtotal={subtotal}
      isv={isv}
      totalPrice={totalPrice}
      onUpdateQuantity={updateCartItemQuantity}
      onRemoveItem={removeFromCart}
      onClearCart={clearCart}
    />
  );
}
