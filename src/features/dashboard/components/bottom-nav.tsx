import { useLocation, Link } from 'react-router-dom';
import { Home, ShoppingCart, Utensils, Egg, TrendingUp } from 'lucide-react';
import { DASHBOARD_CONSTANTS } from '../constants/dashboard.constants';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { label: DASHBOARD_CONSTANTS.navigation.home, path: '/dashboard/home', icon: Home },
    { label: DASHBOARD_CONSTANTS.navigation.orders, path: '/dashboard/orders', icon: ShoppingCart },
    { label: DASHBOARD_CONSTANTS.navigation.products, path: '/dashboard/products', icon: Utensils },
    { label: DASHBOARD_CONSTANTS.navigation.inputs, path: '/dashboard/inputs', icon: Egg },
    { label: DASHBOARD_CONSTANTS.navigation.reports, path: '/dashboard/reports', icon: TrendingUp },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white border-gray-100 pb-safe pt-2 px-2 z-20 flex justify-between h-16 shadow-sm">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.includes(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
              } transition-colors`}
          >
            <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} fill={isActive ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
