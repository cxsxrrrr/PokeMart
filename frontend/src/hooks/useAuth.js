import { useState, useCallback, createContext, useContext, useRef, useEffect } from 'react';
import authService from '../services/auth.service';
import { normalizeError } from '../utils/normalizeResponses';
import { getAccessToken, clearTokens } from '../utils/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      setAuthChecked(true);
      return userData;
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, email, password, avatarUrl) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.register(username, email, password, avatarUrl);
      setAuthChecked(true);
      return userData;
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.verifyEmail(email, otp);
      setUser(userData);
      setAuthChecked(true);
      return userData;
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerificationCode = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.resendVerificationCode(email);
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.forgotPassword(email);
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email, otp, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.resetPassword(email, otp, newPassword);
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setAuthChecked(true);
    } catch (err) {
      console.error(err);
      // Even if the server call fails, clear local state
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkCurrentUser = useCallback(async () => {
    // If there's no token at all, skip the API call entirely
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setAuthChecked(true);
      return null;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      const status = err?.status;
      const isUnauthorized = status === 401 || status === 403;

      if (isUnauthorized) {
        // Token is truly invalid/expired (refresh also failed in apiClient)
        clearTokens();
        setUser(null);
        return null;
      }

      // Keep current session state on transient network/server issues
      return userRef.current;
    } finally {
      setAuthChecked(true);
    }
  }, []);

  const updateProfile = useCallback(async ({ username, avatarUrl }) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.updateProfile({ username, avatarUrl });
      setUser(userData);
      return userData;
    } catch (err) {
      setError(normalizeError(err.message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, authChecked, login, register, verifyEmail, resendVerificationCode, forgotPassword, resetPassword, logout, checkCurrentUser, updateProfile, setUser, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
