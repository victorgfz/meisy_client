import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/contexts/auth.context';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <Outlet />;
};
