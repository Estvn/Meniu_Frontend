import { useState, useEffect } from "react";
import type { MenuItem, Complement, CartItem } from "../shared/restaurant-types.ts";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: MenuItem,
    complements: Complement[] = [],
    instructions: string = "",
    quantity: number = 1,
  ) => {
    const complementsTotal = complements.reduce((sum, comp) => sum + comp.price, 0);
    const totalPrice = item.price + complementsTotal;

    const complementIds = complements.map((comp) => comp.id).sort().join(",");
    const uniqueId = `${item.id}-${complementIds}-${instructions}`;

    const cartItem: CartItem = {
      ...item,
      id: uniqueId,
      price: totalPrice,
      quantity,
      complements,
      instructions,
    };

    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === uniqueId);

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
    localStorage.removeItem("cart");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isv = subtotal * 0.15;
  const totalPrice = subtotal + isv;

  return {
    cart,
    subtotal,
    isv,
    totalPrice,
    totalItems,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  };
}