import { useState } from "react";
import type { MenuItem, Complement, CartItem } from "../shared/restaurant-types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    item: MenuItem,
    complements: Complement[] = [],
    instructions: string = "",
    quantity: number = 1,
  ) => {
    const complementsTotal = complements.reduce(
      (sum, comp) => sum + comp.price,
      0,
    );
    const totalPrice = item.price + complementsTotal;

    const cartItem: CartItem = {
      ...item,
      price: totalPrice,
      quantity: quantity,
      complements,
      instructions,
    };

    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id,
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== itemId));
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  };
}
