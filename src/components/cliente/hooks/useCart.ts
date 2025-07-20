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
    quantity: number = 1
  ) => {
    const complementsTotal = complements.reduce((sum, comp) => sum + comp.price, 0);
    const totalPrice = item.price + complementsTotal;

    // Crear uid: combinación única por producto + complementos + instrucciones
    const complementIds = complements
      .filter((comp) => comp.selected)
      .map((comp) => comp.id)
      .sort()
      .join(",");

    const uid = `${item.id}-${complementIds}-${instructions.trim()}`;

    const existingIndex = cart.findIndex((cartItem) => cartItem.uid === uid);

    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + quantity,
      };
      setCart(updatedCart);
    } else {
      const cartItem: CartItem = {
        ...item,
        id: item.id, // número
        uid,         // cadena única solo para carrito
        price: totalPrice,
        quantity,
        complements,
        instructions,
      };
      setCart([...cart, cartItem]);
    }
  };

  const updateCartItemQuantity = (uid: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.uid !== uid));
    } else {
      setCart(
        cart.map((item) =>
          item.uid === uid ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (uid: string) => {
    setCart(cart.filter((item) => item.uid !== uid));
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
