import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from './desktop-sidebar';
import { BottomNav } from './bottom-nav';
import { DashboardHeader } from './dashboard-header';
import { DashboardSummary } from './dashboard-summary';
import { useDashboardAction } from '../contexts/dashboard-action.context';
import { useAuthContext } from '../../auth/contexts/auth.context';
import { useInfoDashboard } from '../hooks/use-info-dashboard';


export function DashboardLayout() {
  const { action } = useDashboardAction();
  const { user } = useAuthContext();

  const { infoDashboard, isLoading } = useInfoDashboard();
  return (
    <div className="h-screen overflow-hidden bg-bg-body flex md:pl-64 text-text-primary">
      <DesktopSidebar />

      <main className="flex-1 flex flex-col min-w-0 w-full h-full relative ">
        <div className="shrink-0 bg-gradient-brand pb-4 rounded-b-[2rem] md:rounded-b-none relative overflow-visible z-40 md:pb-8">
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-50 z-0">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          </div>

          <DashboardHeader userName={user?.name ?? 'Usuário'} companyCode={user?.companyCode ?? "Não informado"} />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between px-6 max-w-4xl mx-auto md:max-w-none lg:ml-0 lg:pr-10 gap-4">
            {isLoading ? (
              <div className="flex-1 w-full">
                <div className="relative z-10 text-white w-full md:max-w-none">
                  <div className="h-7 w-48 bg-white/20 rounded-md mx-auto my-4 animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-[1.25rem] p-4 md:p-6 shadow-sm border border-white/10 flex flex-col items-center justify-center animate-pulse">
                      <div className="h-4 w-20 bg-white/20 rounded-md mb-3"></div>
                      <div className="h-8 md:h-10 w-24 bg-white/20 rounded-md mb-3"></div>
                      <div className="h-3 w-32 md:w-40 bg-white/20 rounded-md"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-[1.25rem] p-4 md:p-6 shadow-sm border border-white/10 flex flex-col items-center justify-center animate-pulse">
                      <div className="h-4 w-20 bg-white/20 rounded-md mb-3"></div>
                      <div className="h-8 md:h-10 w-16 bg-white/20 rounded-md mb-3"></div>
                      <div className="h-3 w-32 md:w-40 bg-white/20 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <DashboardSummary metrics={infoDashboard} />
              </div>
            )}

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



        <div className="flex-1 w-full relative overflow-y-auto px-4 pb-24 md:pb-8 max-w-5xl mx-auto z-10">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
