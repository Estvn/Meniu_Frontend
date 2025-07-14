// src/routes/CartPageWrapper.tsx

import CartPage from "../../../pages/cliente/CartPage.tsx";
import { useCart } from "../hooks/useCart.ts";

export default function CartPageWrapper() {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  return (
    <CartPage
      cart={cart}
      totalPrice={totalPrice}
      onUpdateQuantity={updateCartItemQuantity}
      onRemoveItem={removeFromCart}
      onClearCart={clearCart}
    />
  );
}
