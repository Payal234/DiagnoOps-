import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      // if item already exists, increment quantity
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: (existing.quantity || 1) + 1,
        };
        return updated;
      }
      // otherwise add with initial quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      const existing = updated[index];
      if ((existing.quantity || 1) > 1) {
        // decrement quantity
        updated[index] = {
          ...existing,
          quantity: existing.quantity - 1,
        };
        return updated;
      }
      // remove item completely
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
