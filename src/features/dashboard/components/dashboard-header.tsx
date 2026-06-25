import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { DASHBOARD_CONSTANTS } from '../constants/dashboard.constants';
import { useAuthContext } from '../../auth/contexts/auth.context';

interface DashboardHeaderProps {
  userName?: string;
  companyCode?: string;
}

export function DashboardHeader({ userName = 'Usuário', companyCode = "Não informado" }: DashboardHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logout } = useAuthContext();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);



  return (
    <>
      <header className="flex justify-between items-center w-full pt-6 pb-4 px-6 relative z-10 text-white border-b-[1px] border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <UserIcon className="text-primary w-6 h-6" />
          </div>
          <div className='md:flex md:flex-col md:items-start md:justify-center md:gap-2'>
            <h1 className="text-lg font-normal leading-none">
              {DASHBOARD_CONSTANTS.greeting.replace('{name}', userName)}
            </h1>
            <p className='text-sm font-light text-white/50'>Código da empresa: <span className='font-bold'>{companyCode}</span> </p>
          </div>

        </div>

        <button
          onClick={toggleDrawer}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7" />
        </button>

        {/* Desktop Profile Info (optional, can be expanded later) */}
        <div className="hidden md:flex gap-4 items-center">

          {/* Can render desktop specific header tools here */}
        </div>
      </header>

      {/* Mobile Settings Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={toggleDrawer}
          />

          {/* Drawer Content */}
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-200">
            <div className="p-6 bg-gradient-brand text-white flex justify-between items-center">
              <span className="font-bold text-lg">{DASHBOARD_CONSTANTS.menu.description}</span>
              <button
                onClick={toggleDrawer}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                <li>
                  <button className="w-full flex items-center gap-3 px-6 py-4 text-text-primary hover:bg-gray-50 transition-colors">
                    <UserIcon className="w-5 h-5 text-text-secondary" />
                    <span>{DASHBOARD_CONSTANTS.menu.profile}</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/dashboard/settings"
                    onClick={toggleDrawer}
                    className="w-full flex items-center gap-3 px-6 py-4 text-text-primary hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-text-secondary" />
                    <span>{DASHBOARD_CONSTANTS.menu.settings}</span>
                  </Link>
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
          </div>
        </div>
      )}
    </>
  );
}
