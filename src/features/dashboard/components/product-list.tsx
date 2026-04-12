import { ProductCard } from './product-card';
import type { Product } from '../types/products.types';
import { PRODUCTS_CONSTANTS } from '../constants/products.constants';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export function ProductList({ products, isLoading, onEdit, onDelete, onViewDetail }: ProductListProps) {

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {/* Skeleton loading cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-3xl w-full"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary bg-white rounded-3xl border border-dashed border-gray-200">
        {PRODUCTS_CONSTANTS.list.empty}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2 lg:grid-cols-3">
      {products.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}
