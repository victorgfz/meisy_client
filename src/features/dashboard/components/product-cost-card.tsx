import { PRODUCTS_CONSTANTS } from '../constants/products.constants';
import type { ProductCostBreakdown } from '../hooks/use-product-cost';

const { costPreview } = PRODUCTS_CONSTANTS;

interface ProductCostCardProps {
  cost: ProductCostBreakdown;
  hasOverheads: boolean;
}

export function ProductCostCard({ cost, hasOverheads }: ProductCostCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const rows = [
    { label: costPreview.ingredientsLabel, value: cost.ingredientsCost },
    { label: costPreview.packagingLabel, value: cost.packagesCost },
    { label: costPreview.overheadsLabel, value: cost.overheadsCost },
  ];

  const isLoss = cost.profit !== null && cost.profit < 0;

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-100 rounded-lg">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-bold text-gray-800 tracking-wide">{costPreview.title}</h4>
        <span className="text-xs text-text-secondary">{costPreview.subtitle}</span>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-row items-center justify-between">
            <span className="text-sm text-gray-700">{row.label}</span>
            <span className="text-sm text-red-600">{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>

      {!cost.hasServings && (
        <span className="text-xs text-text-secondary">{costPreview.servingsHint}</span>
      )}

      {cost.hasServings && hasOverheads && !cost.hasProductionTime && (
        <span className="text-xs text-text-secondary">{costPreview.overheadsHint}</span>
      )}

      <div className="flex items-center justify-center gap-3">
        <div className='bg-red-50 border-[1px] border-red-200 rounded-lg flex-1 p-4 flex flex-col items-center justify-center gap-2'>
          <span className='text-red-900 text-[10px] uppercase leading-none'>{costPreview.costsLabel}</span>
          <span className='text-red-600 text-md leading-none'>{formatCurrency(cost.totalCost)}</span>
        </div>
        {cost.profit !== null && (
          <div className={`${isLoss ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-[1px] rounded-lg flex-1 p-4 flex flex-col items-center justify-center gap-2`}>
            <span className={`${isLoss ? 'text-red-900' : 'text-green-900'} text-[10px] uppercase leading-none`}>{costPreview.profitLabel}</span>
            <span className={`${isLoss ? 'text-red-600' : 'text-green-600'} text-md leading-none`}>{formatCurrency(cost.profit)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
