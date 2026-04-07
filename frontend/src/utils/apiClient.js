/**
 * Centralized API client with JWT token management.
 *
 * Every authenticated request adds `Authorization: Bearer <access_token>`.
 * If a request returns 401, the client automatically tries to refresh the
 * token using the stored refresh_token and retries the original request once.
 */
import { CONSTANTS } from './constants';

const API_BASE = CONSTANTS.API_BASE_URL || 'http://localhost:8000';
const TOKEN_KEY = 'pokemart_access_token';
const REFRESH_KEY = 'pokemart_refresh_token';

// ── Token helpers ──────────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function saveTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ── Refresh logic ──────────────────────────────────────────────────────────────

let _refreshPromise = null;

async function refreshAccessToken() {
  // De-duplicate concurrent refresh calls
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const response = await fetch(`${API_BASE}/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      throw new Error('Refresh token expired');
    }

    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token);
    return data.access_token;
  })();

  try {
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
}

// ── Main fetch wrapper ─────────────────────────────────────────────────────────

/**
 * Fetch wrapper that automatically injects JWT auth and handles token refresh.
 *
 * Usage: `apiFetch('/store/cart/', { method: 'GET' })`
 *        `apiFetch('/users/me/')`
 *
 * @param {string}       path     - API path (e.g. '/store/cart/')
 * @param {RequestInit}  options  - Standard fetch options
 * @param {object}       extra    - { skipAuth: boolean, isRetry: boolean }
 */
export async function apiFetch(path, options = {}, extra = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const headers = { ...(options.headers || {}) };

  // Inject Authorization header if we have a token
  if (!extra.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Keep cookies as fallback during transition
  });

  // If 401 and we haven't retried yet, try refreshing the token
  if (response.status === 401 && !extra.isRetry && !extra.skipAuth) {
    try {
      await refreshAccessToken();
      return apiFetch(path, options, { ...extra, isRetry: true });
    } catch {
      // Refresh failed — propagate the original 401
    }
  }

  return response;
}
