import { CONSTANTS } from '../utils/constants';
import { normalizeError } from '../utils/normalizeResponses';

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
      throw new Error(normalizeError(errorData.error || "Error al crear la cuenta"));
    }

    return response.json();
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

    return response.json();
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
    const response = await fetch(`${API_BASE}/users/logout/`, {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(normalizeError("Error al cerrar sesión"));
    }
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/users/me/`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(normalizeError("No autenticado"));
    }
    return response.json();
  }
};

export default authService;
