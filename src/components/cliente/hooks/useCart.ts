import { useState, useEffect } from "react";
import type { MenuItem, Complement, CartItem } from "../shared/restaurant-types.ts";

export function useCart() {
  // Obtener restaurante y mesa SIEMPRE de localStorage
  const restauranteId = localStorage.getItem("id_restaurante");
  const mesaId = localStorage.getItem("id_mesa");
  const CART_KEY = restauranteId && mesaId ? `cart_${restauranteId}_${mesaId}` : null;

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (!CART_KEY) return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (CART_KEY) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, CART_KEY]);

  const addToCart = (
    item: MenuItem,
    complements: Complement[] = [],
    instructions: string = "",
    quantity: number = 1
  ) => {
    if (!CART_KEY) {
      alert("No se ha seleccionado restaurante o mesa. No se puede agregar al carrito.");
      return;
    }

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
        price: item.price, // Solo el precio del producto principal, sin sumar complementos
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
    if (CART_KEY) localStorage.removeItem(CART_KEY);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calcular subtotal incluyendo producto principal y complementos
  const subtotal = cart.reduce((sum, item) => {
    // Precio del producto principal
    const productPrice = item.price * item.quantity;
    
    // Precio de los complementos seleccionados
    const complementsPrice = (item.complements || [])
      .filter((comp) => comp.selected)
      .reduce((compSum, comp) => compSum + comp.price, 0) * item.quantity;
    
    return sum + productPrice + complementsPrice;
  }, 0);
  
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
