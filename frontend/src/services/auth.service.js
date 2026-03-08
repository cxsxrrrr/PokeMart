import { CONSTANTS } from '../utils/constants';

const API_BASE = CONSTANTS.API_BASE_URL || "http://localhost:8000";

const authService = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al iniciar sesión");
    }
    
    return response.json();
  },

  register: async (username, email, password, avatarUrl) => {
    const response = await fetch(`${API_BASE}/users/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, avatarUrl }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al crear la cuenta");
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE}/users/logout/`, {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/users/me/`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("No autenticado");
    }
    return response.json();
  }
};

export default authService;
