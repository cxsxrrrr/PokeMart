import { useState, useEffect, useMemo, useCallback } from "react";
import { CONSTANTS } from "../utils/constants";
import { safeParseCart } from "../utils/formatters";
import { useAuth } from "./useAuth";
import { cartService } from "../services/cart.service";
import { useNavigate } from "react-router-dom";
import { useToast } from "../providers/ToastProvider";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Cargar carrito desde el backend si está logueado, sino local
  const fetchCart = useCallback(async () => {
    if (!user) {
      const saved = localStorage.getItem(CONSTANTS.CART_STORAGE_KEY);
      if (saved) setCartItems(safeParseCart(saved));
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.getCart();
      // Mapear formato del backend al formato del frontend
      const mappedItems = data.map(item => ({
        id: item.listing.listing_id, // Usamos el ID de la publicación como ID del item en el carrito
        cartItemId: item.cart_item_id,
        name: item.listing.card.name,
        setName: item.listing.card.collection,
        price: parseFloat(item.listing.price),
        image: item.listing.card.image_url || CONSTANTS.PLACEHOLDER_IMAGE,
        quantity: item.quantity,
      }));
      setCartItems(mappedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Si no hay usuario, guardamos en localStorage para persistencia temporal
  useEffect(() => {
    if (!user) {
      localStorage.setItem(CONSTANTS.CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Efecto para procesar artículos pendientes después de iniciar sesión
  useEffect(() => {
    const processPending = async () => {
      if (user) {
        const pendingId = localStorage.getItem('pokemart_pending_listing');
        if (pendingId) {
          localStorage.removeItem('pokemart_pending_listing');
          try {
            await cartService.addListingToCart(pendingId, 1);
            await fetchCart();
            setIsCartOpen(true);
          } catch (e) {
            console.error("Error adding pending item:", e);
          }
        }
      }
    };
    processPending();
  }, [user, fetchCart, showToast]);

  const addItemToCart = useCallback(async (product, priceOverride) => {
    // Extraer el ID numérico real. Si es un string como "listing-5", tomar el 5.
    let listingId = product.listingId || product.id;
    if (typeof listingId === 'string' && listingId.startsWith('listing-')) {
      listingId = parseInt(listingId.replace('listing-', ''), 10);
    }

    if (!user) {
      // Guardar el ID para añadirlo automáticamente después del login
      localStorage.setItem('pokemart_pending_listing', listingId);
      showToast("Debes iniciar sesión para añadir productos al carrito. Tu selección se guardará.", "info");
      navigate('/login');
      return;
    }

    try {
      if (isNaN(listingId)) {
        throw new Error("ID de publicación no válido");
      }
      await cartService.addListingToCart(listingId, 1);
      await fetchCart(); // Refrescar carrito
      setIsCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Hubo un error al añadir al carrito. Verifica tu conexión.", "error");
    }
  }, [user, navigate, fetchCart, showToast]);

  const removeItemFromCart = useCallback(async (id) => {
    if (!user) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    try {
      const itemToRemove = cartItems.find(i => i.id === id);
      if (itemToRemove?.cartItemId) {
        await cartService.removeFromCart(itemToRemove.cartItemId);
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  }, [user, cartItems, fetchCart]);

  const updateItemQuantity = useCallback(async (id, delta) => {
    if (!user) {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        })
      );
      return;
    }

    try {
      const item = cartItems.find(i => i.id === id);
      if (item?.cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        await cartService.updateItemQuantity(item.cartItemId, newQty);
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }, [user, cartItems, fetchCart]);

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
    loading
  };
};