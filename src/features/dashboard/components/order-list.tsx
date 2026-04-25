import { type Order } from '../types/orders.types';
import { OrderCard } from './order-card';
import { ORDERS_CONSTANTS } from '../constants/orders.constants';
import { PackageOpen } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderList({ orders, isLoading }: OrderListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 border border-gray-200 rounded-xl h-64 w-full"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm w-full">
        <PackageOpen className="w-12 h-12 mb-4 text-gray-400 opacity-60" />
        <p className="text-lg font-medium">{ORDERS_CONSTANTS.list.empty}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
