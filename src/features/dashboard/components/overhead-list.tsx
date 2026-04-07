import { Zap, Users, Flame, Wrench, Plus, Edit } from 'lucide-react';
import type { Overhead } from '../types/overheads.types';
import { OverheadType } from '../types/overheads.types';
import { OVERHEADS_CONSTANTS } from '../constants/overheads.constants';

const OVERHEAD_TYPES_INFO = [
  { type: OverheadType.Electricity, label: OVERHEADS_CONSTANTS.types.electricity, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { type: OverheadType.Labor, label: OVERHEADS_CONSTANTS.types.labor, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { type: OverheadType.Gas, label: OVERHEADS_CONSTANTS.types.gas, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  { type: OverheadType.Maintenance, label: OVERHEADS_CONSTANTS.types.maintenance, icon: Wrench, color: 'text-gray-500', bg: 'bg-gray-50' },
];

interface OverheadListProps {
  overheads: Overhead[];
  isLoading: boolean;
  onOpenModal: (type: number, currentOverhead?: Overhead) => void;
}

export function OverheadList({ overheads, isLoading, onOpenModal }: OverheadListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 lg:grid-cols-2 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-3xl w-full"></div>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 lg:grid-cols-2">
      {OVERHEAD_TYPES_INFO.map(({ type, label, icon: Icon, color, bg }) => {
        const currentOverhead = (overheads || []).find((o) => o.type === type);

        return (
          <button
            key={type}
            onClick={() => onOpenModal(type, currentOverhead)}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/30 w-full flex flex-col text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-text-primary whitespace-nowrap">
                  {label}
                </h3>
              </div>
            </div>

            {currentOverhead ? (
              <div className="flex items-center justify-between w-full mt-auto">
                <div>
                  <p className="text-xs text-text-secondary">{OVERHEADS_CONSTANTS.labels.costPerHour}</p>
                  <p className="text-[15px] font-bold text-primary">
                    {formatCurrency(currentOverhead.costPerHour)}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Edit className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mt-auto">
                <div className="flex items-center gap-2 text-text-secondary group-hover:text-primary transition-colors font-medium text-sm">
                  <Plus className="w-4 h-4" />
                  <span>{OVERHEADS_CONSTANTS.labels.addCost}</span>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
