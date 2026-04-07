import { CONSTANTS } from '../utils/constants';
import { normalizeError } from '../utils/normalizeResponses';
import { apiFetch, saveTokens, clearTokens, getAccessToken } from '../utils/apiClient';

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
      const error = new Error(normalizeError(errorData.error || "Error al iniciar sesión"));
      if (errorData.email) {
        error.email = errorData.email;
      }
      if ((errorData.error || "").toLowerCase().includes("verificar")) {
        error.requiresVerification = true;
      }
      throw error;
    }
    
    const data = await response.json();
    // Save JWT tokens
    if (data.access_token) {
      saveTokens(data.access_token, data.refresh_token);
    }
    return data;
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
      throw new Error(normalizeError(errorData.error || "Error al crear la cuenta"));
    }

    const data = await response.json();
    if (data.access_token) {
      saveTokens(data.access_token, data.refresh_token);
    }
    return data;
  },

  verifyEmail: async (email, otp) => {
    const response = await fetch(`${API_BASE}/users/verify-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(normalizeError(errorData.error || "No se pudo verificar el correo"));
    }

    const data = await response.json();
    if (data.access_token) {
      saveTokens(data.access_token, data.refresh_token);
    }
    return data;
  },

  resendVerificationCode: async (email) => {
    const response = await fetch(`${API_BASE}/users/resend-verification/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(normalizeError(errorData.error || "No se pudo reenviar el código"));
    }

    return response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE}/users/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(normalizeError(errorData.error || "No se pudo enviar el código"));
    }

    return response.json();
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await fetch(`${API_BASE}/users/reset-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(normalizeError(errorData.error || "No se pudo restablecer la contraseña"));
    }

    return response.json();
  },

  logout: async () => {
    try {
      await apiFetch('/users/logout/', { method: "POST" });
    } catch {
      // Ignore logout errors
    }
    clearTokens();
    return { message: "Logged out" };
  },

  getCurrentUser: async () => {
    // If there's no token at all, skip the request
    const token = getAccessToken();
    if (!token) {
      const error = new Error("No autenticado");
      error.status = 401;
      throw error;
    }

    const response = await apiFetch('/users/me/', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || (response.status === 401 || response.status === 403 ? "No autenticado" : "No se pudo validar la sesión");
      const error = new Error(normalizeError(message));
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  updateProfile: async ({ username, avatarUrl }) => {
    const response = await apiFetch('/users/profile/', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, avatarUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(normalizeError(errorData.error || "No se pudo actualizar el perfil"));
    }

    return response.json();
  }
};

export default authService;
