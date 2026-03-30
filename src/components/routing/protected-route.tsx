import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/contexts/auth.context';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};
