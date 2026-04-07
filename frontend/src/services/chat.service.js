import { apiFetch } from '../utils/apiClient';

export const chatService = {
  async getMessages(orderId) {
    const response = await apiFetch(`/store/orders/${orderId}/messages/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error al obtener mensajes");
    return response.json();
  },

  async sendMessage(orderId, content) {
    const response = await apiFetch(`/store/orders/${orderId}/messages/add/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Error al enviar mensaje");
    return response.json();
  },

  async updateStatus(orderId, status) {
    const response = await apiFetch(`/store/orders/${orderId}/status/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Error al actualizar estado");
    return response.json();
  }
};
