import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from './desktop-sidebar';
import { BottomNav } from './bottom-nav';
import { DashboardHeader } from './dashboard-header';
import { DashboardSummary } from './dashboard-summary';
import type { SummaryMetrics } from '../types/dashboard.types';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { useAuthContext } from '../../auth/contexts/auth.context';

export function DashboardLayout() {
  const { action } = useDashboardAction();
  const { user } = useAuthContext();

  const mockMetrics: SummaryMetrics = {
    balance: 600,
    balanceChangePercentage: 12,
    totalOrders: 35,
    pendingOrders: 8,
  };

  return (
    <div className="h-screen overflow-hidden bg-bg-body flex md:pl-64 text-text-primary">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full h-full relative ">
        {/* Top Header Section with Gradient Background (Sticky & non-shrinking) */}
        <div className="shrink-0 bg-gradient-brand pb-4 rounded-b-[2rem] md:rounded-b-none relative overflow-visible z-40 md:pb-8">
          {/* Subtle background blob */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-50 z-0">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          </div>

          <DashboardHeader userName={user?.name ?? 'Usuário'} companyCode={user?.companyCode ?? 'XXXXXX'} />

          {/* Wrapper for Summary and Action Button */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between px-6 max-w-4xl mx-auto md:max-w-none lg:ml-0 lg:pr-10 gap-4">
            <div className="flex-1">
              <DashboardSummary metrics={mockMetrics} />
            </div>

            {/* Dynamic Action Button embedded in Layout */}
            {action && (
              <div className="shrink-0 w-full lg:w-auto mt-2 md:mt-0 relative z-10 pb-6 md:pb-6 text-white">
                <button
                  onClick={action.onClick}
                  className="w-full lg:w-auto bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl rounded-2xl py-4 lg:py-4 px-6 flex items-center justify-center flex-row lg:flex-col gap-2 lg:gap-0 font-medium text-lg lg:text-base transition-all active:scale-[0.98]"
                >
                  {action.icon}
                  {action.label}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic scrollable Page Content */}
        {/* Added bottom padding on mobile for BottomNav space */}
        <div className="flex-1 w-full relative overflow-y-auto px-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto z-10 rounded-t-3xl md:rounded-none">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
