import { useState, useCallback, createContext, useContext } from 'react';
import authService from '../services/auth.service';
import { normalizeError } from '../utils/normalizeResponses';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

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
    } finally {
      setLoading(false);
    }
  }, []);

  const checkCurrentUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      return null;
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
