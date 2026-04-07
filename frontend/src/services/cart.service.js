import { CONSTANTS } from '../utils/constants';

const BASE_URL = CONSTANTS.API_BASE_URL || 'http://localhost:8000';

export const cartService = {
  async getCart() {
    const response = await fetch(`${BASE_URL}/store/cart/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      credentials: "include", // Important for session cookies
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "Failed to fetch cart");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  async addListingToCart(listingId, quantity = 1) {
    const response = await fetch(`${BASE_URL}/store/cart/add/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ listing_id: listingId, quantity }),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "Failed to add to cart");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  async updateItemQuantity(cartItemId, quantity) {
    const response = await fetch(`${BASE_URL}/store/cart/${cartItemId}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ quantity }),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "Failed to update quantity");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  async removeFromCart(cartItemId) {
    const response = await fetch(`${BASE_URL}/store/cart/${cartItemId}/delete/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "Failed to remove item");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  async checkout() {
    const response = await fetch(`${BASE_URL}/store/orders/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "Checkout failed");
      error.status = response.status;
      throw error;
    }
    return response.json();
  }
};
