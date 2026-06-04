import { Package2 } from 'lucide-react';
import { type BestSellingProductReport } from '../types/reports.types';
import { REPORTS_CONSTANTS } from '../constants/reports.constants';

interface BestSellingProductsProps {
  products: BestSellingProductReport[];
}

export function BestSellingProducts({ products }: BestSellingProductsProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="bg-bg-card rounded-card p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Package2 className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          {REPORTS_CONSTANTS.bestSellingProducts.title}
        </h3>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
          <p className="text-text-muted text-sm">{REPORTS_CONSTANTS.bestSellingProducts.emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-sm font-medium text-text-secondary">
                  {REPORTS_CONSTANTS.bestSellingProducts.columns.product}
                </th>
                <th className="pb-3 text-sm font-medium text-text-secondary text-right">
                  {REPORTS_CONSTANTS.bestSellingProducts.columns.quantity}
                </th>
                <th className="pb-3 text-sm font-medium text-text-secondary text-right">
                  {REPORTS_CONSTANTS.bestSellingProducts.columns.revenue}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 text-sm text-text-primary font-medium">
                    {product.description}
                  </td>
                  <td className="py-3 text-sm text-text-secondary text-right">
                    {product.total} un.
                  </td>
                  <td className="py-3 text-sm text-success font-medium text-right">
                    {formatCurrency(product.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
