import { apiFetch } from '../utils/apiClient';

export const cartService = {
  async getCart() {
    const response = await apiFetch('/store/cart/', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
    const response = await apiFetch('/store/cart/add/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId, quantity }),
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
    const response = await apiFetch(`/store/cart/${cartItemId}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
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
    const response = await apiFetch(`/store/cart/${cartItemId}/delete/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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
    const response = await apiFetch('/store/orders/create/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
