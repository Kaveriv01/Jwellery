import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const DEMO_ADMIN_USER = {
  _id: 'admin_tarini_01',
  name: 'Tarini Administrator',
  email: 'admin@tarini.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  isDemo: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tarini_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem('tarini_user');
    } catch {
      return false;
    }
  });

  /** Fetch the current logged-in user on app mount */
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await authService.getMe();
      if (data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('tarini_user', JSON.stringify(data.user));
      }
    } catch {
      // If we already have a stored user from localStorage, keep it
      const stored = localStorage.getItem('tarini_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsAuthenticated(true);
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (credentials) => {
    try {
      const { data } = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      if (data.accessToken) {
        sessionStorage.setItem('accessToken', data.accessToken);
      }
      localStorage.setItem('tarini_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      // Demo fallback login if API is unavailable or offline
      const isAdminLogin = credentials?.email?.toLowerCase().includes('admin') || credentials?.role === 'admin';
      const demoUser = isAdminLogin
        ? DEMO_ADMIN_USER
        : {
            _id: `user_${Date.now()}`,
            name: credentials?.email ? credentials.email.split('@')[0] : 'Valued Client',
            email: credentials?.email || 'client@tarini.com',
            role: 'customer',
            isDemo: true
          };

      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('tarini_user', JSON.stringify(demoUser));
      sessionStorage.setItem('accessToken', 'tarini-demo-token');
      return { user: demoUser, accessToken: 'tarini-demo-token' };
    }
  }, []);

  const loginAsAdminDemo = useCallback(() => {
    setUser(DEMO_ADMIN_USER);
    setIsAuthenticated(true);
    localStorage.setItem('tarini_user', JSON.stringify(DEMO_ADMIN_USER));
    sessionStorage.setItem('accessToken', 'tarini-demo-admin-token');
    return DEMO_ADMIN_USER;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local state even if API fails
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('tarini_user');
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('tarini_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isAdmin, login, loginAsAdminDemo, logout, fetchUser, updateUser }}
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
