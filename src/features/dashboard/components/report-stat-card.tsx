import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { REPORTS_CONSTANTS } from '../constants/reports.constants';

interface ReportStatCardProps {
  title: string;
  value: number;
  variationRate: number;
  isCurrency?: boolean;
}

export function ReportStatCard({ title, value, variationRate, isCurrency = false }: ReportStatCardProps) {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : new Intl.NumberFormat('pt-BR').format(value);

  const percentage = (variationRate - 1) * 100;
  const isPositive = percentage > 0;
  const isNegative = percentage < 0;
  const isNeutral = percentage === 0;

  return (
    <div className="bg-bg-card rounded-card p-6 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
      <div className="flex flex-col gap-1 z-10">
        <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
        <span className="text-2xl font-semibold text-text-primary">{formattedValue}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2 z-10">
        <div
          className={`flex items-center justify-center p-1 rounded-full ${
            isPositive ? 'bg-success/10 text-success' : 
            isNegative ? 'bg-red-500/10 text-red-500' : 
            'bg-gray-500/10 text-gray-500'
          }`}
        >
          {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
          {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
          {isNeutral && <Minus className="w-3.5 h-3.5" />}
        </div>
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-success' : 
            isNegative ? 'text-red-500' : 
            'text-gray-500'
          }`}
        >
          {Math.abs(percentage).toFixed(1)}%
        </span>
        <span className="text-xs text-text-muted ml-1 truncate">
          {isPositive ? REPORTS_CONSTANTS.variation.increase : 
           isNegative ? REPORTS_CONSTANTS.variation.decrease : 
           REPORTS_CONSTANTS.variation.neutral}
        </span>
      </div>
      
      {/* Decorative gradient blur in the background */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl z-0" />
    </div>
  );
}
