import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/login-page';
import { RegisterPage } from './features/auth/pages/register-page';
import { InputsPage } from './features/dashboard/pages/inputs-page';
import { ProtectedRoute } from './components/routing/protected-route';
import { PublicRoute } from './components/routing/public-route';
import { DashboardLayout } from './features/dashboard/components/dashboard-layout';
import { DashboardActionProvider } from './features/dashboard/contexts/dashboard-action.context';
import { ProductsPage } from './features/dashboard/pages/products-page';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <DashboardActionProvider>
            <DashboardLayout />
          </DashboardActionProvider>
        ),
        children: [
          {
            path: 'inputs',
            element: <InputsPage />,
          },
          {
            path: 'products',
            element: <ProductsPage />,
          },
        ]
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]);
