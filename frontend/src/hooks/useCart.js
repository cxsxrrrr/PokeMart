import { useState, useEffect, useMemo, useCallback } from "react";
import { CONSTANTS } from "../utils/constants";
import { safeParseCart } from "../utils/formatters";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito al inicio
  useEffect(() => {
    const saved = localStorage.getItem(CONSTANTS.CART_STORAGE_KEY);
    if (saved) {
      setCartItems(safeParseCart(saved));
    }
  }, []);

  // Guardar carrito al cambiar
  useEffect(() => {
    localStorage.setItem(CONSTANTS.CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = useCallback((product, priceOverride) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          setName: product.set?.name,
          price: priceOverride || product.price,
          image: product.imageCandidates?.[0] || CONSTANTS.PLACEHOLDER_IMAGE,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  }, []);

  const removeItemFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback((id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      })
    );
  }, []);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    cartTotal,
  };
};