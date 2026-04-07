import { CONSTANTS } from "../utils/constants";

const API_BASE = CONSTANTS.API_BASE_URL || "http://localhost:8000";

export const listingService = {
  searchCards: async (query, { page = 1, pageSize = 40, signal } = {}) => {
    const q = (query || "").trim();
    if (q.length < 2) {
      return { results: [], has_more: false, page: 1, page_size: pageSize };
    }

    const response = await fetch(
      `${API_BASE}/store/cards/search/?q=${encodeURIComponent(q)}&page=${page}&page_size=${pageSize}`,
      {
      method: "GET",
      credentials: "include",
      signal,
      cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudo buscar cartas");
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return { results: data, has_more: false, page, page_size: pageSize };
    }
    return {
      results: Array.isArray(data.results) ? data.results : [],
      has_more: Boolean(data.has_more),
      page: data.page || page,
      page_size: data.page_size || pageSize,
    };
  },

  createListing: async ({ cardId, price, quantity, condition, description }) => {
    const response = await fetch(`${API_BASE}/store/listings/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        card_id: cardId,
        price,
        quantity,
        condition,
        status: "Available",
        description: description || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "No se pudo crear el listing");
    }

    return response.json();
  },
};
