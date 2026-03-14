import { CONSTANTS } from '../utils/constants';

const BASE_URL = CONSTANTS.API_BASE_URL || 'http://localhost:8000';

export const chatService = {
  async getMessages(orderId) {
    const response = await fetch(`${BASE_URL}/store/orders/${orderId}/messages/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Error al obtener mensajes");
    return response.json();
  },

  async sendMessage(orderId, content) {
    const response = await fetch(`${BASE_URL}/store/orders/${orderId}/messages/add/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Error al enviar mensaje");
    return response.json();
  },

  async updateStatus(orderId, status) {
    const response = await fetch(`${BASE_URL}/store/orders/${orderId}/status/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Error al actualizar estado");
    return response.json();
  }
};
