import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

/**
 * Admin route guard.
 * Wraps the AdminLayout — auto-initializes demo admin if no active admin session exists.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, loginAsAdminDemo } = useAuth();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      loginAsAdminDemo();
    }
  }, [loading, isAuthenticated, isAdmin, loginAsAdminDemo]);

  if (loading) return <PageLoader />;

  return children;
}
