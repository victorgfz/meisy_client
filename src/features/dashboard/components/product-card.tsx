import { Edit, Trash2 } from 'lucide-react';
import type { Product } from '../types/products.types';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import { MeasurementUnit } from '../types/inputs.types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProductCardProps {
  item: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export function ProductCard({ item, onEdit, onDelete, onViewDetail }: ProductCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getUnitName = (value: number, enumValue: any) => {
    return Object.keys(enumValue).find(key => enumValue[key] === value);
  };

  const formatDate = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { locale: ptBR, addSuffix: true });
  };

  return (
    <div 
      onClick={() => onViewDetail(item.id)}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/30 w-full flex flex-col cursor-pointer"
    >
      <div className="flex items-start justify-between mb-5 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-[15px] font-bold text-text-primary mb-0.5">
              {item.description}
            </h3>
            <span className="text-xs text-text-secondary">
              {item.amount.toLocaleString('pt-BR')}
              {getUnitName(item.measurementUnit, MeasurementUnit)}
            </span>
          </div>
        </div>
        <div className="text-[15px] text-text-primary whitespace-nowrap ml-2 font-semibold">
          {formatCurrency(item.price)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-sm font-medium transition-colors"
        >
          <Edit className="w-4 h-4" />
          {PRODUCTS_CONSTANTS.actions.edit}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {PRODUCTS_CONSTANTS.actions.delete}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-[10px] text-text-secondary">Última atualização {formatDate(item.updatedAt)}</p>
      </div>
    </div>
  );
}
