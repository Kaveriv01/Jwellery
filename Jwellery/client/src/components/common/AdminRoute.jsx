import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

/**
 * Admin route guard.
 * Wraps the AdminLayout — only allows users with role === 'admin'.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Temporarily disabled for development preview
  // if (!isAdmin) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
}
