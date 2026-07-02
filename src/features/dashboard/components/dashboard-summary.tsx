import { TrendingUp, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { DASHBOARD_CONSTANTS } from '../constants/dashboard.constants';
import type { InfoDashboard } from '../types/dashboard.types';

interface DashboardSummaryProps {
  metrics?: InfoDashboard;
  showMetrics: boolean;
  onToggleMetrics: () => void;
}

export function DashboardSummary({ metrics, showMetrics, onToggleMetrics }: DashboardSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };


  if (!metrics) {
    return (
      <div className="relative z-10 text-white w-full md:max-w-none">
        <h2 className="text-lg md:text-xl font-medium my-4 text-center">
          {DASHBOARD_CONSTANTS.summary.error}
        </h2>
      </div>
    );
  }

  return (
    <div className="relative z-10 text-white w-full md:max-w-none ">
      <div className={`flex items-center justify-center
        transition-all duration-300 ease-in-out gap-3 ${showMetrics ? "my-2" : "my-0"}`}>
        <h2 className="text-lg md:text-xl font-medium text-center ">
          {DASHBOARD_CONSTANTS.summary.title.replace('{month}', new Date().toLocaleString('pt-BR', { month: 'long' }))}
        </h2>
        <button
          onClick={onToggleMetrics}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors backdrop-blur-sm"
          title={showMetrics ? 'Ocultar Resumo' : 'Mostrar Resumo'}
        >
          {showMetrics ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showMetrics ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-4 pb-2">
          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-[1.25rem] p-4 md:p-6 shadow-sm border border-white/10 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs md:text-sm">{DASHBOARD_CONSTANTS.summary.balance}</span>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">
              {formatCurrency(metrics.balance)}
            </div>
            <div className="text-[10px] md:text-xs text-white/70">
              {metrics.variationRate > 0 ?
                <>{metrics.variationRate > 1 ? '+' : ''}
                  {DASHBOARD_CONSTANTS.summary.thisMonthIncrease.replace('{percentage}', ((metrics.variationRate - 1) * 100).toFixed(2).toString())}</>
                :
                <>{DASHBOARD_CONSTANTS.summary.firstMonth}</>
              }

            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-[1.25rem] p-4 md:p-6 shadow-sm border border-white/10 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-white/80 mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs md:text-sm">{DASHBOARD_CONSTANTS.summary.orders}</span>
            </div>
            <div className="text-xl md:text-3xl font-bold mb-1">
              {metrics.quantityOfOrders}
            </div>
            <div className="text-[10px] md:text-xs text-white/70">
              {DASHBOARD_CONSTANTS.summary.completed.replace('{count}', metrics.quantityOfCompletedOrders.toString())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
