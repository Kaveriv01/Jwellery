import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /** Fetch the current logged-in user on app mount */
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await authService.getMe();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    if (data.accessToken) {
      sessionStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Still clear local state even if API fails
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('accessToken');
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isAdmin, login, logout, fetchUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
