import { useLocation, Link } from 'react-router-dom';
import { Home, ShoppingCart, Utensils, Egg, TrendingUp, UserIcon, LogOut, Settings } from 'lucide-react';
import { DASHBOARD_CONSTANTS } from '../constants/dashboard.constants';
import { useAuthContext } from '../../auth/contexts/auth.context';

export function DesktopSidebar() {
  const location = useLocation();
  const { logout } = useAuthContext();

  const navItems = [
    { label: DASHBOARD_CONSTANTS.navigation.home, path: '/dashboard/home', icon: Home },
    { label: DASHBOARD_CONSTANTS.navigation.orders, path: '/dashboard/orders', icon: ShoppingCart },
    { label: DASHBOARD_CONSTANTS.navigation.products, path: '/dashboard/products', icon: Utensils },
    { label: DASHBOARD_CONSTANTS.navigation.inputs, path: '/dashboard/inputs', icon: Egg },
    { label: DASHBOARD_CONSTANTS.navigation.reports, path: '/dashboard/reports', icon: TrendingUp },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-40 divide-y divide-gray-100">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">Meisy</h2>
      </div>

      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                    }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-primary hover:bg-gray-50 transition-colors">
              <UserIcon className="w-5 h-5 text-text-secondary" />
              <span>{DASHBOARD_CONSTANTS.menu.profile}</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-primary hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5 text-text-secondary" />
              <span>{DASHBOARD_CONSTANTS.menu.settings}</span>
            </button>
          </li>
        </ul>
      </nav>


      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{DASHBOARD_CONSTANTS.menu.logout}</span>
        </button>
      </div>


    </aside>
  );
}
