import { useState, useCallback, createContext, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
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
      return userData;
    } catch (err) {
      setError(err.message);
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
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, checkCurrentUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
