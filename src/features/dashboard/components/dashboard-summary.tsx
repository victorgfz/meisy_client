import { TrendingUp, ShoppingCart } from 'lucide-react';
import { DASHBOARD_CONSTANTS } from '../constants/dashboard.constants';
import type { SummaryMetrics } from '../types/dashboard.types';

interface DashboardSummaryProps {
  metrics: SummaryMetrics;
}

export function DashboardSummary({ metrics }: DashboardSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="relative z-10 text-white w-full md:max-w-none">
      <h2 className="text-lg md:text-xl font-medium my-4 text-center">
        {DASHBOARD_CONSTANTS.summary.title.replace('{month}', new Date().toLocaleString('pt-BR', { month: 'long' }))}
      </h2>

      <div className="grid grid-cols-2 gap-4">
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
            {DASHBOARD_CONSTANTS.summary.thisMonthIncrease.replace('{percentage}', metrics.balanceChangePercentage.toString())}
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-[1.25rem] p-4 md:p-6 shadow-sm border border-white/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-white/80 mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs md:text-sm">{DASHBOARD_CONSTANTS.summary.orders}</span>
          </div>
          <div className="text-xl md:text-3xl font-bold mb-1">
            {metrics.totalOrders}
          </div>
          <div className="text-[10px] md:text-xs text-white/70">
            {DASHBOARD_CONSTANTS.summary.pending.replace('{count}', metrics.pendingOrders.toString())}
          </div>
        </div>
      </div>
    </div>
  );
}
