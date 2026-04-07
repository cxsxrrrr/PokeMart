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
  const { user, authChecked, checkCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isAuthLikeError = useCallback((error) => {
    if (!error) return false;
    if (error.status === 401 || error.status === 403) return true;

    const message = String(error?.message || "").toLowerCase();
    return (
      message.includes("authentication required") ||
      message.includes("autenticación requerida") ||
      message.includes("es necesario iniciar sesión") ||
      message.includes("sesión") ||
      message.includes("sesion") ||
      message.includes("no autenticado")
    );
  }, []);

  // Cargar carrito desde el backend si está logueado, sino local
  const fetchCart = useCallback(async () => {
    if (!authChecked) {
      return;
    }

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
  }, [user, authChecked]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Si no hay usuario, guardamos en localStorage para persistencia temporal
  useEffect(() => {
    if (!authChecked) {
      return;
    }

    if (!user) {
      localStorage.setItem(CONSTANTS.CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, user, authChecked]);

  // Efecto para procesar artículos pendientes después de iniciar sesión
  useEffect(() => {
    const processPending = async () => {
      if (authChecked && user) {
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
  }, [user, authChecked, fetchCart, showToast]);

  const addItemToCart = useCallback(async (product, priceOverride) => {
    // Extraer el ID numérico real. Si es un string como "listing-5", tomar el 5.
    let listingId = product.listingId || product.id;
    if (typeof listingId === 'string' && listingId.startsWith('listing-')) {
      listingId = parseInt(listingId.replace('listing-', ''), 10);
    }

    if (!authChecked) {
      showToast("Estamos verificando tu sesión, intenta de nuevo en un momento.", "info");
      return;
    }

    let activeUser = user;
    if (!activeUser) {
      try {
        activeUser = await checkCurrentUser();
      } catch (error) {
        activeUser = null;
      }

      if (!activeUser) {
        // Guardar el ID para añadirlo automáticamente después del login
        localStorage.setItem('pokemart_pending_listing', listingId);
        showToast("Debes iniciar sesión para añadir productos al carrito. Tu selección se guardará.", "info");
        navigate('/login');
        return;
      }
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
      if (isAuthLikeError(error)) {
        try {
          const refreshedUser = await checkCurrentUser();
          if (refreshedUser) {
            await cartService.addListingToCart(listingId, 1);
            await fetchCart();
            setIsCartOpen(true);
            return;
          }
        } catch (refreshError) {
          console.warn("Session refresh before cart retry failed:", refreshError);
        }

        localStorage.setItem('pokemart_pending_listing', listingId);
        if (user) {
          showToast("No pudimos validar tu sesión en este momento. Intenta nuevamente en unos segundos.", "warning");
        } else {
          showToast("Tu sesión expiró. Inicia sesión nuevamente para continuar.", "warning");
          navigate('/login');
        }
        return;
      }

      showToast("Hubo un error al añadir al carrito. Verifica tu conexión.", "error");
    }
  }, [user, authChecked, checkCurrentUser, navigate, fetchCart, showToast, isAuthLikeError]);

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
